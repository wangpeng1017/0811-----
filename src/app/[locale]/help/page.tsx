import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import StructuredData from '@/components/StructuredData'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { type Locale } from '@/i18n'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale as Locale
  const t = await getTranslations({ locale, namespace: 'help' })
  
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'article',
      locale: locale,
    },
    twitter: {
      card: 'summary',
      title: t('title'),
      description: t('description'),
    },
  }
}

export default async function HelpPage({ params }: Props) {
  const locale = params.locale as Locale
  const t = await getTranslations({ locale, namespace: 'help' })
  const nav = await getTranslations({ locale, namespace: 'navigation' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 顶部导航 */}
        <div className="flex justify-between items-center mb-8">
          <nav className="text-sm text-gray-600">
            <Link href={`/${locale}`} className="hover:text-blue-600">
              {nav('home')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-800">{nav('help')}</span>
          </nav>
          <LanguageSwitcher />
        </div>

        {/* 主要内容 */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            {t('title')}
          </h1>
          
          <div className="prose prose-blue max-w-none">
            <p className="text-lg text-gray-600 mb-8">
              {t('description')}
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {t('quickStart.title')}
            </h2>
            <ol className="list-decimal list-inside space-y-3 mb-8">
              <li className="text-gray-700">{t('quickStart.step1')}</li>
              <li className="text-gray-700">{t('quickStart.step2')}</li>
              <li className="text-gray-700">{t('quickStart.step3')}</li>
              <li className="text-gray-700">{t('quickStart.step4')}</li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {t('features.title')}
            </h2>
            <ul className="list-disc list-inside space-y-3 mb-8">
              <li className="text-gray-700">{t('features.feature1')}</li>
              <li className="text-gray-700">{t('features.feature2')}</li>
              <li className="text-gray-700">{t('features.feature3')}</li>
              <li className="text-gray-700">{t('features.feature4')}</li>
              <li className="text-gray-700">{t('features.feature5')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {t('tips.title')}
            </h2>
            <ul className="list-disc list-inside space-y-3 mb-8">
              <li className="text-gray-700">{t('tips.tip1')}</li>
              <li className="text-gray-700">{t('tips.tip2')}</li>
              <li className="text-gray-700">{t('tips.tip3')}</li>
              <li className="text-gray-700">{t('tips.tip4')}</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {t('troubleshooting.title')}
            </h2>
            <div className="space-y-4 mb-8">
              <div>
                <h3 className="font-semibold text-gray-800">{t('troubleshooting.q1')}</h3>
                <p className="text-gray-700 mt-2">{t('troubleshooting.a1')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{t('troubleshooting.q2')}</h3>
                <p className="text-gray-700 mt-2">{t('troubleshooting.a2')}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{t('troubleshooting.q3')}</h3>
                <p className="text-gray-700 mt-2">{t('troubleshooting.a3')}</p>
              </div>
            </div>
          </div>

          {/* 返回按钮 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </div>

      {/* 结构化数据 */}
      <StructuredData 
        type="Article" 
        data={{
          headline: t('title'),
          description: t('description'),
          author: {
            '@type': 'Organization',
            name: 'Geographic Location Recognition Team'
          },
          publisher: {
            '@type': 'Organization',
            name: 'Geographic Location Recognition App'
          },
          datePublished: '2025-08-14',
          dateModified: '2025-08-14'
        }}
      />
    </div>
  )
}
