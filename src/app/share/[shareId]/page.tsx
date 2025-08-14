'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ShareContent } from '@/types'
import LocationResult from '@/components/LocationResult'
import StructuredData from '@/components/StructuredData'

export default function SharePage() {
  const params = useParams()
  const shareId = params.shareId as string
  const [shareContent, setShareContent] = useState<ShareContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setError(data.error || '分享内容不存在')
      }
    } catch (err) {
      console.error('获取分享内容失败:', err)
      setError('加载分享内容失败')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    // 在分享页面中，重置按钮应该跳转到主页
    window.location.href = '/'
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">加载分享内容</h3>
            <p className="text-gray-600">正在获取分享的地理位置信息...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-white border border-red-200 rounded-xl shadow-xl p-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">加载失败</h3>
              <p className="text-red-600 mb-6 text-sm">{error}</p>
              <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200"
              >
                返回首页
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!shareContent) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="w-full max-w-lg mx-auto">
        {/* 面包屑导航 */}
        <nav className="mb-6" aria-label="面包屑导航">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                首页
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-800">分享结果</span>
            </li>
          </ol>
        </nav>

        {/* 分享页面标题 */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-2">分享的地理位置</h1>
          <p className="text-gray-600 text-sm">
            分享时间: {new Date(shareContent.timestamp).toLocaleString('zh-CN')}
          </p>
        </div>

        {/* 位置结果展示 */}
        <LocationResult 
          result={shareContent.locationData} 
          onReset={handleReset}
        />

        {/* 分享信息 */}
        <div className="text-center text-xs text-gray-500 mt-6">
          <p>此分享链接将于 {new Date(shareContent.expiresAt).toLocaleString('zh-CN')} 过期</p>
          <p className="mt-1">
            <a href="/" className="text-blue-500 hover:text-blue-600">
              创建你自己的地理位置识别
            </a>
          </p>
        </div>

        {/* 结构化数据 */}
        <StructuredData
          type="ImageObject"
          data={{
            url: shareContent.imageUrl,
            description: `${shareContent.locationData.location || '地理位置'}识别结果 - 图片地理位置识别应用分享`,
            name: shareContent.locationData.location || '地理位置识别结果',
            datePublished: shareContent.timestamp,
          }}
        />
      </div>
    </main>
  )
}
