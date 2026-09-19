const fs = require('fs');
const path = require('path');

const dir = 'temp/extracted-asar/out/renderer/assets';
const files = fs.readdirSync(dir);

for (const f of files.filter(f => f.endsWith('.js'))) {
  const c = fs.readFileSync(path.join(dir, f), 'utf8');
  if (c.includes('theme-zai-dark') || c.includes('theme-zai-light')) {
    console.log('Found theme-zai in:', f);
  }
}
