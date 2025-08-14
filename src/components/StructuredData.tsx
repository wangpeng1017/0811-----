'use client'

interface StructuredDataProps {
  type?: 'WebApplication' | 'Article' | 'ImageObject'
  data?: Record<string, any>
}

export default function StructuredData({ type = 'WebApplication', data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
    }

    switch (type) {
      case 'WebApplication':
        return {
          ...baseData,
          name: '地理位置识别应用',
          description: 'AI智能图片地理位置识别工具，支持上传图片识别拍摄地点、景点介绍生成和智能对话功能',
          applicationCategory: 'UtilityApplication',
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'CNY',
            availability: 'https://schema.org/InStock',
          },
          featureList: [
            'AI图片地理位置识别',
            '景点介绍生成',
            '智能对话交互',
            '一键分享功能',
            '示例图片体验',
            '响应式设计'
          ],
          screenshot: '/screenshot.jpg',
          softwareVersion: '1.0.1',
          author: {
            '@type': 'Organization',
            name: '地理位置识别应用团队',
          },
          provider: {
            '@type': 'Organization',
            name: '地理位置识别应用',
          },
          ...data,
        }

      case 'Article':
        return {
          ...baseData,
          headline: data?.title || '如何使用AI识别图片地理位置',
          description: data?.description || '详细介绍如何使用我们的AI工具识别图片中的地理位置信息',
          author: {
            '@type': 'Organization',
            name: '地理位置识别应用团队',
          },
          publisher: {
            '@type': 'Organization',
            name: '地理位置识别应用',
          },
          datePublished: data?.datePublished || new Date().toISOString(),
          dateModified: data?.dateModified || new Date().toISOString(),
          ...data,
        }

      case 'ImageObject':
        return {
          ...baseData,
          contentUrl: data?.url || '',
          description: data?.description || '地理位置识别示例图片',
          name: data?.name || '示例图片',
          author: {
            '@type': 'Organization',
            name: '地理位置识别应用',
          },
          ...data,
        }

      default:
        return baseData
    }
  }

  const structuredData = getStructuredData()

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  )
}
