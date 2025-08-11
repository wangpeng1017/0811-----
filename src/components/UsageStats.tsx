'use client'

import { useState, useEffect } from 'react'

interface UsageData {
  totalUsed: number
  totalLimit: number
  totalRemaining: number
  dailyUsed: number
  dailyLimit: number
  dailyRemaining: number
  usagePercentage: number
}

export default function UsageStats() {
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsageStats()
  }, [])

  const fetchUsageStats = async () => {
    try {
      const response = await fetch('/api/status')
      const data = await response.json()
      
      if (data.success) {
        setUsage(data.data.usage)
      }
    } catch (error) {
      console.error('获取使用统计失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!usage) {
    return null
  }

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500'
    if (percentage < 80) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-sm">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
        <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        服务使用统计
      </h3>
      
      {/* 总使用量 */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-600">总使用量</span>
          <span className="font-medium">
            {formatNumber(usage.totalUsed)} / {formatNumber(usage.totalLimit)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getUsageColor(usage.usagePercentage)}`}
            style={{ width: `${Math.min(usage.usagePercentage, 100)}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          剩余: {formatNumber(usage.totalRemaining)} ({(100 - usage.usagePercentage).toFixed(1)}%)
        </div>
      </div>

      {/* 今日使用量 */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-600">今日使用量</span>
          <span className="font-medium">
            {formatNumber(usage.dailyUsed)} / {formatNumber(usage.dailyLimit)}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${getUsageColor((usage.dailyUsed / usage.dailyLimit) * 100)}`}
            style={{ width: `${Math.min((usage.dailyUsed / usage.dailyLimit) * 100, 100)}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          剩余: {formatNumber(usage.dailyRemaining)}
        </div>
      </div>

      {/* 刷新按钮 */}
      <button
        onClick={fetchUsageStats}
        className="mt-3 text-xs text-blue-600 hover:text-blue-800 transition-colors duration-200"
      >
        刷新统计
      </button>
    </div>
  )
}
