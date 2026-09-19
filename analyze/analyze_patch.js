const fs = require('fs');
const path = require('path');

const originalFile = path.resolve('temp/extracted-asar/out/renderer/assets/styles-DIQgZMVI.js');
let code = fs.readFileSync(originalFile, 'utf8');

console.log('Original styles-DIQgZMVI.js length:', code.length);

// 1. Prepare Jce replacement
const targetJce = 'function Jce(e,t){';
const jceIdx = code.indexOf(targetJce);
console.log('jceIdx:', jceIdx);

// Let's see the start of Jce
console.log('Jce snippet:', code.slice(jceIdx, jceIdx + 200));
