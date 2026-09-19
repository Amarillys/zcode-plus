const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('temp/extracted-asar/out/renderer/assets');

// 1. Update styles-BxjiRXBw.css
const cssFile = path.join(baseDir, 'styles-BxjiRXBw.css');
let cssContent = fs.readFileSync(cssFile, 'utf8');

const solarizedCss = `
.theme-solarized-light{--animated-gradient-text-strong:#073642;--animated-gradient-text-soft:#07364238;--color-background:#fdf6e3;--color-background-win-alt:#eee8d5;--color-background-alt:oklab(96.5% -0.01 0.03/.7);--color-brand:#268bd2;--color-accent:#268bd21a;--color-find-highlight:#fff4eb;--color-find-highlight-active:#ffb26b;--color-border:#657b8326;--color-border-hover:#657b8340;--color-hover:#657b830f;--color-selected:#657b831a;--color-header:#eee8d5;--color-panel:#eee8d5;--color-sidebar:#f5eed9;--color-surface:#657b830d;--color-surface-hover:#657b831a;--color-card:#fdf6e3;--color-card-selected:var(--color-input);--color-card-border:var(--color-border);--color-popover:#fdf6e3;--color-popover-foreground:var(--color-foreground);--color-popover-header:#eee8d5;--color-popover-border:var(--color-border);--color-input:#fffbf0;--color-input-focused:var(--color-input);--color-input-border:var(--color-border);--color-input-border-hover:var(--color-border-hover);--color-input-border-focused:var(--color-border-hover);--color-foreground:#657b83;--color-foreground-subtle:#839496;--color-foreground-subtlest:#93a1a1;--color-terminal-bg:#fdf6e3;--color-terminal-fg:#657b83;--color-terminal-cursor:#657b83;--color-terminal-cursor-accent:#fdf6e3;--color-terminal-selection:#268bd238;--color-terminal-selection-inactive:#657b831a;--color-terminal-black:#073642;--color-terminal-red:#dc322f;--color-terminal-green:#859900;--color-terminal-yellow:#b58900;--color-terminal-blue:#268bd2;--color-terminal-magenta:#d33682;--color-terminal-cyan:#2aa198;--color-terminal-white:#eee8d5;--color-terminal-bright-black:#586e75;--color-terminal-bright-red:#cb4b16;--color-terminal-bright-green:#859900;--color-terminal-bright-yellow:#b58900;--color-terminal-bright-blue:#268bd2;--color-terminal-bright-magenta:#6c71c4;--color-terminal-bright-cyan:#2aa198;--color-terminal-bright-white:#fdf6e3;--color-usage-chart-1:#268bd2;--color-usage-chart-2:#859900;--color-usage-chart-3:#6c71c4;--color-usage-chart-4:#dc322f;--color-usage-chart-5:#b58900;--color-usage-chart-6:#2aa198;--color-context-breakdown-1:#268bd2;--color-context-breakdown-2:#3f9be0;--color-context-breakdown-3:#5faeec;--color-context-breakdown-4:#80c0f5;--color-context-breakdown-5:#a4d2fb;--color-context-breakdown-6:#c8e4fd;--color-context-breakdown-7:#e2f1fe;--color-usage-heatmap-0:color-mix(in oklab, #268bd2 0%, color-mix(in oklab, var(--color-neutral-950) 3%, transparent))}
`;

const monokaiCss = `
.theme-monokai-dark{--animated-gradient-text-strong:#f8f8f2;--animated-gradient-text-soft:#f8f8f238;--color-background:#272822;--color-background-win-alt:#1e1f1c;--color-background-alt:oklab(26% -0.01 0.02/.6);--color-brand:#a6e22e;--color-accent:#f9267226;--color-find-highlight:#6e4400;--color-find-highlight-active:#fd971f;--color-border:#49483e80;--color-border-hover:#75715e80;--color-hover:#ffffff0d;--color-selected:#49483ecc;--color-header:#1e1f1c;--color-panel:#1e1f1c;--color-sidebar:#1e1f1c;--color-surface:#ffffff0a;--color-surface-hover:#ffffff14;--color-card:#34352f;--color-card-selected:var(--color-input);--color-card-border:var(--color-border);--color-popover:#272822;--color-popover-foreground:var(--color-foreground);--color-popover-header:#1e1f1c;--color-popover-border:var(--color-border);--color-input:#3e3d32;--color-input-focused:var(--color-input);--color-input-border:var(--color-border);--color-input-border-hover:var(--color-border-hover);--color-input-border-focused:var(--color-border-hover);--color-foreground:#f8f8f2;--color-foreground-subtle:#a6a69c;--color-foreground-subtlest:#75715e;--color-terminal-bg:#272822;--color-terminal-fg:#f8f8f2;--color-terminal-cursor:#f8f8f0;--color-terminal-cursor-accent:#272822;--color-terminal-selection:#49483e;--color-terminal-selection-inactive:#3e3d32;--color-terminal-black:#272822;--color-terminal-red:#f92672;--color-terminal-green:#a6e22e;--color-terminal-yellow:#e6db74;--color-terminal-blue:#66d9ef;--color-terminal-magenta:#ae81ff;--color-terminal-cyan:#a1efe4;--color-terminal-white:#f8f8f2;--color-terminal-bright-black:#75715e;--color-terminal-bright-red:#f92672;--color-terminal-bright-green:#a6e22e;--color-terminal-bright-yellow:#e6db74;--color-terminal-bright-blue:#66d9ef;--color-terminal-bright-magenta:#ae81ff;--color-terminal-bright-cyan:#a1efe4;--color-terminal-bright-white:#f8f8f2;--color-usage-chart-1:#a6e22e;--color-usage-chart-2:#66d9ef;--color-usage-chart-3:#ae81ff;--color-usage-chart-4:#f92672;--color-usage-chart-5:#fd971f;--color-usage-chart-6:#e6db74;--color-context-breakdown-1:#a6e22e;--color-context-breakdown-2:#b8ea52;--color-context-breakdown-3:#c8f072;--color-context-breakdown-4:#d8f592;--color-context-breakdown-5:#e4f9b0;--color-context-breakdown-6:#f0fccd;--color-context-breakdown-7:#f8fee6;--color-usage-heatmap-0:color-mix(in oklab, #a6e22e 0%, color-mix(in oklab, var(--color-neutral-950) 3%, transparent))}
`;

if (!cssContent.includes('.theme-solarized-light')) {
  cssContent += solarizedCss + monokaiCss;
  fs.writeFileSync(cssFile, cssContent, 'utf8');
  console.log('1. Appended themes to styles-BxjiRXBw.css');
} else {
  console.log('1. CSS already contains theme-solarized-light');
}

// 2. Update IntlProvider-DHlVozww.js
const intlFile = path.join(baseDir, 'IntlProvider-DHlVozww.js');
let intlContent = fs.readFileSync(intlFile, 'utf8');

const targetZh = '"settings.themeMode.zai-dark":`深色`';
const replaceZh = '"settings.themeMode.zai-dark":`深色`,"settings.themeMode.solarized-light":`Solarized 浅色`,"settings.themeMode.monokai-dark":`Monokai 暖黑`,"sidebar.settings.theme.solarized-light":`Solarized 浅色`,"sidebar.settings.theme.monokai-dark":`Monokai 暖黑`';

if (intlContent.includes(targetZh) && !intlContent.includes('settings.themeMode.solarized-light')) {
  intlContent = intlContent.replace(targetZh, replaceZh);
  fs.writeFileSync(intlFile, intlContent, 'utf8');
  console.log('2. Added theme translations to IntlProvider-DHlVozww.js');
} else {
  console.log('2. IntlProvider already patched or target not found');
}

// 3. Update catalogTree-D8IT4Q46.js
const catalogFile = path.join(baseDir, 'catalogTree-D8IT4Q46.js');
let catalogContent = fs.readFileSync(catalogFile, 'utf8');

const targetTn = 'function Tn(e){return e===`system`?wn():e===`dark`||e===`zai-dark`?`dark`:`light`}';
const replaceTn = 'function Tn(e){return e===`system`?wn():e===`dark`||e===`zai-dark`||e===`monokai-dark`?`dark`:`light`}';

const targetKn = 'document.documentElement.classList.toggle(`theme-zai-dark`,n===`zai-dark`),On(t)}';
const replaceKn = 'document.documentElement.classList.toggle(`theme-zai-dark`,n===`zai-dark`),document.documentElement.classList.toggle(`theme-solarized-light`,n===`solarized-light`),document.documentElement.classList.toggle(`theme-monokai-dark`,n===`monokai-dark`),On(t)}';

if (catalogContent.includes(targetTn)) {
  catalogContent = catalogContent.replace(targetTn, replaceTn);
}
if (catalogContent.includes(targetKn)) {
  catalogContent = catalogContent.replace(targetKn, replaceKn);
}
fs.writeFileSync(catalogFile, catalogContent, 'utf8');
console.log('3. Updated catalogTree-D8IT4Q46.js');

// 4. Update index-Ds4WtEHd.js
const indexFile = path.join(baseDir, 'index-Ds4WtEHd.js');
let indexContent = fs.readFileSync(indexFile, 'utf8');

const targetInit = 'document.documentElement.classList.toggle(`theme-zai-dark`,n===`zai-dark`)}';
const replaceInit = 'document.documentElement.classList.toggle(`theme-zai-dark`,n===`zai-dark`),document.documentElement.classList.toggle(`theme-solarized-light`,n===`solarized-light`),document.documentElement.classList.toggle(`theme-monokai-dark`,n===`monokai-dark`)}';

if (indexContent.includes(targetInit) && !indexContent.includes('theme-solarized-light')) {
  indexContent = indexContent.replace(targetInit, replaceInit);
  fs.writeFileSync(indexFile, indexContent, 'utf8');
  console.log('4. Updated index-Ds4WtEHd.js');
} else {
  console.log('4. index-Ds4WtEHd.js already patched or target not found');
}

// 5. Update styles-DIQgZMVI.js
const stylesFile = path.join(baseDir, 'styles-DIQgZMVI.js');
let stylesContent = fs.readFileSync(stylesFile, 'utf8');

const targetHzt = 'var Hzt=[{mode:`system`,icon:dc},{mode:`zai-dark`,icon:fc},{mode:`zai-light`,icon:Gc}]';
const replaceHzt = 'var Hzt=[{mode:`system`,icon:dc},{mode:`zai-dark`,icon:fc},{mode:`zai-light`,icon:Gc},{mode:`monokai-dark`,icon:fc},{mode:`solarized-light`,icon:Gc}]';

const target$ft = 'var $ft=[`system`,`zai-dark`,`zai-light`]';
const replace$ft = 'var $ft=[`system`,`zai-dark`,`zai-light`,`monokai-dark`,`solarized-light`]';

const targetDropdown = '(0,$.jsx)(Pe,{value:`zai-light`,children:_.formatMessage({id:`sidebar.settings.theme.zai-light`})})]})';
const replaceDropdown = '(0,$.jsx)(Pe,{value:`zai-light`,children:_.formatMessage({id:`sidebar.settings.theme.zai-light`})}),(0,$.jsx)(Pe,{value:`monokai-dark`,children:_.formatMessage({id:`sidebar.settings.theme.monokai-dark`})}),(0,$.jsx)(Pe,{value:`solarized-light`,children:_.formatMessage({id:`sidebar.settings.theme.solarized-light`})})]})';

if (stylesContent.includes(targetHzt)) {
  stylesContent = stylesContent.replace(targetHzt, replaceHzt);
}
if (stylesContent.includes(target$ft)) {
  stylesContent = stylesContent.replace(target$ft, replace$ft);
}
if (stylesContent.includes(targetDropdown)) {
  stylesContent = stylesContent.replaceAll(targetDropdown, replaceDropdown);
}

fs.writeFileSync(stylesFile, stylesContent, 'utf8');
console.log('5. Updated styles-DIQgZMVI.js');
