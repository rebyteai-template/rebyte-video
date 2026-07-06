# marketing

Rebyte 的营销工具集 monorepo。装着我们对外触达用户的所有自建系统：CRM/messaging server、Remotion 视频制作、营销图、公众号文章草稿。

仓库前身叫 `rebyte-video`，最早只放 Remotion 工程；后来 CRM、SMS、Clerk 同步、营销图都加进来了，于是改名 `marketing` 反映现状。

## 目录结构

```
marketing/
├── crm/                  # 自建 CRM + messaging server（Next.js）
├── src/                  # 顶层 Remotion 工程（RebyteIntro + Thumbnail）
├── my-remotion-demo/     # 多 composition Remotion 工程（含 explainer / browser-demo / 日文版）
├── scripts/              # 顶层 Remotion 用的口播文案
├── public/               # 顶层 Remotion 用的音频/图片
├── marketing-diagrams/   # 营销图 web app（Vite + React）
├── wechat/               # 公众号文章草稿
└── users_dump.csv        # 用户导出（导入 SMS group 时用）
```

## crm/ — CRM + messaging server

**别被名字误导**——目录原来叫 `emails/`，实际是个完整的多通道 CRM/营销发送系统：

- **数据层**：本地 SQLite（libsql），两张表 `groups` / `members`，支持 email + sms 两种 channel
- **静态 group**：手动加成员 / CSV 批量导入
- **动态 group**：从 Clerk 同步，预设 filter（如"近 7 天注册"、"近 30 天注册"），可手动重新 sync
- **Campaign**：每个 campaign 一个目录，模板用 React Email 写
  - email：`welcome` / `onboarding` / `reengagement` / `product-update-2026-03-{08,18,24,29}`
  - sms：在 `campaigns/index.ts` 注册（发送通道目前 stub）
- **Console UI**：`/`，左边栏选 campaign 或 group，右边 Preview / Send tab，Send 必须先 Dry Run 看清单
- **发送**：email 走 Postmark；SMS 占位待接

跑起来（本地）：

```bash
cd crm
pnpm install
pnpm dev      # http://localhost:10000
pnpm send --campaign recent-signup-feedback --to cj@rebyte.ai --name CJ --dry-run
pnpm send --campaign recent-signup-feedback --to cj@rebyte.ai --name CJ
```

**线上跑在 mini 上（tailnet only）**：

- URL: `https://homos-mac-mini.tigris-bigeye.ts.net:8443`
- 路径：`~/src/cc/marketing/crm` on `homos-mac-mini`
- launchd label：`rebyte.marketing.crm`，`KeepAlive=true`（重启自动起）
- 部署套路见 shared-memories `skills/add-growth-tool`，redeploy 走 `git pull && pnpm build && launchctl kickstart -k gui/$(id -u homo)/rebyte.marketing.crm`

**Cloudflare 版（生产）**：同一份代码也跑在 Cloudflare Workers + D1 上，公网域名 `https://crm.impo.ai`（Cloudflare Access 限 `@rebyte.ai` 邮箱登录）。改完代码（比如新增 campaign）后一键 redeploy：

```bash
cd crm && ./deploy.sh
```

`deploy.sh` 只构建 + 部署当前工作区代码（worker `rebyte-emails`），不动 D1 数据 / secrets / Access 配置；需要 `~/cloudflare.env`。详见 memory `crm-cloudflare-deploy`。

Postmark token 状态见 [crm/POSTMARK.md](crm/POSTMARK.md)。不要再以 `CLAUDE.md` 里的历史 key 为准。

## Remotion 视频（顶层 + my-remotion-demo/）

营销视频用 Remotion 写，每个视频是一个 composition。

- **顶层 `src/`** — 早期工程，只有 `RebyteIntro` + `Thumbnail`
- **`my-remotion-demo/`** — 后来扩出来的，多 composition：`RebyteIntro` / `RebyteIntroJa` / `RebyteExplainer` / `RebyteExplainerJa` / `BrowserAutomation` / `Thumbnail` / `ThumbnailJa`

> 两份 Remotion 工程目前并存，新内容请放 `my-remotion-demo/`。顶层的留着是因为 `out/intro.mp4` build 路径有 npm script 在外面引用（确认前先别删）。

跑起来：

```bash
# 顶层
pnpm install
pnpm start                                  # remotion studio
pnpm build                                  # 渲染 RebyteIntro → out/intro.mp4

# my-remotion-demo
cd my-remotion-demo && pnpm install && pnpm start
```

配音脚本走 OpenAI TTS 或 ElevenLabs，详见 `CLAUDE.md`。

## marketing-diagrams/

营销图（产品架构图、对比图、流程图）用的 Vite + React app。生成 SVG 或导出 PNG 放进文章/视频。`README.md` 还是 Vite scaffold 默认的——后续要替换。

```bash
cd marketing-diagrams && pnpm install && pnpm dev
```

## wechat/

公众号文章草稿池。最终发布走 `rebyteai-template/content-ops` 那边的流程；这里只是临时草稿、灵感、改稿用。

## 注意事项

- **`users_dump.csv`** 在仓库根目录，1.2 MB，含真实用户邮箱/手机号。**这是私仓，但任何 fork / clone 都会带走它**——慎重。
- **`data.db`** 已 gitignore，每台机本地状态独立。如果要共享 group 配置，得从 Clerk dynamic preset 重 sync，不要靠拷 db。
- **Postmark token** 状态见 [crm/POSTMARK.md](crm/POSTMARK.md)。不要提交新的明文 token；本地发送优先用 `crm/.env.local`。
