# 快速入门指南

欢迎使用 Flag Selector 组件！本指南将帮助你在 5 分钟内开始使用这个组件。

## 安装

### 方式 1：直接下载

```bash
git clone https://github.com/yourusername/flag-selector.git
cd flag-selector
```

### 方式 2：通过 CDN

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flag-selector/src/flag-selector.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flag-selector/src/flag-selector-pc.css">
<script src="https://cdn.jsdelivr.net/npm/flag-selector/src/countries-data.js"></script>
<script src="https://cdn.jsdelivr.net/npm/flag-selector/src/flag-selector.js"></script>
```

## 最简示例

### 1. 创建 HTML 文件

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flag Selector Demo</title>
    <link rel="stylesheet" href="src/flag-selector.css">
    <link rel="stylesheet" href="src/flag-selector-pc.css">
</head>
<body>
    <!-- 国旗选择器容器 -->
    <div class="flag-placeholder" title="点击选择国家"></div>

    <!-- 引入组件 -->
    <script src="src/countries-data.js"></script>
    <script src="src/flag-selector.js"></script>

    <!-- 初始化组件 -->
    <script>
        initFlagSelector({
            containerSelector: '.flag-placeholder',
            onSelect: function(country) {
                console.log('选择的国家:', country);
            }
        });
    </script>
</body>
</html>
```

### 2. 运行示例

```bash
# 使用 Python 启动简单服务器
python3 -m http.server 8080

# 或使用 Node.js
npx http-server -p 8080

# 然后在浏览器中打开
open http://localhost:8080
```

## 常用场景

### 场景 1：用户设置国家

```javascript
initFlagSelector({
    containerSelector: '.flag-placeholder',
    onSelect: function(country) {
        // 保存用户选择
        localStorage.setItem('userCountry', country.code);
        
        // 显示提示
        alert(`已设置国家为：${country.flag} ${country.name}`);
        
        // 更新显示
        document.getElementById('country-display').textContent = 
            `${country.flag} ${country.name}`;
    }
});

// 加载时恢复用户选择
const savedCountry = localStorage.getItem('userCountry');
if (savedCountry) {
    setTimeout(() => {
        initFlagSelector().setSelectedCountry(savedCountry, true);
    }, 500);
}
```

### 场景 2：表单选择国家

```html
<form id="settings-form">
    <label>选择国家：</label>
    <div class="flag-placeholder" id="country-selector"></div>
    <input type="hidden" name="country_code" id="country-code">
</form>

<script>
    initFlagSelector({
        containerSelector: '#country-selector',
        onSelect: function(country) {
            document.getElementById('country-code').value = country.code;
        }
    });
</script>
```

### 场景 3：多语言支持

```javascript
// 定义翻译
const translations = {
    'zh-CN': {
        selectCountry: '选择国家',
        searchCountry: '搜索国家名称...',
        noMatchingCountry: '没有找到匹配的国家',
        clickToSelectCountry: '点击选择国家'
    },
    'en-US': {
        selectCountry: 'Select Country',
        searchCountry: 'Search country name...',
        noMatchingCountry: 'No matching country found',
        clickToSelectCountry: 'Click to select country'
    }
};

// 应用翻译
window.commonTranslations = translations['zh-CN'];

// 初始化组件
initFlagSelector({
    containerSelector: '.flag-placeholder',
    onSelect: function(country) {
        console.log('选择:', country);
    }
});
```

### 场景 4：自定义样式

```css
/* 自定义国旗大小 */
.flag-placeholder {
    width: 120px;
    height: 120px;
    border: 3px solid #667eea;
}

/* 自定义弹窗样式 */
.flag-modal-overlay {
    background: rgba(102, 126, 234, 0.8);
}

.flag-modal {
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* 自定义选中状态 */
.flag-item.selected {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}
```

## API 快速参考

### 初始化

```javascript
const flagDisplay = initFlagSelector({
    containerSelector: '.flag-placeholder',
    onSelect: function(country) { }
});
```

### 获取选择

```javascript
const country = flagDisplay.getSelectedCountry();
console.log(country.code, country.name);
```

### 设置选择

```javascript
// 静默设置（不触发回调）
flagDisplay.setSelectedCountry('CN', true);

// 非静默设置（触发回调）
flagDisplay.setSelectedCountry('US', false);
```

### 显示完整选择器

```javascript
const selector = await flagDisplay.loadFullSelector();
selector.show();
```

## 常见问题

### Q: 如何禁用 IP 检测？

A: 通过手动设置默认国家来跳过：

```javascript
flagDisplay.setSelectedCountry('US', true);
```

### Q: 如何获取所有国家列表？

A: 从全局变量获取：

```javascript
const allCountries = window.COUNTRIES_DATA;
console.log('总共有', allCountries.length, '个国家');
```

### Q: 如何自定义国家名称？

A: 在初始化前设置翻译：

```javascript
window.commonTranslations = {
    countries: {
        'CN': '中国（中华人民共和国）',
        'US': '美国（美利坚合众国）'
        // ...
    }
};
```

### Q: 如何清空用户选择？

A: 清除 localStorage 并刷新：

```javascript
localStorage.removeItem('flagSelector_manualSelection');
location.reload();
```

### Q: 如何监听选择变化？

A: 使用 onSelect 回调：

```javascript
flagDisplay.onSelect = function(country) {
    console.log('选择变化:', country);
};
```

## 下一步

- 查看 [完整 API 文档](api.md)
- 浏览 [更多示例](../examples/index.html)
- 了解 [贡献指南](../CONTRIBUTING.md)

## 获取帮助

如果你遇到问题：

1. 查看 [API 文档](api.md)
2. 搜索 [GitHub Issues](https://github.com/yourusername/flag-selector/issues)
3. 提交新的 Issue

---

祝你使用愉快！🚀
