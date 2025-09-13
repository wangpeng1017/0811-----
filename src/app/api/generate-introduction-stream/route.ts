import { NextRequest } from 'next/server'
import { markdownToPlainText } from '@/lib/markdown-utils'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:streamGenerateContent'

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

    // 调用Google Gemini流式API
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
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

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Gemini API错误:', response.status, errorText)
      return new Response(`API请求失败: ${response.status}`, { status: 500 })
    }

    // 创建可读流
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader()
          if (!reader) {
            controller.error(new Error('无法获取响应流'))
            return
          }

          let buffer = ''
          
          while (true) {
            const { done, value } = await reader.read()
            
            if (done) {
              // 发送结束信号
              controller.enqueue(encoder.encode('data: [DONE]\n\n'))
              controller.close()
              break
            }

            // 解码数据
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split('\n')
            buffer = lines.pop() || '' // 保留不完整的行

            for (const line of lines) {
              if (line.trim() && line !== 'data: [DONE]') {
                try {
                  // Gemini流式响应格式不同，直接解析JSON
                  const parsed = JSON.parse(line)
                  const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text
                  
                  if (content) {
                    // 发送内容片段
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\\n\\n`))
                  }
                } catch (parseError) {
                  // 忽略非 JSON 行
                  console.debug('跳过非 JSON 行:', line)
                }
              }
            }
          }
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
    console.error('生成介绍失败:', error)
    return new Response('生成介绍失败', { status: 500 })
  }
}
