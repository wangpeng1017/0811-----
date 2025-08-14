import { redirect } from 'next/navigation'
import { defaultLocale } from '@/i18n'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 根layout重定向到默认语言
  redirect(`/${defaultLocale}`)
}
