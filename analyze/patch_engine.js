const fs = require('fs');
const path = require('path');

const targetFile = path.resolve(__dirname, '../extracted-asar/out/renderer/assets/styles-DIQgZMVI.js');
if (!fs.existsSync(targetFile)) {
  console.log('Target file not found:', targetFile);
  process.exit(0);
}
let code = fs.readFileSync(targetFile, 'utf8');

console.log('Read styles-DIQgZMVI.js length:', code.length);

// 1. Locate Jce
const jceTarget = 'function Jce(e,t){';
const jceIdx = code.indexOf(jceTarget);
if (jceIdx === -1) {
  throw new Error('Jce not found');
}

// Find switch(t.op)
const switchIdx = code.indexOf('switch(t.op){case`row.appended`:', jceIdx);
if (switchIdx === -1) {
  throw new Error('switch(t.op) not found');
}

// Replace everything between function Jce(e,t){ and switch(t.op){
const trackerCode = `function Jce(e,t){try{window.__z_r2s=window.__z_r2s||new Map;window.__z_last_trigger=window.__z_last_trigger||Date.now();let now=Date.now();if(t.op===\`row.appended\`){let r=t.row,ct=r.createdAt?(typeof r.createdAt===\`number\`?r.createdAt:new Date(r.createdAt).getTime()):now;if(r.kind===\`userInput\`){window.__z_last_trigger=ct;window.__z_active_step=null}else if(r.kind===\`reasoning\`){let step={promptTime:window.__z_last_trigger||ct,firstTokenAt:null,firstThoughtAt:null,lastThoughtAt:null,thoughtText:\`\`,firstTextAt:null,lastTextAt:null,replyText:\`\`,completedAt:null};window.__z_active_step=step;window.__z_r2s.set(r.rowId,step)}else if(r.kind===\`assistantText\`){let step=window.__z_active_step;if(!step){step={promptTime:window.__z_last_trigger||ct,firstTokenAt:null,firstThoughtAt:null,lastThoughtAt:null,thoughtText:\`\`,firstTextAt:null,lastTextAt:null,replyText:\`\`,completedAt:null};window.__z_active_step=step}window.__z_r2s.set(r.rowId,step)}else if(r.kind===\`toolCall\`){window.__z_active_step=null}}if(t.op===\`row.delta\`){let step=window.__z_r2s.get(t.rowId);if(!step&&e?.rows?.window){let row=e.rows.window.find(r=>r.rowId===t.rowId);if(row&&(row.kind===\`reasoning\`||row.kind===\`assistantText\`)){step=window.__z_active_step||{promptTime:window.__z_last_trigger||now,firstTokenAt:null,firstThoughtAt:null,lastThoughtAt:null,thoughtText:\`\`,firstTextAt:null,lastTextAt:null,replyText:\`\`,completedAt:null};window.__z_active_step=step;window.__z_r2s.set(t.rowId,step)}}if(step){if(!step.firstTokenAt)step.firstTokenAt=now;let row=e?.rows?.window?.find(r=>r.rowId===t.rowId);if(row?.kind===\`reasoning\`||t.path===\`text\`&&!step.firstTextAt&&!step.replyText){if(!step.firstThoughtAt)step.firstThoughtAt=now;step.lastThoughtAt=now;step.thoughtText+=(t.append||\`\`)}if(row?.kind===\`assistantText\`||t.path===\`text\`&&step.firstTextAt){if(!step.firstTextAt)step.firstTextAt=now;step.lastTextAt=now;step.replyText+=(t.append||\`\`)}if(!row&&t.path===\`text\`){if(!step.firstTextAt&&!step.thoughtText){if(!step.firstThoughtAt)step.firstThoughtAt=now;step.lastThoughtAt=now;step.thoughtText+=(t.append||\`\`)}else{if(!step.firstTextAt)step.firstTextAt=now;step.lastTextAt=now;step.replyText+=(t.append||\`\`)}}}}if(t.op===\`row.upserted\`){let r=t.row,step=window.__z_r2s.get(r.rowId);if(r.kind===\`reasoning\`){if(step){step.thoughtText=r.text||step.thoughtText;step.lastThoughtAt=step.lastThoughtAt||now}}else if(r.kind===\`assistantText\`){if(step){step.replyText=r.text||step.replyText;if(r.state===\`complete\`){step.lastTextAt=step.lastTextAt||now;step.completedAt=now;window.__z_active_step=null}}}else if(r.kind===\`toolCall\`||r.kind===\`subagent\`){if(r.status===\`completed\`||r.status===\`failed\`||r.state===\`complete\`||r.status===\`cancelled\`){window.__z_last_trigger=now;window.__z_active_step=null}}}}catch(e){}`;

code = code.slice(0, jceIdx) + trackerCode + code.slice(switchIdx);
console.log('Jce patched successfully.');

// 2. Locate Z3e and replace the metrics badge
const z3eTarget = 'g?(0,$.jsx)(`div`,{className:`mt-3`,children:(0,$.jsx)(v3e,{cards:g,workspacePath:t.workspacePath,workspaceIdentity:t.workspaceIdentity,workspaceRemoteSessionId:t.workspaceRemoteSessionId,onOpenBrowserUrl:t.onOpenBrowserUrl,onOpenCodeViewer:t.onOpenCodeViewer,onOpenFileLink:t.onOpenFileLink,autoOpenPptxKey:l,onAutoOpenPptx:t.onAutoOpenAssistantPptx,compactForRemoteControl:t.compactForRemoteControl})}):null,';

const bQCallTarget = 'e.state===`complete`&&!a&&!o?(0,$.jsx)(bQ,';

const z3eIdxStart = code.indexOf(z3eTarget);
const bqCallIdx = code.indexOf(bQCallTarget, z3eIdxStart);

if (z3eIdxStart === -1 || bqCallIdx === -1) {
  throw new Error('Z3e target not found');
}

const badgeCode = `(()=>{try{let step=window.__z_r2s?.get(e.rowId);let promptTime=step?.promptTime||(e.createdAt?(typeof e.createdAt===\`number\`?e.createdAt:new Date(e.createdAt).getTime()):null);let firstTokenAt=step?.firstTokenAt;let replyText=e.text||step?.replyText||\`\`;let thoughtText=step?.thoughtText||\`\`;let isStreaming=e.state===\`streaming\`;function _tk(txt){if(!txt)return 0;let cjk=(txt.match(/[\\u4e00-\\u9fa5\\u3040-\\u30ff\\uac00-\\ud7af]/g)||[]).length;let nc=txt.length-cjk;return Math.max(1,Math.round(cjk*0.72+nc*0.28))}let thoughtTokens=_tk(thoughtText);let replyTokens=_tk(replyText);let totalTokens=thoughtTokens+replyTokens;let ttftMs=(promptTime&&firstTokenAt&&firstTokenAt>=promptTime)?(firstTokenAt-promptTime):null;let ttftStr=ttftMs!==null?(ttftMs<1000?ttftMs+\`ms\`:(ttftMs/1000).toFixed(2)+\`s\`):null;if(isStreaming){let now=Date.now();let genStart=firstTokenAt||promptTime||now;let elapsed=Math.max(0.1,(now-genStart)/1000);let spd=(totalTokens/elapsed).toFixed(1);return(0,$.jsx)(\`div\`,{className:\`mt-0.5 mb-0 flex select-none items-center gap-1.5 font-serif text-[11.5px] text-foreground-subtlest opacity-70 leading-tight\`,style:{fontFamily:\`serif\`},children:ttftStr?\`⚡ TTFT: \`+ttftStr+\` · \`+spd+\` t/s · 生成中 (\`+totalTokens+\` tok)\`:\`⚡ 等待响应中...\`})}if(e.state===\`complete\`){let lastTokenAt=step?.lastTextAt||step?.completedAt||(e.createdAt?new Date(e.createdAt).getTime():Date.now());let genStart=firstTokenAt||promptTime;let genSec=(genStart&&lastTokenAt&&lastTokenAt>genStart)?(lastTokenAt-genStart)/1000:0;let avgSpd=genSec>0.05?(totalTokens/genSec).toFixed(1):null;let totalSec=(promptTime&&lastTokenAt&&lastTokenAt>promptTime)?((lastTokenAt-promptTime)/1000).toFixed(1)+\`s\`:(genSec>0.1?genSec.toFixed(1)+\`s\`:null);let pts=[];if(ttftStr)pts.push(\`TTFT: \`+ttftStr);if(avgSpd)pts.push(avgSpd+\` t/s\`);if(totalTokens>0){if(thoughtTokens>0){pts.push(totalTokens+\` tok (思考 \`+thoughtTokens+\` + 回复 \`+replyTokens+\`)\`)}else{pts.push(totalTokens+\` tok\`)}}if(totalSec)pts.push(totalSec);return(0,$.jsx)(\`div\`,{className:\`mt-0.5 mb-0 flex select-none items-center gap-1.5 font-serif text-[11.5px] text-foreground-subtlest opacity-70 leading-tight\`,style:{fontFamily:\`serif\`},children:\`⚡ \`+pts.join(\` · \`)})}}catch(e){}return null})(),`;

code = code.slice(0, z3eIdxStart + z3eTarget.length) + badgeCode + code.slice(bqCallIdx);
console.log('Z3e badge patched successfully.');

fs.writeFileSync(targetFile, code, 'utf8');
fs.writeFileSync(path.resolve(__dirname, '../patched-assets/styles-DIQgZMVI.js'), code, 'utf8');
console.log('Successfully saved patched file.');
