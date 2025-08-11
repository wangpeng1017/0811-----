'use client'

import { useState } from 'react'

interface LocationData {
  continent?: string
  country?: string
  province?: string
  city?: string
  location?: string
  latitude?: number
  longitude?: number
  error?: string
  imageUrl?: string
}

interface LocationResultProps {
  result: LocationData
  onReset: () => void
}

export default function LocationResult({ result, onReset }: LocationResultProps) {
  const [copySuccess, setCopySuccess] = useState(false)

  // 复制地点信息到剪贴板
  const copyLocationInfo = async () => {
    const locationText = formatLocationText(result)

    try {
      await navigator.clipboard.writeText(locationText)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000) // 2秒后隐藏提示
    } catch (err) {
      console.error('复制失败:', err)
      // 降级方案：使用传统方法
      fallbackCopyTextToClipboard(locationText)
    }
  }

  // 格式化地点信息为文本
  const formatLocationText = (data: LocationData): string => {
    const parts = []
    if (data.continent) parts.push(`大洲: ${data.continent}`)
    if (data.country) parts.push(`国家: ${data.country}`)
    if (data.province) parts.push(`省份: ${data.province}`)
    if (data.city) parts.push(`城市: ${data.city}`)
    if (data.location) parts.push(`地名: ${data.location}`)
    if (data.latitude && data.longitude) {
      parts.push(`坐标: ${data.latitude}, ${data.longitude}`)
    }
    return parts.join('\n')
  }

  // 降级复制方案
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.top = '0'
    textArea.style.left = '0'
    textArea.style.position = 'fixed'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()

    try {
      document.execCommand('copy')
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('降级复制也失败了:', err)
    }

    document.body.removeChild(textArea)
  }
  if (result.error) {
    return (
      <div className="w-full bg-white border border-red-200 rounded-xl shadow-xl overflow-hidden">
        {/* 图片显示区域 - 即使错误也显示图片 */}
        {result.imageUrl && (
          <div className="w-full">
            <img
              src={result.imageUrl}
              alt="上传的图片"
              className="w-full h-48 sm:h-56 md:h-64 object-cover"
            />
          </div>
        )}

        {/* 错误信息区域 */}
        <div className="p-4 sm:p-6">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">识别失败</h3>
            <p className="text-red-600 mb-6 text-sm">{result.error}</p>
            <button
              onClick={onReset}
              className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200"
            >
              重新上传
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
      {/* 图片显示区域 */}
      {result.imageUrl && (
        <div className="w-full">
          <img
            src={result.imageUrl}
            alt="上传的图片"
            className="w-full h-48 sm:h-56 md:h-64 object-cover"
          />
        </div>
      )}

      {/* 结果信息区域 */}
      <div className="p-4 sm:p-6">
        <div className="text-center mb-4">
          <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">识别成功</h3>
          <p className="text-gray-600 text-sm mt-1">以下是图片的地理位置信息</p>
        </div>
      
        {/* 地点信息列表 - 紧凑布局 */}
        <div className="space-y-1.5">
          {result.continent && (
            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
              <span className="text-gray-600 font-medium text-sm">大洲</span>
              <span className="text-gray-800 text-sm">{result.continent}</span>
            </div>
          )}

          {result.country && (
            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
              <span className="text-gray-600 font-medium text-sm">国家</span>
              <span className="text-gray-800 text-sm">{result.country}</span>
            </div>
          )}

          {result.province && (
            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
              <span className="text-gray-600 font-medium text-sm">省份/州</span>
              <span className="text-gray-800 text-sm">{result.province}</span>
            </div>
          )}

          {result.city && (
            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
              <span className="text-gray-600 font-medium text-sm">城市</span>
              <span className="text-gray-800 text-sm">{result.city}</span>
            </div>
          )}

          {result.location && (
            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
              <span className="text-gray-600 font-medium text-sm">地名</span>
              <span className="text-gray-800 text-sm">{result.location}</span>
            </div>
          )}

          {result.latitude && result.longitude && (
            <>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                <span className="text-gray-600 font-medium text-sm">纬度</span>
                <span className="text-gray-800 font-mono text-sm">{result.latitude}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-gray-600 font-medium text-sm">经度</span>
                <span className="text-gray-800 font-mono text-sm">{result.longitude}</span>
              </div>
            </>
          )}
        </div>

        {/* 复制按钮和成功提示 */}
        <div className="mt-4 space-y-3">
          <button
            onClick={copyLocationInfo}
            className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>复制地点信息</span>
          </button>

          {/* 复制成功提示 */}
          {copySuccess && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>已复制到剪贴板</span>
              </div>
            </div>
          )}
        </div>
      
        {/* 重新上传按钮 */}
        <div className="text-center">
          <button
            onClick={onReset}
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200"
          >
            重新上传
          </button>
        </div>
      </div>
    </div>
  )
}
