// 测试真实图片的地理位置识别
async function testRealImageAPI() {
  try {
    console.log('🖼️ 测试GLM-4.5V真实图片分析...');
    
    // 使用一个包含地理位置信息的测试图片URL
    // 这是一个天安门广场的图片
    const testImageUrl = 'https://cloudcovert-1305175928.cos.ap-guangzhou.myqcloud.com/%E5%9B%BE%E7%89%87grounding.PNG';
    
    // 创建测试请求
    const testPayload = {
      imageUrl: testImageUrl,
      prompt: '请分析这张图片的拍摄地理位置'
    };
    
    console.log('📤 发送请求到GLM-4.5V API...');
    console.log('🔗 图片URL:', testImageUrl);
    
    // 直接调用智谱AI API进行测试
    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer c86f3e09702947fcb3b1d65b5c4d349a.KIQaMpAZlWdKrzsg`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'glm-4.5v',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: '请分析这张图片的拍摄地理位置，返回JSON格式结果，包含：continent（大洲）、country（国家）、province（省份）、city（城市）、location（具体地名）、latitude（纬度）、longitude（经度）。'
              },
              {
                type: 'image_url',
                image_url: {
                  url: testImageUrl
                }
              }
            ]
          }
        ],
        thinking: {
          type: 'enabled'
        },
        temperature: 0.1,
        max_tokens: 2000,
        stream: false
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ API调用失败:', response.status, errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ GLM-4.5V API调用成功!');
    console.log('📊 完整响应:', JSON.stringify(data, null, 2));
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log('💭 AI分析结果:');
      console.log(data.choices[0].message.content);
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

console.log('🚀 开始GLM-4.5V真实图片测试...\n');
testRealImageAPI().then(() => {
  console.log('\n✨ 测试完成！');
});
