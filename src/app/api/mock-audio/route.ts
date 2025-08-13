import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 生成一个简单的静音音频文件用于测试
    // 这是一个最小的有效WAV文件（1秒静音）
    const createSilentWav = (durationSeconds: number = 1, sampleRate: number = 44100) => {
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
      
      // Silent audio data (all zeros)
      buffer.fill(0, offset)

      return buffer
    }

    // 创建30秒的静音音频用于测试
    const audioBuffer = createSilentWav(30)

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
