# 智谱AI API 故障排除指南 🔧

本指南帮助您解决使用智谱AI GLM-4.5V模型时遇到的常见问题。

## 📋 快速诊断清单

在联系技术支持前，请按顺序检查以下项目：

- [ ] `.env.local` 文件是否存在
- [ ] `ZHIPU_API_TOKEN` 环境变量是否正确配置
- [ ] 智谱AI账户是否有足够余额
- [ ] API Token是否有效且未过期
- [ ] 网络连接是否正常

## 🚨 常见错误及解决方案

### 1. 401 身份验证失败

#### 🔍 错误描述
```
智谱AI API错误: 401 {"error":{"code":"1000","message":"身份验证失败。"}}
```

#### 🎯 可能原因
- API Token无效、已过期或格式错误
- 账户被暂停或禁用
- 环境变量配置错误

#### ✅ 解决步骤

1. **检查环境变量配置**
   ```bash
   # 检查.env.local文件是否存在
   ls -la .env.local
   
   # 查看Token配置（不显示实际值）
   grep "ZHIPU_API_TOKEN" .env.local
   ```

2. **验证Token格式**
   - 正确格式：`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.xxxxxxxxxxxxxx`
   - 长度通常为50-60个字符
   - 包含一个点(.)分隔符

3. **重新获取API Token**
   - 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
   - 登录您的账户
   - 进入"API管理" → "创建新Token"
   - 复制新Token到 `.env.local` 文件

4. **检查账户状态**
   - 登录智谱AI控制台
   - 查看账户是否正常
   - 确认没有违规记录

5. **重启应用**
   ```bash
   # 重启开发服务器
   npm run dev
   ```

### 2. 403 访问被拒绝

#### 🔍 错误描述
```
智谱AI API错误: 403 {"error":{"code":"1002","message":"余额不足。"}}
```

#### 🎯 可能原因
- 账户余额不足
- API权限不足
- GLM-4.5V模型访问权限问题

#### ✅ 解决步骤

1. **检查账户余额**
   - 登录 [智谱AI控制台](https://open.bigmodel.cn/usercenter/overview)
   - 查看账户余额
   - GLM-4.5V是付费模型，确保有足够余额

2. **充值账户**
   - 进入"账户充值"页面
   - 选择合适的充值金额
   - 完成支付流程

3. **检查模型权限**
   - 确认您的账户类型支持GLM-4.5V模型
   - 检查API Key的权限设置

### 3. 429 调用频率超限

#### 🔍 错误描述
```
智谱AI API错误: 429 {"error":{"code":"1004","message":"请求过于频繁。"}}
```

#### ✅ 解决步骤

1. **等待重试**
   - 等待1-2分钟后再次尝试
   - 避免短时间内大量请求

2. **检查调用频率**
   - 查看API文档中的频率限制
   - 优化请求策略

### 4. 500 服务器错误

#### 🔍 错误描述
```
智谱AI API错误: 500 {"error":{"message":"Internal server error"}}
```

#### ✅ 解决步骤

1. **稍后重试**
   - 这通常是智谱AI服务端的临时问题
   - 等待5-10分钟后重试

2. **检查服务状态**
   - 访问智谱AI官方网站查看服务状态
   - 关注官方公告

## 🔧 环境配置检查

### 检查`.env.local`文件

确保文件存在且格式正确：

```env
# 智谱AI API Token - GLM-4.5V模型
ZHIPU_API_TOKEN=your_actual_token_here

# 管理员面板密码（可选）
NEXT_PUBLIC_ADMIN_PASSWORD=your_password_here
```

### 常见配置错误

❌ **错误示例：**
```env
# Token包含额外字符或空格
ZHIPU_API_TOKEN= your_token_here 

# 使用示例Token
ZHIPU_API_TOKEN=your_zhipu_ai_token_here

# Token格式错误
ZHIPU_API_TOKEN=invalid-token-format
```

✅ **正确示例：**
```env
ZHIPU_API_TOKEN=c86f3e09702947fcb3b1d65b5c4d349a.KIQaMpAZlWdKrzsg
```

## 🌐 网络连接问题

### 防火墙和代理

如果您在企业网络环境中，可能需要：

1. **配置代理**（如果适用）
2. **检查防火墙设置**
3. **确保可以访问 `open.bigmodel.cn`**

### 测试网络连接

```bash
# 测试是否能访问智谱AI API
curl -I https://open.bigmodel.cn/api/paas/v4/chat/completions

# 应该返回HTTP状态码，而不是连接错误
```

## 📞 获取帮助

如果按照上述步骤仍无法解决问题，请：

1. **收集错误信息**
   - 完整的错误消息
   - 错误发生的时间
   - 使用的Token长度（不要提供实际Token）

2. **联系方式**
   - 📧 邮箱：wangpeng10170414@gmail.com
   - 🐛 [GitHub Issues](https://github.com/wangpeng1017/0811-----/issues)
   - 📋 智谱AI官方客服

3. **提供环境信息**
   ```bash
   # 系统信息
   node --version
   npm --version
   
   # 项目信息
   cat package.json | grep "version"
   ```

## 💡 预防措施

为避免API问题，建议：

1. **定期检查账户余额**
2. **监控API使用量**
3. **备份重要的API Token**
4. **关注智谱AI服务公告**
5. **设置合理的错误重试机制**

## 📚 相关文档

- [智谱AI官方文档](https://open.bigmodel.cn/dev/api#overview)
- [GLM-4.5V模型说明](https://open.bigmodel.cn/dev/api#glm-4v)
- [API调用示例](https://open.bigmodel.cn/dev/api#example)

---

© 2025 地理位置识别应用. 如有疑问请随时联系我们！