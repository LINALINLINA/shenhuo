import "../styles/home.css";
import { getFeaturedStories } from "../data/stories";
import type { Story } from "../data/types";
import { getFeaturedCharacters, getCharacterById } from "../data/characters";
import type { Character } from "../data/types";
import { cultureItems } from "../data/culture";
import type { CultureItem } from "../data/culture";

function renderStoryCard(story: Story): string {
  const tagHtml = story.tags
    .map((t) => {
      const cls =
        t === "经典必读"
          ? "tag tag--gold"
          : t === "孩子最爱"
            ? "tag tag--cinnabar"
            : "tag";
      return `<span class="${cls}">${t}</span>`;
    })
    .join("");
  const charChipsHtml = (story.relatedCharacters || [])
    .slice(0, 2)
    .map((cid) => {
      const ch = getCharacterById(cid);
      if (!ch) return "";
      return `<span class="story-card__char-chip">
      <span class="story-card__char-avatar" style="background: ${ch.avatarBg}; color: ${ch.color}">${ch.avatarChar.charAt(0)}</span>
      ${ch.name}
    </span>`;
    })
    .join("");
  return `
  <div class="story-card" data-id="${story.id}">
    <div class="story-card__visual" style="background: ${story.gradient}">
      <div class="story-card__visual-bg" style="filter: brightness(0.9)">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="32" r="18" fill="rgba(245,240,232,0.2)"/>
          <path d="M30 50 Q40 45 50 50 Q55 60 40 65 Q25 60 30 50Z" fill="rgba(245,240,232,0.15)"/>
        </svg>
      </div>
      <span class="tag tag--cinnabar story-card__era">${story.era}</span>
    </div>
    <div class="story-card__body">
      <h3 class="story-card__title">${story.title}</h3>
      <p class="story-card__summary">${story.summary}</p>
      <div class="story-card__meta">
        ${tagHtml}
        <span class="story-card__reading-time">阅读约 ${story.readingTime} 分钟</span>
      </div>
      <div class="story-card__chars">${charChipsHtml}</div>
    </div>
  </div>`;
}

function renderCharCard(char: Character): string {
  const tagHtml = char.tags
    .slice(0, 2)
    .map((t) => {
      const cls =
        t === "上古大神"
          ? "tag tag--cinnabar"
          : t === "封神"
            ? "tag tag--jade"
            : t === "始祖"
              ? "tag tag--gold"
              : t === "中秋"
                ? "tag tag--cinnabar"
                : "tag";
      return `<span class="${cls}">${t}</span>`;
    })
    .join("");
  const roleText = char.title.split(" · ").slice(1).join(" · ") || char.title;
  return `
  <div class="char-card">
    <div class="char-card__avatar" style="background: ${char.avatarBg}">
      <span style="font-family: var(--font-brush); font-size: 36px; color: ${char.brushColor}">${char.avatarChar}</span>
    </div>
    <h3 class="char-card__name">${char.name}</h3>
    <p class="char-card__role">${roleText}</p>
    <div class="char-card__tags">${tagHtml}</div>
  </div>`;
}

function renderCultureCard(item: CultureItem): string {
  return `
  <div class="culture-link-item">
    <span class="dot" style="background: ${item.dotColor}"></span>
    ${item.title}
    <p class="culture-link-item__desc">${item.content}</p>
  </div>`;
}

function initScrollAnimations() {
  const targets = document.querySelectorAll<HTMLElement>(
    ".story-card, .char-card, .culture-link-item, .culture-visual, .culture-text",
  );
  targets.forEach((el) => el.classList.add("fade-in-up"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  targets.forEach((el) => observer.observe(el));
}

function initScrollHint() {
  const hint = document.querySelector<HTMLElement>(".hero__scroll-hint");
  const storiesSection = document.querySelector<HTMLElement>(".section");
  if (!hint || !storiesSection) return;

  hint.addEventListener("click", () => {
    storiesSection.scrollIntoView({ behavior: "smooth" });
  });
  hint.style.cursor = "pointer";
}

document.addEventListener("DOMContentLoaded", () => {
  const storiesGrid = document.getElementById("featured-stories");
  const charsRow = document.getElementById("featured-characters");

  if (storiesGrid) {
    storiesGrid.innerHTML = getFeaturedStories().map(renderStoryCard).join("");
    storiesGrid.querySelectorAll<HTMLElement>(".story-card").forEach((card) => {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        const id = card.dataset.id;
        if (id)
          window.location.href = `stories.html?id=${encodeURIComponent(id)}`;
      });
    });
  }
  if (charsRow) {
    charsRow.innerHTML = getFeaturedCharacters().map(renderCharCard).join("");
  }

  const cultureLinks = document.getElementById("culture-links");
  if (cultureLinks) {
    cultureLinks.innerHTML = cultureItems.map(renderCultureCard).join("");
  }

  initScrollAnimations();
  initScrollHint();
  initPetals();
});

function initPetals() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  for (let i = 0; i < 8; i++) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.animationDelay = `${Math.random() * 15}s`;
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDuration = `${8 + Math.random() * 10}s`;
    hero.appendChild(petal);
  }
}
