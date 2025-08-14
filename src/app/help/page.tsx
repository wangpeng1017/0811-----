import type { Metadata } from 'next'
import Link from 'next/link'
import StructuredData from '@/components/StructuredData'

export const metadata: Metadata = {
  title: '使用帮助 - 图片地理位置识别应用 | 如何使用AI识别照片拍摄地点',
  description: '详细的使用指南，教您如何使用AI智能识别图片地理位置。包含上传步骤、功能介绍、常见问题解答和使用技巧。',
  keywords: '图片地理位置识别使用方法,AI图片定位教程,照片位置查询指南,地理位置识别帮助',
  openGraph: {
    title: '使用帮助 - 图片地理位置识别应用',
    description: '详细的使用指南，教您如何使用AI智能识别图片地理位置',
    type: 'article',
  },
}

export default function HelpPage() {
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
              <span className="text-gray-800">使用帮助</span>
            </li>
          </ol>
        </nav>

        {/* 主标题 */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            图片地理位置识别使用指南
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            学习如何使用我们的AI智能工具快速识别图片中的地理位置信息
          </p>
        </header>

        {/* 主要内容 */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* 快速开始 */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
              快速开始
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-1">✓</div>
                <div>
                  <h3 className="font-medium text-gray-800">上传图片</h3>
                  <p className="text-gray-600 text-sm">点击上传区域或拖拽图片文件，支持JPEG、PNG等格式</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-1">✓</div>
                <div>
                  <h3 className="font-medium text-gray-800">AI分析</h3>
                  <p className="text-gray-600 text-sm">等待GLM-4.5V模型自动分析图片中的地理特征</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mt-1">✓</div>
                <div>
                  <h3 className="font-medium text-gray-800">查看结果</h3>
                  <p className="text-gray-600 text-sm">获取详细的地理位置信息，包括坐标和地名</p>
                </div>
              </div>
            </div>
          </section>

          {/* 功能特色 */}
          <section className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="bg-purple-100 text-purple-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">★</span>
              功能特色
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-800 mb-1">🤖 AI智能识别</h3>
                <p className="text-gray-600 text-sm">基于GLM-4.5V旗舰视觉推理模型，高精度识别地理位置</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">📝 景点介绍</h3>
                <p className="text-gray-600 text-sm">自动生成详细的景点介绍，包含历史文化和旅游信息</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">💬 智能对话</h3>
                <p className="text-gray-600 text-sm">基于识别结果进行智能问答，获取更多相关信息</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">🔗 一键分享</h3>
                <p className="text-gray-600 text-sm">生成分享链接和二维码，轻松分享识别结果</p>
              </div>
            </div>
          </section>
        </div>

        {/* 详细说明 */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">详细使用说明</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-4">支持的图片格式</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">📷</div>
                  <div className="font-medium text-gray-800">JPEG</div>
                  <div className="text-sm text-gray-600">.jpg, .jpeg</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🖼️</div>
                  <div className="font-medium text-gray-800">PNG</div>
                  <div className="text-sm text-gray-600">.png</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">📱</div>
                  <div className="font-medium text-gray-800">HEIC</div>
                  <div className="text-sm text-gray-600">.heic</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">📸</div>
                  <div className="font-medium text-gray-800">HEIF</div>
                  <div className="text-sm text-gray-600">.heif</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-medium text-gray-800 mb-4">识别信息类型</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🌍</span>
                    <div>
                      <div className="font-medium text-gray-800">大洲信息</div>
                      <div className="text-sm text-gray-600">如：亚洲、欧洲、北美洲等</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🏳️</span>
                    <div>
                      <div className="font-medium text-gray-800">国家信息</div>
                      <div className="text-sm text-gray-600">如：中国、美国、法国等</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🏛️</span>
                    <div>
                      <div className="font-medium text-gray-800">省份/州</div>
                      <div className="text-sm text-gray-600">如：北京市、广东省等</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🏙️</span>
                    <div>
                      <div className="font-medium text-gray-800">城市信息</div>
                      <div className="text-sm text-gray-600">如：北京市、上海市等</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <div className="font-medium text-gray-800">具体地名</div>
                      <div className="text-sm text-gray-600">如：天安门广场、埃菲尔铁塔等</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🧭</span>
                    <div>
                      <div className="font-medium text-gray-800">GPS坐标</div>
                      <div className="text-sm text-gray-600">精确的经纬度坐标信息</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 使用技巧 */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">使用技巧</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">提高识别准确率</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>选择包含明显地理特征的图片</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>确保图片清晰度良好</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>包含建筑物、标识或自然景观</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>避免过度模糊或暗淡的图片</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">最佳实践</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>先尝试示例图片了解功能</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>使用对话功能获取更多信息</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>生成景点介绍了解详细信息</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>使用分享功能保存结果</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 返回按钮 */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页开始使用
          </Link>
        </div>
      </div>

      {/* 结构化数据 */}
      <StructuredData 
        type="Article" 
        data={{
          title: '图片地理位置识别使用指南',
          description: '详细的使用指南，教您如何使用AI智能识别图片地理位置',
          datePublished: '2025-08-14T00:00:00Z',
          dateModified: '2025-08-14T00:00:00Z',
        }}
      />
    </div>
  )
}
