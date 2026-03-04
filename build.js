#!/usr/bin/env node

/**
 * 简单的构建脚本 - 复制源文件到 dist 目录
 */

const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

// 创建 dist 目录
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('✓ 创建 dist 目录');
}

// 复制文件
const files = [
    'flag-selector.js',
    'flag-selector.css',
    'flag-selector-pc.css',
    'countries-data.js'
];

files.forEach(file => {
    const srcFile = path.join(srcDir, file);
    const distFile = path.join(distDir, file);
    
    if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, distFile);
        console.log(`✓ 复制 ${file} 到 dist/`);
    } else {
        console.error(`✗ 找不到文件: ${file}`);
    }
});

console.log('\n构建完成！');
console.log('输出目录: ' + distDir);
