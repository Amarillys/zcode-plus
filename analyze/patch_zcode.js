const fs = require('fs');
const path = require('path');

const originalFile = path.resolve('temp/extracted-asar/out/renderer/assets/styles-DIQgZMVI.js');
const patchedDir = path.resolve('temp/patched-assets');

if (!fs.existsSync(patchedDir)) {
  fs.mkdirSync(patchedDir, { recursive: true });
}

let code = fs.readFileSync(originalFile, 'utf8');

// Patch 1: Global timing tracking in Jce
const targetJce = 'function Jce(e,t){switch(t.op){case`row.appended`:return{...e,rows:{...e.rows,window:[...e.rows.window,t.row],totalCount:e.rows.totalCount+1,firstRowId:e.rows.firstRowId??t.row.rowId}};case`row.upserted`:';

const replaceJce = 'function Jce(e,t){try{window.__z_t=window.__z_t||new Map;if(t.op===`row.appended`){if(t.row.kind===`userInput`)window.__z_lu=Date.now();if(t.row.kind===`assistantText`||t.row.kind===`reasoning`){let st=t.row.createdAt?(typeof t.row.createdAt===`number`?t.row.createdAt:new Date(t.row.createdAt).getTime()):(window.__z_lu||Date.now());window.__z_t.set(t.row.rowId,{startAt:st,firstTokenAt:null,lastTokenAt:null,len:0})}}if(t.op===`row.delta`){let info=window.__z_t.get(t.rowId);if(info){if(!info.firstTokenAt)info.firstTokenAt=Date.now();info.lastTokenAt=Date.now();info.len+=(t.append||``).length}}if(t.op===`row.upserted`){let info=window.__z_t.get(t.row.rowId);if(info){if(t.row.state===`complete`&&!info.lastTokenAt)info.lastTokenAt=Date.now()}}}catch(e){}switch(t.op){case`row.appended`:return{...e,rows:{...e.rows,window:[...e.rows.window,t.row],totalCount:e.rows.totalCount+1,firstRowId:e.rows.firstRowId??t.row.rowId}};case`row.upserted`:';

if (!code.includes(targetJce)) {
  console.log('Notice: targetJce might already be patched or not found.');
} else {
  code = code.replace(targetJce, replaceJce);
  console.log('Patch 1 (Jce global timing tracker) applied.');
}

// Patch 2: Always-visible metrics component in Z3e
const targetZ3e = 'g?(0,$.jsx)(`div`,{className:`mt-3`,children:(0,$.jsx)(v3e,{cards:g,workspacePath:t.workspacePath,workspaceIdentity:t.workspaceIdentity,workspaceRemoteSessionId:t.workspaceRemoteSessionId,onOpenBrowserUrl:t.onOpenBrowserUrl,onOpenCodeViewer:t.onOpenCodeViewer,onOpenFileLink:t.onOpenFileLink,autoOpenPptxKey:l,onAutoOpenPptx:t.onAutoOpenAssistantPptx,compactForRemoteControl:t.compactForRemoteControl})}):null,e.state===`complete`&&!a&&!o?(0,$.jsx)(bQ,';

const replaceZ3e = 'g?(0,$.jsx)(`div`,{className:`mt-3`,children:(0,$.jsx)(v3e,{cards:g,workspacePath:t.workspacePath,workspaceIdentity:t.workspaceIdentity,workspaceRemoteSessionId:t.workspaceRemoteSessionId,onOpenBrowserUrl:t.onOpenBrowserUrl,onOpenCodeViewer:t.onOpenCodeViewer,onOpenFileLink:t.onOpenFileLink,autoOpenPptxKey:l,onAutoOpenPptx:t.onAutoOpenAssistantPptx,compactForRemoteControl:t.compactForRemoteControl})}):null,(()=>{try{let info=window.__z_t&&window.__z_t.get(e.rowId);let st=info?.startAt||(e.createdAt?(typeof e.createdAt===`number`?e.createdAt:new Date(e.createdAt).getTime()):null);let ft=info?.firstTokenAt;let lt=info?.lastTokenAt||(e.state===`complete`?Date.now():null);let txt=e.text||``;if(st&&(ft||f)){let tt=ft?Math.max(0,ft-st):Date.now()-st;let tts=tt<1000?tt+`ms`:(tt/1000).toFixed(2)+`s`;if(f){let g=ft?Math.max(0.1,(Date.now()-ft)/1000):0.1;let tok=Math.max(1,Math.round(txt.length/1.8));let s=(tok/g).toFixed(1);return(0,$.jsx)(`div`,{className:`mt-1.5 flex select-none items-center gap-1.5 font-mono text-[11px] text-foreground-subtlest opacity-70`,children:ft?`⚡ TTFT: `+tts+` · `+s+` t/s`:`⚡ 等待首字中... (`+tts+`)`})}if(e.state===`complete`){let g=(ft&&lt&&lt>ft)?(lt-ft)/1000:0;let tok=Math.max(1,Math.round(txt.length/1.8));let s=g>0.05?(tok/g).toFixed(1)+` t/s`:null;let p=[`TTFT: `+tts];s&&p.push(s);g>0.1&&p.push(g.toFixed(1)+`s`);return(0,$.jsx)(`div`,{className:`mt-1.5 flex select-none items-center gap-1.5 font-mono text-[11px] text-foreground-subtlest opacity-70`,children:`⚡ `+p.join(` · `)})}}}catch(e){}return null})(),e.state===`complete`&&!a&&!o?(0,$.jsx)(bQ,';

if (!code.includes(targetZ3e)) {
  console.log('Notice: targetZ3e might already be patched or not found.');
} else {
  code = code.replace(targetZ3e, replaceZ3e);
  console.log('Patch 2 (Z3e visible metrics component) applied.');
}

const patchedPath = path.join(patchedDir, 'styles-DIQgZMVI.js');
fs.writeFileSync(patchedPath, code, 'utf8');
console.log('Successfully written patched file to:', patchedPath);
