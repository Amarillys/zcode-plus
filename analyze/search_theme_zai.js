const fs = require('fs');

function searchAll(dir, query) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    if (!f.endsWith('.js')) continue;
    const full = dir + '/' + f;
    const c = fs.readFileSync(full, 'utf8');
    let idx = 0;
    while ((idx = c.indexOf(query, idx)) !== -1) {
      console.log(`Found "${query}" in ${f} at ${idx}:`);
      console.log(c.slice(Math.max(0, idx - 150), Math.min(c.length, idx + query.length + 150)));
      idx += query.length;
    }
  }
}

searchAll('temp/extracted-asar/out/renderer/assets', 'theme-zai-light');
searchAll('temp/extracted-asar/out/renderer/assets', 'theme-zai-dark');
