import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// 支持的语言列表
export const locales = ['zh-CN', 'en-US', 'ja-JP'] as const
export type Locale = typeof locales[number]

// 默认语言
export const defaultLocale: Locale = 'zh-CN'

// 语言显示名称
export const localeNames: Record<Locale, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English',
  'ja-JP': '日本語'
}

// 语言对应的国旗emoji
export const localeFlags: Record<Locale, string> = {
  'zh-CN': '🇨🇳',
  'en-US': '🇺🇸',
  'ja-JP': '🇯🇵'
}

export default getRequestConfig(async ({ locale }) => {
  // 验证传入的locale是否支持
  if (!locales.includes(locale as Locale)) notFound()

  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
