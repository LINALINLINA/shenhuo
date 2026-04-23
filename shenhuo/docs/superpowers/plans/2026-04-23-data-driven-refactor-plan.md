# 神话录数据驱动改进 实施计划

> **For agentic workers:** Use superpowers:subagent-driven-development to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将硬编码内容迁移到数据层，修复 12 个已知 bug，实现数据驱动的页面渲染。

**Architecture:** 保持 Vite MPA 架构。新建 `src/data/` 存放类型和数据。各页面 TS 文件增加渲染函数，从数据生成 DOM 注入 HTML 容器。URL 参数控制故事分类筛选。

**Tech Stack:** Vite 6, TypeScript, Vanilla DOM API

---

## File Map

### 新建文件

| 文件                     | 职责                             |
| ------------------------ | -------------------------------- |
| `src/data/types.ts`      | Story, Character, Place 接口定义 |
| `src/data/stories.ts`    | 5 条故事数据 + 查询函数          |
| `src/data/characters.ts` | 6 个人物数据 + 查询函数          |
| `src/data/places.ts`     | 11 个地标数据 + 查询函数         |

### 修改文件

| 文件                      | 改动                                             |
| ------------------------- | ------------------------------------------------ |
| `src/main.ts`             | 删除 `initFooterBrand()` 空函数                  |
| `src/pages/home.ts`       | 数据驱动渲染首页卡片                             |
| `src/pages/characters.ts` | 数据驱动渲染 + 精确筛选 + 动态详情               |
| `src/pages/stories.ts`    | 数据驱动渲染 + URL 参数 + 动态阅读 + 工具栏      |
| `src/pages/worldmap.ts`   | 数据驱动 tooltip + 移动端支持                    |
| `src/styles/global.css`   | 删除未使用 class、添加 `.footer__brand` 内联样式 |
| `index.html`              | 精简为容器，卡片区域改为空 `<div>`               |
| `characters.html`         | 精简为容器，人物网格改为空 `<div>`               |
| `stories.html`            | 精简为容器，故事列表和阅读区改为空 `<div>`       |
| `worldmap.html`           | 补 script 标签，Google Fonts 异步化              |

---

### Task 1: 创建数据层

**Files:**

- Create: `src/data/types.ts`
- Create: `src/data/stories.ts`
- Create: `src/data/characters.ts`
- Create: `src/data/places.ts`

- [ ] **Step 1: 创建类型定义** `src/data/types.ts`

```ts
export interface Story {
  id: string;
  title: string;
  summary: string;
  category: string;
  era: string;
  tags: string[];
  content?: string;
  discussion?: string[];
  readingTime: number;
  ageRange: string;
  gradient: string;
  order: number;
}

export interface Character {
  id: string;
  name: string;
  altName: string;
  title: string;
  desc: string;
  fullDesc?: string;
  era: string;
  tags: string[];
  relatedStories: string[];
  color: string;
  brushColor: string;
}

export interface Place {
  name: string;
  realm: "heaven" | "mortal" | "underworld" | "sea";
  pos: { left: string; top: string };
  desc: string;
}
```

- [ ] **Step 2: 创建故事数据** `src/data/stories.ts`

从现有 `index.html`（3 条）和 `stories.html`（5 条，含女娲补天正文）中提取。注意：

- 女娲补天有 `content` 字段（完整 7 段正文 HTML）和 `discussion` 字段
- 其他故事 `content` 为 `undefined`
- 分类包含：创世神话、英雄传说、民间故事、道教仙话、节日神话
- 女娲补天属于"创世神话"，哪吒闹海属于"封神演义"，夸父追日/精卫填海属于"英雄传说"，盘古开天属于"创世神话"
- 导出 `getFeaturedStories(): Story[]`（3 条精选）和 `getStoriesByCategory(cat: string): Story[]`

- [ ] **Step 3: 创建人物数据** `src/data/characters.ts`

从现有 `characters.html`（6 条）和 `index.html`（4 条精选）提取。注意：

- `era` 字段用筛选按钮文本精确匹配：上古大神(女娲/后羿)、封神演义(哪吒)、西游记(孙悟空)
- 嫦娥 era 设为"上古神话"（badge 原文已是"上古神话"）
- 盘古 era 设为"上古大神"
- 孙悟空 era 设为"西游记"
- 导出 `getAllCharacters(): Character[]` 和 `getCharacterById(id: string): Character | undefined`

- [ ] **Step 4: 创建地标数据** `src/data/places.ts`

从 `worldmap.html` 的 11 个 `.map-region` 提取 `name`、`realm`、CSS `pos`、`desc`。`desc` 使用 `worldmap.ts` 中已有的 `MAP_DATA` 对象。导出 `getAllPlaces(): Place[]`。

---

### Task 2: 快速修复与清理

**Files:**

- Modify: `src/main.ts:35-39` (删除 initFooterBrand)
- Modify: `src/styles/global.css` (删除死代码)
- Modify: `index.html:7-12` (Google Fonts)
- Modify: `characters.html:7-12`
- Modify: `stories.html:7-12`
- Modify: `worldmap.html:7-12,717-718` (补脚本)

- [ ] **Step 1: 清理 main.ts**

在 `src/main.ts` 中：

1. 删除 `initFooterBrand()` 函数定义（约第 35-39 行）
2. 删除 `DOMContentLoaded` 回调中的 `initFooterBrand()` 调用

- [ ] **Step 2: 清理 global.css 死代码**

在 `src/styles/global.css` 中删除以下未使用的 class（从约第 77 行开始）：

- `.seal` 和 `.seal::before`（约第 78-91 行）
- `.divider-brush` 及其伪元素（约第 93-102 行）
- `.cloud-decor` 及其伪元素（约第 104-111 行）
- `.card` 和 `.card:hover`（约第 113-120 行）
- `.ink-mountains`（约第 122-125 行）
- `.text-serif` 到 `.text-center` 共 6 个工具类（约第 77-82 行）

保留所有其他样式不变。

- [ ] **Step 3: Google Fonts 异步加载（4 个文件）**

每个 HTML 的 `<head>` 中，将 Google Fonts 的 `<link rel="stylesheet" href="..." rel="stylesheet" />` 替换为：

```html
<link
  rel="preload"
  href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600&family=Noto+Serif+SC:wght@400;600;700;900&family=Ma+Shan+Zheng&display=swap"
  as="style"
  onload="this.rel='stylesheet'"
/>
<noscript>
  <link
    href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600&family=Noto+Serif+SC:wght@400;600;700;900&family=Ma+Shan+Zheng&display=swap"
    rel="stylesheet"
  />
</noscript>
```

对 `index.html`、`characters.html`、`stories.html`、`worldmap.html` 都做此替换。

- [ ] **Step 4: 修复 worldmap.html 脚本缺失**

在 `worldmap.html` 的 `</body>` 标签前（注意不是 `</html>`），添加：

```html
<script type="module" src="/src/main.ts"></script>
<script type="module" src="/src/pages/worldmap.ts"></script>
```

- [ ] **Step 5: 验证快速修复**

Run: `npm run build`
Expected: 0 errors, build 成功

---

### Task 3: 改造首页

**Files:**

- Modify: `index.html` (精简内容区为空容器)
- Modify: `src/pages/home.ts` (数据驱动渲染)

- [ ] **Step 1: 精简 index.html 内容区**

将 `index.html` 中以下 3 个区域替换为空容器 div（保留导航、Hero、页脚）：

**精选故事区**（`<section class="section">` 内部的 `.stories-grid` 及其全部子元素）替换为：

```html
<div id="featured-stories" class="stories-grid"></div>
```

**精选人物区**（`<section class="section section--alt">` 内部的 `.characters-row` 及其全部子元素）替换为：

```html
<div id="featured-characters" class="characters-row"></div>
```

**文化链接**（4 个 `.culture-link-item` 的 `cursor: pointer`）：在 `home.css` 中将 `.culture-link-item` 的 `cursor: pointer` 改为 `cursor: default`。

- [ ] **Step 2: 重写 home.ts 数据驱动渲染**

在 `src/pages/home.ts` 中：

1. 导入数据：`import { getFeaturedStories } from "../data/stories"` 和 `import { getFeaturedCharacters } from "../data/characters"`
2. 新增 `renderStoryCard(story: Story): string` 函数，返回故事卡片 HTML 字符串（参考现有 index.html 中 `.story-card` 的结构，渐变色用 `style` 属性）
3. 新增 `renderCharCard(char: Character): string` 函数
4. 在 `DOMContentLoaded` 中调用：
   ```ts
   const storiesGrid = document.getElementById("featured-stories");
   const charsRow = document.getElementById("featured-characters");
   if (storiesGrid)
     storiesGrid.innerHTML = getFeaturedStories().map(renderStoryCard).join("");
   if (charsRow)
     charsRow.innerHTML = getFeaturedCharacters().map(renderCharCard).join("");
   ```
5. 保留现有的 `initScrollAnimations()` 和 `initScrollHint()` 不变
6. 删除 `import "../styles/home.css"` 改为 `import "../styles/home.css"`（已在文件顶部）

- [ ] **Step 3: 验证首页**

Run: `npm run dev`，打开 `http://localhost:5173/`
Expected: 首页显示 3 张故事卡 + 4 个人物卡，与之前视觉一致

---

### Task 4: 改造故事页

**Files:**

- Modify: `stories.html` (精简列表和阅读区为容器)
- Rewrite: `src/pages/stories.ts` (数据驱动 + URL 参数 + 工具栏)

- [ ] **Step 1: 精简 stories.html**

将以下区域替换为空容器：

**故事列表区**（`.stories-list` 内的所有 `.stories-list__group-title` + `.story-row-card`）替换为：

```html
<div id="stories-list-content"></div>
```

保留外层 `<div class="stories-list">` 和首尾的 `stories-list__group-title`（但改为由 JS 渲染）。

**阅读器区域**（`<div class="story-reader">` 内部）替换为：

```html
<div id="story-reader-header"></div>
<div id="story-reader-content"></div>
```

**页脚"分类"栏 4 个链接**：

```html
<a href="stories.html?category=上古神话">上古神话</a>
<a href="stories.html?category=民间传说">民间传说</a>
<a href="stories.html?category=道教仙话">道教仙话</a>
<a href="stories.html?category=节日神话">节日神话</a>
```

注意 `佛教故事` 改为 `节日神话`（匹配数据中的分类）。4 个 HTML 页脚都同步修改。

**页脚"关于"栏**：移除 `文化溯源`、`育儿指南`、`关于我们` 3 个 `<a>` 标签（这 4 个 HTML 都改）。

- [ ] **Step 2: 重写 stories.ts**

`src/pages/stories.ts` 全部重写。核心逻辑：

1. 导入数据：`import { stories, getStoriesByCategory } from "../data/stories"`
2. `renderStoryRowCard(story: Story): string` — 返回故事横卡 HTML
3. `renderStoryReader(story: Story): string` — 返回阅读器 HTML（标题 + 正文 + 插图 + 讨论）
4. `renderStoriesList(filter: string)` — 根据 filter 渲染列表 + 分类标题
5. `loadStory(storyId: string)` — 加载指定故事到阅读区，更新工具栏状态
6. URL 参数处理：`new URLSearchParams(location.search).get("category")` 读取初始分类
7. 分类 chip 点击 → `history.pushState(null, "", "?category=" + cat)` → 调用 `renderStoriesList(cat)`
8. 故事卡片点击 → `history.pushState(null, "", "?category=" + cat + "&id=" + id)` → 滚动到阅读区 → `loadStory(id)`
9. 阅读工具栏：
   - 字号 A-/A+：保持现有逻辑
   - 上一章/下一章：获取同分类故事列表，根据当前 `storyId` 找到相邻 `order` 的故事，调用 `loadStory(newId)`
   - 收藏：`localStorage` 存取 `{storyId: boolean}` 映射，初始化时检查当前故事设置按钮状态
   - 进度条：保持现有滚动监听逻辑

- [ ] **Step 3: 验证故事页**

Run: `npm run dev`，打开 `http://localhost:5173/stories.html`
验证项：

- 默认显示全部 5 条故事
- 点击分类 chip 筛选，URL 参数变化
- 点击故事卡片滚动到阅读区并显示正文
- 上一章/下一章切换故事
- 收藏按钮切换状态

---

### Task 5: 改造人物页

**Files:**

- Modify: `characters.html` (精简网格和详情为容器)
- Rewrite: `src/pages/characters.ts` (数据驱动 + 精确筛选 + 动态详情)

- [ ] **Step 1: 精简 characters.html**

**人物网格**（`.char-grid` 内全部 6 个 `.char-detail-card`）替换为：

```html
<div id="char-grid"></div>
```

**详情展示区**（`.detail-placeholder` 内部 `.detail-hero` 的具体内容）替换为：

```html
<div id="char-detail-area"></div>
```

- [ ] **Step 2: 重写 characters.ts**

`src/pages/characters.ts` 全部重写。核心逻辑：

1. 导入数据：`import { characters, getCharactersByEra } from "../data/characters"`
2. `renderCharDetailCard(char: Character): string` — 返回人物卡片 HTML
3. `renderCharDetail(char: Character): string` — 返回详情展示 HTML
4. 筛选逻辑：`char.era === filterText` 精确匹配（不再用 `includes`）
5. 筛选按钮 "全部" 时显示所有，否则只显示匹配的卡片
6. 卡片点击 → 找到对应人物数据 → 调用 `renderCharDetail(char)` 填充 `#char-detail-area` → 滚动到详情区
7. `DOMContentLoaded` 中初始化：渲染网格、绑定筛选、检查 URL hash `location.hash.slice(1)` 如果有则自动展示对应人物

- [ ] **Step 3: 验证人物页**

Run: `npm run dev`，打开 `http://localhost:5173/characters.html`
验证项：

- 默认显示 6 个人物卡片
- 点击"封神演义"显示哪吒（修复 bug）
- 点击"上古大神"显示女娲、后羿、嫦娥、盘古（4 张）
- 点击"西游记"显示孙悟空（1 张）
- 点击"八仙"/"山海经"/"民间传说"显示 0 张 + 空状态提示
- 点击卡片详情区切换为对应人物

---

### Task 6: 改造世界地图页

**Files:**

- Modify: `src/pages/worldmap.ts` (数据驱动 tooltip + 移动端)

- [ ] **Step 1: 重写 worldmap.ts**

`src/pages/worldmap.ts` 重写。核心逻辑：

1. 导入数据：`import { places } from "../data/places"`
2. 删除硬编码的 `MAP_DATA` 对象，改用 `places` 数据
3. `initMapTooltips()` 改为：
   - 遍历所有 `.map-region`，通过 `.map-region__label` 的 `textContent` 从 `places` 中查找匹配
   - 找到数据后设置 tooltip 内容
   - **添加 click 事件** 作为移动端回退
4. 移动端检测：`const isMobile = 'ontouchstart' in window`
5. 移动端 tooltip：改为居中弹窗样式（`worldmap.css` 中添加 `.map-tooltip--mobile` class），点击地图区域显示，点击遮罩关闭
6. 桌面端 tooltip 保持原有 fixed + 跟随手指逻辑

- [ ] **Step 2: 添加移动端 tooltip 样式**

在 `src/styles/worldmap.css` 中添加：

```css
.map-tooltip--mobile {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 280px;
  text-align: center;
  padding: 20px;
 24px;
}

.map-tooltip--mobile::before {
  content: "×";
  position: absolute;
  top: 4px;
  right: 8px;
  font-size: 18px;
  cursor: pointer;
}
```

- [ ] **Step 3: 验证世界地图页**

Run: `npm run dev`，打开 `http://localhost:5173/worldmap.html`
验证项：

- 导航 active 状态正确（之前缺失的 P0 bug 已修复）
- 星空动画显示
- hover 地标显示 tooltip
- 移动端点击地标显示居中 tooltip

---

### Task 7: 页脚链接同步修复

**Files:**

- Modify: `index.html` (页脚分类和关于栏)
- Modify: `characters.html`
- Modify: `stories.html`
- Modify: `worldmap.html`

- [ ] **Step 1: 同步修改 4 个 HTML 的页脚**

每个 HTML 的页脚做以下修改：

1. **"分类"栏** 4 个 `<a href="#">` 改为：
   - `上古神话` → `stories.html?category=上古神话`
   - `民间传说` → `stories.html?category=民间传说`
   - `道教仙话` → `stories.html?category=道教仙话`
   - `节日神话` → `stories.html?category=节日神话`

2. **"关于"栏** 删除 `文化溯源`、`育儿指南`、`关于我们` 3 个 `<a>` 标签

4 个文件做相同修改。

- [ ] **Step 2: 验证链接**

Run: `npm run dev`
验证项：点击页脚"上古神话"跳转到 stories 页并筛选出创世故事

---

### Task 8: 构建验证

- [ ] **Step 1: 完整构建验证**

Run: `npm run build`
Expected: 0 errors, 4 个 HTML + 5 个 CSS + 5 个 JS 产物

- [ ] **Step 2: 逐页检查**

Run: `npm run preview` 或 `npm run dev`
检查清单：

- [ ] 首页：3 故事卡 + 4 人物卡 + 文化区域 + 导航 + 页脚
- [ ] 故事页：分类 chip 筛选生效 + 故事列表渲染 + 阅读器加载正文 + 工具栏完整
- [ ] 人物页：筛选按钮生效 + 网格渲染 + 详情区动态切换
- [ ] 世界地图：星空动画 + tooltip 桌面端 + 移动端
- [ ] 导航栏 4 个页面 active 状态正确
- [ ] 汉堡菜单展开/收起
- [ ] 页脚无 `#` 空链接
- [ ] 控制台无报错

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "refactor: 数据驱动渲染，修复12个已知问题"
```
