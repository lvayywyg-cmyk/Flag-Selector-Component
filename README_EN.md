# Flag Selector Component

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/yourusername/flag-selector)
[![Size](https://img.shields.io/badge/gzip%20size-15%20KB-brightgreen.svg)](https://github.com/yourusername/flag-selector)

A high-performance flag selector component supporting both lightweight and full selection modes. Includes 250+ countries and regions data, featuring smart IP detection, local storage, search filtering, and rich functionality.

## 🎯 Project Background

This project was a byproduct during my work on [Sudoku100](https://www.sudoku100.com). While developing the international version of the Sudoku website, I needed users to select their country to provide better localized services. I looked at many flag selector components, but none met my requirements - either they were too large, lacked IP detection functionality, or didn't have a good design.

So I decided to develop a lightweight, high-performance, fully-featured flag selector myself. After continuous refinement, this component has been applied in multiple scenarios on Sudoku100, including user registration, language settings, regional recommendations, and other functional modules.

### 📍 Real Use Cases

- **User Registration Flow**: [www.sudoku100.com](https://www.sudoku100.com) - Let users select their country
- **Sudoku Battle Mode**: [www.sudoku100.com/battle](https://www.sudoku100.com/battle) - International battle matching
- **Samurai Sudoku Challenge**: [www.sudoku100.com/samurai-sudoku](https://www.sudoku100.com/samurai-sudoku) - Ultimate Sudoku challenge

If you enjoy Sudoku games, please visit [Sudoku100](https://www.sudoku100.com) to experience. I personally have recently become addicted to the extremely challenging [Samurai Sudoku](https://www.sudoku100.com/samurai-sudoku), composed of 5 9x9 Sudoku grids combined, it's the ultimate challenge for Sudoku enthusiasts!

## ✨ Features

- ✅ **Lightweight Mode**: Only load basic country data, load full list on demand
- ✅ **Smart Detection**: Automatically detect user's country based on IP
- ✅ **Priority System**: Manual selection > IP detection > Default country
- ✅ **Cross-platform Compatibility**: SVG images + Emoji dual display solution
- ✅ **Local Storage**: Automatically save user selection
- ✅ **Search Function**: Support Chinese and English country name search
- ✅ **Responsive Design**: Perfect adaptation for mobile and desktop
- ✅ **Performance Optimization**: Lazy loading, on-demand initialization
- ✅ **Offline Support**: Local cache for flag images
- ✅ **No Dependencies**: Pure native JavaScript implementation

## 📦 Installation

### Direct Download

```bash
git clone https://github.com/yourusername/flag-selector.git
```

### Via NPM (Coming Soon)

```bash
npm install flag-selector-component --save
```

### Via CDN

```html
<!-- Style files -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flag-selector/src/flag-selector.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flag-selector/src/flag-selector-pc.css">

<!-- Complete country data -->
<script src="https://cdn.jsdelivr.net/npm/flag-selector/src/countries-data.js"></script>

<!-- Main component file -->
<script src="https://cdn.jsdelivr.net/npm/flag-selector/src/flag-selector.js"></script>
```

## 🚀 Quick Start

### 1. Include Files

```html
<!-- Style files -->
<link rel="stylesheet" href="src/flag-selector.css">
<link rel="stylesheet" href="src/flag-selector-pc.css">

<!-- Complete country data (optional, load on demand) -->
<script src="src/countries-data.js"></script>

<!-- Main component file -->
<script src="src/flag-selector.js"></script>
```

### 2. HTML Structure

```html
<!-- Flag display position -->
<div class="flag-placeholder" title="Click to select country"></div>
```

### 3. Initialize Component

#### Lightweight Mode (Recommended)

```javascript
const flagDisplay = initFlagSelector({
    containerSelector: '.flag-placeholder',
    onSelect: function(selectedCountry) {
        console.log('Selected country:', selectedCountry);
        // Handle country selection logic
    }
});
```

#### Full Mode

```javascript
const flagSelector = new FlagSelector();
flagSelector.onSelect = function(selectedCountry) {
    console.log('Selected country:', selectedCountry);
};
flagSelector.show(); // Show selection modal
```

## 📖 API Documentation

### FlagDisplay (Lightweight Display)

#### Constructor

```javascript
const flagDisplay = new FlagDisplay();
```

#### Main Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `bindToContainer(selector, callback)` | selector: string, callback: function | Bind to specified container element |
| `setSelectedCountry(countryCode, silent)` | countryCode: string, silent: boolean | Set selected country |
| `getSelectedCountry()` | - | Get currently selected country |
| `loadFullSelector()` | - | Load full selector on demand |

### FlagSelector (Full Selector)

#### Constructor

```javascript
const flagSelector = new FlagSelector();
```

#### Main Methods

| Method | Parameters | Description |
|--------|-----------|-------------|
| `show()` | - | Show selection modal |
| `hide()` | - | Hide selection modal |
| `setSelectedCountry(countryCode, silent)` | countryCode: string, silent: boolean | Set selected country |
| `getSelectedCountry()` | - | Get currently selected country |
| `destroy()` | - | Destroy component |

#### Event Callback

```javascript
flagSelector.onSelect = function(country) {
    // country object includes:
    // - code: Country code (e.g., 'CN')
    // - name: Chinese name (e.g., '中国')
    // - nameEn: English name (e.g., 'China')
    // - flag: Emoji (e.g., '🇨🇳')
    // - continent: Continent (e.g., 'Asia')
};
```

### Global Initialization Function

```javascript
initFlagSelector(options)
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `containerSelector` | string | - | Container selector |
| `onSelect` | function | - | Selection callback function |

## 💡 Usage Examples

### Example 1: Basic Usage

```javascript
// Initialize component
const flagDisplay = initFlagSelector({
    containerSelector: '.flag-placeholder',
    onSelect: (country) => {
        console.log('Selected country:', country);
        alert(`You selected: ${country.flag} ${country.name}`);
    }
});

// Set default country
setTimeout(() => {
    flagDisplay.setSelectedCountry('CN', true);
}, 100);
```

### Example 2: Get User Selection

```javascript
// Get currently selected country
const selectedCountry = flagDisplay.getSelectedCountry();

if (selectedCountry) {
    console.log('Country code:', selectedCountry.code);
    console.log('Chinese name:', selectedCountry.name);
    console.log('English name:', selectedCountry.nameEn);
    console.log('Flag emoji:', selectedCountry.flag);
    console.log('Continent:', selectedCountry.continent);
}
```

### Example 3: Custom Event Handling

```javascript
const flagDisplay = initFlagSelector({
    containerSelector: '.flag-placeholder',
    onSelect: function(selectedCountry) {
        // Save to local storage
        localStorage.setItem('userCountry', selectedCountry.code);
        
        // Send to server
        fetch('/api/user/country', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                countryCode: selectedCountry.code,
                countryName: selectedCountry.name
            })
        });
        
        // Update UI
        document.getElementById('country-display').textContent = 
            `${selectedCountry.flag} ${selectedCountry.name}`;
    }
});
```

### Example 4: Search Countries

```javascript
// Search function is built into the component, just type in the modal
// Supports: Chinese name, English name, country code search
```

## 🎨 Customization

### CSS Variables

```css
::root {
    --flag-size: 144px;              /* Flag size in main display area */
    --flag-list-size: 56px;          /* Flag size in list */
    --flag-placeholder-size: 160px;   /* Placeholder size */
    --modal-z-index: 9999;           /* Modal z-index */
}
```

### Main Style Classes

- `.flag-placeholder` - Flag placeholder container
- `.flag-display` - Flag display area
- `.flag-img` - Flag image
- `.flag-emoji` - Flag emoji
- `.flag-modal` - Selection modal
- `.flag-list` - Country list
- `.flag-item` - Country list item

### Custom Style Examples

```css
/* Modify flag size */
.flag-placeholder {
    width: 120px;
    height: 120px;
}

/* Modify modal color */
.flag-modal-overlay {
    background: rgba(0, 0, 0, 0.7);
}

.flag-modal {
    border-radius: 20px;
}

/* Modify selected state */
.flag-item.selected {
    background: #your-color;
}
```

## 📊 Performance Optimization

### Advantages of Lightweight Mode

1. **Fast Initial Load**: Only load basic data for 10 common countries
2. **Small Memory Footprint**: Don't immediately load complete data for 250+ countries
3. **On-demand Loading**: Only load full selection interface when user clicks
4. **Smart Detection**: IP-based detection provides personalized default selection

### Data Loading Strategy

```javascript
// Basic data (load immediately) - 10 common countries
basicCountries = [
    { code: 'CN', name: '中国', nameEn: 'China', flag: '🇨🇳', continent: 'Asia' },
    { code: 'US', name: '美国', nameEn: 'United States', flag: '🇺🇸', continent: 'North America' },
    // ... 8 other common countries
];

// Complete data (load on demand) - 250+ countries
window.COUNTRIES_DATA // Load from countries-data.js
```

## 🌍 Country Data Format

```javascript
{
    code: 'CN',           // ISO 3166-1 alpha-2 country code
    name: '中国',         // Chinese name
    nameEn: 'China',      // English name
    flag: '🇨🇳',          // Unicode emoji
    continent: 'Asia'     // Continent
}
```

## 📱 Compatibility

- **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 12+, Edge 79+
- **Mobile**: iOS Safari 12+, Chrome Mobile 60+
- **Flag Display**: SVG images + Emoji dual solution ensures cross-platform display

## 🔧 Configuration Options

### Disable IP Detection

```javascript
// Skip IP detection by manually setting default country
flagDisplay.setSelectedCountry('US', true);
```

### Custom Search

```javascript
// Search function is built into the component, no additional configuration needed
// Supports searching: Chinese name, English name, country code
```

### Local Storage Keys

Component uses the following local storage keys:

- `flagSelector_manualSelection` - User manually selected country code
- `flagSelector_ipCache` - IP detection cache
- `flagSelector_svg_cache_${countryCode}` - Flag SVG cache

## 📄 File Structure

```
flag-selector-component/
├── src/
│   ├── flag-selector.js       # Main component file
│   ├── flag-selector.css      # Style file
│   ├── flag-selector-pc.css   # PC style file
│   └── countries-data.js      # Complete country data
├── examples/
│   └── index.html             # Example page
├── docs/
│   └── api.md                 # API documentation
├── dist/                      # Build output directory
├── package.json              # npm package configuration
├── README.md                 # Project documentation
└── LICENSE                   # Open source license
```

## 🤝 Contributing

Contributions are welcome! Please check [CONTRIBUTING.md](CONTRIBUTING.md) for details.

If you think this component would also be helpful for Sudoku100, feel free to submit a Pull Request or open an Issue on GitHub. I look forward to seeing this component being used by more projects!

### Development

```bash
# Clone project
git clone https://github.com/yourusername/flag-selector.git

# Enter project directory
cd flag-selector

# Install dependencies (if using build tools)
npm install

# Start development server
npm run dev
```

### Submit Pull Request

1. Fork this project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

## 📝 Changelog

### v2.0.0 (2024-02-02)

- ✅ Added lightweight mode
- ✅ Implemented on-demand loading
- ✅ Optimized performance and memory usage
- ✅ Improved cross-platform compatibility
- ✅ Added SVG local caching
- ✅ Enhanced PC adaptation

### v1.0.0 (2024-01-15)

- ✅ Basic flag selection functionality
- ✅ Search and filtering
- ✅ IP geolocation detection
- ✅ Responsive design

## 📄 License

This project is open source under [MIT License](LICENSE).

## 🙏 Acknowledgments

- Flag images from [Circle Flags](https://github.com/HatScripts/circle-flags) project
- Circle Flags is open source under MIT License

## 📮 Contact

- Issue Reporting: [GitHub Issues](https://github.com/yourusername/flag-selector/issues)
- Sudoku100 Official Site: [www.sudoku100.com](https://www.sudoku100.com)
- Sudoku Battle Mode: [www.sudoku100.com/battle](https://www.sudoku100.com/battle)
- Samurai Sudoku Challenge: [www.sudoku100.com/samurai-sudoku](https://www.sudoku100.com/samurai-sudoku)

## ⭐ Star History

If this project helps you, please give it a Star ⭐️

---

Made with ❤️ for [Sudoku100](https://www.sudoku100.com)
