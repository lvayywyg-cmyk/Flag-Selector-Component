/**
 * 轻量级国旗显示器 - 仅用于显示当前选中的国家
 * 
 * 国旗图片使用 Circle Flags 项目 (https://github.com/HatScripts/circle-flags)
 * Circle Flags 基于 MIT 许可证开源
 * 
 * MIT License
 * Copyright (c) 2020 HatScripts
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function(global) {
    'use strict';

    // ========================================================================
    // 共享工具函数
    // ========================================================================

    const FlagUtils = {
        getFlagImageUrl(countryCode) {
            return 'https://hatscripts.github.io/circle-flags/flags/' + countryCode.toLowerCase() + '.svg';
        },

        async getFlagSvgContent(countryCode) {
            try {
                const cacheKey = `flagSelector_svg_cache_${countryCode.toLowerCase()}`;
                const cacheData = localStorage.getItem(cacheKey);
                
                if (cacheData) {
                    const parsedData = JSON.parse(cacheData);
                    const cacheAge = Date.now() - parsedData.timestamp;
                    const maxCacheAge = 7 * 24 * 60 * 60 * 1000;
                    
                    if (cacheAge <= maxCacheAge) {
                        console.log('使用缓存的SVG内容:', countryCode);
                        return parsedData.svgContent;
                    } else {
                        console.log('SVG缓存已过期，重新获取:', countryCode);
                        localStorage.removeItem(cacheKey);
                    }
                }
                
                console.log('从网络获取SVG内容:', countryCode);
                const svgUrl = this.getFlagImageUrl(countryCode);
                const response = await fetch(svgUrl);
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const svgContent = await response.text();
                
                const cacheDataToSave = {
                    svgContent: svgContent,
                    timestamp: Date.now()
                };
                
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(cacheDataToSave));
                    console.log('SVG内容已缓存:', countryCode);
                } catch (storageError) {
                    console.warn('保存SVG缓存失败:', storageError);
                }
                
                return svgContent;
                
            } catch (error) {
                console.warn('获取国旗SVG内容失败:', error);
                return null;
            }
        },

        async createCachedFlagImage(countryCode, countryName) {
            const svgContent = await this.getFlagSvgContent(countryCode);
            
            if (svgContent) {
                const svgDataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgContent);
                return '<img src="' + svgDataUri + '" alt="' + countryName + '" class="flag-img" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'inline\';">';
            }
            
            return null;
        },

        async getFlagDisplay(country) {
            try {
                const cachedImage = await this.createCachedFlagImage(country.code, country.name);
                
                if (cachedImage) {
                    return cachedImage + '<span class="flag-emoji" style="display:none;">' + country.flag + '</span>';
                }
                
                const flagImageUrl = this.getFlagImageUrl(country.code);
                return '<img src="' + flagImageUrl + '" alt="' + country.name + '" class="flag-img" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'inline\';">' +
                       '<span class="flag-emoji" style="display:none;">' + country.flag + '</span>';
                
            } catch (error) {
                console.warn('获取国旗显示内容失败:', error);
                return '<span class="flag-emoji">' + country.flag + '</span>';
            }
        },

        getFlagDisplaySync(country) {
            const flagImageUrl = this.getFlagImageUrl(country.code);
            return '<img src="' + flagImageUrl + '" alt="' + country.name + '" class="flag-img" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'inline\';">' +
                   '<span class="flag-emoji" style="display:none;">' + country.flag + '</span>';
        },

        checkIPCache() {
            try {
                const savedIPData = localStorage.getItem('flagSelector_ipCache');
                
                if (!savedIPData) {
                    console.log('没有IP缓存数据');
                    return { hasValidCache: false };
                }
                
                const ipCache = JSON.parse(savedIPData);
                const cacheAge = Date.now() - ipCache.timestamp;
                const maxCacheAge = 24 * 60 * 60 * 1000;
                
                if (cacheAge > maxCacheAge) {
                    console.log('IP缓存已过期');
                    localStorage.removeItem('flagSelector_ipCache');
                    return { hasValidCache: false };
                }
                
                console.log('IP缓存有效，上次检测国家:', ipCache.detectedCountry);
                
                return { 
                    hasValidCache: true, 
                    cachedIP: ipCache.ip,
                    cachedCountry: ipCache.detectedCountry 
                };
                
            } catch (error) {
                console.warn('检查IP缓存失败:', error);
                return { hasValidCache: false };
            }
        },

        saveIPCache(ip, countryCode) {
            try {
                const cacheData = {
                    ip: ip,
                    detectedCountry: countryCode,
                    timestamp: Date.now()
                };
                localStorage.setItem('flagSelector_ipCache', JSON.stringify(cacheData));
                console.log('IP缓存已保存:', cacheData);
            } catch (error) {
                console.warn('保存IP缓存失败:', error);
            }
        },

        getUserCountryFromCache() {
            try {
                const cacheResult = this.checkIPCache();
                
                if (cacheResult.hasValidCache && cacheResult.cachedCountry) {
                    console.log('从缓存获取用户国家:', cacheResult.cachedCountry);
                    return cacheResult.cachedCountry;
                }
                
                console.log('未检测到用户国家，使用默认排序');
                return null;
            } catch (error) {
                console.warn('获取用户国家缓存失败:', error);
                return null;
            }
        }
    };

    // ========================================================================
    // FlagDisplay 类 - 轻量级国旗显示器
    // ========================================================================

    class FlagDisplay {
        constructor() {
            this.selectedCountry = null;
            this.userCountryCode = null;
            this.manualSelection = null;
            this.fullSelector = null;
            this.ipDetectionCompleted = false;
            this.lastDetectedIP = null;
            this.ipCacheValid = false;
            
            this.basicCountries = [
                { code: 'US', name: '美国', nameEn: 'United States', flag: '🇺🇸', continent: 'North America' },
                { code: 'CN', name: '中国', nameEn: 'China', flag: '🇨🇳', continent: 'Asia' },
                { code: 'GB', name: '英国', nameEn: 'United Kingdom', flag: '🇬🇧', continent: 'Europe' },
                { code: 'JP', name: '日本', nameEn: 'Japan', flag: '🇯🇵', continent: 'Asia' },
                { code: 'DE', name: '德国', nameEn: 'Germany', flag: '🇩🇪', continent: 'Europe' },
                { code: 'FR', name: '法国', nameEn: 'France', flag: '🇫🇷', continent: 'Europe' },
                { code: 'KR', name: '韩国', nameEn: 'South Korea', flag: '🇰🇷', continent: 'Asia' },
                { code: 'CA', name: '加拿大', nameEn: 'Canada', flag: '🇨🇦', continent: 'North America' },
                { code: 'AU', name: '澳大利亚', nameEn: 'Australia', flag: '🇦🇺', continent: 'Oceania' },
                { code: 'RU', name: '俄罗斯', nameEn: 'Russia', flag: '🇷🇺', continent: 'Europe' }
            ];
            
            this.init();
        }
        
        async init() {
            const manualSelection = localStorage.getItem('flagSelector_manualSelection');
            
            if (manualSelection) {
                console.log('检测到用户手动选择，直接使用:', manualSelection);
                this.manualSelection = manualSelection;
                this.ipDetectionCompleted = true;
                
                const selectedCountry = this.findCountry(manualSelection);
                if (selectedCountry) {
                    this.selectCountry(selectedCountry, true);
                    return;
                }
            }
            
            console.log('没有用户手动选择，开始IP检测流程');
            const cacheResult = await this.checkIPCache();
            
            if (cacheResult.hasValidCache) {
                console.log('使用有效的IP缓存，立即显示国旗');
                this.ipDetectionCompleted = true;
                this.ipCacheValid = true;
                
                const defaultCountry = this.getUserDefaultCountry();
                if (defaultCountry) {
                    this.selectCountry(defaultCountry, true);
                }
                
                this.backgroundIPVerification();
                
            } else {
                console.log('IP缓存无效，进行新的检测');
                await this.detectUserCountry();
                this.ipDetectionCompleted = true;
                
                const defaultCountry = this.getUserDefaultCountry();
                if (defaultCountry) {
                    this.selectCountry(defaultCountry, true);
                }
            }
        }
        
        async loadFullSelector() {
            if (this.fullSelector) {
                return this.fullSelector;
            }
            
            console.log('按需加载完整国家选择器...');
            
            if (!global.COUNTRIES_DATA || global.COUNTRIES_DATA.length === 0) {
                console.warn('完整国家数据未加载，使用基础数据');
            }
            
            this.fullSelector = new FlagSelector();
            
            if (this.selectedCountry) {
                this.fullSelector.setSelectedCountry(this.selectedCountry.code, true);
            }
            
            return this.fullSelector;
        }
        
        bindToContainer(containerSelector, callback) {
            const containers = document.querySelectorAll(containerSelector);
            containers.forEach(container => {
                // 为"查看全部国家"按钮单独绑定事件
                container.addEventListener('click', async (e) => {
                    const viewAllBtn = e.target.closest('.view-all-countries-btn');
                    
                    // 如果点击的是"查看全部国家"按钮，直接打开选择器
                    if (viewAllBtn) {
                        e.stopPropagation();
                        e.preventDefault();
                        const fullSelector = await this.loadFullSelector();
                        fullSelector.show();
                        
                        if (callback) {
                            fullSelector.onSelect = (country) => {
                                this.selectCountry(country, false);
                                callback(country);
                            };
                        }
                        return;
                    }
                    
                    // 如果没有选中国旗，点击容器也可以打开选择器
                    if (!container.classList.contains('has-flag')) {
                        const fullSelector = await this.loadFullSelector();
                        fullSelector.show();
                        
                        if (callback) {
                            fullSelector.onSelect = (country) => {
                                this.selectCountry(country, false);
                                callback(country);
                            };
                        }
                    }
                }, true);
            });
        }
        
        findCountry(countryCode) {
            let country = this.basicCountries.find(c => c.code === countryCode);
            
            if (!country && global.COUNTRIES_DATA) {
                country = global.COUNTRIES_DATA.find(c => c.code === countryCode);
            }
            
            return country;
        }
        
        async selectCountry(country, silent = false) {
            this.selectedCountry = country;
            await this.updateDisplay();
            
            if (!silent) {
                this.manualSelection = country.code;
                localStorage.setItem('flagSelector_manualSelection', country.code);
            }
        }
        
        async updateDisplay() {
            const flagContainers = document.querySelectorAll('.flag-placeholder');
            
            const clickToSelect = global.commonTranslations?.clickToSelectCountry || '点击选择国家';
            const viewAllText = global.commonTranslations?.viewAllCountries || '查看全部国家';
            
            const editIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>';
            
            for (const container of flagContainers) {
                if (this.selectedCountry) {
                    const flagDisplay = await this.getFlagDisplay(this.selectedCountry);
                    const translatedName = global.commonTranslations?.[this.selectedCountry.code] || this.selectedCountry.name;
                    container.innerHTML = '<div class="flag-display">' + flagDisplay + '</div><button class="view-all-countries-btn" title="' + viewAllText + '">' + editIcon + '</button>';
                    container.classList.add('has-flag');
                    container.title = translatedName;
                } else {
                    container.innerHTML = '';
                    container.classList.remove('has-flag');
                    container.title = clickToSelect;
                }
            }
        }
        
        getSelectedCountry() {
            return this.selectedCountry;
        }
        
        setSelectedCountry(countryCode, silent = true) {
            const country = this.findCountry(countryCode);
            if (country) {
                this.selectCountry(country, silent);
            }
        }
        
        async checkIPCache() {
            const cacheResult = FlagUtils.checkIPCache();
            
            if (cacheResult.hasValidCache) {
                this.userCountryCode = cacheResult.cachedCountry;
                this.lastDetectedIP = cacheResult.cachedIP;
            }
            
            return cacheResult;
        }
        
        async getCurrentIP() {
            const ipServices = [
                'https://api.ipify.org?format=text',
                'https://api64.ipify.org?format=text',
                'https://icanhazip.com/',
                'https://checkip.amazonaws.com/',
                'https://ifconfig.me/ip'
            ];
            
            for (const service of ipServices) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 3000);
                    
                    const response = await fetch(service, {
                        method: 'GET',
                        signal: controller.signal
                    });
                    
                    clearTimeout(timeoutId);
                    
                    if (response.ok) {
                        const ip = await response.text();
                        const trimmedIp = ip.trim();
                        if (trimmedIp && this.isValidIP(trimmedIp)) {
                            console.log('成功获取IP地址:', trimmedIp, '来自:', service);
                            return trimmedIp;
                        }
                    }
                } catch (error) {
                    console.warn('IP服务 ' + service + ' 请求失败:', error.message);
                    continue;
                }
            }
            
            console.warn('所有IP获取服务都失败了');
            return null;
        }
        
        isValidIP(ip) {
            const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
            return ipRegex.test(ip);
        }
        
        async detectUserCountry() {
            try {
                const currentIP = await this.getCurrentIP();
                
                const services = [
                    'https://ipapi.co/country_code/',
                    'https://api.country.is/',
                    'https://ipinfo.io/country'
                ];
                
                for (const service of services) {
                    try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 5000);
                        
                        const response = await fetch(service, {
                            method: 'GET',
                            signal: controller.signal
                        });
                        
                        clearTimeout(timeoutId);
                        
                        if (response.ok) {
                            let countryCode;
                            
                            if (service.includes('country.is')) {
                                const data = await response.json();
                                countryCode = data.country;
                            } else {
                                countryCode = await response.text();
                            }
                            
                            countryCode = countryCode.trim().toUpperCase();
                            
                            if (this.findCountry(countryCode)) {
                                this.userCountryCode = countryCode;
                                this.lastDetectedIP = currentIP;
                                
                                this.saveIPCache(currentIP, countryCode);
                                
                                console.log('检测到用户所在国家:', countryCode);
                                return countryCode;
                            }
                        }
                    } catch (error) {
                        console.warn('IP服务 ' + service + ' 请求失败:', error);
                        continue;
                    }
                }
            } catch (error) {
                console.warn('IP地理位置检测失败:', error);
            }
            
            console.log('IP地理位置检测失败，将使用默认国家');
            return null;
        }
        
        async backgroundIPVerification() {
            const savedSelection = localStorage.getItem('flagSelector_manualSelection');
            if (savedSelection) {
                console.log('用户已手动选择国家，跳过后台IP验证');
                return;
            }
            
            try {
                console.log('开始后台IP验证...');
                
                setTimeout(async () => {
                    try {
                        const currentSelection = localStorage.getItem('flagSelector_manualSelection');
                        if (currentSelection) {
                            console.log('检测到用户在后台验证期间进行了手动选择，停止IP验证');
                            return;
                        }
                        
                        const currentIP = await this.getCurrentIP();
                        console.log('当前IP:', currentIP, '缓存IP:', this.lastDetectedIP);
                        
                        if (currentIP && currentIP !== this.lastDetectedIP) {
                            console.log('检测到IP变化，从', this.lastDetectedIP, '到', currentIP);
                            
                            const oldCountryCode = this.userCountryCode;
                            const newCountryCode = await this.detectUserCountry();
                            
                            console.log('国家检测结果 - 旧:', oldCountryCode, '新:', newCountryCode);
                            
                            const finalSelection = localStorage.getItem('flagSelector_manualSelection');
                            
                            if (newCountryCode && newCountryCode !== oldCountryCode && !finalSelection) {
                                console.log('IP变化导致国家变更，从', oldCountryCode, '到', newCountryCode);
                                
                                const newCountry = this.findCountry(newCountryCode);
                                console.log('找到新国家信息:', newCountry);
                                
                                if (newCountry) {
                                    this.userCountryCode = newCountryCode;
                                    this.selectedCountry = newCountry;
                                    
                                    console.log('开始更新前台显示...');
                                    this.updateDisplay();
                                    
                                    console.log('已自动更新国家为:', newCountry.name);
                                } else {
                                    console.warn('未找到新国家信息:', newCountryCode);
                                }
                            } else {
                                console.log('IP变化但国家未变更或用户有手动选择，保持当前显示');
                                console.log('- 新国家代码:', newCountryCode);
                                console.log('- 旧国家代码:', oldCountryCode);
                                console.log('- 用户手动选择:', finalSelection);
                            }
                        } else {
                            console.log('IP未变化，无需更新');
                        }
                    } catch (error) {
                        console.warn('后台IP验证失败:', error);
                    }
                }, 1000);
                
            } catch (error) {
                console.warn('启动后台IP验证失败:', error);
            }
        }
        
        saveIPCache(ip, countryCode) {
            FlagUtils.saveIPCache(ip, countryCode);
        }
        
        getUserDefaultCountry() {
            const savedSelection = localStorage.getItem('flagSelector_manualSelection');
            if (savedSelection) {
                const savedCountry = this.findCountry(savedSelection);
                if (savedCountry) {
                    console.log('使用用户手动选择的国家:', savedSelection);
                    this.manualSelection = savedSelection;
                    return savedCountry;
                }
            }
            
            if (this.userCountryCode) {
                const userCountry = this.findCountry(this.userCountryCode);
                if (userCountry) {
                    console.log('使用IP检测到的国家:', this.userCountryCode);
                    return userCountry;
                }
            }
            
            if (this.ipDetectionCompleted) {
                console.log('IP检测完成，使用默认国家:', this.basicCountries[0]?.code);
                return this.basicCountries[0];
            }
            
            console.log('IP检测未完成，暂不设置默认国家');
            return null;
        }
        
        async getFlagDisplay(country) {
            return await FlagUtils.getFlagDisplay(country);
        }
        
        getFlagDisplaySync(country) {
            return FlagUtils.getFlagDisplaySync(country);
        }
        
        getFlagImageUrl(countryCode) {
            return FlagUtils.getFlagImageUrl(countryCode);
        }
    }

    // ========================================================================
    // FlagSelector 类 - 完整国旗选择器
    // ========================================================================

    class FlagSelector {
        constructor() {
            this.countries = global.COUNTRIES_DATA || [];
            
            if (!this.countries || this.countries.length === 0) {
                console.error('完整国家数据未加载，请确保 countries-data.js 文件已正确引入');
                this.countries = new FlagDisplay().basicCountries;
            }
            
            this.userCountryCode = this.getUserCountryFromCache();
            
            if (this.userCountryCode) {
                this.countries = this.sortCountriesWithUserCountryFirst(this.countries, this.userCountryCode);
                console.log('已检测到用户国家:', this.userCountryCode, '，已将其排在第一位');
            }
            
            this.selectedCountry = null;
            this.filteredCountries = [...this.countries];
            this.onSelect = null;
            this.modal = null;
            this.isVisible = false;
            this.listRendered = false;
            this.backButtonHandlerId = null;
            
            this.createModal();
            this.bindEvents();
        }
        
        getUserCountryFromCache() {
            const countryCode = FlagUtils.getUserCountryFromCache();
            
            if (!countryCode && global.flagDisplay && global.flagDisplay.userCountryCode) {
                console.log('从FlagDisplay实例获取用户国家:', global.flagDisplay.userCountryCode);
                return global.flagDisplay.userCountryCode;
            }
            
            return countryCode;
        }
        
        sortCountriesWithUserCountryFirst(countries, userCountryCode) {
            if (!userCountryCode || !countries || countries.length === 0) {
                return countries;
            }
            
            const userCountryIndex = countries.findIndex(country => country.code === userCountryCode);
            
            if (userCountryIndex === -1) {
                console.log('用户国家', userCountryCode, '不在国家列表中，使用默认排序');
                return countries;
            }
            
            const userCountry = countries[userCountryIndex];
            const otherCountries = countries.filter((_, index) => index !== userCountryIndex);
            
            return [userCountry, ...otherCountries];
        }
        
        createModal() {
            const selectCountry = global.commonTranslations?.selectCountry || '选择国家';
            const searchCountry = global.commonTranslations?.searchCountry || '搜索国家名称...';
            
            const modalHTML = 
                '<div class="flag-modal-overlay" id="flagModalOverlay">' +
                    '<div class="flag-modal">' +
                        '<div class="flag-modal-header">' +
                            '<h3 class="flag-modal-title">' + selectCountry + '</h3>' +
                            '<button class="flag-modal-close" id="flagModalClose">×</button>' +
                        '</div>' +
                        '<div class="flag-search-container">' +
                            '<input type="text" class="flag-search-input" id="flagSearchInput" placeholder="' + searchCountry + '" autocomplete="off">' +
                        '</div>' +
                        '<div class="flag-list-container">' +
                            '<ul class="flag-list" id="flagList">' +
                            '</ul>' +
                        '</div>' +
                    '</div>' +
                '</div>';
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.modal = document.getElementById('flagModalOverlay');
            this.isPCMode = this.detectPCMode();
            this.setupModalPosition();
            this.renderCountryList();
        }
        
        detectPCMode() {
            const styleSheets = Array.from(document.styleSheets);
            const hasPCStyles = styleSheets.some(sheet => 
                sheet.href && sheet.href.includes('flag-selector-pc.css')
            );
            
            const isWideScreen = window.innerWidth > 768;
            
            return hasPCStyles || isWideScreen;
        }
        
        setupModalPosition() {
            // 弹窗已经添加到 body，不需要移动位置
            this.modalPositioningSetup = true;
        }
        
        setupPCOutsideClick() {
            this.pcOutsideClickHandler = (e) => {
                const modalOverlay = this.modal;
                const flagContainers = document.querySelectorAll('.flag-placeholder');
                let clickedInsideModal = modalOverlay.contains(e.target);
                let clickedOnTrigger = false;
                
                flagContainers.forEach(container => {
                    if (container.contains(e.target)) {
                        clickedOnTrigger = true;
                    }
                });
                
                if (!clickedInsideModal && !clickedOnTrigger) {
                    this.hide();
                }
            };
            
            setTimeout(() => {
                document.addEventListener('click', this.pcOutsideClickHandler);
            }, 100);
        }
        
        removePCOutsideClick() {
            if (this.pcOutsideClickHandler) {
                document.removeEventListener('click', this.pcOutsideClickHandler);
                this.pcOutsideClickHandler = null;
            }
        }
        
        renderCountryList() {
            const listElement = document.getElementById('flagList');
            if (!listElement) return;
            
            const noMatchingCountry = global.commonTranslations?.noMatchingCountry || '没有找到匹配的国家';
            
            if (this.filteredCountries.length === 0) {
                listElement.innerHTML = 
                    '<li class="flag-empty-state">' +
                        '<div class="flag-empty-icon">🔍</div>' +
                        '<p class="flag-empty-text">' + noMatchingCountry + '</p>' +
                    '</li>';
                return;
            }
            
            if (this.listRendered && this.filteredCountries.length === this.countries.length) {
                this.updateSelectedState();
                return;
            }
            
            const itemsHTML = this.filteredCountries.map(country => {
                const translatedName = global.commonTranslations?.countries?.[country.code] || country.name;
                const translatedNameEn = global.commonTranslations?.countries?.[country.code] || country.nameEn;
                
                const displayName = (global.commonTranslations?.language === 'en-US' || global.commonTranslations?.lang === 'en-US') ? 
                                   translatedNameEn : translatedName;
                
                return '<li class="flag-item ' + (this.selectedCountry?.code === country.code ? 'selected' : '') + '" data-country-code="' + country.code + '">' +
                    '<div class="flag-image">' +
                        this.getFlagDisplaySync(country) +
                    '</div>' +
                    '<div class="flag-selector-country-info">' +
                        '<div class="flag-selector-country-name">' + displayName + '</div>' +
                        '<div class="flag-selector-country-code">' + country.code + ' - ' + country.nameEn + '</div>' +
                    '</div>' +
                '</li>';
            }).join('');
            
            listElement.innerHTML = itemsHTML;
            
            if (this.filteredCountries.length === this.countries.length) {
                this.listRendered = true;
            }
        }
        
        updateSelectedState() {
            const listElement = document.getElementById('flagList');
            if (!listElement) return;
            
            const items = listElement.querySelectorAll('.flag-item');
            items.forEach(item => {
                const countryCode = item.dataset.countryCode;
                if (countryCode === this.selectedCountry?.code) {
                    item.classList.add('selected');
                } else {
                    item.classList.remove('selected');
                }
            });
        }
        
        bindEvents() {
            const closeBtn = document.getElementById('flagModalClose');
            const overlay = document.getElementById('flagModalOverlay');
            
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.hide());
            }
            
            if (overlay && !this.isPCMode) {
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        this.hide();
                    }
                });
            }
            
            const searchInput = document.getElementById('flagSearchInput');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.filterCountries(e.target.value);
                });
            }
            
            const flagList = document.getElementById('flagList');
            if (flagList) {
                flagList.addEventListener('click', (e) => {
                    const flagItem = e.target.closest('.flag-item');
                    if (flagItem && !flagItem.classList.contains('flag-empty-state')) {
                        const countryCode = flagItem.dataset.countryCode;
                        const country = this.countries.find(c => c.code === countryCode);
                        if (country) {
                            this.selectCountry(country, false, true);
                        }
                    }
                });
            }
            
            document.addEventListener('keydown', (e) => {
                if (this.isVisible && e.key === 'Escape') {
                    this.hide();
                }
            });
        }
        
        filterCountries(searchTerm) {
            const term = searchTerm.toLowerCase().trim();
            
            if (!term) {
                this.filteredCountries = [...this.countries];
            } else {
                this.filteredCountries = this.countries.filter(country => 
                    country.name.toLowerCase().includes(term) ||
                    country.nameEn.toLowerCase().includes(term) ||
                    country.code.toLowerCase().includes(term)
                );
                this.listRendered = false;
            }
            
            this.renderCountryList();
        }
        
        selectCountry(country, silent = false, autoHide = false) {
            this.selectedCountry = country;
            
            if (this.listRendered) {
                this.updateSelectedState();
            } else {
                this.renderCountryList();
            }
            
            if (!silent && this.onSelect && typeof this.onSelect === 'function') {
                this.onSelect(country);
            }
            
            if (autoHide) {
                setTimeout(() => {
                    this.hide();
                }, 50);
            }
        }
        
        show() {
            if (!this.modal) return;
            
            this.isVisible = true;
            
            if (this.isPCMode) {
                setTimeout(() => {
                    this.modal.classList.add('show');
                    this.setupPCOutsideClick();
                }, 10);
            } else {
                this.modal.classList.add('show');
                document.body.style.overflow = 'hidden';
                
                if (global.utils && global.utils.backButton) {
                    this.backButtonHandlerId = global.utils.backButton.bindForModal(this);
                }
            }
            
            const searchInput = document.getElementById('flagSearchInput');
            if (searchInput) {
                searchInput.value = '';
                this.filterCountries('');
            }
        }
        
        hide() {
            if (!this.modal) return;
            
            this.isVisible = false;
            this.modal.classList.remove('show');
            
            if (!this.isPCMode) {
                document.body.style.overflow = '';
                
                if (this.backButtonHandlerId && global.utils && global.utils.backButton) {
                    global.utils.backButton.unbind(this.backButtonHandlerId);
                    this.backButtonHandlerId = null;
                }
            } else {
                this.removePCOutsideClick();
            }
            
            const searchInput = document.getElementById('flagSearchInput');
            if (searchInput) {
                searchInput.value = '';
                this.filterCountries('');
            }
        }
        
        getSelectedCountry() {
            return this.selectedCountry;
        }
        
        setSelectedCountry(countryCode, silent = true) {
            const country = this.countries.find(c => c.code === countryCode);
            if (country) {
                this.selectCountry(country, silent);
            }
        }
        
        async getFlagDisplay(country) {
            return await FlagUtils.getFlagDisplay(country);
        }
        
        getFlagDisplaySync(country) {
            return FlagUtils.getFlagDisplaySync(country);
        }
        
        getFlagImageUrl(countryCode) {
            return FlagUtils.getFlagImageUrl(countryCode);
        }
        
        destroy() {
            if (this.modal) {
                this.modal.remove();
                this.modal = null;
            }
            document.body.style.overflow = '';
            this.isVisible = false;
            
            if (this.backButtonHandlerId && global.utils && global.utils.backButton) {
                global.utils.backButton.unbind(this.backButtonHandlerId);
                this.backButtonHandlerId = null;
            }
        }
    }

    // ========================================================================
    // 全局实例和初始化函数
    // ========================================================================

    global.flagDisplay = null;

    function initFlagSelector(options = {}) {
        if (!global.flagDisplay) {
            global.flagDisplay = new FlagDisplay();
        }
        
        if (options.containerSelector) {
            global.flagDisplay.bindToContainer(options.containerSelector, options.onSelect);
        }
        
        return global.flagDisplay;
    }

    // 导出
    global.FlagDisplay = FlagDisplay;
    global.FlagSelector = FlagSelector;
    global.initFlagSelector = initFlagSelector;

    // 模块化导出
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = { FlagDisplay, FlagSelector, initFlagSelector };
    }

})(typeof window !== 'undefined' ? window : this);
