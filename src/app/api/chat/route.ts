import { NextRequest, NextResponse } from 'next/server'
import { formatChatAnswer } from '@/lib/markdown-utils'

const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

export async function POST(request: NextRequest) {
  try {
    // 检查环境变量
    const apiToken = process.env.ZHIPU_API_TOKEN
    if (!apiToken) {
      return NextResponse.json(
        { success: false, error: '服务配置错误' },
        { status: 500 }
      )
    }

    // 解析请求数据
    const { message, locationData, chatHistory } = await request.json()
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: '缺少消息内容' },
        { status: 400 }
      )
    }

    // 构建地点信息字符串
    let locationContext = ''
    if (locationData) {
      const locationInfo = [
        locationData.continent && `大洲: ${locationData.continent}`,
        locationData.country && `国家: ${locationData.country}`,
        locationData.province && `省份: ${locationData.province}`,
        locationData.city && `城市: ${locationData.city}`,
        locationData.location && `地点: ${locationData.location}`,
        locationData.latitude && locationData.longitude && `坐标: ${locationData.latitude}, ${locationData.longitude}`,
        locationData.introduction && `景点介绍: ${locationData.introduction}`
      ].filter(Boolean).join('\n')
      
      locationContext = `\n\n当前讨论的地理位置信息：\n${locationInfo}`
    }

    // 构建对话历史
    const messages = [
      {
        role: 'system',
        content: `你是一个专业的地理和旅游专家，擅长回答关于世界各地景点、历史、文化、旅游等相关问题。请基于提供的地理位置信息，为用户提供准确、详细、有用的回答。

回答要求：
1. 基于提供的地理位置信息进行回答
2. 回答要准确、详细、有帮助
3. 可以包含历史背景、文化特色、旅游建议等
4. 语言要友好、专业
5. 如果问题与当前地点无关，也可以提供相关的地理知识
6. 请使用纯文本格式回答，不要使用Markdown语法标记

${locationContext}`
      }
    ]

    // 添加聊天历史
    if (chatHistory && Array.isArray(chatHistory)) {
      chatHistory.forEach((chat: any) => {
        messages.push(
          { role: 'user', content: chat.question },
          { role: 'assistant', content: chat.answer }
        )
      })
    }

    // 添加当前用户消息
    messages.push({ role: 'user', content: message })

    // 调用智谱AI
    const response = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'glm-4.5v',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('智谱AI API错误:', response.status, errorText)
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()
    const answer = data.choices?.[0]?.message?.content

    if (!answer) {
      return NextResponse.json(
        { success: false, error: '无法生成回答' },
        { status: 500 }
      )
    }

    // 将markdown格式转换为纯文本
    const formattedAnswer = formatChatAnswer(answer)

    return NextResponse.json({
      success: true,
      data: {
        question: message,
        answer: formattedAnswer,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('对话失败:', error)
    return NextResponse.json(
      { success: false, error: '对话失败，请重试' },
      { status: 500 }
    )
  }
}
