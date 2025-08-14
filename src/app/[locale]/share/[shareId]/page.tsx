'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ShareContent } from '@/types'
import LocationResult from '@/components/LocationResult'
import StructuredData from '@/components/StructuredData'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function SharePage() {
  const params = useParams()
  const shareId = params.shareId as string
  const locale = params.locale as string
  const [shareContent, setShareContent] = useState<ShareContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations()

  useEffect(() => {
    if (shareId) {
      fetchShareContent(shareId)
    }
  }, [shareId])

  const fetchShareContent = async (id: string) => {
    try {
      const response = await fetch(`/api/share?id=${id}`)
      const data = await response.json()

      if (data.success) {
        setShareContent(data.data)
      } else {
        setError(data.error || t('errors.shareNotFound'))
      }
    } catch (err) {
      console.error('获取分享内容失败:', err)
      setError(t('errors.networkError'))
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    // 分享页面不需要重置功能，直接跳转到首页
    window.location.href = `/${locale}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          {/* 语言切换器 */}
          <div className="flex justify-end mb-6">
            <LanguageSwitcher />
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {t('errors.shareNotFound')}
            </h1>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {t('share.createYourOwn')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!shareContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-gray-400 text-6xl mb-4">📍</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {t('errors.shareNotFound')}
            </h1>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t('share.createYourOwn')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 检查分享是否过期
  const isExpired = new Date() > new Date(shareContent.expiresAt)
  if (isExpired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="text-yellow-500 text-6xl mb-4">⏰</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {t('errors.shareExpired')}
            </h1>
            <p className="text-gray-600 mb-6">
              {t('share.expiresAt', { date: new Date(shareContent.expiresAt).toLocaleString() })}
            </p>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              {t('share.createYourOwn')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg mx-auto">
        {/* 语言切换器 */}
        <div className="flex justify-end mb-6">
          <LanguageSwitcher />
        </div>

        {/* 分享标题 */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-4">
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              {t('share.title')}
            </h1>
            <p className="text-sm text-gray-600">
              {t('share.sharedAt')}: {new Date(shareContent.timestamp).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {t('share.expiresAt', { date: new Date(shareContent.expiresAt).toLocaleString() })}
            </p>
          </div>
        </div>

        {/* 位置结果 */}
        <LocationResult 
          result={shareContent.locationData} 
          onReset={handleReset}
          isSharedView={true}
        />

        {/* 创建自己的识别链接 */}
        <div className="text-center mt-6">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t('share.createYourOwn')}
          </Link>
        </div>
      </div>

      {/* 结构化数据 */}
      <StructuredData 
        type="ImageObject" 
        data={{
          contentUrl: shareContent.imageUrl,
          description: shareContent.introduction || shareContent.locationData.location,
          name: shareContent.locationData.location,
          dateCreated: shareContent.timestamp,
          locationCreated: {
            '@type': 'Place',
            name: shareContent.locationData.location,
            geo: (shareContent.locationData.latitude && shareContent.locationData.longitude) ? {
              '@type': 'GeoCoordinates',
              latitude: shareContent.locationData.latitude,
              longitude: shareContent.locationData.longitude
            } : undefined
          }
        }}
      />
    </div>
  )
}
