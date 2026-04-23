import { stories } from "../data/stories";
import { characters } from "../data/characters";
import { places } from "../data/places";

interface SearchResult {
  type: "story" | "character" | "place";
  id: string;
  title: string;
  desc: string;
  url: string;
}

function search(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: SearchResult[] = [];

  stories.forEach((s) => {
    if (
      s.title.toLowerCase().includes(q) ||
      s.summary.toLowerCase().includes(q)
    ) {
      results.push({
        type: "story",
        id: s.id,
        title: s.title,
        desc: s.summary.slice(0, 60) + "...",
        url: `stories.html?id=${s.id}`,
      });
    }
  });

  characters.forEach((c) => {
    const searchable =
      `${c.name} ${c.altName} ${c.title} ${c.desc} ${c.era}`.toLowerCase();
    if (searchable.includes(q)) {
      results.push({
        type: "character",
        id: c.id,
        title: c.name,
        desc: c.title + " - " + c.desc.slice(0, 40) + "...",
        url: `characters.html#${c.id}`,
      });
    }
  });

  places.forEach((p) => {
    if (p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) {
      results.push({
        type: "place",
        id: p.name,
        title: p.name,
        desc: p.desc,
        url: "worldmap.html",
      });
    }
  });

  return results.slice(0, 12);
}

let panel: HTMLDivElement | null = null;

export function initSearch() {
  panel = document.createElement("div");
  panel.className = "search-panel hidden";
  panel.id = "search-panel";

  panel.innerHTML = `
    <div class="search-panel__header">
      <svg class="search-panel__icon" width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="8" cy="8" r="6" />
        <line x1="12.5" y1="12.5" x2="16" y2="16" />
      </svg>
      <input class="search-panel__input" type="text" placeholder="搜索故事、人物、地标..." />
      <span class="search-panel__hint">ESC 关闭</span>
    </div>
    <div class="search-panel__results"></div>
  `;

  document.body.appendChild(panel);

  (window as unknown as Record<string, () => void>).__hideSearch = hideSearch;

  const input = panel.querySelector<HTMLInputElement>(".search-panel__input");

  document.addEventListener("keydown", (e) => {
    if ((e.key === "k" || e.key === "/") && !e.ctrlKey && !e.metaKey) {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      e.preventDefault();
      showSearch();
    }
    if (e.key === "Escape") hideSearch();
  });

  if (input) {
    let debounceTimer: ReturnType<typeof setTimeout>;
    input.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const results = search(input.value);
        renderResults(results);
        panel!.classList.remove("hidden");
      }, 200);
    });
  }
}

export function showSearch() {
  if (!panel) return;
  panel.classList.remove("hidden");
  const input = panel.querySelector<HTMLInputElement>(".search-panel__input");
  if (input) {
    input.value = "";
    input.focus();
  }
}

export function hideSearch() {
  if (!panel) return;
  panel.classList.add("hidden");
  const input = panel.querySelector<HTMLInputElement>(".search-panel__input");
  if (input) input.value = "";
}

function renderResults(results: SearchResult[]) {
  if (!panel) return;
  const resultsContainer = panel.querySelector<HTMLElement>(
    ".search-panel__results",
  );
  if (!resultsContainer) return;

  if (results.length === 0) {
    resultsContainer.innerHTML = `<div class="search-panel__empty">未找到相关结果</div>`;
    return;
  }

  resultsContainer.innerHTML = results
    .map((r) => {
      const typeLabel =
        r.type === "story" ? "故事" : r.type === "character" ? "人物" : "地标";
      const typeClass =
        r.type === "story"
          ? "search-result__type--story"
          : r.type === "character"
            ? "search-result__type--char"
            : "search-result__type--place";
      return `
      <a href="${r.url}" class="search-result" onclick="window.__hideSearch && window.__hideSearch()">
        <span class="search-result__type ${typeClass}">${typeLabel}</span>
        <div class="search-result__text">
          <span class="search-result__title">${r.title}</span>
          <span class="search-result__desc">${r.desc}</span>
        </div>
      </a>`;
    })
    .join("");
}
