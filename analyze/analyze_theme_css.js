const fs = require('fs');

const css = fs.readFileSync('temp/extracted-asar/out/renderer/assets/styles-BxjiRXBw.css', 'utf8');

console.log('CSS length:', css.length);

function findMatches(str, re, max = 10) {
  let m;
  let count = 0;
  while ((m = re.exec(str)) !== null && count < max) {
    console.log('Match:', m[0]);
    count++;
  }
}

console.log('--- Themes in CSS ---');
findMatches(css, /:root\s*\{[^}]*\}/g, 3);
findMatches(css, /\.dark\s*\{[^}]*\}/g, 3);
findMatches(css, /\[data-theme=[^\]]+\]\s*\{[^}]*\}/g, 10);
findMatches(css, /\[class\*="theme-"\]\s*\{[^}]*\}/g, 10);
