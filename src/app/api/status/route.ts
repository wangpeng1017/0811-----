import { NextResponse } from 'next/server'
import { getUsageStats } from '@/lib/token-manager'

export async function GET() {
  try {
    const stats = getUsageStats()
    
    return NextResponse.json({
      success: true,
      data: {
        service: 'Photo Location Recognition API',
        status: 'operational',
        version: '1.0.0',
        usage: {
          totalUsed: stats.totalUsed,
          totalLimit: stats.totalLimit,
          totalRemaining: stats.remainingTotal,
          dailyUsed: stats.dailyUsed,
          dailyLimit: stats.dailyLimit,
          dailyRemaining: stats.remainingDaily,
          usagePercentage: Math.round((stats.totalUsed / stats.totalLimit) * 100)
        },
        features: {
          supportedFormats: ['JPEG', 'PNG', 'HEIC', 'HEIF'],
          maxFileSize: '10MB',
          aiModel: 'Gemini 2.5 Flash',
          modelType: '多模态快速推理模型',
          thinkingMode: 'n/a',
          responseFormat: 'JSON'
        },
        lastUpdated: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('获取状态失败:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: '无法获取服务状态' 
      },
      { status: 500 }
    )
  }
}
