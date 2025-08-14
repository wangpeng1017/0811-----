'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import ImageUpload from '@/components/ImageUpload'
import LocationResult from '@/components/LocationResult'
import ExampleImages from '@/components/ExampleImages'
import ErrorBoundary from '@/components/ErrorBoundary'
import StructuredData from '@/components/StructuredData'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { LocationData } from '@/types'

export default function HomePage() {
  const [result, setResult] = useState<LocationData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const t = useTranslations()

  const handleImageAnalysis = async (file: File) => {
    setIsAnalyzing(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const uploadResult = await response.json()
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed')
      }

      const analysisResponse = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: uploadResult.imageUrl,
        }),
      })

      if (!analysisResponse.ok) {
        throw new Error('Analysis failed')
      }

      const analysisResult = await response.json()
      
      if (analysisResult.success && analysisResult.data) {
        setResult({
          ...analysisResult.data,
          imageUrl: uploadResult.imageUrl,
        })
      } else {
        throw new Error(analysisResult.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Image analysis error:', error)
      setResult({
        error: error instanceof Error ? error.message : t('errors.analysisError'),
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleExampleClick = async (imageUrl: string) => {
    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      
      if (result.success && result.data) {
        setResult({
          ...result.data,
          imageUrl,
        })
      } else {
        throw new Error(result.error || 'Analysis failed')
      }
    } catch (error) {
      console.error('Example analysis error:', error)
      setResult({
        error: error instanceof Error ? error.message : t('errors.analysisError'),
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setIsAnalyzing(false)
  }

  if (result) {
    return (
      <ErrorBoundary>
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg mx-auto">
            {/* 语言切换器 */}
            <div className="flex justify-end mb-4">
              <LanguageSwitcher />
            </div>
            
            <LocationResult result={result} onReset={handleReset} />
          </div>
        </main>
      </ErrorBoundary>
    )
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto">
          {/* 语言切换器 */}
          <div className="flex justify-end mb-6">
            <LanguageSwitcher />
          </div>

          {/* 只在未显示结果时显示标题区域 */}
          {!result && (
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full shadow-lg flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 leading-tight">
                {t('homepage.title')}
              </h1>
              <h2 className="text-xl sm:text-2xl font-semibold text-blue-600 mb-2">
                {t('homepage.subtitle')}
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                {t('homepage.description')}
              </p>
              
              {/* SEO优化的功能介绍 */}
              <div className="text-center mb-6">
                <p className="text-gray-700 text-sm leading-relaxed max-w-md mx-auto">
                  {t('homepage.featureDescription')}
                </p>
              </div>
            </div>
          )}

          {/* 图片上传组件 */}
          <ImageUpload 
            onImageSelect={handleImageAnalysis} 
            isAnalyzing={isAnalyzing}
          />

          {/* 示例图片 */}
          <ExampleImages onImageSelect={handleExampleClick} disabled={isAnalyzing} />

          {/* SEO优化的FAQ部分 */}
          {!result && (
            <div className="bg-white rounded-2xl shadow-xl p-6 mt-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                {t('homepage.faq.title')}
              </h3>
              <div className="space-y-3 text-sm">
                <details className="group">
                  <summary className="font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                    {t('homepage.faq.question1')}
                  </summary>
                  <p className="mt-2 text-gray-600 pl-4">
                    {t('homepage.faq.answer1')}
                  </p>
                </details>
                
                <details className="group">
                  <summary className="font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                    {t('homepage.faq.question2')}
                  </summary>
                  <p className="mt-2 text-gray-600 pl-4">
                    {t('homepage.faq.answer2')}
                  </p>
                </details>
                
                <details className="group">
                  <summary className="font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                    {t('homepage.faq.question3')}
                  </summary>
                  <p className="mt-2 text-gray-600 pl-4">
                    {t('homepage.faq.answer3')}
                  </p>
                </details>
                
                <details className="group">
                  <summary className="font-medium text-gray-700 cursor-pointer hover:text-blue-600">
                    {t('homepage.faq.question4')}
                  </summary>
                  <p className="mt-2 text-gray-600 pl-4">
                    {t('homepage.faq.answer4')}
                  </p>
                </details>
              </div>
            </div>
          )}

          <footer className="text-center text-sm text-gray-500 mt-8">
            <p>{t('footer.poweredBy')}</p>
            <p className="mt-1">
              {t('footer.contact')}：
              <a
                href="mailto:wangpeng10170414@gmail.com"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                wangpeng10170414@gmail.com
              </a>
            </p>
            <p className="mt-2 text-xs">
              <span className="inline-block mx-2">{t('footer.keywords.imageLocation')}</span>
              <span className="inline-block mx-2">{t('footer.keywords.aiPositioning')}</span>
              <span className="inline-block mx-2">{t('footer.keywords.photoQuery')}</span>
            </p>
            <p className="mt-3 text-xs space-x-4">
              <a href="/help" className="text-blue-500 hover:text-blue-600 underline">
                {t('navigation.help')}
              </a>
              <a href="/privacy" className="text-blue-500 hover:text-blue-600 underline">
                {t('navigation.privacy')}
              </a>
            </p>
          </footer>
          
          {/* 结构化数据 */}
          <StructuredData type="WebApplication" />
        </div>
      </main>
    </ErrorBoundary>
  )
}
