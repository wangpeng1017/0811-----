import { NextRequest, NextResponse } from 'next/server'
import imageStorage from '@/lib/image-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: { imageId: string } }
) {
  try {
    const { imageId } = params
    
    if (!imageId) {
      return new NextResponse('缺少图片ID', { status: 400 })
    }

    const storedImage = imageStorage.get(imageId)

    if (!storedImage) {
      return new NextResponse('图片不存在', { status: 404 })
    }

    return new NextResponse(new Uint8Array(storedImage.buffer), {
      status: 200,
      headers: {
        'Content-Type': storedImage.mimeType,
        'Cache-Control': 'public, max-age=31536000', // 缓存1年
        'Content-Length': storedImage.buffer.length.toString(),
      }
    })

  } catch (error) {
    console.error('获取图片失败:', error)
    return new NextResponse('获取图片失败', { status: 500 })
  }
}
