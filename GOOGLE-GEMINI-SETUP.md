# Google Gemini API 配置指南 🤖

本指南帮助您配置Google Gemini API，以便使用地理位置识别功能。

## 🚀 快速开始

### 步骤1: 获取Google Gemini API Key

1. **访问Google AI Studio**
   - 打开 [https://ai.google.dev/](https://ai.google.dev/)
   - 使用Google账户登录

2. **创建API Key**
   - 点击 "Get API Key" 按钮
   - 选择或创建Google Cloud项目
   - 生成新的API Key

### 步骤2: 启用API服务（如使用Google Cloud Console）

如果您使用Google Cloud Console：

1. **访问Google Cloud Console**
   - 打开 [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - 选择您的项目

2. **启用Generative Language API**
   - 进入 "APIs & Services" > "Library"
   - 搜索 "Generative Language API"
   - 点击启用

### 步骤3: 配置环境变量

1. **复制示例配置文件**
   ```bash
   cp .env.local.example .env.local
   ```

2. **编辑 `.env.local` 文件**
   ```env
   # Google Gemini API Key
   GEMINI_API_KEY=你的实际API_Key
   
   # 可选：管理员面板密码
   NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
   ```

### 步骤4: 启动应用

```bash
npm run dev
```

## 🔧 常见问题解决

### 401 身份验证失败

**症状：** `Google Gemini API身份验证失败 (401)`

**解决方案：**
1. 检查API Key是否正确配置
2. 确保API Key有效且未过期
3. 验证项目是否启用了Generative Language API
4. 重启开发服务器

### 403 访问被拒绝

**症状：** `Google Gemini API访问被拒绝 (403)`

**解决方案：**
1. 检查Google Cloud项目的计费设置
2. 确认API配额未超限
3. 验证API Key权限
4. 检查地理位置限制

### 429 调用频率超限

**症状：** `Google Gemini API调用频率超限 (429)`

**解决方案：**
1. 等待1-2分钟后重试
2. 检查API调用频率限制
3. 考虑升级配额

## 📋 API Key 安全提示

### ✅ 最佳实践
- 仅在 `.env.local` 文件中存储API Key
- 不要将API Key提交到版本控制
- 定期轮换API Key
- 使用最小权限原则

### ❌ 避免做法
- 在前端代码中暴露API Key
- 在公共代码库中提交API Key
- 在日志中打印API Key
- 使用过于宽泛的API权限

## 💰 成本控制

### 使用量监控
1. **Google Cloud Console**
   - 进入 "APIs & Services" > "Quotas"
   - 监控API调用次数和成本

2. **设置配额限制**
   - 设置每日/每月API调用限制
   - 启用配额警报

### 优化建议
- 缓存API响应结果
- 压缩图片以减少Token消耗
- 实现请求去重机制

## 🌍 地理位置支持

### 支持地区
Google Gemini API在以下地区可用：
- 美国
- 欧盟多数国家
- 日本
- 其他支持地区（请查看官方文档）

### 中国大陆使用注意事项
- 需要稳定的国际网络连接
- 可能需要配置代理服务器
- 建议使用香港或其他地区的服务器部署

## 📚 相关资源

### 官方文档
- [Google AI Studio](https://ai.google.dev/)
- [Generative Language API文档](https://ai.google.dev/docs)
- [Google Cloud Console](https://console.cloud.google.com/)

### API 参考
- [Gemini API Reference](https://ai.google.dev/api)
- [Authentication Guide](https://ai.google.dev/docs/authentication)
- [Pricing Information](https://ai.google.dev/pricing)

## 🆘 获取帮助

如果您遇到问题：

1. **检查官方状态**
   - 访问 [Google Cloud Status](https://status.cloud.google.com/)

2. **联系支持**
   - 📧 邮箱：wangpeng10170414@gmail.com
   - 🐛 [GitHub Issues](https://github.com/wangpeng1017/0811-----/issues)

3. **社区资源**
   - [Google AI Community](https://ai.google.dev/community)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/google-generative-ai)

---

© 2025 地理位置识别应用. 祝您使用愉快！