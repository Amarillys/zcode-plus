const fs = require('fs');

const f = 'temp/extracted-asar/out/renderer/assets/index-Ds4WtEHd.js';
const c = fs.readFileSync(f, 'utf8');

function showAround(str, keyword, len = 400) {
  let idx = str.indexOf(keyword);
  while (idx !== -1) {
    console.log(`=== AROUND: ${keyword} at ${idx} ===`);
    console.log(c.slice(Math.max(0, idx - len), Math.min(c.length, idx + len)));
    idx = str.indexOf(keyword, idx + keyword.length);
  }
}

showAround(c, 'theme-zai-light');
