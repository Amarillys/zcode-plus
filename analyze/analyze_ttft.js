const fs = require('fs');

const zcode = fs.readFileSync('resources/glm/zcode.cjs', 'utf8');

function showAround(str, keyword, len = 500) {
  let idx = str.indexOf(keyword);
  let count = 0;
  while (idx !== -1 && count < 5) {
    console.log(`=== AROUND: ${keyword} at ${idx} ===`);
    console.log(str.slice(Math.max(0, idx - len), Math.min(str.length, idx + len)));
    idx = str.indexOf(keyword, idx + keyword.length);
    count++;
  }
}

showAround(zcode, 'time_to_first_token');
showAround(zcode, 'firstTokenAt');
