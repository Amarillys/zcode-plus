const fs = require('fs');
const path = require('path');

const cssFile = path.resolve('temp/extracted-asar/out/renderer/assets/styles-BxjiRXBw.css');
let cssContent = fs.readFileSync(cssFile, 'utf8');

const targetFontSans = '--font-sans:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
const replaceFontSans = '--font-sans:"Noto Sans", "Noto Sans SC", "Noto Sans CJK SC", "Noto Sans HK", "Noto Sans TC", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

console.log('Includes targetFontSans?', cssContent.includes(targetFontSans));

if (cssContent.includes(targetFontSans)) {
  cssContent = cssContent.replaceAll(targetFontSans, replaceFontSans);
}

// Append global Noto Sans override
const notoSansGlobalCss = `
html, body, #root, input, button, textarea, select {
  font-family: "Noto Sans", "Noto Sans SC", "Noto Sans CJK SC", "Noto Sans HK", "Noto Sans TC", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
}
.font-mono, pre, code, kbd, samp, .font-mono * {
  font-family: var(--font-mono) !important;
}
`;

if (!cssContent.includes('Noto Sans SC')) {
  cssContent += notoSansGlobalCss;
}

fs.writeFileSync(cssFile, cssContent, 'utf8');
console.log('Updated styles-BxjiRXBw.css with Noto Sans font stack.');

// Also update index.html
const indexHtmlFile = path.resolve('temp/extracted-asar/out/renderer/index.html');
let htmlContent = fs.readFileSync(indexHtmlFile, 'utf8');

const targetHtmlStyle = 'html,\n      body,\n      #root {\n        margin: 0;\n        width: 100%;\n        height: 100%;\n      }';
const replaceHtmlStyle = 'html,\n      body,\n      #root {\n        margin: 0;\n        width: 100%;\n        height: 100%;\n        font-family: "Noto Sans", "Noto Sans SC", "Noto Sans CJK SC", ui-sans-serif, system-ui, sans-serif;\n      }';

if (htmlContent.includes(targetHtmlStyle)) {
  htmlContent = htmlContent.replace(targetHtmlStyle, replaceHtmlStyle);
  fs.writeFileSync(indexHtmlFile, htmlContent, 'utf8');
  console.log('Updated index.html with Noto Sans.');
}
