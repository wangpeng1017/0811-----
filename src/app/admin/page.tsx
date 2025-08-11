'use client'

import { useState, useEffect } from 'react'
import UsageStats from '@/components/UsageStats'

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
    aiModel: string
    responseFormat: string
  }
  lastUpdated: string
}

export default function AdminPage() {
  const [status, setStatus] = useState<ServiceStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (authenticated) {
      fetchStatus()
    }
  }, [authenticated])

  const handleLogin = () => {
    // 简单的密码验证（生产环境应使用更安全的认证方式）
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'admin123') {
      setAuthenticated(true)
    } else {
      alert('密码错误')
    }
  }

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status')
      const data = await response.json()
      
      if (data.success) {
        setStatus(data.data)
      }
    } catch (error) {
      console.error('获取状态失败:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">管理员登录</h1>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="请输入管理员密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              登录
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">系统管理面板</h1>
            <button
              onClick={() => setAuthenticated(false)}
              className="text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              退出登录
            </button>
          </div>

          {status && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 服务状态 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">服务状态</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>服务名称:</span>
                    <span className="font-medium">{status.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>状态:</span>
                    <span className={`font-medium ${status.status === 'operational' ? 'text-green-600' : 'text-red-600'}`}>
                      {status.status === 'operational' ? '正常运行' : '异常'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>版本:</span>
                    <span className="font-medium">{status.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>更新时间:</span>
                    <span className="font-medium text-xs">
                      {new Date(status.lastUpdated).toLocaleString('zh-CN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* 功能特性 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">功能特性</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">支持格式:</span>
                    <div className="mt-1">
                      {status.features.supportedFormats.map((format, index) => (
                        <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>最大文件:</span>
                    <span className="font-medium">{status.features.maxFileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI模型:</span>
                    <span className="font-medium">{status.features.aiModel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>响应格式:</span>
                    <span className="font-medium">{status.features.responseFormat}</span>
                  </div>
                </div>
              </div>

              {/* 使用统计 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <UsageStats />
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="mt-6 flex space-x-4">
            <button
              onClick={fetchStatus}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              刷新状态
            </button>
            <button
              onClick={() => window.open('/', '_blank')}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              访问应用
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
