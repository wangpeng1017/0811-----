import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '图片地理位置识别',
  description: '上传图片，快速识别拍摄地理位置',
  viewport: 'width=device-width, initial-scale=1',
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
