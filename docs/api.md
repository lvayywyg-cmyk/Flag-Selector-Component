# Flag Selector API 文档

## 目录

- [类和方法](#类和方法)
- [事件回调](#事件回调)
- [配置选项](#配置选项)
- [数据格式](#数据格式)
- [示例代码](#示例代码)

---

## 类和方法

### FlagDisplay（轻量级显示器）

轻量级显示器，用于显示当前选中的国家，支持按需加载完整选择器。

#### 构造函数

```javascript
const flagDisplay = new FlagDisplay();
```

**说明**：创建轻量级显示器实例，自动初始化并检测用户国家。

#### 方法列表

##### bindToContainer(selector, callback)

绑定选择器到指定的 DOM 容器。

**参数**：
- `selector` (string): CSS 选择器，用于选择要绑定的容器元素
- `callback` (function): 国家选择回调函数

**返回值**：无

**示例**：

```javascript
flagDisplay.bindToContainer('.flag-placeholder', function(country) {
    console.log('选择的国家:', country);
});
```

---

##### setSelectedCountry(countryCode, silent)

设置当前选中的国家。

**参数**：
- `countryCode` (string): ISO 3166-1 alpha-2 国家代码，如 'CN', 'US'
- `silent` (boolean): 是否静默模式（不触发回调），默认 true

**返回值**：无

**示例**：

```javascript
// 静默设置（不触发回调）
flagDisplay.setSelectedCountry('CN', true);

// 非静默设置（触发回调）
flagDisplay.setSelectedCountry('US', false);
```

---

##### getSelectedCountry()

获取当前选中的国家对象。

**参数**：无

**返回值**：
- `Object | null`: 国家对象，如果没有选择则返回 null

**返回对象结构**：
```javascript
{
    code: 'CN',           // 国家代码
    name: '中国',         // 中文名称
    nameEn: 'China',      // 英文名称
    flag: '🇨🇳',          // 表情符号
    continent: 'Asia'     // 所属大洲
}
```

**示例**：

```javascript
const country = flagDisplay.getSelectedCountry();
if (country) {
    console.log('当前选择:', country.name);
}
```

---

##### loadFullSelector()

按需加载完整国家选择器。

**参数**：无

**返回值**：`Promise<FlagSelector>` - 返回完整选择器实例

**说明**：此方法会在首次调用时创建完整选择器，后续调用返回缓存的实例。

**示例**：

```javascript
const fullSelector = await flagDisplay.loadFullSelector();
fullSelector.onSelect = function(country) {
    console.log('从完整选择器选择:', country);
};
fullSelector.show();
```

---

##### getUserDefaultCountry()

获取用户默认国家。

**参数**：无

**返回值**：`Object | null`: 默认国家对象

**优先级**：
1. 用户手动选择（从 localStorage）
2. IP 检测到的国家
3. 硬编码默认值（美国）

**示例**：

```javascript
const defaultCountry = flagDisplay.getUserDefaultCountry();
if (defaultCountry) {
    console.log('默认国家:', defaultCountry.name);
}
```

---

##### findCountry(countryCode)

在国家列表中查找指定国家。

**参数**：
- `countryCode` (string): 国家代码

**返回值**：`Object | null`: 国家对象，如果未找到则返回 null

**示例**：

```javascript
const china = flagDisplay.findCountry('CN');
if (china) {
    console.log('找到中国:', china.name);
}
```

---

### FlagSelector（完整选择器）

完整的国家选择器，包含弹窗界面和搜索功能。

#### 构造函数

```javascript
const flagSelector = new FlagSelector();
```

**说明**：创建完整选择器实例，自动创建 DOM 结构并绑定事件。

#### 方法列表

##### show()

显示国家选择弹窗。

**参数**：无

**返回值**：无

**示例**：

```javascript
flagSelector.show();
```

---

##### hide()

隐藏国家选择弹窗。

**参数**：无

**返回值**：无

**示例**：

```javascript
flagSelector.hide();
```

---

##### setSelectedCountry(countryCode, silent)

设置当前选中的国家。

**参数**：
- `countryCode` (string): 国家代码
- `silent` (boolean): 是否静默模式，默认 true

**返回值**：无

**示例**：

```javascript
flagSelector.setSelectedCountry('CN', false);
```

---

##### getSelectedCountry()

获取当前选中的国家对象。

**参数**：无

**返回值**：`Object | null`: 国家对象

**示例**：

```javascript
const country = flagSelector.getSelectedCountry();
console.log('选择的国家:', country?.name);
```

---

##### filterCountries(searchTerm)

过滤国家列表。

**参数**：
- `searchTerm` (string): 搜索关键词

**返回值**：无

**说明**：支持搜索中文名称、英文名称、国家代码。

**示例**：

```javascript
flagSelector.filterCountries('中国');
flagSelector.filterCountries('China');
flagSelector.filterCountries('CN');
```

---

##### destroy()

销毁组件实例，清理 DOM 和事件监听。

**参数**：无

**返回值**：无

**示例**：

```javascript
flagSelector.destroy();
```

---

### 全局函数

#### initFlagSelector(options)

初始化国旗选择器的便捷函数。

**参数**：
- `options` (object): 配置选项
  - `containerSelector` (string): 容器选择器
  - `onSelect` (function): 选择回调函数

**返回值**：`FlagDisplay` - 返回轻量级显示器实例

**示例**：

```javascript
const flagDisplay = initFlagSelector({
    containerSelector: '.flag-placeholder',
    onSelect: function(selectedCountry) {
        console.log('选择的国家:', selectedCountry);
    }
});
```

---

## 事件回调

### onSelect

国家选择事件回调。

**回调参数**：
```javascript
function(country) {
    // country 对象
}
```

**country 对象结构**：
```javascript
{
    code: 'CN',           // 国家代码
    name: '中国',         // 中文名称
    nameEn: 'China',      // 英文名称
    flag: '🇨🇳',          // 表情符号
    continent: 'Asia'     // 所属大洲
}
```

**示例**：

```javascript
flagDisplay.onSelect = function(country) {
    console.log('选择了:', country.name);
    // 保存选择
    localStorage.setItem('selectedCountry', country.code);
};
```

---

## 配置选项

### initFlagSelector 选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `containerSelector` | string | 必填 | 容器 CSS 选择器 |
| `onSelect` | function | 可选 | 选择回调函数 |

**示例**：

```javascript
initFlagSelector({
    containerSelector: '.flag-placeholder',
    onSelect: function(country) {
        console.log('选择:', country);
    }
});
```

---

### 本地存储键名

组件使用以下 localStorage 键名：

| 键名 | 描述 | 有效期 |
|------|------|--------|
| `flagSelector_manualSelection` | 用户手动选择的国家代码 | 永久 |
| `flagSelector_ipCache` | IP 检测缓存 | 24 小时 |
| `flagSelector_svg_cache_${countryCode}` | 国旗 SVG 缓存 | 7 天 |

**示例**：

```javascript
// 手动清除缓存
localStorage.removeItem('flagSelector_manualSelection');
localStorage.removeItem('flagSelector_ipCache');
// 清除所有 SVG 缓存
Object.keys(localStorage)
    .filter(key => key.startsWith('flagSelector_svg_cache_'))
    .forEach(key => localStorage.removeItem(key));
```

---

## 数据格式

### 国家对象

```javascript
{
    code: 'CN',           // ISO 3166-1 alpha-2 国家代码
    name: '中国',         // 中文名称
    nameEn: 'China',      // 英文名称
    flag: '🇨🇳',          // Unicode 表情符号
    continent: 'Asia'     // 所属大洲
}
```

### 完整国家数据

```javascript
window.COUNTRIES_DATA = [
    {
        code: 'US',
        name: '美国',
        nameEn: 'United States',
        flag: '🇺🇸',
        continent: 'North America'
    },
    // ... 更多国家
];
```

### IP 缓存数据

```javascript
{
    ip: '192.168.1.1',
    detectedCountry: 'CN',
    timestamp: 1706899200000
}
```

### SVG 缓存数据

```javascript
{
    svgContent: '<svg>...</svg>',
    timestamp: 1706899200000
}
```

---

## 示例代码

### 基础使用

```javascript
// 初始化组件
const flagDisplay = initFlagSelector({
    containerSelector: '.flag-placeholder',
    onSelect: function(selectedCountry) {
        console.log('选择的国家:', selectedCountry);
        alert(`你选择了：${selectedCountry.flag} ${selectedCountry.name}`);
    }
});

// 设置默认国家
setTimeout(() => {
    flagDisplay.setSelectedCountry('CN', true);
}, 100);
```

### 获取选择结果

```javascript
// 获取当前选择
const selectedCountry = flagDisplay.getSelectedCountry();

if (selectedCountry) {
    console.log('国家代码:', selectedCountry.code);
    console.log('中文名称:', selectedCountry.name);
    console.log('英文名称:', selectedCountry.nameEn);
    console.log('国旗表情:', selectedCountry.flag);
    console.log('所属大洲:', selectedCountry.continent);
}
```

### 与服务器交互

```javascript
flagDisplay.onSelect = function(country) {
    // 保存到本地
    localStorage.setItem('userCountry', country.code);
    
    // 发送到服务器
    fetch('/api/user/country', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            countryCode: country.code,
            countryName: country.name,
            countryNameEn: country.nameEn
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('保存成功:', data);
    })
    .catch(error => {
        console.error('保存失败:', error);
    });
};
```

### 重置选择

```javascript
// 清除用户选择并刷新页面
function resetSelection() {
    localStorage.removeItem('flagSelector_manualSelection');
    location.reload();
}
```

### 动态创建选择器

```javascript
// 在运行时动态创建选择器
function createCountrySelector(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // 创建占位符
    const placeholder = document.createElement('div');
    placeholder.className = 'flag-placeholder';
    placeholder.title = '点击选择国家';
    container.appendChild(placeholder);
    
    // 初始化选择器
    initFlagSelector({
        containerSelector: `#${containerId} .flag-placeholder`,
        onSelect: function(country) {
            console.log('动态选择器选择:', country);
        }
    });
}

// 使用
createCountrySelector('my-container');
```

### 监听选择变化

```javascript
// 使用 MutationObserver 监听 DOM 变化
const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            const flagContainer = document.querySelector('.flag-placeholder.has-flag');
            if (flagContainer) {
                console.log('国旗已显示');
                const country = flagDisplay.getSelectedCountry();
                console.log('当前选择:', country?.name);
            }
        }
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
```

### 错误处理

```javascript
try {
    const flagDisplay = initFlagSelector({
        containerSelector: '.flag-placeholder',
        onSelect: function(country) {
            console.log('选择:', country);
        }
    });
} catch (error) {
    console.error('初始化失败:', error);
    // 显示错误提示
    alert('国旗选择器初始化失败，请刷新页面重试');
}
```

---

## 最佳实践

1. **使用轻量级模式**：在大多数情况下，轻量级模式已经足够，按需加载完整选择器
2. **处理异步操作**：某些操作（如 IP 检测）是异步的，注意使用 `await` 或 `Promise`
3. **错误处理**：始终添加错误处理，特别是网络请求和 localStorage 操作
4. **性能优化**：避免频繁调用 `setSelectedCountry`，尽量批量处理
5. **用户体验**：为用户提供清晰的反馈和加载状态

---

如有其他问题或建议，欢迎提出 Issue 或 Pull Request。
