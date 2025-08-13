// 地理位置信息类型
export interface LocationData {
  continent?: string
  country?: string
  province?: string
  city?: string
  location?: string
  latitude?: number
  longitude?: number
  error?: string
  imageUrl?: string  // 添加图片URL支持
  introduction?: string  // 地点介绍文本
  audioUrl?: string  // 音频文件URL
  shareId?: string  // 分享ID
}

// API响应类型
export interface ApiResponse {
  success: boolean
  data?: LocationData
  error?: string
  message?: string
}

// 智谱AI API响应类型
export interface ZhipuAIResponse {
  // 根据实际API响应结构定义
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  error?: {
    message: string
    type: string
  }
}

// Token使用量统计类型
export interface TokenUsage {
  totalUsed: number
  lastUpdated: string
  limit: number
}

// 音频播放状态
export interface AudioState {
  isPlaying: boolean
  currentTime: number
  duration: number
  isLoading: boolean
  error?: string
}

// 分享内容类型
export interface ShareContent {
  id: string
  locationData: LocationData
  timestamp: string
  expiresAt: string
}

// 地点介绍段落类型
export interface IntroductionParagraph {
  id: number
  text: string
  startTime: number
  endTime: number
  isActive: boolean
}
