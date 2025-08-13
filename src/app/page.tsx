'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import LocationResult from '@/components/LocationResult'
import ExampleImages from '@/components/ExampleImages'
import ErrorBoundary from '@/components/ErrorBoundary'
import { analyzeImageLocation, compressImage } from '@/lib/api'

export default function Home() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleUpload = async (file: File) => {
    setLoading(true)
    setResult(null)

    try {
      console.log('开始处理文件:', file.name, '大小:', (file.size / 1024 / 1024).toFixed(2) + 'MB')

      // 如果文件较大，进行压缩
      let processedFile = file
      if (file.size > 2 * 1024 * 1024) { // 大于2MB时压缩
        console.log('压缩图片中...')
        processedFile = await compressImage(file, 1920, 0.8)
        console.log('压缩后大小:', (processedFile.size / 1024 / 1024).toFixed(2) + 'MB')
      }

      // 先上传图片到服务器
      console.log('上传图片到服务器...')
      const uploadFormData = new FormData()
      uploadFormData.append('image', processedFile)

      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: uploadFormData,
      })

      const uploadData = await uploadResponse.json()
      if (!uploadData.success) {
        throw new Error(uploadData.error || '图片上传失败')
      }

      const serverImageUrl = uploadData.data.imageUrl
      console.log('图片上传成功:', serverImageUrl)

      // 调用API分析图片
      const response = await analyzeImageLocation(processedFile)

      if (response.success && response.data) {
        // 将服务器图片URL添加到结果中
        setResult({
          ...response.data,
          imageUrl: serverImageUrl
        })
      } else {
        setResult({
          error: response.error || '这个图片我看不清，换个试试吧',
          imageUrl: serverImageUrl // 即使失败也保留图片
        })
      }
    } catch (error) {
      console.error('上传失败:', error)
      setResult({ error: '这个图片我看不清，换个试试吧' })
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    // 重置状态
    setResult(null)
    setLoading(false)
  }

  // 处理示例图片选择
  const handleExampleImageSelect = async (imageUrl: string) => {
    setLoading(true)
    setResult(null)

    try {
      console.log('开始处理示例图片:', imageUrl)

      // 从URL获取图片
      const response = await fetch(imageUrl)
      const blob = await response.blob()

      // 创建File对象
      const file = new File([blob], 'example-image.jpg', { type: 'image/jpeg' })

      // 如果文件较大，进行压缩
      let processedFile = file
      if (file.size > 2 * 1024 * 1024) { // 大于2MB时压缩
        console.log('压缩图片中...')
        processedFile = await compressImage(file, 1920, 0.8)
        console.log('压缩后大小:', (processedFile.size / 1024 / 1024).toFixed(2) + 'MB')
      }

      // 先上传图片到服务器
      console.log('上传图片到服务器...')
      const uploadFormData = new FormData()
      uploadFormData.append('image', processedFile)

      const uploadResponse = await fetch('/api/upload-image', {
        method: 'POST',
        body: uploadFormData,
      })

      const uploadData = await uploadResponse.json()
      if (!uploadData.success) {
        throw new Error(uploadData.error || '图片上传失败')
      }

      const serverImageUrl = uploadData.data.imageUrl
      console.log('图片上传成功:', serverImageUrl)

      // 调用API分析图片
      const analysisResponse = await analyzeImageLocation(processedFile)

      if (analysisResponse.success && analysisResponse.data) {
        // 将服务器图片URL添加到结果中
        setResult({
          ...analysisResponse.data,
          imageUrl: serverImageUrl
        })
      } else {
        setResult({
          error: analysisResponse.error || '这个图片我看不清，换个试试吧',
          imageUrl: serverImageUrl // 即使失败也保留图片
        })
      }
    } catch (error) {
      console.error('处理示例图片失败:', error)
      setResult({ error: '处理图片失败，请重试' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 leading-tight">
            上传朋友圈的一张风景图
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-2">
            我来告诉你是哪里
          </h2>
          <p className="text-gray-600 text-sm">
            AI智能识别图片拍摄地点
          </p>
        </div>

        {!result && !loading && (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <ImageUpload onUpload={handleUpload} />
            </div>

            {/* 示例图片展示 */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <ExampleImages
                onImageSelect={handleExampleImageSelect}
                disabled={loading}
              />
            </div>
          </>
        )}

        {loading && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">AI正在分析中</h3>
            <p className="text-gray-600">正在识别图片中的地理位置信息...</p>
          </div>
        )}

        {result && (
          <LocationResult result={result} onReset={handleReset} />
        )}

        <footer className="text-center text-sm text-gray-500 mt-8">
          <p>© GLM-4.5V提供模型支持</p>
          <p className="mt-1">基于AI技术，快速精准识别</p>
        </footer>
      </div>
    </main>
    </ErrorBoundary>
  )
}
