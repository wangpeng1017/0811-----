// 根页面不应该被访问，因为中间件会处理重定向
export default function RootPage() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>重定向中...</h1>
      <p>如果您看到此页面，请刷新浏览器。</p>
    </div>
  )
}
