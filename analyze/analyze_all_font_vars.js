const fs = require('fs');

const css = fs.readFileSync('temp/extracted-asar/out/renderer/assets/styles-BxjiRXBw.css', 'utf8');

function showAround(str, keyword, len = 200) {
  let idx = 0;
  let count = 0;
  while ((idx = str.indexOf(keyword, idx)) !== -1 && count < 10) {
    console.log(`=== Found "${keyword}" at ${idx} ===`);
    console.log(str.slice(Math.max(0, idx - len), Math.min(str.length, idx + keyword.length + len)));
    idx += keyword.length;
    count++;
  }
}

showAround(css, '--font-sans');
showAround(css, '--default-font-family');
