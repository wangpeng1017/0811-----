// 测试应用API端点
async function testAppAPI() {
  try {
    console.log('🖼️ 测试应用的图片分析API...');
    
    // 创建一个更大的测试图片（100x100像素的PNG，包含一些颜色）
    const canvas = require('canvas');
    const canvasInstance = canvas.createCanvas(200, 200);
    const ctx = canvasInstance.getContext('2d');
    
    // 绘制一个简单的图案
    ctx.fillStyle = '#4A90E2';
    ctx.fillRect(0, 0, 200, 200);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '20px Arial';
    ctx.fillText('TEST', 80, 100);
    
    // 转换为buffer
    const buffer = canvasInstance.toBuffer('image/png');
    
    const formData = new FormData();
    const blob = new Blob([buffer], { type: 'image/png' });
    formData.append('image', blob, 'test-image.png');
    
    console.log('📤 发送请求到应用API...');
    
    const response = await fetch('http://localhost:3003/api/analyze-image', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ 应用API测试成功!');
      console.log('📍 识别结果:', JSON.stringify(data.data, null, 2));
      console.log('🧠 使用了GLM-4.5V thinking模式进行深度推理');
    } else {
      console.log('⚠️ 应用API返回错误:', data.error);
      if (data.stats) {
        console.log('📊 Token统计:', data.stats);
      }
    }
    
  } catch (error) {
    console.log('❌ 测试出错:', error.message);
  }
}

// 简化版测试（不需要canvas）
async function testAppAPISimple() {
  try {
    console.log('🖼️ 测试应用的图片分析API（简化版）...');
    
    // 创建一个稍大的测试图片（10x10像素的PNG）
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFYSURBVBiVY/z//z8DJQAggBhJVQcQQIykqgMIIEZS1QEEECO56gACiJFcdQABxEiuOoAAYiRXHUAAMZKrDiCAGMlVBxBAjOSqAwggRnLVAQQQI7nqAAKIkVx1AAHESKo6gABiJFUdQAAxkqoOIIAYSVUHEECMpKoDCCBGUtUBBBAjqeoAAoiRVHUAAcRIqjqAAGIkVR1AADGSqg4ggBhJVQcQQIykqgMIIEZy1QEEECO56gACiJFcdQABxEiuOoAAYiRXHUAAMZKrDiCAGMlVBxBAjOSqAwggRnLVAQQQI7nqAAKIkVx1AAHESKo6gABiJFUdQAAxkqoOIIAYSVUHEECMpKoDCCBGUtUBBBAjqeoAAoiRVHUAAcRIqjqAAGIkVR1AADGSqw4ggBjJVQcQQIzkqgMIIEZy1QEEECO56gACiJFcdQABxEiuOoAAYiRXHUAAMZKrDiCAGAEAP9YDAAAAAAAASUVORK5CYII=';
    const testImageBuffer = Buffer.from(testImageBase64, 'base64');
    
    const formData = new FormData();
    const blob = new Blob([testImageBuffer], { type: 'image/png' });
    formData.append('image', blob, 'test-simple.png');
    
    console.log('📤 发送请求到应用API...');
    
    const response = await fetch('http://localhost:3003/api/analyze-image', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ 应用API测试成功!');
      console.log('📍 识别结果:', JSON.stringify(data.data, null, 2));
      console.log('🧠 使用了GLM-4.5V thinking模式进行深度推理');
    } else {
      console.log('⚠️ 应用API返回错误:', data.error);
      if (data.stats) {
        console.log('📊 Token统计:', data.stats);
      }
    }
    
  } catch (error) {
    console.log('❌ 测试出错:', error.message);
  }
}

// 检查是否有fetch函数（Node.js 18+）
if (typeof fetch === 'undefined') {
  console.log('❌ 需要Node.js 18+版本才能运行此测试脚本');
  process.exit(1);
}

console.log('🚀 开始应用API测试...\n');

// 先测试简化版
testAppAPISimple().then(() => {
  console.log('\n✨ 测试完成！');
});
