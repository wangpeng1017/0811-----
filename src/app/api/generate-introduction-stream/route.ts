import { NextRequest } from 'next/server'
import { markdownToPlainText } from '@/lib/markdown-utils'

// Google Gemini API配置 - 多模型备选方案
const GEMINI_MODELS = [
  'gemini-2.5-flash',
  'gemini-1.5-flash', 
  'gemini-1.5-pro'
]

const getGeminiApiUrl = (modelName: string) => 
  `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent`

// 带重试机制的Gemini API调用函数
async function callGeminiAPIWithRetry(prompt: string, apiKey: string): Promise<any> {
  let lastError: any = null

  // 依次尝试每个模型
  for (let modelIndex = 0; modelIndex < GEMINI_MODELS.length; modelIndex++) {
    const model = GEMINI_MODELS[modelIndex]
    console.log(`尝试使用模型 ${model} 流式生成介绍 (${modelIndex + 1}/${GEMINI_MODELS.length})`)

    try {
      const response = await fetch(`${getGeminiApiUrl(model)}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1500
          }
        })
      })

      // 检查响应状态
      if (response.ok) {
        const data = await response.json()
        const fullText = data.candidates?.[0]?.content?.parts?.[0]?.text
        
        if (fullText) {
          console.log(`模型 ${model} 成功生成流式介绍`)
          return { success: true, data: fullText }
        } else {
          throw new Error('返回数据格式错误')
        }
      }

      // 处理503过载错误
      if (response.status === 503) {
        const errorText = await response.text()
        console.warn(`模型 ${model} 服务过载 (503):`, errorText)
        lastError = new Error('服务繁忙，正在尝试其他模型...')
        
        // 如果还有其他模型可以尝试，等待1秒后继续
        if (modelIndex < GEMINI_MODELS.length - 1) {
          console.log('等待1秒后尝试下一个模型...')
          await new Promise(resolve => setTimeout(resolve, 1000))
          continue
        }
      } else {
        // 其他HTTP错误
        const errorText = await response.text()
        console.error(`模型 ${model} API错误:`, response.status, errorText)
        lastError = new Error(`API请求失败: ${response.status}`)
        
        // 对于非503错误，也尝试下一个模型
        if (modelIndex < GEMINI_MODELS.length - 1) {
          console.log('尝试下一个模型...')
          await new Promise(resolve => setTimeout(resolve, 1000))
          continue
        }
      }
    } catch (error) {
      console.error(`模型 ${model} 请求失败:`, error)
      lastError = error
      
      // 如果还有其他模型，继续尝试
      if (modelIndex < GEMINI_MODELS.length - 1) {
        console.log('尝试下一个模型...')
        await new Promise(resolve => setTimeout(resolve, 1000))
        continue
      }
    }
  }

  // 所有模型都失败了
  console.error('所有模型都失败了，最后的错误:', lastError)
  
  if (lastError?.message?.includes('503') || lastError?.message?.includes('过载') || lastError?.message?.includes('服务繁忙')) {
    return { success: false, error: 'AI服务繁忙，请稍后再试' }
  }
  
  return { success: false, error: '生成介绍失败，请重试' }
}

export async function POST(request: NextRequest) {
  try {
    // 检查环境变量
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return new Response('服务配置错误', { status: 500 })
    }

    // 解析请求数据
    const { locationData } = await request.json()
    
    if (!locationData) {
      return new Response('缺少地理位置数据', { status: 400 })
    }

    // 构建地点信息字符串
    const locationInfo = [
      locationData.continent && `大洲: ${locationData.continent}`,
      locationData.country && `国家: ${locationData.country}`,
      locationData.province && `省份: ${locationData.province}`,
      locationData.city && `城市: ${locationData.city}`,
      locationData.location && `地点: ${locationData.location}`,
      locationData.latitude && locationData.longitude && `坐标: ${locationData.latitude}, ${locationData.longitude}`
    ].filter(Boolean).join('\n')

    // 构建提示词
    const prompt = `请为以下地理位置生成详细的景点介绍：

${locationInfo}

要求：
1. 介绍该地点的历史背景和文化意义
2. 描述主要的景观特色和建筑风格
3. 提供旅游建议和最佳游览时间
4. 如果是5A级景区，请特别说明其等级和特色
5. 推荐周边的其他景点或美食
6. 内容要详细丰富，至少300字
7. 请使用纯文本格式，不要使用任何Markdown语法标记（如**、##、*等）
8. 段落之间用空行分隔，保持自然的文本格式

请用中文回答，语言要生动有趣，适合游客阅读。`

    // 使用重试机制调用Gemini API
    const result = await callGeminiAPIWithRetry(prompt, apiKey)
    
    if (!result.success) {
      const friendlyError = result.error || '生成介绍失败，请重试'
      return new Response(friendlyError, { status: 500 })
    }

    const fullText = result.data

    // 创建模拟流式输出（将全文分段发送）
    const encoder = new TextEncoder()
    const chunks = fullText.split('')
    const chunkSize = 3 // 每次发送3个字符

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for (let i = 0; i < chunks.length; i += chunkSize) {
            const chunk = chunks.slice(i, i + chunkSize).join('')
            if (chunk) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`))
              // 模拟打字机效果，每个块之间稍微延迟
              await new Promise(resolve => setTimeout(resolve, 20))
            }
          }
          // 发送结束信号
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('流式处理错误:', error)
          controller.error(error)
        }
      }
    })

    // 返回SSE响应
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })

  } catch (error) {
    console.error('生成流式介绍失败:', error)
    
    // 根据错误类型返回友好的错误信息
    let friendlyError = '生成介绍失败，请重试'
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      if (errorMessage.includes('服务繁忙') || errorMessage.includes('503') || errorMessage.includes('过载')) {
        friendlyError = 'AI服务繁忙，请稍后再试'
      } else if (errorMessage.includes('网络') || errorMessage.includes('network') || errorMessage.includes('timeout')) {
        friendlyError = '网络连接异常，请检查网络后重试'
      }
    }
    
    return new Response(friendlyError, { status: 500 })
  }
}
