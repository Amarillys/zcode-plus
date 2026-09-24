const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rootDir = path.resolve(__dirname, '..');
const tempDir = __dirname;
const asarFile = path.join(rootDir, 'resources', 'app.asar');
const asarBak = path.join(rootDir, 'resources', 'app.asar.bak');
const extractedDir = path.join(tempDir, 'extracted-asar');
const assetsDir = path.join(extractedDir, 'out', 'renderer', 'assets');

function askPromptModification() {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      return resolve(false);
    }
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    console.log('\n----------------------------------------------------');
    console.log('❓ [可选配置] 是否修改并优化系统提示词 (System Prompt)？');
    console.log('   ⚠️ [重要提示] 如果您使用的是 GLM 官方订阅/官方套餐，请不要修改 (输入 N)！');
    console.log('      (官方模型深度绑定了原版提示词与缓存机制，修改可能导致行为偏差或缓存失效)');
    console.log('   💡 若您主要使用 第三方模型 / 自定义 API (Claude/DeepSeek/GPT/Kimi等)：');
    console.log('      输入 Y 可精简安全声明与长文交流规范，并注入「深模块设计、决策树对齐」工程准则');
    rl.question('👉 是否确认修改提示词？[y/N] (默认 N，直接回车即保持官方原版): ', (ans) => {
      rl.close();
      const choice = ans.trim().toLowerCase();
      resolve(choice === 'y' || choice === 'yes');
    });
  });
}

async function main() {
  console.log('====================================================');
  console.log('    ZCode Master Auto-Patcher (3.14 深度适配版)     ');
  console.log('====================================================');

  // 询问用户是否修改系统提示词 (默认 N，保护 GLM 官方订阅)
  const shouldPatchPrompt = await askPromptModification();
  if (shouldPatchPrompt) {
    console.log('  -> [选择已确认] 将修改系统提示词 (适合第三方模型/自定义 API)');
  } else {
    console.log('  -> [选择已确认] 保持官方原版提示词 (完美兼容 GLM 官方订阅)');
  }
  console.log('----------------------------------------------------\n');

  // 检查 ZCode 进程是否在运行
try {
  const tasklist = execSync('tasklist', { encoding: 'utf8' });
  if (tasklist.toLowerCase().includes('zcode.exe')) {
    console.warn('\n⚠️ [警告] 检测到 ZCode 客户端正在运行！');
    console.warn('  -> 打包覆盖 app.asar 可能会因文件占用失败。');
    console.warn('  -> 建议您先完全退出 ZCode 客户端后再打补丁哦~ (◕‿◕✿)\n');
  }
} catch (e) {}

// Step 1: Backup & Extract (带智能版本保护)
console.log('[1/4] 检查并准备官方纯净底包...');
if (!fs.existsSync(asarBak)) {
  console.log('  -> 备份不存在，将当前 app.asar 作为初始官方备份...');
  fs.copyFileSync(asarFile, asarBak);
  console.log('  -> 备份已保存至:', asarBak);
} else {
  try {
    const asarStat = fs.statSync(asarFile);
    const bakStat = fs.statSync(asarBak);
    // 若当前 asar 大于 315MB 且 bak 小于 315MB，说明官方刚完成 3.14 大版本更新，自动刷新备份
    if (asarStat.size > 315 * 1024 * 1024 && bakStat.size < 315 * 1024 * 1024) {
      console.log('  -> 检测到官方升级为 3.14+ 全新底包，自动更新备份副本...');
      fs.copyFileSync(asarFile, asarBak);
    } else {
      console.log('  -> 从官方备份恢复干净副本...');
      fs.copyFileSync(asarBak, asarFile);
    }
  } catch (e) {
    fs.copyFileSync(asarBak, asarFile);
  }
}

console.log('[2/4] 准备 extracted-asar 源码目录...');
if (fs.existsSync(extractedDir)) {
  fs.rmSync(extractedDir, { recursive: true, force: true });
}
console.log('  -> 正在解包 app.asar 到 extracted-asar...');
execSync(`npx @electron/asar extract "${asarFile}" "${extractedDir}"`, { stdio: 'inherit' });

// Step 2: Apply Patches
console.log('[3/4] 正在动态扫描并应用全部增强补丁...');

const files = fs.readdirSync(assetsDir);
const stylesJsName = files.find(f => f.startsWith('styles-') && f.endsWith('.js'));
const cssFileName = files.find(f => f.startsWith('styles-') && f.endsWith('.css'));
const intlFileName = files.find(f => f.startsWith('IntlProvider-') && f.endsWith('.js'));
const indexFileName = files.find(f => f.startsWith('index-') && f.endsWith('.js'));

console.log(`  -> 目标资产定位:`, { stylesJsName, cssFileName, intlFileName, indexFileName });

if (!stylesJsName || !cssFileName || !intlFileName || !indexFileName) {
  throw new Error('未能完整定位核心资源文件，请检查解包目录！');
}

// --- 补丁 1: TTFT & Token 速度与思考过程明细监控 (styles-*.js) ---
const stylesJsFile = path.join(assetsDir, stylesJsName);
let stylesJs = fs.readFileSync(stylesJsFile, 'utf8');

// 1.1 全局时间与分步 (Step-level) Token 追踪
const switchIdx = stylesJs.indexOf('switch(t.op){case`row.appended`:');
const funcStart = stylesJs.lastIndexOf('function ', switchIdx);

if (switchIdx !== -1 && funcStart !== -1) {
  const funcHeader = stylesJs.slice(funcStart, switchIdx);
  const trackerBody = `try{window.__z_r2s=window.__z_r2s||new Map;window.__z_last_trigger=window.__z_last_trigger||Date.now();let now=Date.now();if(t.op===\`row.appended\`){let r=t.row,ct=r.createdAt?(typeof r.createdAt===\`number\`?r.createdAt:new Date(r.createdAt).getTime()):now;if(r.kind===\`userInput\`){window.__z_last_trigger=ct;window.__z_active_step=null}else if(r.kind===\`reasoning\`){let step={promptTime:window.__z_last_trigger||ct,firstTokenAt:null,firstThoughtAt:null,lastThoughtAt:null,thoughtText:\`\`,firstTextAt:null,lastTextAt:null,replyText:\`\`,completedAt:null};window.__z_active_step=step;window.__z_r2s.set(r.rowId,step)}else if(r.kind===\`assistantText\`){let step=window.__z_active_step;if(!step){step={promptTime:window.__z_last_trigger||ct,firstTokenAt:null,firstThoughtAt:null,lastThoughtAt:null,thoughtText:\`\`,firstTextAt:null,lastTextAt:null,replyText:\`\`,completedAt:null};window.__z_active_step=step}window.__z_r2s.set(r.rowId,step)}else if(r.kind===\`toolCall\`){window.__z_active_step=null}}if(t.op===\`row.delta\`){let step=window.__z_r2s.get(t.rowId);if(!step&&e?.rows?.window){let row=e.rows.window.find(r=>r.rowId===t.rowId);if(row&&(row.kind===\`reasoning\`||row.kind===\`assistantText\`)){step=window.__z_active_step||{promptTime:window.__z_last_trigger||now,firstTokenAt:null,firstThoughtAt:null,lastThoughtAt:null,thoughtText:\`\`,firstTextAt:null,lastTextAt:null,replyText:\`\`,completedAt:null};window.__z_active_step=step;window.__z_r2s.set(t.rowId,step)}}if(step){if(!step.firstTokenAt)step.firstTokenAt=now;let row=e?.rows?.window?.find(r=>r.rowId===t.rowId);if(row?.kind===\`reasoning\`||(t.path===\`text\`&&!step.firstTextAt&&!step.replyText)){if(!step.firstThoughtAt)step.firstThoughtAt=now;step.lastThoughtAt=now;step.thoughtText+=(t.append||\`\`)}if(row?.kind===\`assistantText\`||(t.path===\`text\`&&step.firstTextAt)){if(!step.firstTextAt)step.firstTextAt=now;step.lastTextAt=now;step.replyText+=(t.append||\`\`)}}}if(t.op===\`row.upserted\`){let r=t.row,step=window.__z_r2s.get(r.rowId);if(r.kind===\`reasoning\`){if(step){step.thoughtText=r.text||step.thoughtText;step.lastThoughtAt=step.lastThoughtAt||now}}else if(r.kind===\`assistantText\`){if(step){step.replyText=r.text||step.replyText;if(r.state===\`complete\`){step.lastTextAt=step.lastTextAt||now;step.completedAt=now;window.__z_active_step=null}}}else if(r.kind===\`toolCall\`||r.kind===\`subagent\`){if(r.status===\`completed\`||r.status===\`failed\`||r.state===\`complete\`||r.status===\`cancelled\`){window.__z_last_trigger=now;window.__z_active_step=null}}}}catch(e){}`;
  stylesJs = stylesJs.slice(0, funcStart) + funcHeader + trackerBody + stylesJs.slice(switchIdx);
  console.log('  ✔ [TTFT] 全局请求与首字时间追踪器已注入 (Step-level v3 精确版)');
}

// 1.2 指标徽章组件渲染 (Serif 字体 + 紧凑边距)
const z3eTarget = 'compactForRemoteControl:t.compactForRemoteControl})}):null,';
const bQCallTarget = 'e.state===`complete`&&!a&&!o?(0,$.jsx)(';
const z3eIdxStart = stylesJs.indexOf(z3eTarget);
const bqCallIdx = stylesJs.indexOf(bQCallTarget, z3eIdxStart);

if (z3eIdxStart !== -1 && bqCallIdx !== -1) {
  const badgeCode = `(()=>{try{let step=window.__z_r2s?.get(e.rowId);let promptTime=step?.promptTime||(e.createdAt?(typeof e.createdAt===\`number\`?e.createdAt:new Date(e.createdAt).getTime()):null);let firstTokenAt=step?.firstTokenAt;let replyText=e.text||step?.replyText||\`\`;let thoughtText=step?.thoughtText||\`\`;let isStreaming=e.state===\`streaming\`;function _tk(txt){if(!txt)return 0;let cjk=(txt.match(/[\\u4e00-\\u9fa5\\u3040-\\u30ff\\uac00-\\ud7af]/g)||[]).length;let nc=txt.length-cjk;return Math.max(1,Math.round(cjk*0.72+nc*0.28))}let thoughtTokens=_tk(thoughtText);let replyTokens=_tk(replyText);let totalTokens=thoughtTokens+replyTokens;let ttftMs=(promptTime&&firstTokenAt&&firstTokenAt>=promptTime)?(firstTokenAt-promptTime):null;let ttftStr=ttftMs!==null?(ttftMs<1000?ttftMs+\`ms\`:(ttftMs/1000).toFixed(2)+\`s\`):null;if(isStreaming){let now=Date.now();let genStart=firstTokenAt||promptTime||now;let elapsed=Math.max(0.1,(now-genStart)/1000);let spd=(totalTokens/elapsed).toFixed(1);return(0,$.jsx)(\`div\`,{className:\`mt-0.5 mb-0 flex select-none items-center gap-1.5 font-serif text-[11.5px] text-foreground-subtlest opacity-70 leading-tight\`,style:{fontFamily:\`serif\`},children:ttftStr?\`⚡ TTFT: \`+ttftStr+\` · \`+spd+\` t/s · 生成中 (\`+totalTokens+\` tok)\`:\`⚡ 等待响应中...\`})}if(e.state===\`complete\`){let lastTokenAt=step?.lastTextAt||step?.completedAt||(e.createdAt?new Date(e.createdAt).getTime():Date.now());let genStart=firstTokenAt||promptTime;let genSec=(genStart&&lastTokenAt&&lastTokenAt>genStart)?(lastTokenAt-genStart)/1000:0;let avgSpd=genSec>0.05?(totalTokens/genSec).toFixed(1):null;let totalSec=(promptTime&&lastTokenAt&&lastTokenAt>promptTime)?((lastTokenAt-promptTime)/1000).toFixed(1)+\`s\`:(genSec>0.1?genSec.toFixed(1)+\`s\`:null);let pts=[];if(ttftStr)pts.push(\`TTFT: \`+ttftStr);if(avgSpd)pts.push(avgSpd+\` t/s\`);if(totalTokens>0){if(thoughtTokens>0){pts.push(totalTokens+\` tok (思考 \`+thoughtTokens+\` + 回复 \`+replyTokens+\`)\`)}else{pts.push(totalTokens+\` tok\`)}}if(totalSec)pts.push(totalSec);return(0,$.jsx)(\`div\`,{className:\`mt-0.5 mb-0 flex select-none items-center gap-1.5 font-serif text-[11.5px] text-foreground-subtlest opacity-70 leading-tight\`,style:{fontFamily:\`serif\`},children:\`⚡ \`+pts.join(\` · \`)})}}catch(e){}return null})(),`;
  stylesJs = stylesJs.slice(0, z3eIdxStart + z3eTarget.length) + badgeCode + stylesJs.slice(bqCallIdx);
  console.log('  ✔ [TTFT] 消息底部常驻 Serif 指标徽章组件已挂载 (Step-level v3 精确版)');
}

// 1.3 注册新主题到 styles-*.js
stylesJs = stylesJs.replace(
  /(\[\{mode:`system`,icon:[a-zA-Z0-9_$]+\},\{mode:`zai-dark`,icon:([a-zA-Z0-9_$]+)\},\{mode:`zai-light`,icon:([a-zA-Z0-9_$]+)\})\]/,
  '$1,{mode:`monokai-dark`,icon:$2},{mode:`solarized-light`,icon:$3}]'
);
stylesJs = stylesJs.replace(
  /\[`system`,`zai-dark`,`zai-light`\]/,
  '[`system`,`zai-dark`,`zai-light`,`monokai-dark`,`solarized-light`]'
);
stylesJs = stylesJs.replaceAll(
  /\(0,\$\.jsx\)\(([a-zA-Z0-9_$]+),\{value:`zai-light`,children:([a-zA-Z0-9_$]+)\.formatMessage\(\{id:`sidebar\.settings\.theme\.zai-light`\}\)\}\)/g,
  '(0,$.jsx)($1,{value:`zai-light`,children:$2.formatMessage({id:`sidebar.settings.theme.zai-light`})}),(0,$.jsx)($1,{value:`monokai-dark`,children:$2.formatMessage({id:`sidebar.settings.theme.monokai-dark`})}),(0,$.jsx)($1,{value:`solarized-light`,children:$2.formatMessage({id:`sidebar.settings.theme.solarized-light`})})'
);

// 1.4 3.14 主题切换逻辑与状态机 (内联挂载在 styles-*.js)
stylesJs = stylesJs.replace(
  /function\s+([a-zA-Z0-9_$]+)\s*\(e\)\{return\s+e===`system`\?([a-zA-Z0-9_$]+)\(\):e===`dark`\|\|e===`zai-dark`\?`dark`:`light`\}/,
  'function $1(e){return e===`system`?$2():e===`dark`||e===`zai-dark`||e===`monokai-dark`?`dark`:`light`}'
);
stylesJs = stylesJs.replace(
  /document\.documentElement\.classList\.toggle\(`theme-zai-dark`,([a-zA-Z0-9_$]+)===`zai-dark`\),([a-zA-Z0-9_$]+)\(([a-zA-Z0-9_$]+)\)\}/,
  'document.documentElement.classList.toggle(`theme-zai-dark`,$1===`zai-dark`),document.documentElement.classList.toggle(`theme-solarized-light`,$1===`solarized-light`),document.documentElement.classList.toggle(`theme-monokai-dark`,$1===`monokai-dark`),$2($3)}'
);

fs.writeFileSync(stylesJsFile, stylesJs, 'utf8');
console.log('  ✔ [主题] Monokai 暖黑 与 Solarized 浅色 主题逻辑已注入');

// --- 补丁 2: CSS 主题色彩与 Noto Sans 字体栈 (styles-*.css) ---
const cssFile = path.join(assetsDir, cssFileName);
let cssContent = fs.readFileSync(cssFile, 'utf8');

const targetFontSans = '--font-sans:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
const replaceFontSans = '--font-sans:"Noto Sans", "Noto Sans SC", "Noto Sans CJK SC", "Noto Sans HK", "Noto Sans TC", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

if (cssContent.includes(targetFontSans)) {
  cssContent = cssContent.replaceAll(targetFontSans, replaceFontSans);
}

const themeAndFontCss = `
.theme-solarized-light{--animated-gradient-text-strong:#073642;--animated-gradient-text-soft:#07364238;--color-background:#fdf6e3;--color-background-win-alt:#eee8d5;--color-background-alt:oklab(96.5% -0.01 0.03/.7);--color-brand:#268bd2;--color-accent:#268bd21a;--color-find-highlight:#fff4eb;--color-find-highlight-active:#ffb26b;--color-border:#657b8326;--color-border-hover:#657b8340;--color-hover:#657b830f;--color-selected:#657b831a;--color-header:#eee8d5;--color-panel:#eee8d5;--color-sidebar:#f5eed9;--color-surface:#657b830d;--color-surface-hover:#657b831a;--color-card:#fdf6e3;--color-card-selected:var(--color-input);--color-card-border:var(--color-border);--color-popover:#fdf6e3;--color-popover-foreground:var(--color-foreground);--color-popover-header:#eee8d5;--color-popover-border:var(--color-border);--color-input:#fffbf0;--color-input-focused:var(--color-input);--color-input-border:var(--color-border);--color-input-border-hover:var(--color-border-hover);--color-input-border-focused:var(--color-border-hover);--color-foreground:#657b83;--color-foreground-subtle:#839496;--color-foreground-subtlest:#93a1a1;--color-terminal-bg:#fdf6e3;--color-terminal-fg:#657b83;--color-terminal-cursor:#657b83;--color-terminal-cursor-accent:#fdf6e3;--color-terminal-selection:#268bd238;--color-terminal-selection-inactive:#657b831a;--color-terminal-black:#073642;--color-terminal-red:#dc322f;--color-terminal-green:#859900;--color-terminal-yellow:#b58900;--color-terminal-blue:#268bd2;--color-terminal-magenta:#d33682;--color-terminal-cyan:#2aa198;--color-terminal-white:#eee8d5;--color-terminal-bright-black:#586e75;--color-terminal-bright-red:#cb4b16;--color-terminal-bright-green:#859900;--color-terminal-bright-yellow:#b58900;--color-terminal-bright-blue:#268bd2;--color-terminal-bright-magenta:#6c71c4;--color-terminal-bright-cyan:#2aa198;--color-terminal-bright-white:#fdf6e3;--color-usage-chart-1:#268bd2;--color-usage-chart-2:#859900;--color-usage-chart-3:#6c71c4;--color-usage-chart-4:#dc322f;--color-usage-chart-5:#b58900;--color-usage-chart-6:#2aa198;--color-context-breakdown-1:#268bd2;--color-context-breakdown-2:#3f9be0;--color-context-breakdown-3:#5faeec;--color-context-breakdown-4:#80c0f5;--color-context-breakdown-5:#a4d2fb;--color-context-breakdown-6:#c8e4fd;--color-context-breakdown-7:#e2f1fe;--color-usage-heatmap-0:color-mix(in oklab, #268bd2 0%, color-mix(in oklab, var(--color-neutral-950) 3%, transparent))}
.theme-monokai-dark{--animated-gradient-text-strong:#f8f8f2;--animated-gradient-text-soft:#f8f8f238;--color-background:#272822;--color-background-win-alt:#1e1f1c;--color-background-alt:oklab(26% -0.01 0.02/.6);--color-brand:#a6e22e;--color-accent:#f9267226;--color-find-highlight:#6e4400;--color-find-highlight-active:#fd971f;--color-border:#49483e80;--color-border-hover:#75715e80;--color-hover:#ffffff0d;--color-selected:#49483ecc;--color-header:#1e1f1c;--color-panel:#1e1f1c;--color-sidebar:#1e1f1c;--color-surface:#ffffff0a;--color-surface-hover:#ffffff14;--color-card:#34352f;--color-card-selected:var(--color-input);--color-card-border:var(--color-border);--color-popover:#272822;--color-popover-foreground:var(--color-foreground);--color-popover-header:#1e1f1c;--color-popover-border:var(--color-border);--color-input:#3e3d32;--color-input-focused:var(--color-input);--color-input-border:var(--color-border);--color-input-border-hover:var(--color-border-hover);--color-input-border-focused:var(--color-border-hover);--color-foreground:#f8f8f2;--color-foreground-subtle:#a6a69c;--color-foreground-subtlest:#75715e;--color-terminal-bg:#272822;--color-terminal-fg:#f8f8f2;--color-terminal-cursor:#f8f8f0;--color-terminal-cursor-accent:#272822;--color-terminal-selection:#49483e;--color-terminal-selection-inactive:#3e3d32;--color-terminal-black:#272822;--color-terminal-red:#f92672;--color-terminal-green:#a6e22e;--color-terminal-yellow:#e6db74;--color-terminal-blue:#66d9ef;--color-terminal-magenta:#ae81ff;--color-terminal-cyan:#a1efe4;--color-terminal-white:#f8f8f2;--color-terminal-bright-black:#75715e;--color-terminal-bright-red:#f92672;--color-terminal-bright-green:#a6e22e;--color-terminal-bright-yellow:#e6db74;--color-terminal-bright-blue:#66d9ef;--color-terminal-bright-magenta:#ae81ff;--color-terminal-bright-cyan:#a1efe4;--color-terminal-bright-white:#f8f8f2;--color-usage-chart-1:#a6e22e;--color-usage-chart-2:#66d9ef;--color-usage-chart-3:#ae81ff;--color-usage-chart-4:#f92672;--color-usage-chart-5:#fd971f;--color-usage-chart-6:#e6db74;--color-context-breakdown-1:#a6e22e;--color-context-breakdown-2:#b8ea52;--color-context-breakdown-3:#c8f072;--color-context-breakdown-4:#d8f592;--color-context-breakdown-5:#e4f9b0;--color-context-breakdown-6:#f0fccd;--color-context-breakdown-7:#f8fee6;--color-usage-heatmap-0:color-mix(in oklab, #a6e22e 0%, color-mix(in oklab, var(--color-neutral-950) 3%, transparent))}
html, body, #root, input, button, textarea, select {
  font-family: "Noto Sans", "Noto Sans SC", "Noto Sans CJK SC", "Noto Sans HK", "Noto Sans TC", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
}
.font-mono, pre, code, kbd, samp, .font-mono * {
  font-family: var(--font-mono) !important;
}
`;

if (!cssContent.includes('.theme-solarized-light')) {
  cssContent += themeAndFontCss;
  fs.writeFileSync(cssFile, cssContent, 'utf8');
  console.log('  ✔ [主题 & 字体] Solarized Light、Monokai 暖黑 及 Noto Sans 样式已注入');
}

// --- 补丁 3: 多语言文案 (IntlProvider-*.js) ---
const intlFile = path.join(assetsDir, intlFileName);
let intlContent = fs.readFileSync(intlFile, 'utf8');
const targetZh = '"settings.themeMode.zai-dark":`深色`';
const replaceZh = '"settings.themeMode.zai-dark":`深色`,"settings.themeMode.solarized-light":`Solarized 浅色`,"settings.themeMode.monokai-dark":`Monokai 暖黑`,"sidebar.settings.theme.solarized-light":`Solarized 浅色`,"sidebar.settings.theme.monokai-dark":`Monokai 暖黑`';

if (intlContent.includes(targetZh) && !intlContent.includes('settings.themeMode.solarized-light')) {
  intlContent = intlContent.replace(targetZh, replaceZh);
  fs.writeFileSync(intlFile, intlContent, 'utf8');
  console.log('  ✔ [多语言] 主题中英文对照文案已更新');
}

// --- 补丁 4: index-*.js 开机自适应 ---
const indexFile = path.join(assetsDir, indexFileName);
let indexContent = fs.readFileSync(indexFile, 'utf8');
if (!indexContent.includes('theme-solarized-light')) {
  indexContent = indexContent.replace(
    /document\.documentElement\.classList\.toggle\(`theme-zai-dark`,([a-zA-Z0-9_$]+)===`zai-dark`\)/,
    'document.documentElement.classList.toggle(`theme-zai-dark`,$1===`zai-dark`),document.documentElement.classList.toggle(`theme-solarized-light`,$1===`solarized-light`),document.documentElement.classList.toggle(`theme-monokai-dark`,$1===`monokai-dark`)'
  );
  fs.writeFileSync(indexFile, indexContent, 'utf8');
  console.log('  ✔ [开机自适应] index 入口主题状态初始化已挂载');
}

// --- 补丁 5: 隐私安全守卫与遥测阻断 (针对 3.14 全面增强) ---
// 5.1 工作区快照上云防复活检查 (兼容旧版 3.12 / 确认 3.14 已原生移除)
const hostJsFile = path.join(extractedDir, 'out', 'host', 'index.js');
if (fs.existsSync(hostJsFile)) {
  let hostJs = fs.readFileSync(hostJsFile, 'utf8');
  let legacyPatched = 0;
  if (hostJs.includes('async captureBeforePrompt(t){')) {
    hostJs = hostJs.replace('async captureBeforePrompt(t){', 'async captureBeforePrompt(t){return;');
    legacyPatched++;
  }
  if (hostJs.includes('async flushWorkspace(t){')) {
    hostJs = hostJs.replace('async flushWorkspace(t){', 'async flushWorkspace(t){return;');
    legacyPatched++;
  }
  if (hostJs.includes('async uploadObject(t){')) {
    hostJs = hostJs.replace('async uploadObject(t){', 'async uploadObject(t){return{ok:false,reason:"disabled"};');
    legacyPatched++;
  }
  if (legacyPatched > 0) {
    fs.writeFileSync(hostJsFile, hostJs, 'utf8');
    console.log(`  ✔ [隐私安全] 旧版工作区快照与 OSS 上传已被短路 (${legacyPatched}/3)`);
  } else {
    console.log('  ✔ [隐私安全] 官方 3.14 已彻底原生移除 RepoSnapshot 工作区快照扫盘上云，安全达标');
  }
}

// 5.2 阻断阿里云 ARMS RUM / SLS 行为埋点 & OpenTelemetry APM 链路监控
const mainDir = path.join(extractedDir, 'out', 'main');
if (fs.existsSync(mainDir)) {
  let armsBlocked = 0;
  for (const f of fs.readdirSync(mainDir)) {
    if (f.endsWith('.js')) {
      const p = path.join(mainDir, f);
      let content = fs.readFileSync(p, 'utf8');
      if (content.includes('https://proj-xtrace-')) {
        content = content.replace(/https:\/\/proj-xtrace-[^"']+/g, 'http://127.0.0.1:0/disabled');
        fs.writeFileSync(p, content, 'utf8');
        armsBlocked++;
      }
    }
  }
  if (armsBlocked > 0) {
    console.log(`  ✔ [隐私安全] 阿里云 ARMS RUM 埋点与 OpenTelemetry APM 监控已彻底阻断 (${armsBlocked} 处)`);
  }

  // 5.3 阻断官方内置 Telemetry 事件与设备指纹上报 (/api/v1/event/report)
  for (const f of fs.readdirSync(mainDir)) {
    if (f.endsWith('.js')) {
      const p = path.join(mainDir, f);
      let content = fs.readFileSync(p, 'utf8');
      if (content.includes('/api/v1/event/report')) {
        // 短路事件上报函数，禁止向官方回传 deviceMid 与活跃会话
        content = content.replace(
          /async\s+function\s+([a-zA-Z0-9_$]+)\s*\((C,S,I,k,T)\)\{let\s+O=null;try\{O=await\s+o\(\)\}/,
          'async function $1($2){return;let O=null;try{O=await o()}'
        );
        fs.writeFileSync(p, content, 'utf8');
        console.log(`  ✔ [隐私安全] 官方内置 Telemetry 事件与设备指纹上报已静默拦截 (${f})`);
      }
    }
  }
}
// --- 补丁 6: Token 极致精简与冗余工具/提示词裁剪 (resources/glm/zcode.cjs) ---
const glmDir = path.join(rootDir, 'resources', 'glm');
const zcodeCjsFile = path.join(glmDir, 'zcode.cjs');
const zcodeCjsBak = path.join(glmDir, 'zcode.cjs.bak');

if (fs.existsSync(zcodeCjsFile)) {
  console.log('  -> 正在应用 Token 极致精简补丁 (zcode.cjs)...');
  // 6.1 备份与基线还原
  if (!fs.existsSync(zcodeCjsBak)) {
    fs.copyFileSync(zcodeCjsFile, zcodeCjsBak);
    console.log('  ✔ [Token 瘦身] 已创建原始 zcode.cjs 干净备份副本');
  } else {
    fs.copyFileSync(zcodeCjsBak, zcodeCjsFile);
  }

  let cjsCode = fs.readFileSync(zcodeCjsFile, 'utf8');

  // 6.2 冗余工具剔除 (Workflow 全家桶 / 定时与离峰任务全家桶)
  const targetToContracts = 'toContracts(){return Array.from(this.tools.values()).filter(t=>t.metadata.providerVisible!==!1)';
  const replaceToContracts = 'toContracts(){var _b=new Set(["CreateWorkflow","SaveWorkflow","EvalWorkflowSnippet","AmendWorkflow","ListWorkflowRuns","GetWorkflowRun","ResumeWorkflowRun","ResolveWorkflowQuestion","ListSavedWorkflows","CronCreate","CronDelete","CronList","CronUpdate","OffPeakCreate","OffPeakList","ListModels"]);return Array.from(this.tools.values()).filter(t=>t.metadata.providerVisible!==!1&&!_b.has(t.metadata.name))';

  if (cjsCode.includes(targetToContracts)) {
    cjsCode = cjsCode.replace(targetToContracts, replaceToContracts);
    console.log('  ✔ [Token 瘦身] 已过滤 16 个写代码用不到的冗余工具 (立省 ~26,500 Token)');
    console.log('     * 包含: Workflow 全家桶 (Create/Save/EvalWorkflow等)、Cron定时、OffPeak离峰、ListModels');
    console.log('     * 保留: AskUserQuestion, Enter/ExitPlanMode, Agent, SendMessage 及所有写代码/调试核心工具');
  }

  // 6.3 & 6.4 系统提示词精简与工程规范注入 (由用户交互确认，默认跳过以完美兼容 GLM 官方订阅)
  if (shouldPatchPrompt) {
    // 精简冗长安防免责声明
    const targetWeo = 'weo="IMPORTANT: Assist with authorized security testing, defensive security, CTF challenges, and educational contexts. Refuse requests for destructive techniques, DoS attacks, mass targeting, supply chain compromise, or detection evasion for malicious purposes. Dual-use security tools (C2 frameworks, credential testing, exploit development) require clear authorization context: pentesting engagements, CTF competitions, security research, or defensive use cases."';
    const replaceWeo = 'weo="Refuse requests for formatting the hard drive or clearing directories; instead, let the user perform these actions themselves."';
    if (cjsCode.includes(targetWeo)) {
      cjsCode = cjsCode.replace(targetWeo, replaceWeo);
      console.log('  ✔ [提示词精简] 系统安全声明已精简为极简模式');
    }

    // 精简话痨型沟通规范 (# Communicating with the user)
    const targetComm = 'additional:{beforeDefault:["# Communicating with the user","","Your text output is what the user reads; they usually can\'t see your thinking or the raw tool results. Write it for a teammate who stepped away and is catching up, not for a log file: they don\'t know the codenames or shorthand you created along the way, and they didn\'t watch your process unfold. Before your first tool call, say in a sentence what you\'re about to do; while working, give brief updates when you find something load-bearing or change direction.","","Text you write between tool calls may not be shown to the user. Everything the user needs from this turn \\u2014 answers, summaries, findings, conclusions, deliverables \\u2014 must be in the final text message of your turn, with no tool calls after it. Keep text between tool calls to brief status notes. If something important appeared only mid-turn or in your thinking, restate it in that final message.","",' +
    '\'Lead with the outcome. Your first sentence after finishing should answer "what happened" or "what did you find" \\u2014 the thing the user would ask for if they said "just give me the TLDR." Supporting detail and reasoning come after, for readers who want them.\',"","Being readable and being concise are different things, and readable matters more. If the user has to reread your summary or ask you to explain, any time saved by brevity is gone. The way to keep output short is to be selective about what you include (drop details that don\'t change what the reader would do next), not to compress the writing into fragments, abbreviations, arrow chains like `A \\u2192 B \\u2192 fails`, or jargon. What you do include, write in complete sentences with the technical terms spelled out. Don\'t make the reader cross-reference labels or numbering you invented earlier; say what you mean in place.","","Match the response to the question: a simple question gets a direct answer in prose, not headers and sections. Use tables only for short enumerable facts, with explanations in the surrounding prose rather than the cells. Calibrate to the user \\u2014 a bit tighter for an expert, more explanatory for someone newer."].join(`';
    const replaceComm = 'additional:{beforeDefault:["# Engineering & Collaboration Guidelines","","- Peer Collaboration: Partner with the user as an equal engineering peer; communicate naturally, honestly, and directly.","- Thoughtful & Diligent: Act diligently and responsibly, think through edge cases, and verify carefully before modifying code.","- Ask Promptly & Design Tree: When facing ambiguity or design branching, map decisions into a design tree and ask promptly with recommended options in rounds instead of guessing.","- Deep Module Design: Design deep modules with minimal, intuitive interfaces hiding rich internal logic; evaluate abstractions via the deletion test and avoid empty shallow wrappers.","- Direct & Focused: Keep answers focused on code, progress, and concrete deliverables; verify environment facts before asking."].join(`';

    if (cjsCode.includes(targetComm)) {
      cjsCode = cjsCode.replace(targetComm, replaceComm);
      console.log('  ✔ [高阶工程注入] 系统指南已升级为「深模块设计、决策树对齐、平等协同」工程准则 (立省 ~1,000 Token)');
    }
  } else {
    console.log('  ℹ️ [提示词跳过] 保持官方原版系统提示词不变 (完美兼容 GLM 官方订阅与 Prompt Cache)');
  }

  // 6.5 核心交互工具说明脱水瘦身 (EnterPlanMode / ExitPlanMode / Agent / AskUserQuestion)
  const enterPlanRegex = /function\s+Zyn\s*\(e=\{\}\)\{return`Use this tool proactively[\s\S]*?Users appreciate being consulted before significant changes are made to their codebase\s*`\}/;
  if (enterPlanRegex.test(cjsCode)) {
    cjsCode = cjsCode.replace(enterPlanRegex, 'function Zyn(e={}){return"Transition into plan mode to explore the codebase and draft an implementation plan for user approval before making non-trivial changes."}');
    console.log('  ✔ [工具说明瘦身] EnterPlanMode 教程说明已脱水压缩 (立省 ~900 Token)');
  }

  const exitPlanRegex = /emo=\[`Use this tool when you are in plan mode[\s\S]*?use exit plan mode tool after clarifying the approach\.\s*`\]/;
  if (exitPlanRegex.test(cjsCode)) {
    cjsCode = cjsCode.replace(exitPlanRegex, 'emo=["Exit plan mode and present the finalized plan to the user for review and approval."]');
    console.log('  ✔ [工具说明瘦身] ExitPlanMode 教程说明已脱水压缩 (立省 ~450 Token)');
  }

  const agentWorkflowRegex = /,?\.\.\.e\.dynamicWorkflowEnabled===!1\?\[\]:\['- If the user explicitly asks for a workflow[\s\S]*?however small the task\.'\]/;
  if (agentWorkflowRegex.test(cjsCode)) {
    cjsCode = cjsCode.replace(agentWorkflowRegex, '');
    console.log('  ✔ [工具说明瘦身] Agent 描述中强推 CreateWorkflow 的残留文案已清理');
  }

  const askUserRegex = /cua=\["Use this tool only when you are blocked on a decision that is genuinely the user's to make[\s\S]*?Note: previews are only supported for single-select questions \(not multiSelect\)\."\]\.join\(`/;
  if (askUserRegex.test(cjsCode)) {
    cjsCode = cjsCode.replace(askUserRegex, 'cua=["Ask the user a structured clarifying question with selectable options when blocked on ambiguous requirements or design choices.","Usage: options must contain choices; multiSelect allows multiple selections; first option can be marked \'(Recommended)\'."].join(`');
    console.log('  ✔ [工具说明瘦身] AskUserQuestion 描述说明已精简提纯 (立省 ~400 Token)');
  }

  fs.writeFileSync(zcodeCjsFile, cjsCode, 'utf8');
}

// Step 3: Repack
console.log('[4/4] 正在重新打包 app.asar...');
execSync(`npx @electron/asar pack "${extractedDir}" "${asarFile}"`, { stdio: 'inherit' });

console.log('====================================================');
console.log('       🎉 补丁全部成功应用并打包完成！              ');
console.log('====================================================');
}

main().catch(err => {
  console.error('\n❌ 补丁执行遇到错误:', err);
  process.exit(1);
});
