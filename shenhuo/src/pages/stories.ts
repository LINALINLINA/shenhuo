import "../styles/stories.css";
import {
  stories,
  getStoriesByCategory,
  getStoryById,
  getAllCategories,
} from "../data/stories";
import type { Story } from "../data/types";

/* === 渲染函数 === */

function renderStoryRowCard(story: Story): string {
  const tagHtml = story.tags
    .map((t) => {
      if (t === "经典必读") return `<span class="tag tag--gold">${t}</span>`;
      if (t === "孩子最爱")
        return `<span class="tag tag--cinnabar">${t}</span>`;
      if (t === "适合讨论") return `<span class="tag tag--jade">${t}</span>`;
      return `<span class="tag">${t}</span>`;
    })
    .join("");
  return `
  <div class="story-row-card" data-id="${story.id}">
    <div class="story-row-card__cover" style="background: ${story.gradient}">
      <span class="story-row-card__cover-art" style="color: ${extractCoverColor(story)}">${story.title.charAt(0)}${story.title.length > 2 ? story.title.charAt(1) : ""}</span>
    </div>
    <div class="story-row-card__content">
      <div class="story-row-card__top">
        <h3 class="story-row-card__title">${story.title}</h3>
        ${tagHtml}
      </div>
      <p class="story-row-card__summary">${story.summary}</p>
      <div class="story-row-card__meta">
        <span class="tag">${story.tags[0] || ""}</span>
        <span>阅读约 ${story.readingTime} 分钟</span>
        <span>适合 ${story.ageRange}</span>
      </div>
    </div>
  </div>`;
}

function extractCoverColor(story: Story): string {
  const m = story.gradient.match(/#[0-9a-fA-F]{6}/g);
  return m ? m[m.length - 1] : "#333";
}

function renderStoryReader(story: Story): string {
  const contentHtml = story.content
    ? `<article class="story-text">${story.content}</article>`
    : `<article class="story-text"><p>该故事的完整内容正在撰写中，敬请期待。</p></article>`;

  const discussionHtml = story.discussion
    ? `<div class="discussion-box">
        <h3>与孩子聊聊这个故事</h3>
        <p>读完故事后，可以和孩子讨论下面这些话题：</p>
        <ul class="discussion-questions">
          ${story.discussion.map((q, i) => `<li><span class="num">${i + 1}</span><span>${q}</span></li>`).join("")}
        </ul>
      </div>`
    : "";

  return `
  <div class="story-reader__header">
    <p class="story-reader__category">${story.era} · ${story.category}</p>
    <h1 class="story-reader__title">${story.title}</h1>
    <p class="story-reader__subtitle">中国经典神话故事</p>
    <div class="story-reader__divider"><span>◆</span></div>
  </div>
  ${contentHtml}
  ${discussionHtml}`;
}

function renderStoriesList(filter: string) {
  const container = document.getElementById("stories-list-content");
  if (!container) return;

  const filtered = getStoriesByCategory(filter);
  if (filtered.length === 0) {
    container.innerHTML = `<p style="text-align: center; color: var(--ink-muted); padding: 40px 0;">该分类暂无故事</p>`;
    return;
  }

  const grouped = new Map<string, Story[]>();
  filtered.forEach((s) => {
    const cat = s.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(s);
  });

  let html = "";
  grouped.forEach((items, cat) => {
    html += `<h3 class="stories-list__group-title">${cat}</h3>`;
    items.forEach((s) => {
      html += renderStoryRowCard(s);
    });
  });
  container.innerHTML = html;

  container.querySelectorAll<HTMLElement>(".story-row-card").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      if (id) loadStory(id, filter);
    });
  });
}

/* === 故事加载 === */

let currentStoryId: string | null = null;
let currentCategory = "";

function loadStory(storyId: string, category?: string) {
  const story = getStoryById(storyId);
  if (!story) return;

  currentStoryId = storyId;
  currentCategory = category || "";

  const container = document.getElementById("story-reader-content");
  if (container) {
    container.innerHTML = renderStoryReader(story);
  }

  const readerSection = document.querySelector<HTMLElement>(
    '[style*="paper-deep"]',
  );
  if (readerSection) {
    readerSection.scrollIntoView({ behavior: "smooth" });
  }

  history.pushState(
    null,
    "",
    `?category=${encodeURIComponent(currentCategory)}&id=${storyId}`,
  );

  updateToolbarState();
}

/* === 分类 chip === */

function initCategories() {
  const chips = document.querySelectorAll<HTMLElement>(".category-chip");

  // 动态更新每个 chip 的篇数
  chips.forEach((chip) => {
    const countEl = chip.querySelector(".category-chip__count");
    const labelEl = chip.querySelector(".category-chip__label");
    if (!countEl || !labelEl) return;
    const label = labelEl.textContent || "";
    if (label === "全部故事") {
      countEl.textContent = `${stories.length} 篇`;
    } else {
      const count = stories.filter((s) => s.category === label).length;
      countEl.textContent = `${count} 篇`;
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("category-chip--active"));
      chip.classList.add("category-chip--active");
      const label = chip.querySelector(".category-chip__label");
      const cat = label?.textContent || "";
      if (cat === "全部故事") {
        currentCategory = "";
        history.pushState(null, "", "");
      } else {
        currentCategory = cat;
        history.pushState(null, "", `?category=${encodeURIComponent(cat)}`);
      }
      renderStoriesList(currentCategory);
    });
  });
}

/* === 阅读工具栏 === */

function initReaderToolbar() {
  const toolbar = document.querySelector<HTMLElement>(".reader-toolbar");
  const reader = document.querySelector<HTMLElement>('[style*="paper-deep"]');
  if (!toolbar) return;

  let fontSize = 17;
  const buttons = toolbar.querySelectorAll<HTMLButtonElement>("button");

  // buttons[0] = A-, buttons[1] = A+, buttons[2] = prev, buttons[3] = next, buttons[4] = favorite
  const fontDownBtn = buttons[0];
  const fontUpBtn = buttons[1];

  if (fontDownBtn) {
    fontDownBtn.addEventListener("click", () => {
      fontSize = Math.max(14, fontSize - 1);
      const el = document.querySelector<HTMLElement>(".story-text");
      if (el) el.style.fontSize = `${fontSize}px`;
    });
  }

  if (fontUpBtn) {
    fontUpBtn.addEventListener("click", () => {
      fontSize = Math.min(24, fontSize + 1);
      const el = document.querySelector<HTMLElement>(".story-text");
      if (el) el.style.fontSize = `${fontSize}px`;
    });
  }

  // 上一章 / 下一章
  const prevBtn = buttons[2];
  const nextBtn = buttons[3];

  if (prevBtn) {
    prevBtn.addEventListener("click", () => navigateStory(-1));
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => navigateStory(1));
  }

  // 收藏
  const favBtn = buttons[4];
  if (favBtn) {
    favBtn.addEventListener("click", () => {
      if (!currentStoryId) return;
      const favs = getFavorites();
      favs[currentStoryId] = !favs[currentStoryId];
      localStorage.setItem("favorites", JSON.stringify(favs));
      updateToolbarState();
    });
  }

  // 进度条
  const progressBar = document.querySelector<HTMLElement>(
    ".reader-toolbar__progress-bar",
  );

  function updateProgress() {
    if (!progressBar) return;
    const storyText = document.querySelector<HTMLElement>(".story-text");
    if (!storyText) return;
    const total = storyText.scrollHeight - storyText.clientHeight;
    const scrolled = -storyText.getBoundingClientRect().top;
    const pct = Math.min(100, Math.max(0, (scrolled / total) * 100));
    progressBar.style.width = `${pct}%`;
  }

  function updateVisibility() {
    if (!reader) return;
    const rect = reader.getBoundingClientRect();
    const inReader = rect.top < window.innerHeight && rect.bottom > 0;
    toolbar.classList.toggle("hidden", !inReader);
  }

  window.addEventListener("scroll", () => {
    updateProgress();
    updateVisibility();
  });

  updateVisibility();
  updateToolbarState();
}

function navigateStory(direction: number) {
  if (!currentStoryId) return;
  const currentStory = getStoryById(currentStoryId);
  if (!currentStory) return;

  const catStories = getStoriesByCategory(currentCategory).sort(
    (a, b) => a.order - b.order,
  );
  const idx = catStories.findIndex((s) => s.id === currentStoryId);
  if (idx === -1) return;

  const newIdx = idx + direction;
  if (newIdx < 0 || newIdx >= catStories.length) return;

  loadStory(catStories[newIdx].id, currentCategory);
}

function getFavorites(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem("favorites") || "{}");
  } catch {
    return {};
  }
}

function updateToolbarState() {
  const toolbar = document.querySelector<HTMLElement>(".reader-toolbar");
  if (!toolbar) return;

  const buttons = toolbar.querySelectorAll<HTMLButtonElement>("button");
  const favBtn = buttons[4];
  if (favBtn && currentStoryId) {
    const favs = getFavorites();
    favBtn.textContent = favs[currentStoryId] ? "★" : "☆";
  }

  // 上一章/下一章 disabled 状态
  const prevBtn = buttons[2];
  const nextBtn = buttons[3];
  if (currentStoryId) {
    const catStories = getStoriesByCategory(currentCategory).sort(
      (a, b) => a.order - b.order,
    );
    const idx = catStories.findIndex((s) => s.id === currentStoryId);
    if (prevBtn) prevBtn.disabled = idx <= 0;
    if (nextBtn) nextBtn.disabled = idx >= catStories.length - 1;
  }
}

/* === 初始化 === */

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(location.search);
  const category = params.get("category") || "";
  const storyId = params.get("id") || "";

  currentCategory = category;

  initCategories();
  renderStoriesList(category);
  initReaderToolbar();

  if (storyId) {
    loadStory(storyId, category);
  }

  // popstate 处理浏览器前进后退
  window.addEventListener("popstate", () => {
    const p = new URLSearchParams(location.search);
    currentCategory = p.get("category") || "";
    const id = p.get("id") || "";
    renderStoriesList(currentCategory);
    if (id) loadStory(id, currentCategory);
  });
});
