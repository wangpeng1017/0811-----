'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { getExampleImages, ExampleImage } from '@/data/example-images'

interface ExampleImagesProps {
  onImageSelect: (imageUrl: string) => Promise<void>
  disabled?: boolean
}

export default function ExampleImages({ onImageSelect, disabled = false }: ExampleImagesProps) {
  const [loadingImageId, setLoadingImageId] = useState<string | null>(null)
  const t = useTranslations()
  const exampleImages = getExampleImages()

  const handleImageClick = async (image: ExampleImage) => {
    if (disabled || loadingImageId) return

    setLoadingImageId(image.id)

    try {
      // 调用父组件的处理函数
      await onImageSelect(image.url)
    } catch (error) {
      console.error('加载示例图片失败:', error)
    } finally {
      setLoadingImageId(null)
    }
  }

  return (
    <div className="mt-8">
      {/* 标题 */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {t('homepage.exampleImages.title')}
        </h3>
        <p className="text-sm text-gray-600">
          {t('homepage.exampleImages.subtitle')}
        </p>
      </div>

      {/* 图片网格 - 移动端2列，桌面端2列 */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {exampleImages.map((image) => (
          <div
            key={image.id}
            className={`relative group cursor-pointer transition-all duration-300 ${
              disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
            onClick={() => handleImageClick(image)}
          >
            {/* 图片容器 */}
            <div className="relative overflow-hidden rounded-xl shadow-lg bg-gray-200 aspect-[4/3]">
              {/* 加载状态 */}
              {loadingImageId === image.id && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                </div>
              )}
              
              {/* 图片 */}
              <img
                src={image.url}
                alt={t(`homepage.exampleImages.${image.id}`)}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* 悬停遮罩 */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white bg-opacity-90 rounded-full p-3">
                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 提示文本 */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          💡 这些都是真实的地标建筑，AI会准确识别出它们的位置信息
        </p>
      </div>
    </div>
  )
}
