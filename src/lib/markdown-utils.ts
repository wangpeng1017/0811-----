/**
 * 将Markdown格式的文本转换为纯文本
 * 保持段落结构，但移除所有Markdown语法标记
 */
export function markdownToPlainText(markdown: string): string {
  if (!markdown) return ''

  let text = markdown

  // 移除代码块
  text = text.replace(/```[\s\S]*?```/g, '')
  text = text.replace(/`([^`]+)`/g, '$1')

  // 移除标题标记
  text = text.replace(/^#{1,6}\s+/gm, '')

  // 移除粗体和斜体
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1')
  text = text.replace(/\*([^*]+)\*/g, '$1')
  text = text.replace(/__([^_]+)__/g, '$1')
  text = text.replace(/_([^_]+)_/g, '$1')

  // 移除删除线
  text = text.replace(/~~([^~]+)~~/g, '$1')

  // 移除链接，保留链接文本
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
  text = text.replace(/\[([^\]]+)\]\[[^\]]*\]/g, '$1')

  // 移除图片
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')

  // 移除引用标记
  text = text.replace(/^>\s+/gm, '')

  // 移除列表标记
  text = text.replace(/^[\s]*[-*+]\s+/gm, '• ')
  text = text.replace(/^[\s]*\d+\.\s+/gm, '')

  // 移除水平分割线
  text = text.replace(/^[-*_]{3,}$/gm, '')

  // 移除表格标记
  text = text.replace(/\|/g, ' ')
  text = text.replace(/^[-\s|:]+$/gm, '')

  // 清理多余的空行，但保持段落结构
  text = text.replace(/\n{3,}/g, '\n\n')

  // 清理行首行尾空格
  text = text.replace(/^[ \t]+|[ \t]+$/gm, '')

  // 移除开头和结尾的空行
  text = text.trim()

  return text
}

/**
 * 格式化对话回答，确保良好的显示效果
 */
export function formatChatAnswer(answer: string): string {
  const plainText = markdownToPlainText(answer)
  
  // 确保段落之间有适当的间距
  return plainText.replace(/\n\n/g, '\n\n')
}
