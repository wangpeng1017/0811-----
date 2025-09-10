// 测试真实图片的地理位置识别
async function testRealImageAPI() {
  try {
    console.log('🖼️ 测试Gemini 2.5 Flash真实图片分析...');
    
    // 检查环境变量中的API密钥
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log('❌ 缺少 GEMINI_API_KEY 环境变量');
      console.log('请设置: $env:GEMINI_API_KEY="你的API密钥"');
      return;
    }
    
    // 使用一个包含地理位置信息的测试图片URL
    // 这是一个天安门广场的图片
    const testImageUrl = 'https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG';
    
    console.log('📤 发送请求到Gemini API...');
    console.log('🔗 图片URL:', testImageUrl);
    
    // 调用Google Gemini API进行测试
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: '请分析这张图片的拍摄地理位置，返回JSON格式结果，包含：continent（大洲）、country（国家）、province（省份）、city（城市）、location（具体地名）、latitude（纬度）、longitude（经度）。'
              },
              {
                fileData: {
                  mimeType: 'image/png',
                  fileUri: testImageUrl
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 2000
        }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API调用失败:', response.status, errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Gemini API调用成功!');
    console.log('📊 完整响应:', JSON.stringify(data, null, 2));
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      console.log('💭 AI分析结果:');
      const content = data.candidates[0].content.parts
        .map(part => part.text)
        .filter(Boolean)
        .join('\n');
      console.log(content);
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

console.log('🚀 开始Gemini 2.5 Flash真实图片测试...\n');
testRealImageAPI().then(() => {
  console.log('\n✨ 测试完成！');
});
