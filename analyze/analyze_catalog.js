const fs = require('fs');

const f = 'temp/extracted-asar/out/renderer/assets/catalogTree-D8IT4Q46.js';
const c = fs.readFileSync(f, 'utf8');

function showAround(str, keyword, len = 600) {
  let idx = str.indexOf(keyword);
  while (idx !== -1) {
    console.log(`=== AROUND: ${keyword} at ${idx} ===`);
    console.log(str.slice(Math.max(0, idx - len), Math.min(str.length, idx + len)));
    idx = str.indexOf(keyword, idx + keyword.length);
  }
}

showAround(c, 'theme-zai-light');
