'use client'

import { useState, useEffect } from 'react'
import { type Locale } from '@/i18n'

interface GeoLocationData {
  country: string
  countryCode: string
  region: string
  city: string
  timezone: string
  preferredLocale: Locale
}

// 国家代码到语言的映射
const countryToLocale: Record<string, Locale> = {
  'CN': 'zh-CN', // 中国
  'TW': 'zh-CN', // 台湾
  'HK': 'zh-CN', // 香港
  'MO': 'zh-CN', // 澳门
  'SG': 'zh-CN', // 新加坡（华人较多）
  'US': 'en-US', // 美国
  'CA': 'en-US', // 加拿大
  'GB': 'en-US', // 英国
  'AU': 'en-US', // 澳大利亚
  'NZ': 'en-US', // 新西兰
  'IE': 'en-US', // 爱尔兰
  'ZA': 'en-US', // 南非
  'JP': 'ja-JP', // 日本
  'KR': 'ja-JP', // 韩国（暂时映射到日文）
}

export function useGeoLocation() {
  const [geoData, setGeoData] = useState<GeoLocationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function detectLocation() {
      try {
        // 首先检查localStorage中是否有用户偏好
        const savedLocale = localStorage.getItem('preferred-locale') as Locale
        if (savedLocale && ['zh-CN', 'en-US', 'ja-JP'].includes(savedLocale)) {
          setGeoData({
            country: 'User Preference',
            countryCode: 'UP',
            region: '',
            city: '',
            timezone: '',
            preferredLocale: savedLocale
          })
          setLoading(false)
          return
        }

        // 使用免费的IP地理位置API
        const response = await fetch('https://ipapi.co/json/', {
          headers: {
            'Accept': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch location data')
        }

        const data = await response.json()
        
        // 根据国家代码确定首选语言
        const preferredLocale = countryToLocale[data.country_code] || 'en-US'

        const geoLocationData: GeoLocationData = {
          country: data.country_name || 'Unknown',
          countryCode: data.country_code || 'XX',
          region: data.region || '',
          city: data.city || '',
          timezone: data.timezone || '',
          preferredLocale
        }

        setGeoData(geoLocationData)
      } catch (err) {
        console.error('Geolocation detection error:', err)
        
        // 降级到浏览器语言检测
        const browserLang = navigator.language || navigator.languages?.[0] || 'en-US'
        let preferredLocale: Locale = 'en-US'
        
        if (browserLang.startsWith('zh')) {
          preferredLocale = 'zh-CN'
        } else if (browserLang.startsWith('ja')) {
          preferredLocale = 'ja-JP'
        } else {
          preferredLocale = 'en-US'
        }

        setGeoData({
          country: 'Browser Detection',
          countryCode: 'BD',
          region: '',
          city: '',
          timezone: '',
          preferredLocale
        })
        
        setError('Failed to detect precise location, using browser language')
      } finally {
        setLoading(false)
      }
    }

    detectLocation()
  }, [])

  return { geoData, loading, error }
}
