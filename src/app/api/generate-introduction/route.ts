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

    // 调用Google Gemini API生成介绍文本
    const response = await fetch(`${getGeminiApiUrl(GEMINI_MODELS[0])}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `请为以下地理位置生成一段详细的景点介绍，要求：

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
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 800
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Gemini API错误:', response.status, errorText)
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()
    const introduction = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!introduction) {
      return NextResponse.json(
        { success: false, error: '无法生成介绍文本' },
        { status: 500 }
      )
    }

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
    return NextResponse.json(
      { success: false, error: '生成介绍文本失败' },
      { status: 500 }
    )
  }
}
