const fs = require('fs');

function showAround(filepath, keyword, len = 500) {
  const c = fs.readFileSync(filepath, 'utf8');
  let idx = 0, count = 0;
  while ((idx = c.indexOf(keyword, idx)) !== -1 && count < 5) {
    console.log(`=== Found in ${filepath} at ${idx} ===`);
    console.log(c.slice(Math.max(0, idx - len), Math.min(c.length, idx + keyword.length + len)));
    idx += keyword.length;
    count++;
  }
}

showAround('temp/extracted-asar/out/renderer/assets/styles-DIQgZMVI.js', 'theme-zai-dark');
showAround('temp/extracted-asar/out/renderer/assets/styles-DIQgZMVI.js', 'settings.theme');
showAround('temp/extracted-asar/out/renderer/assets/styles-DIQgZMVI.js', 'theme.system');
