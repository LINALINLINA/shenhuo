# 神火（Shenhuo）

基于 **Vite + TypeScript** 的多页面静态站点，展示角色、故事、世界地图等内容。源码位于 `shenhuo/` 目录。

## 在线预览

推送 `main` 分支且开启 GitHub Pages 后，站点地址一般为：

<https://linalinlina.github.io/shenhuo/>

（若仓库名或用户名不同，请按实际 GitHub Pages 地址访问。）

## 本地开发

**环境要求：** Node.js **18+**（推荐与 CI 一致使用 **24**）

```bash
cd shenhuo
npm install
npm run dev
```

浏览器打开终端里提示的本地地址即可。

> 若你本地使用 pnpm：`pnpm install` 与 `pnpm dev` 亦可；CI 当前以 `npm ci` + `package-lock.json` 为准。

## 构建与本地预览产物

```bash
cd shenhuo
npm run build
npm run preview
```

构建输出目录：`shenhuo/dist/`。

## GitHub Pages 部署

仓库已包含工作流：`.github/workflows/deploy.yml`。

1. 在 GitHub 打开本仓库 → **Settings** → **Pages**
2. **Build and deployment** 的 **Source** 选择 **GitHub Actions**
3. 向 `main` 分支推送代码，在 **Actions** 中查看 **Deploy to GitHub Pages** 是否成功

工作流会在 `shenhuo/` 下执行 `npm ci` 与 `npm run build`，并将 `shenhuo/dist` 发布为 Pages 站点。

### 关于 `base` 路径

`vite.config.ts` 中配置了 `base: '/shenhuo/'`，与「用户名.github.io/**仓库名**」形式的 GitHub Pages 子路径一致。若你改为自定义域名或根站点部署，需同步修改 `base`。

## 目录结构（简要）

```text
.
├── .github/workflows/deploy.yml   # Pages 自动发布
├── shenhuo/
│   ├── src/                       # 页面逻辑、数据、样式
│   ├── *.html                     # 多页面入口
│   ├── vite.config.ts
│   ├── package.json
│   └── dist/                      # 构建产物（勿手改，以构建为准）
└── README.md
```

## 相关文档

设计与迭代说明见 `shenhuo/docs/superpowers/` 下的计划与规格文档。

## 仓库

<https://github.com/LINALINLINA/shenhuo>
