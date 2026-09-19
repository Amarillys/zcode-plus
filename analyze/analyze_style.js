const fs = require('fs');

const f = 'temp/extracted-asar/out/renderer/assets/styles-DIQgZMVI.js';
const c = fs.readFileSync(f, 'utf8');

function showAround(str, keyword, len = 300) {
  let idx = str.indexOf(keyword);
  let count = 0;
  while (idx !== -1 && count < 5) {
    console.log(`=== AROUND: ${keyword} at ${idx} ===`);
    console.log(c.slice(Math.max(0, idx - len), Math.min(c.length, idx + len)));
    idx = str.indexOf(keyword, idx + keyword.length);
    count++;
  }
}

showAround(c, 'font-mono text-[11px]');
