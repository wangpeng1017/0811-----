import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 生成包含实际音频内容的测试WAV文件
    // 这将生成一个包含正弦波音调的音频文件，用户可以听到声音
    const createTestAudioWav = (durationSeconds: number = 30, sampleRate: number = 44100) => {
      const numSamples = durationSeconds * sampleRate
      const numChannels = 1
      const bytesPerSample = 2
      const blockAlign = numChannels * bytesPerSample
      const byteRate = sampleRate * blockAlign
      const dataSize = numSamples * blockAlign
      const fileSize = 36 + dataSize

      const buffer = Buffer.alloc(44 + dataSize)
      let offset = 0

      // WAV Header
      buffer.write('RIFF', offset); offset += 4
      buffer.writeUInt32LE(fileSize, offset); offset += 4
      buffer.write('WAVE', offset); offset += 4

      // Format chunk
      buffer.write('fmt ', offset); offset += 4
      buffer.writeUInt32LE(16, offset); offset += 4 // Chunk size
      buffer.writeUInt16LE(1, offset); offset += 2  // Audio format (PCM)
      buffer.writeUInt16LE(numChannels, offset); offset += 2
      buffer.writeUInt32LE(sampleRate, offset); offset += 4
      buffer.writeUInt32LE(byteRate, offset); offset += 4
      buffer.writeUInt16LE(blockAlign, offset); offset += 2
      buffer.writeUInt16LE(bytesPerSample * 8, offset); offset += 2

      // Data chunk
      buffer.write('data', offset); offset += 4
      buffer.writeUInt32LE(dataSize, offset); offset += 4

      // 生成实际的音频数据 - 多频率正弦波组合，模拟语音特征
      const dataOffset = offset
      for (let i = 0; i < numSamples; i++) {
        // 创建多个频率的正弦波组合，模拟更自然的声音
        const time = i / sampleRate

        // 基础频率 (类似人声基频)
        const freq1 = 220 // A3音符
        const freq2 = 440 // A4音符
        const freq3 = 660 // E5音符

        // 添加包络，避免突然开始和结束
        const fadeInTime = 0.1 // 0.1秒淡入
        const fadeOutTime = 0.1 // 0.1秒淡出
        let envelope = 1.0

        if (time < fadeInTime) {
          envelope = time / fadeInTime
        } else if (time > durationSeconds - fadeOutTime) {
          envelope = (durationSeconds - time) / fadeOutTime
        }

        // 组合多个正弦波，创建更丰富的音色
        const sample = envelope * 0.3 * (
          Math.sin(2 * Math.PI * freq1 * time) * 0.5 +
          Math.sin(2 * Math.PI * freq2 * time) * 0.3 +
          Math.sin(2 * Math.PI * freq3 * time) * 0.2
        )

        // 转换为16位整数
        const intSample = Math.round(sample * 32767)
        const clampedSample = Math.max(-32768, Math.min(32767, intSample))

        // 写入小端序16位数据
        buffer.writeInt16LE(clampedSample, dataOffset + i * 2)
      }

      return buffer
    }

    // 创建30秒的测试音频，包含实际可听到的声音
    const audioBuffer = createTestAudioWav(30)

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Length': audioBuffer.length.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*'
      }
    })

  } catch (error) {
    console.error('生成模拟音频失败:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
