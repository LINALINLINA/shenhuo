# 神话录改进设计文档

## Context

神话录网站是一个面向父母给孩子讲中国神话故事的 Vite 多页面项目。当前存在 12 个问题：数据全部硬编码在 HTML、worldmap 页面脚本缺失、筛选逻辑有 bug、28 个空链接、工具栏半成品等。本次改进采用"数据驱动 MPA"方案，建立数据层 + 渲染函数，保持现有 Vite 多页面架构。

## 1. 数据层

### 文件结构

```
src/data/
├── types.ts        # Story, Character, Place 类型定义
├── stories.ts      # 全部故事数据
├── characters.ts   # 全部人物数据
└── places.ts       # 世界观地标数据
```

### 类型定义

**Story** — `src/data/types.ts`

```ts
export interface Story {
  id: string; // "nuwa-butian"
  title: string;
  summary: string; // 一句话摘要
  category: string; // "创世神话" | "英雄传说" | "民间故事" | "道教仙话" | "节日神话"
  era: string; // "上古神话" | "封神演义" | "西游记" 等（用于人物页筛选）
  tags: string[];
  content?: string; // 完整正文 HTML
  discussion?: string[]; // 讨论引导问题
  readingTime: number;
  ageRange: string;
  gradient: string; // 卡片封面渐变 CSS
  order: number; // 在分类内的排序
}
```

**Character** — `src/data/types.ts`

```ts
export interface Character {
  id: string;
  name: string;
  altName: string;
  title: string; // "大地之母 · 抟土造人"
  desc: string;
  fullDesc?: string; // 完整描述（2-3 段）
  era: string; // 筛选用：精确匹配按钮文本
  tags: string[];
  relatedStories: string[];
  color: string; // 卡片背景色
  brushColor: string; // 毛笔字颜色
}
```

**Place** — `src/data/types.ts`

```ts
export interface Place {
  name: string;
  realm: "heaven" | "mortal" | "underworld" | "sea";
  pos: { left: string; top: string };
  desc: string;
}
```

### 数据量

先迁移现有 5 条故事 + 6 个人物 + 11 个地标。后续新增内容只改 `src/data/` 文件。

## 2. 页面改造

### 首页（index.html + home.ts）

- `getFeaturedStories()` → 渲染 `.stories-grid`（3 条精选）
- `getFeaturedCharacters()` → 渲染 `.characters-row`（4 条精选）
- 故事卡片包裹 `<a href="stories.html?id=xxx">`
- 人物卡片包裹 `<a href="characters.html#xxx">`
- 文化链接改为 cursor: default，移除交互暗示

### 故事页（stories.html + stories.ts）

- URL 参数 `?category=创世神话` 控制列表筛选
- `getStoriesByCategory(category)` 筛选并渲染 `.stories-list`
- 分类 chip 点击 → 更新 URL 参数 → 重新渲染
- 故事卡片点击 → 滚动到阅读区 → 加载 `story.content` 到 `.story-text`
- 阅读区内容不再硬编码，改为动态填充
- 分类数字从 `stories.filter(s => s.category === cat).length` 动态计算

### 人物页（characters.html + characters.ts）

- `getAllCharacters()` → 渲染 `.char-grid`
- 筛选逻辑改为用 `character.era === filterText` 精确匹配（修复"封神榜"bug）
- 卡片点击 → 更新 `.detail-hero` 区域显示对应人物信息（不再固定女娲）
- 筛选按钮文本与数据 `era` 字段保持一致：上古大神/封神演义/西游记/八仙/山海经/民间传说

### 世界地图页（worldmap.html + worldmap.ts）

- **P0 修复**：补上缺失的 `<script type="module" src="/src/main.ts"></script>` 和 `<script type="module" src="/src/pages/worldmap.ts"></script>`
- tooltip 数据从 `places.ts` 读取
- 移动端：click 事件回退 + 居中弹出式 tooltip

## 3. 导航与链接

### 页脚空链接修复

页脚"分类"栏改为带参数的跳转：

- `上古神话` → `stories.html?category=上古神话`
- `民间传说` → `stories.html?category=民间传说`
- `道教仙话` → `stories.html?category=道教仙话`
- `佛教故事` → `stories.html?category=佛教故事`（数据层中补充此分类）

页脚"关于"栏：移除 `文化溯源`、`育儿指南`、`关于我们`（无对应页面），保留 `探索` 栏。

## 4. 性能与代码质量

### Google Fonts 异步加载

4 个 HTML 的 `<link rel="stylesheet">` 改为：

```html
<link
  rel="preload"
  href="...googleapis.com/css2?..."
  as="style"
  onload="this.rel='stylesheet'"
/>
<noscript><link rel="stylesheet" href="...googleapis.com/css2?..." /></noscript>
```

### 清理未使用代码

- 删除 `global.css` 中 `.seal`、`.seal::before`、`.divider-brush`、`.cloud-decor`、`.card`、`.card:hover`、`.ink-mountains`、`.text-serif`、`.text-brush`、`.text-gold`、`.text-cinnabar`、`.text-muted`、`.text-center`
- 删除 `main.ts` 中 `initFooterBrand()` 函数及其调用

### 阅读工具栏补全

- 上一章/下一章：根据当前故事的 `order` 在同分类中切换，更新阅读区内容和 URL
- 收藏按钮：`localStorage.getItem('favorites')` 读取，切换 `★/☆` 样式和存储

### 移动端 tooltip

- `worldmap.ts` 添加 click 事件监听
- 移动端检测：`'ontouchstart' in window`
- 移动端 tooltip 改为 `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%)` 居中弹窗，点击其他区域关闭

## 5. 实施顺序

1. 创建数据文件（types.ts, stories.ts, characters.ts, places.ts）
2. 修复 worldmap.html 脚本缺失（P0）
3. 改造首页为数据驱动渲染
4. 改造故事页为数据驱动渲染 + URL 参数筛选 + 动态阅读
5. 改造人物页为数据驱动渲染 + 精确筛选 + 动态详情
6. 修复导航链接（页脚空链接、卡片包裹 a 标签）
7. 性能优化（字体异步、清理死代码）
8. 补全工具栏 + 移动端 tooltip
9. 验证：npm run build + 逐页检查
