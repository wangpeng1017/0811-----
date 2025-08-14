import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  // 支持的语言列表
  locales,
  // 默认语言
  defaultLocale,
  // 语言检测策略
  localeDetection: true,
  // 路径名本地化
  pathnames: {
    '/': '/',
    '/help': {
      'zh-CN': '/help',
      'en-US': '/help',
      'ja-JP': '/help'
    },
    '/privacy': {
      'zh-CN': '/privacy',
      'en-US': '/privacy',
      'ja-JP': '/privacy'
    }
  }
})

export const config = {
  // 匹配所有路径，除了API路由、静态文件等
  matcher: [
    // 匹配所有路径
    '/((?!api|_next|_vercel|.*\\..*).*)',
    // 匹配根路径
    '/',
    // 匹配本地化路径
    '/(zh-CN|en-US|ja-JP)/:path*'
  ]
}
