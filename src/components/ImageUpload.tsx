'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  isAnalyzing?: boolean
}

export default function ImageUpload({ onImageSelect, isAnalyzing = false }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const t = useTranslations()

  const handleClick = () => {
    if (!isAnalyzing) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // 检查文件类型
      const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif']
      if (!allowedTypes.includes(file.type)) {
        alert(t('errors.unsupportedFormat'))
        return
      }

      // 检查文件大小 (限制为10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(t('errors.fileTooLarge'))
        return
      }

      onImageSelect(file)
    }
  }

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/heic,image/heif"
        onChange={handleFileChange}
        className="hidden"
        disabled={isAnalyzing}
      />

      {isAnalyzing ? (
        <div className="text-center py-8">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('homepage.uploadArea.analyzing')}</h3>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t('homepage.uploadArea.title')}
            </h3>
            <div className="w-24 h-24 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-gray-600 mb-6">
              {t('homepage.uploadArea.dragText')}
            </p>
          </div>

          <button
            onClick={handleClick}
            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center space-x-3 transform hover:scale-105"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="text-lg">{t('homepage.uploadArea.selectFile')}</span>
          </button>

          <p className="text-sm text-gray-500 text-center mt-4">
            {t('homepage.uploadArea.description')}
          </p>
        </>
      )}
    </div>
  )
}
