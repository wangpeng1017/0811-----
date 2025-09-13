import { NextRequest, NextResponse } from 'next/server'
import { canUseTokens, recordTokenUsage, estimateTokensForImage, getUsageStats } from '@/lib/token-manager'

// Google Gemini API配置
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro-vision:generateContent'

export async function POST(request: NextRequest) {
  try {
    // 检查环境变量
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('GEMINI_API_KEY环境变量未设置')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Google Gemini API Key未配置，请在.env.local文件中设置GEMINI_API_KEY环境变量',
          details: '请参考.env.local.example文件配置您的API Key'
        },
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

    // 调用Google Gemini API
    const aiResponse = await callGeminiAPI(apiKey, base64, file.type)

    if (!aiResponse.success) {
      return NextResponse.json(aiResponse, { status: 500 })
    }

    // 记录实际Token使用量
    // Gemini API响应包含详细的Token使用统计
    const actualTokens = aiResponse.usage?.totalTokenCount || estimatedTokens
    recordTokenUsage(actualTokens)

    console.log('Token使用统计:', {
      promptTokenCount: aiResponse.usage?.promptTokenCount,
      candidatesTokenCount: aiResponse.usage?.candidatesTokenCount,
      totalTokenCount: aiResponse.usage?.totalTokenCount,
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

async function callGeminiAPI(apiKey: string, base64Image: string, mimeType: string) {
  try {
    // 验证API Key格式
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      throw new Error('无效的API Key，请检查环境变量配置')
    }

    console.log('调用Google Gemini API，API Key长度:', apiKey.length)
    
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: '请仔细分析这张图片的拍摄地理位置。请根据图片中的建筑物、标识、自然景观、文字等特征，尽可能准确地识别拍摄地点。\n\n重要要求：\n1. 所有地名必须使用中文名称（如：亚洲、中国、北京市、天安门广场等）\n2. 不要使用英文地名（如：Asia、China、Beijing等）\n3. 坐标信息使用数字格式\n\n请以JSON格式返回结果，包含以下字段：\n{\n  "continent": "大洲中文名称（如：亚洲、欧洲、北美洲等）",\n  "country": "国家中文名称（如：中国、美国、法国等）", \n  "province": "省份或州中文名称（如：北京市、广东省、加利福尼亚州等）",\n  "city": "城市中文名称（如：北京市、上海市、洛杉矶等）",\n  "location": "具体地点中文名称（如：天安门广场、埃菲尔铁塔、自由女神像等）",\n  "latitude": 纬度数值,\n  "longitude": 经度数值\n}\n\n如果无法确定某项信息，请返回null。请确保返回的是有效的JSON格式，且所有地名都是中文。'
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2000
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE'
          }
        ]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Gemini API错误:', response.status, errorText)
      
      // 针对不同的错误状态码提供更详细的错误信息
      if (response.status === 401) {
        throw new Error(`Google Gemini API身份验证失败 (401):\n\n可能的原因：\n1. API Key无效或已过期\n2. API Key格式错误\n3. 项目没有开启Generative Language API\n\n解决方案：\n1. 访问 https://console.cloud.google.com/ 检查项目状态\n2. 启用Generative Language API\n3. 重新生成API Key\n4. 更新.env.local文件中的GEMINI_API_KEY\n\n当前API Key长度: ${apiKey.length}字符\n错误详情: ${errorText}`)
      } else if (response.status === 403) {
        throw new Error(`Google Gemini API访问被拒绝 (403):\n\n可能的原因：\n1. API Key没有权限\n2. 超出配额限制\n3. 地理位置限制\n\n解决方案：\n1. 检查Google Cloud Console中API权限\n2. 检查计费设置和配额\n3. 确认服务在支持的地区\n\n错误详情: ${errorText}`)
      } else if (response.status === 429) {
        throw new Error(`Google Gemini API调用频率超限 (429):\n\n请稍等片刻后重试\n建议等待时间: 1-2分钟\n\n错误详情: ${errorText}`)
      } else if (response.status >= 500) {
        throw new Error(`Google Gemini服务器错误 (${response.status}):\n\n这是Google服务端的问题，请稍后重试\n如果问题持续，请联系Google支持\n\n错误详情: ${errorText}`)
      } else {
        throw new Error(`Google Gemini API请求失败 (${response.status}):\n\n未知错误，请检查网络连接或联系技术支持\n\n错误详情: ${errorText}`)
      }
    }

    const data = await response.json()
    console.log('Google Gemini API响应:', JSON.stringify(data, null, 2))
    
    // 解析AI返回的结果
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!content) {
      return { success: false, error: '无法识别图片位置' }
    }

    // 尝试从响应中提取JSON内容
    let jsonContent = content
    
    // 如果内容包被```json```包裹，提取其中内容
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonContent = jsonMatch[1].trim()
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
        usage: data.usageMetadata // 传递Token使用统计
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
        usage: data.usageMetadata // 传递Token使用统计
      }
    }

  } catch (error) {
    console.error('Google Gemini API调用失败:', error)
    
    // 返回更详细的错误信息
    const errorMessage = error instanceof Error ? error.message : 'AI服务暂时不可用'
    return { 
      success: false, 
      error: errorMessage,
      details: '请检查API Key配置或网络连接'
    }
  }
}
