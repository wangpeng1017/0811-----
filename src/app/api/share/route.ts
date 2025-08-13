import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { ShareContent } from '@/types'

// 简单的内存存储（生产环境应使用数据库）
const shareStorage = new Map<string, ShareContent>()

// 清理过期的分享内容
function cleanupExpiredShares() {
  const now = new Date()
  shareStorage.forEach((content, id) => {
    if (new Date(content.expiresAt) < now) {
      shareStorage.delete(id)
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const { locationData } = await request.json()
    
    if (!locationData) {
      return NextResponse.json(
        { success: false, error: '缺少位置数据' },
        { status: 400 }
      )
    }

    // 清理过期内容
    cleanupExpiredShares()

    // 生成分享ID
    const shareId = uuidv4()
    
    // 设置过期时间（48小时后）
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 48)

    // 创建分享内容
    const shareContent: ShareContent = {
      id: shareId,
      locationData: {
        ...locationData,
        shareId // 添加分享ID到位置数据中
      },
      timestamp: new Date().toISOString(),
      expiresAt: expiresAt.toISOString()
    }

    // 存储分享内容
    shareStorage.set(shareId, shareContent)

    // 获取正确的基础URL
    const getBaseUrl = (request: NextRequest) => {
      // 优先使用环境变量
      if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL
      }

      // 从请求头获取
      const host = request.headers.get('host')
      const protocol = request.headers.get('x-forwarded-proto') || 'https'

      if (host) {
        return `${protocol}://${host}`
      }

      // 默认值
      return 'http://localhost:3000'
    }

    const baseUrl = getBaseUrl(request)
    const shareUrl = `${baseUrl}/share/${shareId}`

    return NextResponse.json({
      success: true,
      data: {
        shareId,
        shareUrl,
        expiresAt: expiresAt.toISOString()
      }
    })

  } catch (error) {
    console.error('创建分享失败:', error)
    return NextResponse.json(
      { success: false, error: '创建分享失败' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const shareId = searchParams.get('id')
    
    if (!shareId) {
      return NextResponse.json(
        { success: false, error: '缺少分享ID' },
        { status: 400 }
      )
    }

    // 清理过期内容
    cleanupExpiredShares()

    // 获取分享内容
    const shareContent = shareStorage.get(shareId)
    
    if (!shareContent) {
      return NextResponse.json(
        { success: false, error: '分享内容不存在或已过期' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: shareContent
    })

  } catch (error) {
    console.error('获取分享内容失败:', error)
    return NextResponse.json(
      { success: false, error: '获取分享内容失败' },
      { status: 500 }
    )
  }
}
