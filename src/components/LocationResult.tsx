'use client'

interface LocationData {
  continent?: string
  country?: string
  province?: string
  city?: string
  location?: string
  latitude?: number
  longitude?: number
  error?: string
}

interface LocationResultProps {
  result: LocationData
  onReset: () => void
}

export default function LocationResult({ result, onReset }: LocationResultProps) {
  if (result.error) {
    return (
      <div className="w-full bg-red-50 border border-red-200 rounded-xl p-6 shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">识别失败</h3>
          <p className="text-red-600 mb-6">{result.error}</p>
          <button
            onClick={onReset}
            className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
          >
            重新上传
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl shadow-xl p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">识别成功</h3>
        <p className="text-gray-600 text-sm mt-1">以下是图片的地理位置信息</p>
      </div>
      
      <div className="space-y-3">
        {result.continent && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium">大洲</span>
            <span className="text-gray-800">{result.continent}</span>
          </div>
        )}
        
        {result.country && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium">国家</span>
            <span className="text-gray-800">{result.country}</span>
          </div>
        )}
        
        {result.province && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium">省份/州</span>
            <span className="text-gray-800">{result.province}</span>
          </div>
        )}
        
        {result.city && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium">城市</span>
            <span className="text-gray-800">{result.city}</span>
          </div>
        )}
        
        {result.location && (
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 font-medium">地名</span>
            <span className="text-gray-800">{result.location}</span>
          </div>
        )}
        
        {result.latitude && result.longitude && (
          <>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600 font-medium">纬度</span>
              <span className="text-gray-800 font-mono">{result.latitude}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600 font-medium">经度</span>
              <span className="text-gray-800 font-mono">{result.longitude}</span>
            </div>
          </>
        )}
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={onReset}
          className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105"
        >
          重新上传
        </button>
      </div>
    </div>
  )
}
