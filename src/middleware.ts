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
  // 匹配所有路径，除了API路由、静态文件等
  matcher: [
    // 匹配所有路径，排除API、静态文件、图片等
    '/((?!api|_next|_vercel|.*\\..*|favicon.ico|robots.txt|sitemap.xml).*)',
    // 匹配根路径
    '/'
  ]
}
