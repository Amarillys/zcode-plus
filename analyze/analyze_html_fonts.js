const fs = require('fs');
const path = require('path');

const dir = 'temp/extracted-asar/out/renderer';
const files = fs.readdirSync(dir, { recursive: true });

for (const f of files) {
  if (f.endsWith('.html') || f.endsWith('.css')) {
    const full = path.join(dir, f);
    const content = fs.readFileSync(full, 'utf8');
    if (content.includes('font-family')) {
      console.log('File with font-family:', f);
    }
  }
}
