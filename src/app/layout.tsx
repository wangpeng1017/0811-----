import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI智能识别照片拍摄地点 | 地理位置识别应用',
  description: '上传任何图片，AI立即识别拍摄地理位置。支持大洲、国家、城市、具体地名及GPS坐标识别。免费使用，保护隐私，基于GLM-4.5V模型。',
  keywords: '图片地理位置识别,照片位置查询,AI图片定位,景点识别,GPS坐标提取,在线图片位置识别工具,免费照片地理位置查询,上传图片识别拍摄地点,AI智能图片定位服务,照片GPS位置信息提取,图片景点识别工具',
  authors: [{ name: '地理位置识别应用团队' }],
  creator: '地理位置识别应用',
  publisher: '地理位置识别应用',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'AI智能识别照片拍摄地点',
    description: '上传图片即可获取详细地理位置信息，支持景点介绍和智能对话。基于GLM-4.5V模型，免费使用，保护隐私。',
    type: 'website',
    locale: 'zh_CN',
    url: 'https://your-domain.com',
    siteName: '地理位置识别应用',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '图片地理位置识别应用 - AI智能识别照片拍摄地点',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '图片地理位置识别 - AI智能识别照片拍摄地点',
    description: '上传图片即可获取详细地理位置信息，支持景点介绍和智能对话',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}
