import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '隐私政策 - 图片地理位置识别应用 | 用户隐私保护声明',
  description: '了解我们如何保护您的隐私和数据安全。详细说明图片处理、数据使用和隐私保护措施。',
  keywords: '隐私政策,数据保护,用户隐私,图片安全,数据安全',
  openGraph: {
    title: '隐私政策 - 图片地理位置识别应用',
    description: '了解我们如何保护您的隐私和数据安全',
    type: 'article',
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 面包屑导航 */}
        <nav className="mb-8" aria-label="面包屑导航">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                首页
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-800">隐私政策</span>
            </li>
          </ol>
        </nav>

        {/* 主标题 */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            隐私政策
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            我们重视您的隐私，致力于保护您的个人信息和数据安全
          </p>
          <p className="text-sm text-gray-500 mt-2">
            最后更新时间：2025年8月14日
          </p>
        </header>

        {/* 主要内容 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">信息收集</h2>
              <div className="space-y-4 text-gray-600">
                <h3 className="text-lg font-medium text-gray-800">我们收集的信息</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>您上传的图片文件（仅用于地理位置识别）</li>
                  <li>基本的使用统计信息（如访问时间、使用频率）</li>
                  <li>技术信息（如浏览器类型、设备信息）</li>
                </ul>
                
                <h3 className="text-lg font-medium text-gray-800 mt-6">我们不收集的信息</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>个人身份信息（姓名、邮箱、电话等）</li>
                  <li>位置信息（除图片中包含的地理信息外）</li>
                  <li>社交媒体账户信息</li>
                  <li>支付信息（本服务完全免费）</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">信息使用</h2>
              <div className="space-y-4 text-gray-600">
                <h3 className="text-lg font-medium text-gray-800">图片处理</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>上传的图片仅用于AI地理位置识别分析</li>
                  <li>图片在处理完成后立即删除，不会永久存储</li>
                  <li>图片不会被用于训练AI模型或其他用途</li>
                  <li>我们不会查看、分享或出售您的图片</li>
                </ul>
                
                <h3 className="text-lg font-medium text-gray-800 mt-6">数据分析</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>使用匿名统计数据改进服务质量</li>
                  <li>分析使用模式以优化用户体验</li>
                  <li>监控系统性能和稳定性</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">数据安全</h2>
              <div className="space-y-4 text-gray-600">
                <h3 className="text-lg font-medium text-gray-800">安全措施</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>使用HTTPS加密传输保护数据安全</li>
                  <li>采用安全的云服务提供商（Vercel）</li>
                  <li>定期进行安全审查和更新</li>
                  <li>限制数据访问权限，仅授权人员可访问</li>
                </ul>
                
                <h3 className="text-lg font-medium text-gray-800 mt-6">数据存储</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>图片文件临时存储在内存中，处理后立即清除</li>
                  <li>识别结果可通过分享功能临时保存</li>
                  <li>分享链接有效期有限，过期后自动删除</li>
                  <li>不会在本地设备存储个人数据</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">第三方服务</h2>
              <div className="space-y-4 text-gray-600">
                <h3 className="text-lg font-medium text-gray-800">AI服务提供商</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>我们使用智谱AI的GLM-4.5V模型进行图片分析</li>
                  <li>图片数据会发送到智谱AI进行处理</li>
                  <li>智谱AI遵循其自身的隐私政策和数据保护措施</li>
                  <li>处理完成后，智谱AI不会保留您的图片数据</li>
                </ul>
                
                <h3 className="text-lg font-medium text-gray-800 mt-6">托管服务</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>应用托管在Vercel平台</li>
                  <li>Vercel提供安全的云基础设施</li>
                  <li>遵循行业标准的安全和隐私保护措施</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">用户权利</h2>
              <div className="space-y-4 text-gray-600">
                <h3 className="text-lg font-medium text-gray-800">您的权利</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>随时停止使用我们的服务</li>
                  <li>要求删除已分享的识别结果</li>
                  <li>了解我们如何处理您的数据</li>
                  <li>对隐私政策提出问题或建议</li>
                </ul>
                
                <h3 className="text-lg font-medium text-gray-800 mt-6">数据控制</h3>
                <ul className="list-disc list-inside space-y-2">
                  <li>您完全控制上传的图片内容</li>
                  <li>可以选择是否使用分享功能</li>
                  <li>可以随时清除浏览器缓存和数据</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">政策更新</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  我们可能会不时更新此隐私政策。重大变更将在网站上显著位置公布，
                  并更新&ldquo;最后更新时间&rdquo;。继续使用我们的服务即表示您接受更新后的政策。
                </p>
                <p>
                  我们建议您定期查看此页面以了解最新的隐私保护措施。
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">联系我们</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  如果您对此隐私政策有任何问题或建议，请通过以下方式联系我们：
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>邮箱：wangpeng10170414@gmail.com</li>
                  <li>GitHub：<a href="https://github.com/wangpeng1017/0811-----" className="text-blue-600 hover:text-blue-800">项目仓库</a></li>
                </ul>
                <p>
                  我们将在收到您的询问后尽快回复。
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* 返回按钮 */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
