import { NextRequest, NextResponse } from 'next/server'
import { formatChatAnswer } from '@/lib/markdown-utils'

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
    console.log(`尝试使用模型 ${model} 生成介绍 (${modelIndex + 1}/${GEMINI_MODELS.length})`)

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
            maxOutputTokens: 800
          }
        })
      })

      // 检查响应状态
      if (response.ok) {
        const data = await response.json()
        const introduction = data.candidates?.[0]?.content?.parts?.[0]?.text
        
        if (introduction) {
          console.log(`模型 ${model} 成功生成介绍`)
          return { success: true, data: introduction }
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
      return NextResponse.json(
        { success: false, error: '服务配置错误' },
        { status: 500 }
      )
    }

    // 解析请求数据
    const { locationData } = await request.json()
    
    if (!locationData) {
      return NextResponse.json(
        { success: false, error: '缺少位置信息' },
        { status: 400 }
      )
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

    // 构建提示文本
    const prompt = `请为以下地理位置生成一段详细的景点介绍，要求：

地点信息：
${locationInfo}

要求：
1. 生成2-3个段落的介绍文本
2. 包含历史背景、文化意义和有趣的事实
3. 语言生动有趣，适合语音播报
4. 总字数控制在300-500字之间
5. 每个段落用换行符分隔
6. 不要包含标题或序号

请直接返回介绍文本，不要包含其他格式。`

    // 使用重试机制调用Gemini API
    const result = await callGeminiAPIWithRetry(prompt, apiKey)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    const introduction = result.data

    // 将介绍文本分割成段落
    const paragraphs = introduction
      .split('\n\n')
      .filter((p: string) => p.trim().length > 0)
      .map((text: string, index: number) => ({
        id: index,
        text: text.trim(),
        startTime: 0, // 将在前端计算
        endTime: 0,   // 将在前端计算
        isActive: false
      }))

    // 格式化介绍内容，移除markdown语法
    const formattedIntroduction = formatChatAnswer(introduction)

    return NextResponse.json({
      success: true,
      data: {
        introduction: formattedIntroduction,
        paragraphs
      }
    })

  } catch (error) {
    console.error('生成介绍文本失败:', error)
    
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
    
    return NextResponse.json(
      { success: false, error: friendlyError },
      { status: 500 }
    )
  }
}
