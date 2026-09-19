const fs = require('fs');
const path = require('path');

const cssDir = 'temp/extracted-asar/out/renderer/assets';
const files = fs.readdirSync(cssDir);

console.log('CSS files in assets:');
files.filter(f => f.endsWith('.css')).forEach(f => console.log(' - ', f));

// Search for theme list in JS files
for (const f of files.filter(f => f.endsWith('.js'))) {
  const c = fs.readFileSync(path.join(cssDir, f), 'utf8');
  if (c.includes('theme.light') || c.includes('theme.dark') || c.includes('settings.theme') || c.includes('Monokai') || c.includes('monokai')) {
    console.log('Found theme keyword in:', f);
  }
}
