import { notFound, redirect } from 'next/navigation'
import { locales, defaultLocale } from '@/i18n'

// 这个根layout用于处理语言重定向
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 这个layout不应该被渲染，因为所有路由都应该通过中间件重定向到 /[locale]
  // 如果到达这里，说明是直接访问根路径，重定向到默认语言
  redirect(`/${defaultLocale}`)
}
