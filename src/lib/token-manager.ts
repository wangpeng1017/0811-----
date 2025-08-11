// Token使用量管理模块
// 在生产环境中，这应该使用真实的数据库（如Vercel KV）

interface TokenUsage {
  totalUsed: number
  lastUpdated: string
  dailyUsed: number
  lastResetDate: string
}

// 内存存储（仅用于开发测试）
let tokenUsage: TokenUsage = {
  totalUsed: 0,
  lastUpdated: new Date().toISOString(),
  dailyUsed: 0,
  lastResetDate: new Date().toISOString().split('T')[0]
}

const MAX_TOTAL_TOKENS = 20000000 // 2000万总限制
const MAX_DAILY_TOKENS = 100000   // 每日10万限制

/**
 * 检查是否可以使用指定数量的Token
 */
export function canUseTokens(estimatedTokens: number): boolean {
  resetDailyUsageIfNeeded()
  
  // 检查总量限制
  if (tokenUsage.totalUsed + estimatedTokens > MAX_TOTAL_TOKENS) {
    return false
  }
  
  // 检查每日限制
  if (tokenUsage.dailyUsed + estimatedTokens > MAX_DAILY_TOKENS) {
    return false
  }
  
  return true
}

/**
 * 记录Token使用量
 */
export function recordTokenUsage(usedTokens: number): void {
  resetDailyUsageIfNeeded()
  
  tokenUsage.totalUsed += usedTokens
  tokenUsage.dailyUsed += usedTokens
  tokenUsage.lastUpdated = new Date().toISOString()
}

/**
 * 获取当前使用量统计
 */
export function getUsageStats(): {
  totalUsed: number
  totalLimit: number
  dailyUsed: number
  dailyLimit: number
  remainingTotal: number
  remainingDaily: number
} {
  resetDailyUsageIfNeeded()
  
  return {
    totalUsed: tokenUsage.totalUsed,
    totalLimit: MAX_TOTAL_TOKENS,
    dailyUsed: tokenUsage.dailyUsed,
    dailyLimit: MAX_DAILY_TOKENS,
    remainingTotal: MAX_TOTAL_TOKENS - tokenUsage.totalUsed,
    remainingDaily: MAX_DAILY_TOKENS - tokenUsage.dailyUsed
  }
}

/**
 * 如果需要，重置每日使用量
 */
function resetDailyUsageIfNeeded(): void {
  const today = new Date().toISOString().split('T')[0]
  
  if (tokenUsage.lastResetDate !== today) {
    tokenUsage.dailyUsed = 0
    tokenUsage.lastResetDate = today
  }
}

/**
 * 估算图片分析所需的Token数量
 * GLM-4.5V模型的Token消耗相对较高，需要更准确的估算
 */
export function estimateTokensForImage(fileSize: number): number {
  // 基于文件大小估算Token使用量
  // GLM-4.5V模型消耗更多Token，特别是启用thinking模式时
  const baseCost = 1500 // GLM-4.5V基础分析成本（包含thinking模式）
  const sizeFactor = Math.ceil(fileSize / (1024 * 1024)) // 每MB额外成本
  const thinkingCost = 800 // thinking模式额外成本
  return baseCost + (sizeFactor * 300) + thinkingCost
}

// 生产环境中的数据库实现示例（使用Vercel KV）
/*
import { kv } from '@vercel/kv'

const TOKEN_USAGE_KEY = 'token_usage'

export async function canUseTokensDB(estimatedTokens: number): Promise<boolean> {
  try {
    const usage = await kv.get<TokenUsage>(TOKEN_USAGE_KEY) || {
      totalUsed: 0,
      lastUpdated: new Date().toISOString(),
      dailyUsed: 0,
      lastResetDate: new Date().toISOString().split('T')[0]
    }
    
    // 重置每日使用量
    const today = new Date().toISOString().split('T')[0]
    if (usage.lastResetDate !== today) {
      usage.dailyUsed = 0
      usage.lastResetDate = today
    }
    
    return (usage.totalUsed + estimatedTokens <= MAX_TOTAL_TOKENS) &&
           (usage.dailyUsed + estimatedTokens <= MAX_DAILY_TOKENS)
  } catch (error) {
    console.error('检查Token使用量失败:', error)
    return false
  }
}

export async function recordTokenUsageDB(usedTokens: number): Promise<void> {
  try {
    const usage = await kv.get<TokenUsage>(TOKEN_USAGE_KEY) || {
      totalUsed: 0,
      lastUpdated: new Date().toISOString(),
      dailyUsed: 0,
      lastResetDate: new Date().toISOString().split('T')[0]
    }
    
    // 重置每日使用量
    const today = new Date().toISOString().split('T')[0]
    if (usage.lastResetDate !== today) {
      usage.dailyUsed = 0
      usage.lastResetDate = today
    }
    
    usage.totalUsed += usedTokens
    usage.dailyUsed += usedTokens
    usage.lastUpdated = new Date().toISOString()
    
    await kv.set(TOKEN_USAGE_KEY, usage)
  } catch (error) {
    console.error('记录Token使用量失败:', error)
  }
}
*/
