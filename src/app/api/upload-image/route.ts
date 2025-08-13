import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import imageStorage from '@/lib/image-storage'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    
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
        { success: false, error: '不支持的图片格式，请上传 JPEG、PNG、HEIC 或 HEIF 格式的图片' },
        { status: 400 }
      )
    }

    // 验证文件大小（最大10MB）
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: '图片文件过大，请上传小于10MB的图片' },
        { status: 400 }
      )
    }

    // 生成唯一的图片ID
    const imageId = uuidv4()
    
    // 获取文件扩展名
    const extension = file.name.split('.').pop() || 'jpg'
    const fileName = `${imageId}.${extension}`

    // 将文件转换为Buffer并存储
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    imageStorage.store(imageId, buffer, file.type, file.name)

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
    const imageUrl = `${baseUrl}/api/images/${imageId}`

    return NextResponse.json({
      success: true,
      data: {
        imageId,
        imageUrl,
        fileName,
        size: file.size,
        type: file.type
      }
    })

  } catch (error) {
    console.error('图片上传失败:', error)
    return NextResponse.json(
      { success: false, error: '图片上传失败' },
      { status: 500 }
    )
  }
}


