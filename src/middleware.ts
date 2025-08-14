import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  // 支持的语言列表
  locales,
  // 默认语言
  defaultLocale,
  // 语言检测策略
  localeDetection: true
})

export const config = {
  // 匹配需要语言重定向的路径，排除API、静态文件和已经包含locale的路径
  matcher: [
    // 匹配根路径和不包含locale的路径
    '/((?!api|_next|_vercel|.*\\..*|favicon.ico|robots.txt|sitemap.xml|zh-CN|en-US|ja-JP).*)',
    // 匹配根路径
    '/'
  ]
}
