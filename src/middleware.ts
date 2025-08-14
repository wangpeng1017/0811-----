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
  // 匹配需要语言重定向的路径，排除API、静态文件
  matcher: [
    // 匹配根路径和所有需要处理的路径
    '/((?!api|_next|_vercel|.*\\..*|favicon.ico|robots.txt|sitemap.xml).*)',
    // 匹配根路径
    '/'
  ]
}
