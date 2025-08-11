import { ApiResponse } from '@/types'

/**
 * 上传图片并分析地理位置
 */
export async function analyzeImageLocation(file: File): Promise<ApiResponse> {
  try {
    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch('/api/analyze-image', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    
    if (!response.ok) {
      return {
        success: false,
        error: data.error || '请求失败'
      }
    }

    return data
  } catch (error) {
    console.error('API调用失败:', error)
    return {
      success: false,
      error: '网络错误，请检查连接'
    }
  }
}

/**
 * 压缩图片（可选功能，用于优化上传速度）
 */
export function compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // 计算压缩后的尺寸
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      // 绘制压缩后的图片
      ctx?.drawImage(img, 0, 0, width, height)

      // 转换为Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            })
            resolve(compressedFile)
          } else {
            resolve(file) // 压缩失败，返回原文件
          }
        },
        file.type,
        quality
      )
    }

    img.onerror = () => {
      resolve(file) // 加载失败，返回原文件
    }

    img.src = URL.createObjectURL(file)
  })
}
