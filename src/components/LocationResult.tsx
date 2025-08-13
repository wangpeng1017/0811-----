'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

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
  introduction?: string
  shareId?: string
}

interface LocationResultProps {
  result: LocationData
  onReset: () => void
}

export default function LocationResult({ result, onReset }: LocationResultProps) {
  const [copySuccess, setCopySuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [introduction, setIntroduction] = useState<string>('')
  const [shareUrl, setShareUrl] = useState<string>('')
  const [showQR, setShowQR] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

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

  // 生成地点介绍
  const generateIntroduction = async () => {
    if (!result || result.error) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/generate-introduction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationData: result })
      })

      const data = await response.json()
      if (data.success) {
        setIntroduction(data.data.introduction)
      } else {
        console.error('生成介绍失败:', data.error)
      }
    } catch (error) {
      console.error('生成介绍失败:', error)
    } finally {
      setIsLoading(false)
    }
  }







  // 分享功能
  const createShare = async () => {
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationData: {
            ...result,
            introduction
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        setShareUrl(data.data.shareUrl)

        // 生成二维码
        const qrCode = await QRCode.toDataURL(data.data.shareUrl)
        setQrCodeUrl(qrCode)
        setShowQR(true)
      }
    } catch (error) {
      console.error('创建分享失败:', error)
    }
  }

  const copyShareUrl = async () => {
    if (shareUrl) {
      try {
        await navigator.clipboard.writeText(shareUrl)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (err) {
        fallbackCopyTextToClipboard(shareUrl)
      }
    }
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
            <h3 className="text-lg font-semibold text-red-800 mb-2">看不清楚</h3>
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
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden relative">
      {/* 分享按钮 - 右上角 */}
      <button
        onClick={createShare}
        className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all duration-200"
        title="分享结果"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      </button>

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

        {/* 景点介绍区域 */}
        <div className="mt-6 border-t border-gray-100 pt-4">
          {!introduction ? (
            <button
              onClick={generateIntroduction}
              disabled={isLoading}
              className="w-full bg-purple-500 hover:bg-purple-600 active:bg-purple-700 disabled:bg-purple-300 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>生成介绍中...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>生成景点介绍</span>
                </>
              )}
            </button>
          ) : (
            <div className="space-y-4">
              {/* 景点介绍标题 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-3">景点介绍</h4>

                {/* 介绍文本 */}
                <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                  {introduction}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 操作按钮区域 */}
        <div className="mt-4 space-y-2.5">
          {/* 复制地点信息按钮 */}
          <button
            onClick={copyLocationInfo}
            className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>复制地点信息</span>
          </button>

          {/* 重新上传按钮 - 与复制按钮相同宽度和间距 */}
          <button
            onClick={onReset}
            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200"
          >
            重新上传
          </button>

          {/* 复制成功提示 */}
          {copySuccess && (
            <div className="text-center pt-1">
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>已复制到剪贴板</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 分享弹窗 */}
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">分享地理位置</h3>

              {/* 二维码 */}
              {qrCodeUrl && (
                <div className="mb-4">
                  <img src={qrCodeUrl} alt="分享二维码" className="mx-auto w-32 h-32" />
                  <p className="text-sm text-gray-600 mt-2">扫描二维码分享</p>
                </div>
              )}

              {/* 分享链接 */}
              <div className="mb-4">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50"
                />
              </div>

              {/* 操作按钮 */}
              <div className="flex space-x-2">
                <button
                  onClick={copyShareUrl}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                >
                  复制链接
                </button>
                <button
                  onClick={() => setShowQR(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg text-sm transition-colors duration-200"
                >
                  关闭
                </button>
              </div>

              {/* 复制成功提示 */}
              {copySuccess && (
                <div className="mt-3">
                  <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>已复制到剪贴板</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
