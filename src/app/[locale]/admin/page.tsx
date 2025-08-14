'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import UsageStats from '@/components/UsageStats'
import LanguageSwitcher from '@/components/LanguageSwitcher'

interface ServiceStatus {
  service: string
  status: string
  version: string
  usage: {
    totalUsed: number
    totalLimit: number
    totalRemaining: number
    dailyUsed: number
    dailyLimit: number
    dailyRemaining: number
    usagePercentage: number
  }
  features: {
    supportedFormats: string[]
    maxFileSize: string
    responseTime: string
  }
}

export default function AdminPage() {
  const [status, setStatus] = useState<ServiceStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations()

  useEffect(() => {
    fetchStatus()
  }, [])

  const fetchStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/status')
      
      if (!response.ok) {
        throw new Error('Failed to fetch status')
      }
      
      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">❌</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchStatus}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* 顶部导航 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">系统管理</h1>
          <LanguageSwitcher />
        </div>

        {/* 服务状态卡片 */}
        {status && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 基本信息 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">服务信息</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">服务名称:</span>
                  <span className="font-medium">{status.service}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">状态:</span>
                  <span className={`font-medium ${
                    status.status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {status.status === 'active' ? '正常运行' : '异常'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">版本:</span>
                  <span className="font-medium">{status.version}</span>
                </div>
              </div>
            </div>

            {/* 功能特性 */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">功能特性</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">支持格式:</span>
                  <div className="mt-1">
                    {status.features.supportedFormats.map((format, index) => (
                      <span
                        key={index}
                        className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">最大文件大小:</span>
                  <span className="font-medium">{status.features.maxFileSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">响应时间:</span>
                  <span className="font-medium">{status.features.responseTime}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 使用统计 */}
        <UsageStats />

        {/* 刷新按钮 */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchStatus}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            刷新状态
          </button>
        </div>
      </div>
    </div>
  )
}
