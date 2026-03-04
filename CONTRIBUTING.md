# 贡献指南

感谢你对 Flag Selector 组件感兴趣！我们欢迎任何形式的贡献。

## 🤝 如何贡献

### 报告 Bug

如果你发现了 bug，请：

1. 先在 [Issues](https://github.com/yourusername/flag-selector/issues) 中搜索是否已有相同的问题
2. 如果没有，创建一个新的 Issue，包含以下信息：
   - Bug 的详细描述
   - 复现步骤
   - 预期行为和实际行为
   - 浏览器信息（名称、版本）
   - 代码示例或截图

### 提出新功能

如果你有新的功能建议，请：

1. 先在 [Issues](https://github.com/yourusername/flag-selector/issues) 中搜索是否已有相同的建议
2. 如果没有，创建一个新的 Issue，描述你的想法：
   - 功能描述
   - 使用场景
   - 可能的实现方案

### 提交代码

如果你想直接贡献代码，请遵循以下步骤：

#### 1. Fork 项目

点击 GitHub 页面右上角的 Fork 按钮，将项目 fork 到你的账号下。

#### 2. 克隆你的 Fork

```bash
git clone https://github.com/yourusername/flag-selector.git
cd flag-selector
```

#### 3. 创建特性分支

```bash
git checkout -b feature/你的功能名
```

或修复 bug：

```bash
git checkout -b fix/bug描述
```

#### 4. 进行修改

- 确保代码风格一致
- 添加必要的注释
- 更新相关文档
- 测试你的修改

#### 5. 提交更改

```bash
git add .
git commit -m "feat: 添加某功能" 或 "fix: 修复某bug"
```

**提交信息格式**：

我们遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式调整（不影响功能）
- `refactor:` 重构
- `perf:` 性能优化
- `test:` 测试相关
- `chore:` 构建/工具相关

示例：
```
feat: 添加多语言支持
fix: 修复移动端弹窗定位问题
docs: 更新 API 文档
```

#### 6. 推送到你的 Fork

```bash
git push origin feature/你的功能名
```

#### 7. 创建 Pull Request

1. 访问你的 Fork 页面
2. 点击 "New Pull Request"
3. 填写 PR 描述：
   - 简要描述你的改动
   - 关联相关的 Issue（如果有）
   - 说明测试情况
4. 等待代码审查

## 📝 代码规范

### JavaScript

- 使用 4 空格缩进
- 使用单引号
- 语句末尾加分号
- 变量命名使用驼峰式（camelCase）
- 常量命名使用大写下划线（UPPER_SNAKE_CASE）
- 类名使用帕斯卡命名（PascalCase）

### CSS

- 使用 4 空格缩进
- 类名使用短横线分隔（kebab-case）
- 选择器尽量简洁
- 避免使用 `!important`

### 文档

- 更新 README.md 或相关文档
- 为新功能添加使用示例
- 代码注释使用中文

## 🧪 测试

在提交代码前，请确保：

1. 在主流浏览器中测试：
   - Chrome
   - Firefox
   - Safari
   - Edge

2. 在移动端测试：
   - iOS Safari
   - Chrome Mobile

3. 测试不同场景：
   - 基础功能
   - 边界情况
   - 错误处理

## 📦 项目结构

```
flag-selector-component/
├── src/
│   ├── flag-selector.js       # 主组件文件
│   ├── flag-selector.css      # 样式文件
│   ├── flag-selector-pc.css   # PC 端样式
│   └── countries-data.js      # 完整国家数据
├── examples/
│   └── index.html             # 示例页面
├── docs/
│   └── api.md                 # API 文档
├── dist/                      # 编译输出目录
├── package.json               # npm 包配置
├── README.md                  # 项目说明
├── CONTRIBUTING.md            # 贡献指南（本文件）
└── LICENSE                    # 开源许可证
```

## 🎯 贡献方向

我们欢迎以下类型的贡献：

- 修复 bug
- 添加新功能
- 改进性能
- 优化用户体验
- 完善文档
- 改进测试
- 代码重构
- 翻译

## 💬 沟通

如果你有任何问题：

- 提交 [Issue](https://github.com/yourusername/flag-selector/issues)
- 加入讨论组（如果有）
- 联系维护者

## ⚖️ 行为准则

1. 尊重他人
2. 友善交流
3. 建设性反馈
4. 关注社区利益

## 📄 许可证

贡献的代码将采用与项目相同的 [MIT 许可证](LICENSE)。

## 🙏 致谢

感谢所有贡献者！

---

再次感谢你的贡献！🎉
