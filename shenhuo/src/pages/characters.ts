import "../styles/characters.css";
import { characters, getCharactersByEra } from "../data/characters";
import { getStoryById } from "../data/stories";
import type { Character } from "../data/types";

function renderCharDetailCard(char: Character): string {
  const badgeStyle = char.customBadgeStyle
    ? `style="${char.customBadgeStyle}"`
    : "";
  const badgeClass = char.tagClass
    ? `tag ${char.tagClass} char-detail-card__era-badge`
    : `tag char-detail-card__era-badge`;
  const relatedHtml = char.relatedStories
    .map((id) => {
      const s = getStoryById(id);
      return s ? `<strong>${s.title}</strong>` : "";
    })
    .filter(Boolean)
    .join(" · ");

  return `
  <div class="char-detail-card" data-id="${char.id}">
    <div class="char-detail-card__top" style="background: ${char.avatarBg}">
      <div class="char-detail-card__avatar-circle" style="background: rgba(255,255,255,0.6); color: ${char.color}">${char.avatarChar}</div>
      <span class="${badgeClass}" ${badgeStyle}>${char.era}</span>
      <div class="char-detail-card__element" style="color: ${char.color}">${char.elementIcon}</div>
    </div>
    <div class="char-detail-card__body">
      <div class="char-detail-card__name-row">
        <span class="char-detail-card__name">${char.name}</span>
        <span class="char-detail-card__alt-name">${char.altName}</span>
      </div>
      <p class="char-detail-card__title">${char.title}</p>
      <p class="char-detail-card__desc">${char.desc}</p>
      <div class="char-detail-card__footer">
        <span class="char-detail-card__related">关联故事: ${relatedHtml}</span>
        <span class="char-detail-card__enter">查看详情 →</span>
      </div>
    </div>
  </div>`;
}

function renderCharDetail(char: Character): string {
  const descParagraphs = char.fullDesc
    ? char.fullDesc
        .split("\n\n")
        .map((p) => `<p class="detail-hero__desc">${p}</p>`)
        .join("")
    : `<p class="detail-hero__desc">${char.desc}</p>`;

  const tagsHtml = char.tags
    .map((t) => {
      if (t === "上古大神" || t === "创世")
        return `<span class="tag tag--cinnabar">${t}</span>`;
      if (t === "始祖") return `<span class="tag tag--gold">${t}</span>`;
      if (t === "女娲氏") return `<span class="tag tag--jade">${t}</span>`;
      return `<span class="tag">${t}</span>`;
    })
    .join("");

  const artifactsHtml =
    char.artifacts && char.artifacts.length > 0
      ? `<div class="char-artifacts">
        <h4>法宝与技能</h4>
        ${char.artifacts
          .map(
            (a) => `
            <div class="char-artifact">
              <span class="char-artifact__name">${a.name}</span>
              <span class="char-artifact__desc">${a.desc}</span>
            </div>
          `,
          )
          .join("")}
      </div>`
      : "";

  const quotesHtml =
    char.quotes && char.quotes.length > 0
      ? `<div class="char-quotes">
        <h4>经典语录</h4>
        ${char.quotes
          .map(
            (q) => `
            <blockquote class="char-quote">
              <p>“${q.text}”</p>
              ${q.source ? `<cite>—— ${q.source}</cite>` : ""}
            </blockquote>
          `,
          )
          .join("")}
      </div>`
      : "";

  const relatedHtml =
    char.relatedStories && char.relatedStories.length > 0
      ? `<div class="char-related">
        <h4>相关故事</h4>
        <div class="char-related__list">
          ${char.relatedStories
            .map((id) => {
              const s = getStoryById(id);
              if (!s) return "";
              return `<a href="stories.html?id=${encodeURIComponent(id)}" class="char-related__link">${s.title}</a>`;
            })
            .filter(Boolean)
            .join("")}
        </div>
      </div>`
      : "";

  return `
  <div class="detail-hero">
    <div class="detail-hero__avatar" style="background: ${char.avatarBg}; display: flex; align-items: center; justify-content: center;">
      <span style="font-family: var(--font-brush); font-size: 64px; color: ${char.color}">${char.avatarChar}</span>
    </div>
    <div class="detail-hero__info">
      <h1>${char.name}</h1>
      <p class="detail-hero__subtitle">${char.title}</p>
      <div class="detail-hero__meta">
        <span class="tag tag--cinnabar">${char.era}</span>
        ${tagsHtml}
      </div>
      ${descParagraphs}
      ${artifactsHtml}
      ${quotesHtml}
      ${relatedHtml}
    </div>
  </div>`;
}

function renderCharGrid(filter: string) {
  const grid = document.getElementById("char-grid");
  if (!grid) return;

  const filtered = getCharactersByEra(filter);
  if (filtered.length === 0) {
    grid.innerHTML = `<p style="text-align: center; color: var(--ink-muted); padding: 40px 0; grid-column: 1 / -1;">该分类暂无人物</p>`;
    return;
  }

  grid.innerHTML = filtered.map(renderCharDetailCard).join("");

  grid.querySelectorAll<HTMLElement>(".char-detail-card").forEach((card) => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      if (id) showCharDetail(id);
    });
  });

  grid.querySelectorAll<HTMLElement>(".char-detail-card").forEach((el, i) => {
    el.classList.add("stagger-enter");
    setTimeout(() => el.classList.add("visible"), i * 60);
  });
}

function showCharDetail(charId: string) {
  const char = characters.find((c) => c.id === charId);
  if (!char) return;

  const area = document.getElementById("char-detail-area");
  if (area) {
    area.innerHTML = renderCharDetail(char);
  }

  const detailSection = document.querySelector<HTMLElement>(
    ".detail-placeholder",
  );
  if (detailSection) {
    detailSection.scrollIntoView({ behavior: "smooth" });
  }

  history.pushState(null, "", `#${charId}`);
}

document.addEventListener("DOMContentLoaded", () => {
  renderCharGrid("全部");

  const buttons = document.querySelectorAll<HTMLButtonElement>(".filter-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("filter-btn--active"));
      btn.classList.add("filter-btn--active");
      renderCharGrid(btn.textContent || "全部");
    });
  });

  const hash = location.hash.slice(1);
  if (hash) {
    showCharDetail(hash);
  }

  window.addEventListener("popstate", () => {
    const h = location.hash.slice(1);
    if (h) showCharDetail(h);
  });
});
