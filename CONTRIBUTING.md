# 贡献指南

感谢你对 Smart NAS Redirect 项目的关注！我们欢迎所有形式的贡献。

## 🤝 如何贡献

### 报告问题

如果你发现了 bug 或有功能建议：

1. 检查 [Issues](../../issues) 页面，确保问题未被报告
2. 创建新的 Issue，详细描述问题或建议
3. 提供复现步骤（如果是 bug）
4. 包含相关的环境信息

### 提交代码

1. **Fork 项目**
   ```bash
   git clone https://github.com/your-username/smart-nas-redirect.git
   cd smart-nas-redirect
   ```

2. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **进行开发**
   - 遵循现有的代码风格
   - 添加必要的测试
   - 更新相关文档

4. **提交更改**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
   - 详细描述你的更改
   - 引用相关的 Issue
   - 确保所有检查通过

## 📝 代码规范

### TypeScript/JavaScript

- 使用 TypeScript 进行类型安全
- 遵循 ESLint 配置
- 使用有意义的变量和函数名
- 添加适当的注释

### 提交信息格式

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

类型包括：
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式化
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

### 示例

```
feat(middleware): add support for custom DNS servers

- Add DNS_SERVER environment variable
- Support multiple DNS providers
- Update documentation

Closes #123
```

## 🧪 测试

在提交 PR 之前，请确保：

```bash
# 类型检查
npm run type-check

# 代码检查
npm run lint

# 构建测试
npm run build
```

## 📚 开发环境设置

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量**
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local 文件
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

## 🎯 优先级

我们特别欢迎以下类型的贡献：

- 🐛 Bug 修复
- 📚 文档改进
- 🚀 性能优化
- 🔒 安全增强
- 🌐 国际化支持
- 🧪 测试覆盖率提升

## 📞 联系方式

如果你有任何问题或需要帮助：

1. 创建 Issue 进行讨论
2. 查看现有的 Issues 和 Pull Requests
3. 阅读项目文档

## 📄 许可证

通过贡献代码，你同意你的贡献将在 MIT 许可证下发布。

---

再次感谢你的贡献！🎉