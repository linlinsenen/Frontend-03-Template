- 持续集成
    + 发布前检查相关知识
    + GitHook的基本用法
    + ESLint的基本用法
    + ESLint API的高级用法
    + 使用无头浏览器检查DOM
    
```javascript
//ESLint-dome
module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {}
};
```
```javascript
//index.js
let a = 1;
for (let i of [1, 2, 3]) {
    console.log(i);
}
```
```javascript
//headless-deom/main.js
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://localhost:8080/main.html', {
        waitUntil: 'networkidle2'
    });

    const img = await page.$$('a');
    console.log(img);
    await browser.close();
})();
```