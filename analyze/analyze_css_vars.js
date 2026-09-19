const fs = require('fs');

const css = fs.readFileSync('temp/extracted-asar/out/renderer/assets/styles-BxjiRXBw.css', 'utf8');

// Find all rules setting --color-background or --color-foreground or --color-border
const rules = css.match(/[^{}]+{[^{}]*--color-background[^{}]*}/g) || [];
console.log('Found rules with --color-background:', rules.length);
rules.forEach((r, idx) => {
  console.log(`\n=== Rule ${idx + 1} ===\n`, r);
});
