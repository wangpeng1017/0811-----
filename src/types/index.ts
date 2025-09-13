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
  shareId?: string  // 分享ID
}

// API响应类型
export interface ApiResponse {
  success: boolean
  data?: LocationData
  error?: string
  message?: string
}

// Google Gemini API响应类型
export interface GeminiAPIResponse {
  // 根据Google Gemini API响应结构定义
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string
      }>
    }
  }>
  usageMetadata?: {
    promptTokenCount?: number
    candidatesTokenCount?: number
    totalTokenCount?: number
  }
  error?: {
    message: string
    code: number
  }
}

// Token使用量统计类型
export interface TokenUsage {
  totalUsed: number
  lastUpdated: string
  limit: number
}



// 分享内容类型
export interface ShareContent {
  id: string
  locationData: LocationData
  imageUrl: string
  introduction?: string
  timestamp: string
  expiresAt: string
}

// 对话消息类型
export interface ChatMessage {
  id: string
  question: string
  answer: string
  timestamp: string
}

// 对话历史类型
export interface ChatHistory {
  messages: ChatMessage[]
  locationData?: LocationData
}


