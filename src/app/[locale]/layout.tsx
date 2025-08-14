import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/i18n'
import '../globals.css'

interface Props {
  children: React.ReactNode
  params: { locale: string }
}

// 生成静态参数，确保所有支持的locale都被预生成
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

// 生成多语言metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale
  const t = await getTranslations({ locale, namespace: 'homepage' })
  
  const baseMetadata = {
    title: t('title'),
    description: t('description'),
    keywords: 'image geolocation,photo location,AI positioning,geographic recognition',
    authors: [{ name: 'Geographic Location Recognition Team' }],
    creator: 'Geographic Location Recognition App',
    publisher: 'Geographic Location Recognition App',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: t('title'),
      description: t('featureDescription'),
      type: 'website',
      locale: locale,
      siteName: 'Geographic Location Recognition App',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('featureDescription'),
    },
    robots: {
      index: true,
      follow: true,
    },
  }

  // 根据语言添加特定的关键词
  if (locale === 'zh-CN') {
    baseMetadata.keywords = '图片地理位置识别,照片位置查询,AI图片定位,景点识别,GPS坐标提取,在线图片位置识别工具,免费照片地理位置查询,上传图片识别拍摄地点,AI智能图片定位服务,照片GPS位置信息提取,图片景点识别工具'
  } else if (locale === 'en-US') {
    baseMetadata.keywords = 'image geolocation recognition,photo location identification,AI image positioning,landmark recognition,GPS coordinate extraction,online image location tool,free photo geolocation query,upload image location detection,AI smart image positioning service,photo GPS information extraction,image landmark recognition tool'
  } else if (locale === 'ja-JP') {
    baseMetadata.keywords = '画像地理位置認識,写真位置クエリ,AI画像ポジショニング,ランドマーク認識,GPS座標抽出,オンライン画像位置ツール,無料写真地理位置クエリ,画像アップロード位置検出,AIスマート画像ポジショニングサービス,写真GPS情報抽出,画像ランドマーク認識ツール'
  }

  return baseMetadata
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' },
  ],
}

export default async function LocaleLayout({ children, params }: Props) {
  const locale = params.locale as Locale

  // 验证locale是否支持
  if (!locales.includes(locale)) {
    notFound()
  }

  // 获取翻译消息
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
