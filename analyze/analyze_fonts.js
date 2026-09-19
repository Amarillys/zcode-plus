const fs = require('fs');

const css = fs.readFileSync('temp/extracted-asar/out/renderer/assets/styles-BxjiRXBw.css', 'utf8');

function findMatches(str, re, max = 10) {
  let m;
  let count = 0;
  while ((m = re.exec(str)) !== null && count < max) {
    console.log('Match:', m[0]);
    count++;
  }
}

console.log('--- font-family in CSS ---');
findMatches(css, /font-family:[^;}{]+/g, 15);
findMatches(css, /--font-[a-zA-Z0-9_-]+:[^;}{]+/g, 15);
