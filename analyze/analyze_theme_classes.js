const fs = require('fs');

const css = fs.readFileSync('temp/extracted-asar/out/renderer/assets/styles-BxjiRXBw.css', 'utf8');

const themeClasses = css.match(/\.theme-[a-zA-Z0-9_-]+/g) || [];
const uniqueThemes = Array.from(new Set(themeClasses));
console.log('Unique theme classes in CSS:', uniqueThemes);
