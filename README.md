# 图片地理位置识别工具

基于智谱AI GLM-4V-Flash模型的图片地理位置识别微信网页应用。用户可以上传图片，AI将自动识别并返回详细的地理位置信息。

## ✨ 功能特性

- 🤖 **AI智能识别**: 基于智谱AI GLM-4.5V旗舰视觉推理模型
- 🧠 **深度推理**: 启用thinking模式，提供更准确的地理位置识别
- 📱 **移动优先**: 专为微信浏览器优化的响应式设计
- 🔐 **安全可靠**: API Token安全存储，完善的错误处理
- 💰 **成本控制**: 智能Token使用量管理，防止超出预算
- ⚡ **快速响应**: 优化的图片处理和API调用
- 🎨 **极简设计**: 符合PRD要求的现代化UI界面

## 🚀 技术栈

- **前端**: Next.js 14 + React + TypeScript + Tailwind CSS
- **后端**: Vercel Serverless Functions
- **AI服务**: 智谱AI GLM-4.5V（旗舰视觉推理模型）
- **推理模式**: 启用thinking模式，提供更准确的分析结果
- **部署**: Vercel平台
- **开发工具**: Cursor AI辅助开发

## 📋 功能说明

### 支持的图片格式
- JPEG (.jpg, .jpeg)
- PNG (.png)
- HEIC (.heic)
- HEIF (.heif)

### 识别信息
- 🌍 大洲
- 🏳️ 国家
- 🏛️ 省份/州
- 🏙️ 城市
- 📍 具体地名
- 🧭 经纬度坐标

## 🛠️ 本地开发

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 环境配置
1. 复制环境变量模板：
```bash
cp .env.local.example .env.local
```

2. 在 `.env.local` 中配置智谱AI API Token：
```env
ZHIPU_API_TOKEN=your_zhipu_ai_token_here
```

### 获取智谱AI API Token
1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册并登录账户
3. 创建API Key
4. 将API Key配置到环境变量中

### 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🚀 部署到Vercel

### 一键部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/photo-location-app)

### 手动部署
1. Fork本仓库
2. 在Vercel中导入项目
3. 配置环境变量：
   - `ZHIPU_API_TOKEN`: 智谱AI API Token
4. 部署完成

### 环境变量配置
在Vercel项目设置中添加以下环境变量：
- `ZHIPU_API_TOKEN`: 智谱AI API Token（必需）
- `NEXT_PUBLIC_ADMIN_PASSWORD`: 管理员面板密码（可选）

## 📊 成本控制

### Token使用限制
- **总限制**: 2000万Token
- **每日限制**: 10万Token
- **自动重置**: 每日0点重置日使用量

### 监控功能
- 实时使用量统计
- 剩余额度显示
- 超限自动拒绝服务
- 管理员面板监控

## 🔧 API接口

### 图片分析接口
```
POST /api/analyze-image
Content-Type: multipart/form-data

参数:
- image: 图片文件

响应:
{
  "success": true,
  "data": {
    "continent": "亚洲",
    "country": "中国",
    "province": "北京市",
    "city": "北京市",
    "location": "天安门广场",
    "latitude": 39.908721,
    "longitude": 116.397472
  }
}
```

### 状态查询接口
```
GET /api/status

响应:
{
  "success": true,
  "data": {
    "service": "Photo Location Recognition API",
    "status": "operational",
    "usage": {
      "totalUsed": 1000,
      "totalLimit": 20000000,
      "dailyUsed": 50,
      "dailyLimit": 100000
    }
  }
}
```

## 📱 使用方法

1. **访问应用**: 通过微信扫描二维码或点击链接
2. **上传图片**: 点击"选择图片"按钮，从相册选择或现场拍摄
3. **等待识别**: AI自动分析图片中的地理位置信息
4. **查看结果**: 获得详细的地理位置信息和经纬度坐标
5. **重新上传**: 点击"重新上传"进行下一次识别

## 🔒 安全特性

- API Token环境变量存储
- 文件类型和大小验证
- 请求频率限制
- 错误信息脱敏
- CORS安全配置

## 📈 性能优化

- 图片自动压缩
- CDN加速
- Serverless架构
- 响应式缓存
- 错误重试机制

## 🐛 故障排除

### 常见问题
1. **上传失败**: 检查图片格式和大小限制
2. **识别失败**: 确保图片清晰，包含可识别的地理特征
3. **服务不可用**: 可能已达到使用限制，请稍后重试

### 错误代码
- `400`: 请求参数错误
- `429`: 使用量超限
- `500`: 服务器内部错误

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交GitHub Issue
- 发送邮件至: your-email@example.com

---

© 2025 图片地理位置识别工具. All rights reserved.
