// 这个根layout不应该被使用，因为所有路由都应该通过中间件重定向到 /[locale]
// 如果到达这里，说明中间件没有正确工作
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h1>重定向中...</h1>
          <p>如果您看到此页面，请刷新浏览器。</p>
        </div>
      </body>
    </html>
  )
}
