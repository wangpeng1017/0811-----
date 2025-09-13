# 智谱AI API Token配置指南

## 问题描述
当前应用出现401身份验证失败错误，这是因为智谱AI API Token未正确配置。

## 解决步骤

### 1. 创建环境变量文件
在项目根目录创建 `.env.local` 文件：

```bash
# 复制示例文件
cp .env.local.example .env.local
```

### 2. 获取智谱AI API Token
1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册账户并登录
3. 在控制台中创建API Key
4. 确保账户有足够余额（GLM-4.5V是付费模型）

### 3. 配置API Token
编辑 `.env.local` 文件，替换示例Token：

```env
# 智谱AI API Token
ZHIPU_API_TOKEN=你的真实API_Token

# 可选：管理员面板密码
NEXT_PUBLIC_ADMIN_PASSWORD=your_admin_password
```

### 4. 重启应用
配置完成后重启Next.js应用：

```bash
npm run dev
```

## 错误修复说明

已对 `src/app/api/analyze-image/route.ts` 进行以下改进：

1. **增强错误提示**：提供更详细的API Token配置错误信息
2. **Token验证**：在调用API前验证Token格式和有效性
3. **状态码处理**：针对不同HTTP状态码提供具体的错误说明
4. **调试日志**：增加更多调试信息帮助排查问题

## 常见问题

### Q: 仍然出现401错误？
- 检查API Token是否正确复制（不包含额外空格）
- 确认智谱AI账户状态和余额
- 验证API Key是否已激活

### Q: 403错误？
- 检查账户余额是否充足
- 确认API权限设置

### Q: 429错误？
- API调用频率过高，请稍后重试
- 考虑增加请求间隔

## 测试配置
配置完成后，可以通过上传图片测试API是否正常工作。
