import { NextRequest, NextResponse } from 'next/server'
import { formatChatAnswer } from '@/lib/markdown-utils'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent'

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

    // 构建上Gemini的对话内容（Gemini不支持system role，需要将系统提示合并到用户消息中）
    let conversationText = `你是一个专业的地理和旅游专家，擅长回答关于世界各地景点、历史、文化、旅游等相关问题。请基于提供的地理位置信息，为用户提供准确、详细、有用的回答。\n\n回答要求：\n1. 基于提供的地理位置信息进行回答\n2. 回答要准确、详细、有帮助\n3. 可以包含历史背景、文化特色、旅游建议等\n4. 语言要友好、专业\n5. 如果问题与当前地点无关，也可以提供相关的地理知识\n6. 请使用纯文本格式回答，不要使用Markdown语法标记${locationContext}\n\n`
    
    // 添加聊天历史
    if (chatHistory && Array.isArray(chatHistory)) {
      conversationText += '以下是之前的对话历史：\n'
      chatHistory.forEach((chat: any) => {
        conversationText += `用户: ${chat.question}\n助手: ${chat.answer}\n\n`
      })
    }
    
    // 添加当前问题
    conversationText += `用户: ${message}\n请回答:`

    // 调用Google Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: conversationText
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Gemini API错误:', response.status, errorText)
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text

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
