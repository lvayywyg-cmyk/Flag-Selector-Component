# Flag Selector Component - 项目说明

## 📁 项目概览

这是一个完整、独立的国旗选择器组件，已经从原始项目中抽取出来，准备用于开源发布。

### 项目结构

```
flag-selector-component/
├── src/                          # 源代码目录
│   ├── flag-selector.js          # 主组件文件（1144行）
│   ├── flag-selector.css         # 移动端样式（374行）
│   ├── flag-selector-pc.css      # PC端样式（432行）
│   └── countries-data.js         # 完整国家数据（250+国家）
├── examples/                     # 示例代码
│   └── index.html                # 演示页面
├── docs/                         # 文档目录
│   ├── api.md                    # 完整 API 文档
│   └── getting-started.md        # 快速入门指南
├── dist/                         # 构建输出目录（自动生成）
├── .gitignore                    # Git 忽略文件配置
├── build.js                      # 简单的构建脚本
├── package.json                  # npm 包配置
├── README.md                     # 项目主文档
├── LICENSE                       # MIT 开源许可证
├── CONTRIBUTING.md               # 贡献指南
├── CHANGELOG.md                  # 更新日志
└── PROJECT.md                    # 本文件
```

## ✨ 核心特性

### 1. 轻量级模式
- 只加载 10 个常用国家的基础数据
- 按需加载完整的 250+ 国家列表
- 显著减少初始加载时间和内存占用

### 2. 智能检测
- 基于 IP 自动检测用户所在国家
- 支持 5 个备用 IP 服务
- 24 小时本地缓存，避免重复请求
- 后台异步验证 IP 变化

### 3. 性能优化
- SVG 国旗本地缓存（7天有效期）
- 懒加载和按需初始化
- 优化的渲染策略
- 支持 Emoji 回退方案

### 4. 跨平台兼容
- 完美适配移动端和桌面端
- SVG 图片 + Emoji 双重显示
- 响应式设计
- 现代浏览器全支持

### 5. 用户体验
- 智能国家排序（用户所在国家优先）
- 支持中英文搜索
- 本地存储用户选择
- 优雅的动画效果

## 🚀 快速开始

### 安装

```bash
# 克隆项目
git clone https://github.com/yourusername/flag-selector.git
cd flag-selector

# 查看示例
npm run dev
```

### 基础使用

```html
<link rel="stylesheet" href="src/flag-selector.css">
<link rel="stylesheet" href="src/flag-selector-pc.css">

<script src="src/countries-data.js"></script>
<script src="src/flag-selector.js"></script>

<div class="flag-placeholder"></div>

<script>
initFlagSelector({
    containerSelector: '.flag-placeholder',
    onSelect: function(country) {
        console.log('选择的国家:', country);
    }
});
</script>
```

## 📊 技术细节

### 组件架构

```javascript
// 1. FlagUtils - 工具函数
FlagUtils = {
    getFlagImageUrl(),
    getFlagSvgContent(),
    createCachedFlagImage(),
    getFlagDisplay(),
    checkIPCache(),
    saveIPCache(),
    getUserCountryFromCache()
}

// 2. FlagDisplay - 轻量级显示器
class FlagDisplay {
    constructor()
    async init()
    async loadFullSelector()
    bindToContainer()
    findCountry()
    async selectCountry()
    async updateDisplay()
    getSelectedCountry()
    setSelectedCountry()
    async getCurrentIP()
    async detectUserCountry()
    async backgroundIPVerification()
    // ... 更多方法
}

// 3. FlagSelector - 完整选择器
class FlagSelector {
    constructor()
    createModal()
    show()
    hide()
    filterCountries()
    selectCountry()
    setSelectedCountry()
    getSelectedCountry()
    destroy()
    // ... 更多方法
}
```

### 数据流程

```
1. 初始化
   ↓
2. 检查本地存储（手动选择）
   ↓ (有手动选择)
   直接使用
   ↓ (无手动选择)
3. 检查 IP 缓存
   ↓ (缓存有效)
   立即显示 + 后台验证
   ↓ (缓存无效)
4. IP 地理位置检测
   ↓
5. 显示检测到的国家或默认国家
   ↓
6. 用户点击国旗
   ↓
7. 按需加载完整选择器
   ↓
8. 用户选择国家
   ↓
9. 保存到本地存储
   ↓
10. 更新显示
```

## 🎯 使用场景

### 适合使用的场景

- ✅ 用户设置界面
- ✅ 注册/登录表单
- ✅ 地理位置选择
- ✅ 国际化配置
- ✅ 游竞技排行榜

### 不适合使用的场景

- ❌ 需要实时地理位置（GPS）
- ❌ 需要复杂的地图交互
- ❌ 需要自定义国家数据
- ❌ 需要无框架限制的深度定制

## 🔧 配置选项

### 初始化选项

```javascript
{
    containerSelector: string,  // 必填：容器选择器
    onSelect: function          // 可选：选择回调
}
```

### 全局配置

```javascript
// 翻译
window.commonTranslations = {
    selectCountry: '选择国家',
    searchCountry: '搜索国家...',
    noMatchingCountry: '没有找到匹配的国家',
    clickToSelectCountry: '点击选择国家',
    countries: { 'CN': '中国', ... }
}

// 国家数据
window.COUNTRIES_DATA = [...] // 默认已包含
```

## 📝 开发计划

### 已完成 ✅

- [x] 轻量级模式
- [x] IP 检测和缓存
- [x] SVG 本地缓存
- [x] 响应式设计
- [x] 完整文档
- [x] 示例代码

### 计划中 📋

- [ ] TypeScript 类型定义
- [ ] 更多主题支持
- [ ] 自定义国家数据
- [ ] 无障碍访问（ARIA）
- [ ] 单元测试
- [ ] CDN 发布
- [ ] npm 发布

## 🤝 贡献指南

### 如何贡献

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

### 代码规范

- JavaScript: 4 空格缩进，单引号，驼峰命名
- CSS: 4 空格缩进，kebab-case 类名
- 文档: 清晰的注释和示例

## 📄 许可证

本项目采用 MIT 许可证开源。

### 第三方库

- **Circle Flags**: 国旗图片
  - 许可证: MIT
  - 项目: https://github.com/HatScripts/circle-flags

## 📞 联系方式

- GitHub: https://github.com/yourusername/flag-selector
- Email: your-email@example.com
- Issues: https://github.com/yourusername/flag-selector/issues

## 🙏 致谢

感谢所有贡献者和使用者的支持！

---

**版本**: 2.0.0  
**最后更新**: 2024-02-02
