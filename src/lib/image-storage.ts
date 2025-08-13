// 共享的图片存储模块
// 在生产环境中，这应该替换为文件系统存储或云存储服务

interface StoredImage {
  buffer: Buffer
  mimeType: string
  originalName: string
  uploadTime: number
}

class ImageStorage {
  private storage = new Map<string, StoredImage>()

  // 存储图片
  store(imageId: string, buffer: Buffer, mimeType: string, originalName: string): void {
    this.storage.set(imageId, {
      buffer,
      mimeType,
      originalName,
      uploadTime: Date.now()
    })
  }

  // 获取图片
  get(imageId: string): StoredImage | undefined {
    return this.storage.get(imageId)
  }

  // 检查图片是否存在
  exists(imageId: string): boolean {
    return this.storage.has(imageId)
  }

  // 删除图片
  delete(imageId: string): boolean {
    return this.storage.delete(imageId)
  }

  // 清理过期图片（超过7天的图片）
  cleanup(): number {
    const now = Date.now()
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7天
    let deletedCount = 0

    const entries = Array.from(this.storage.entries())
    for (const [imageId, image] of entries) {
      if (now - image.uploadTime > maxAge) {
        this.storage.delete(imageId)
        deletedCount++
      }
    }

    return deletedCount
  }

  // 获取存储统计信息
  getStats() {
    const totalImages = this.storage.size
    let totalSize = 0

    const values = Array.from(this.storage.values())
    for (const image of values) {
      totalSize += image.buffer.length
    }

    return {
      totalImages,
      totalSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
    }
  }
}

// 创建单例实例
const imageStorage = new ImageStorage()

// 定期清理过期图片（每小时执行一次）
if (typeof window === 'undefined') { // 只在服务器端执行
  setInterval(() => {
    const deletedCount = imageStorage.cleanup()
    if (deletedCount > 0) {
      console.log(`清理了 ${deletedCount} 个过期图片`)
    }
  }, 60 * 60 * 1000) // 1小时
}

export default imageStorage
