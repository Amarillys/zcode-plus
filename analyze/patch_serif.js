const fs = require('fs');
const path = require('path');

const targetFile = path.resolve('temp/extracted-asar/out/renderer/assets/styles-DIQgZMVI.js');
let code = fs.readFileSync(targetFile, 'utf8');

// Replace font-mono with font-serif and reduce margins
const targetBadge1 = 'className:`mt-1.5 flex select-none items-center gap-1.5 font-mono text-[11px] text-foreground-subtlest opacity-75`';
const replaceBadge1 = 'className:`mt-0.5 mb-0 flex select-none items-center gap-1.5 font-serif text-[11.5px] text-foreground-subtlest opacity-70 leading-tight`,style:{fontFamily:`serif`}';

const targetBadge2 = 'className:`mt-1.5 flex select-none items-center gap-1.5 font-mono text-[11px] text-foreground-subtlest opacity-75`';
const replaceBadge2 = 'className:`mt-0.5 mb-0 flex select-none items-center gap-1.5 font-serif text-[11.5px] text-foreground-subtlest opacity-70 leading-tight`,style:{fontFamily:`serif`}';

// Also tighten bQ margin from mt-1 to mt-0.5
const targetBqMt = 'className:Z(`mt-1`,t.compactForRemoteControl?`opacity-100`:`opacity-0 transition-opacity group-hover/assistant-row:opacity-100 focus-within:opacity-100`)';
const replaceBqMt = 'className:Z(`mt-0.5`,t.compactForRemoteControl?`opacity-100`:`opacity-0 transition-opacity group-hover/assistant-row:opacity-100 focus-within:opacity-100`)';

console.log('Includes targetBadge1?', code.includes(targetBadge1));
console.log('Includes targetBqMt?', code.includes(targetBqMt));

code = code.replaceAll(targetBadge1, replaceBadge1);
code = code.replace(targetBqMt, replaceBqMt);

fs.writeFileSync(targetFile, code, 'utf8');
fs.writeFileSync(path.resolve('temp/patched-assets/styles-DIQgZMVI.js'), code, 'utf8');
console.log('Successfully updated styles-DIQgZMVI.js with serif font and tighter spacing.');
