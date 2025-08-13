'use client'

import { useState, useRef, useEffect } from 'react'

export default function AudioTestPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handlePlay = async () => {
    if (audioRef.current) {
      try {
        setError(null)
        const audio = audioRef.current
        audio.volume = volume
        audio.muted = false
        
        console.log('尝试播放音频...')
        console.log('音频状态:', {
          readyState: audio.readyState,
          volume: audio.volume,
          muted: audio.muted,
          src: audio.src
        })
        
        if (isPlaying) {
          audio.pause()
        } else {
          await audio.play()
          console.log('音频播放成功')
        }
      } catch (err) {
        console.error('音频播放失败:', err)
        setError(`播放失败: ${err instanceof Error ? err.message : '未知错误'}`)
      }
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
      console.log('音频元数据加载完成，时长:', audioRef.current.duration)
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const testDirectAudio = () => {
    // 直接测试浏览器音频API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime) // A4音符
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
    
    oscillator.start()
    oscillator.stop(audioContext.currentTime + 1) // 播放1秒
    
    console.log('直接音频测试完成')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">音频播放测试页面</h1>
        
        {/* 音频控制 */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlay}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            >
              {isPlaying ? '暂停' : '播放'}
            </button>
            
            <button
              onClick={testDirectAudio}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
            >
              测试直接音频
            </button>
          </div>
          
          {/* 音量控制 */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">音量:</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm">{Math.round(volume * 100)}%</span>
          </div>
          
          {/* 进度条 */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{currentTime.toFixed(1)}s</span>
              <span>{duration.toFixed(1)}s</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* 错误信息 */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-600">
            {error}
          </div>
        )}
        
        {/* 音频信息 */}
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h3 className="font-medium mb-2">音频信息:</h3>
          <div className="text-sm space-y-1">
            <div>播放状态: {isPlaying ? '播放中' : '已停止'}</div>
            <div>当前时间: {currentTime.toFixed(1)}秒</div>
            <div>总时长: {duration.toFixed(1)}秒</div>
            <div>音量: {Math.round(volume * 100)}%</div>
            {audioRef.current && (
              <>
                <div>就绪状态: {audioRef.current.readyState}</div>
                <div>静音状态: {audioRef.current.muted ? '是' : '否'}</div>
                <div>音频源: {audioRef.current.src}</div>
              </>
            )}
          </div>
        </div>
        
        {/* 使用说明 */}
        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h3 className="font-medium mb-2">测试说明:</h3>
          <ul className="text-sm space-y-1 list-disc list-inside">
            <li>点击&quot;播放&quot;按钮测试WAV文件播放</li>
            <li>点击&quot;测试直接音频&quot;按钮测试浏览器音频API</li>
            <li>调整音量滑块测试音量控制</li>
            <li>检查浏览器控制台查看详细日志</li>
            <li>确保设备音量已开启且不是静音模式</li>
          </ul>
        </div>
        
        {/* 隐藏的音频元素 */}
        <audio
          ref={audioRef}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={(e) => {
            console.error('音频错误:', e)
            setError('音频加载或播放错误')
          }}
          preload="auto"
          src="/api/mock-audio"
        />
      </div>
    </div>
  )
}
