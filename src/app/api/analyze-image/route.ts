import { NextRequest, NextResponse } from 'next/server'
import { canUseTokens, recordTokenUsage, estimateTokensForImage, getUsageStats } from '@/lib/token-manager'

// 智谱AI API配置
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
    const formData = await request.formData()
    const file = formData.get('image') as File

    // 估算Token使用量
    const estimatedTokens = estimateTokensForImage(file.size)

    // 检查Token使用量限制
    if (!canUseTokens(estimatedTokens)) {
      const stats = getUsageStats()
      return NextResponse.json(
        {
          success: false,
          error: stats.remainingTotal <= 0 ? '服务已达到使用上限，请稍后再试' : '今日使用量已达上限，请明天再试',
          stats: {
            dailyRemaining: stats.remainingDaily,
            totalRemaining: stats.remainingTotal
          }
        },
        { status: 429 }
      )
    }
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: '请上传图片文件' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: '不支持的文件格式' },
        { status: 400 }
      )
    }

    // 验证文件大小 (10MB限制)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: '文件大小不能超过10MB' },
        { status: 400 }
      )
    }

    // 将文件转换为base64
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    // 调用智谱AI API
    const aiResponse = await callZhipuAI(apiToken, base64, file.type)

    if (!aiResponse.success) {
      return NextResponse.json(aiResponse, { status: 500 })
    }

    // 记录实际Token使用量
    // GLM-4.5V API响应包含详细的Token使用统计
    const actualTokens = aiResponse.usage?.total_tokens || estimatedTokens
    recordTokenUsage(actualTokens)

    console.log('Token使用统计:', {
      prompt_tokens: aiResponse.usage?.prompt_tokens,
      completion_tokens: aiResponse.usage?.completion_tokens,
      total_tokens: aiResponse.usage?.total_tokens,
      estimated: estimatedTokens,
      actual: actualTokens
    })

    return NextResponse.json(aiResponse)

  } catch (error) {
    console.error('API错误:', error)
    return NextResponse.json(
      { success: false, error: '服务器内部错误' },
      { status: 500 }
    )
  }
}

async function callZhipuAI(apiToken: string, base64Image: string, mimeType: string) {
  try {
    const response = await fetch(ZHIPU_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'glm-4.5v', // 使用GLM-4.5V旗舰视觉推理模型
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: '请仔细分析这张图片的拍摄地理位置。请根据图片中的建筑物、标识、自然景观、文字等特征，尽可能准确地识别拍摄地点。请以JSON格式返回结果，包含以下字段：\n{\n  "continent": "大洲名称",\n  "country": "国家名称", \n  "province": "省份或州名称",\n  "city": "城市名称",\n  "location": "具体地点名称",\n  "latitude": 纬度数值,\n  "longitude": 经度数值\n}\n如果无法确定某项信息，请返回null。请确保返回的是有效的JSON格式。'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        thinking: {
          type: 'enabled'  // 启用GLM-4.5V的思考模式，提高推理准确性
        },
        temperature: 0.1,
        max_tokens: 2000,  // 增加token限制以支持更详细的分析
        stream: false
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('智谱AI API错误:', response.status, errorText)
      throw new Error(`API请求失败: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('智谱AI API响应:', JSON.stringify(data, null, 2))
    
    // 解析AI返回的结果
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      return { success: false, error: '无法识别图片位置' }
    }

    // GLM-4.5V可能返回带有特殊标记的JSON格式
    // 提取<|begin_of_box|>和<|end_of_box|>之间的JSON内容
    let jsonContent = content
    const boxMatch = content.match(/<\|begin_of_box\|>([\s\S]*?)<\|end_of_box\|>/)
    if (boxMatch) {
      jsonContent = boxMatch[1].trim()
    }

    // 尝试解析JSON结果
    try {
      const locationData = JSON.parse(jsonContent)
      return {
        success: true,
        data: {
          continent: locationData.continent,
          country: locationData.country,
          province: locationData.province,
          city: locationData.city,
          location: locationData.location,
          latitude: locationData.latitude,
          longitude: locationData.longitude
        },
        usage: data.usage // 传递Token使用统计
      }
    } catch (parseError) {
      console.error('JSON解析失败:', parseError, '原始内容:', content)
      // 如果不是JSON格式，尝试从文本中提取信息
      return {
        success: true,
        data: {
          location: content,
          continent: null,
          country: null,
          province: null,
          city: null,
          latitude: null,
          longitude: null
        },
        usage: data.usage // 传递Token使用统计
      }
    }

  } catch (error) {
    console.error('智谱AI调用失败:', error)
    return { success: false, error: 'AI服务暂时不可用' }
  }
}
