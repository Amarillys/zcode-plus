const fs = require('fs');

const css = fs.readFileSync('temp/extracted-asar/out/renderer/assets/styles-BxjiRXBw.css', 'utf8');

function showAround(str, keyword, len = 300) {
  let idx = str.indexOf(keyword);
  let count = 0;
  while ((idx !== -1) && count < 5) {
    console.log(`=== AROUND: ${keyword} at ${idx} ===`);
    console.log(str.slice(Math.max(0, idx - len), Math.min(str.length, idx + len)));
    idx = str.indexOf(keyword, idx + keyword.length);
    count++;
  }
}

showAround(css, '--font-sans:');
showAround(css, 'body{');
showAround(css, 'html{');
