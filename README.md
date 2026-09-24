# ZCODE-PLUS (v3.14)
A Hacker's Patchkit for ZCode Desktop Client.

```
========================================================================
  Cut the bloat. Track real TTFT. Reclaim your screen and privacy.
========================================================================
```

## [0] 为什么做这个？(WHY)

官方 ZCode 挺好用，但底包太重了：
1. **一句话没说，初始握手就吞掉 36,000+ Tokens**（大量平时用不到的工具与 SDK 文档塞在请求里）。
2. **首字时延（TTFT）看不见**，只有粗粒度的总耗时。
3. **界面纯黑死黑刺眼**，中文字体发虚。
4. **后台塞了 ARMS、OpenTelemetry 和设备指纹上报**。

ZCode-Plus 是一个本地注入补丁。不重装、不联网、直接给本地客户端瘦身。


## [1] 做了什么？(WHAT IT DOES)

### 1. ⚡ Token 大瘦身：36K -> 7K (-78%) [重点]

#### 痛点排查：
翻看 `~/.zcode/cli/rollout/model-io-*.jsonl` 真实请求日志发现：官方客户端默认挂了 **32 个底层工具**，占了 **34,100+ Tokens**（整整 94.4% 的初始上下文）：
* 光 `CreateWorkflow` 和 `SaveWorkflow` 这两个写代码根本用不上的工具，描述里就硬塞了一整套 2 万字符的 TypeScript SDK 手册（独占 **~23,000 Tokens**）。
* 后台定时任务（Cron）和离峰任务（Off-Peak）又占了 **~3,500 Tokens**。

#### 瘦身手术：
* **过滤 16 个冗余工具**：彻底剥离 Workflow 全家桶、Cron 全家桶、Off-Peak 与模型列表查询。
* **核心工具描述脱水**：压缩 `EnterPlanMode`、`ExitPlanMode`、`AskUserQuestion` 的冗长说明；清理 `Agent` 工具中强推 CreateWorkflow 的残留文案。
* **完整保留编码与交互核心**：`Bash`、`Read`、`Write`、`Edit`、`Agent`、`SendMessage`、`AskUserQuestion`、`PlanMode`、`Skill` 全家桶 100% 完好。
* **实测战果**：初始会话从 **36,000+** 骤降至 **约 7,000 ~ 8,000 Tokens**（**暴降 78%**，单次立省 2.8 万 Tokens！）。首字响应（TTFT）大幅加快，API 账单大幅缩减。

### 2. ⚡ 真实 TTFT 与推理速度监控
在每条回复底部常驻单行微小指标条（Serif 字体，紧凑不遮挡）：
`⚡ TTFT: 1.15s · 68.5 t/s · 1240 tok (思考 1180 + 回复 60) · 18.2s`
* 测量真正的首字时延（TTFT）与纯生成吞吐速度（t/s）。
* 多步 Agent 流程下分步独立追踪，严格扣除网络等待与本地工具磁盘 I/O 耗时。

### 3. 🎨 经典配色 + 思源黑体
告别死黑，在「设置 -> 外观」自由选：
* **Monokai 暖黑**：经典橄榄深灰底（#272822），久看不累。
* **Solarized 浅色**：温润 Base3 暖米黄底（#fdf6e3），柔和如纸。
* 界面字体优先使用 `Noto Sans` 思源黑体，代码块保留原生等宽编程字体。

### 4. 🛡️ 砍掉隐私遥测
* 阻断阿里云 ARMS RUM 用户行为埋点。
* 熔断 OpenTelemetry APM 链路监控。
* 拦截官方 `/api/v1/event/report` 设备指纹（deviceMid）上报。
* 人机滑块验证（Captcha）正常放行，风控登录不影响。


## [2] 快速开始 (HOW TO USE)

**环境要求**：Windows x64 + Node.js (v18+)

1. **完全退出 ZCode 客户端**。
2. 双击运行 `apply_patch.bat`（或在当前目录跑 `node auto_patch.js`）。
3. 提示完成后，启动 ZCode 即可。

### ❓ 打补丁时的 [y/N] 提示词选项怎么选？
脚本启动时会弹出一行交互询问：
* **GLM 官方订阅用户**：直接按回车（选 **N**）。
  官方模型（GLM-4 / GLM-Zero）对原版提示词有特定格式对齐和 Prompt Cache 缓存机制，保持原版最稳定；16 个冗余工具依然会自动过滤，稳省 2.6W+ Tokens。
* **第三方模型 / 自定义 API 用户 (Claude/DeepSeek/GPT等)**：输入 **Y**。
  精简安防长文与话痨写作规范，并注入「深模块设计、决策树对齐」高阶工程准则（[docs/engineering-standards.md](docs/engineering-standards.md)），再省 ~1,500 Tokens。


## [3] 卸载 / 还原 (UNINSTALL)

任何时候想回到官方纯净版：
* 双击运行 `restore_backup.bat`，即可秒级还原所有文件。


## [4] 目录结构 (FILES)

```text
zcode-plus/
├── auto_patch.js       # 核心一键主补丁
├── apply_patch.bat     # Windows 双击运行入口
├── restore_backup.bat  # 官方备份一键还原
├── docs/               # 高阶工程与架构规范
└── README.md           # 本文件
```

```
========================================================================
  EOF. Keep it simple, hack on.
========================================================================
```
