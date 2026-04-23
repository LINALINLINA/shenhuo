import "../styles/worldmap.css";
import { places, getPlaceByName } from "../data/places";

function initStars() {
  const container = document.getElementById("stars");
  if (!container) return;
  for (let i = 0; i < 60; i++) {
    const star = document.createElement("span");
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.opacity = String(0.1 + Math.random() * 0.5);
    star.style.width = star.style.height = `${1 + Math.random() * 2}px`;
    container.appendChild(star);
  }
}

function initMapTooltips() {
  const regions = document.querySelectorAll<HTMLElement>(".map-region");
  const isMobile = "ontouchstart" in window;

  // 创建 tooltip
  const tooltip = document.createElement("div");
  tooltip.className = "map-tooltip" + (isMobile ? " map-tooltip--mobile" : "");
  document.body.appendChild(tooltip);

  // 移动端遮罩
  let overlay: HTMLDivElement | null = null;
  if (isMobile) {
    overlay = document.createElement("div");
    overlay.style.cssText = "position:fixed;inset:0;z-index:999;display:none;";
    document.body.appendChild(overlay);
  }

  regions.forEach((region) => {
    const label = region.querySelector(".map-region__label");
    if (!label) return;

    const name = label.textContent?.trim() || "";
    const data = getPlaceByName(name);
    if (!data) return;

    function showTooltip(e?: MouseEvent | TouchEvent) {
      tooltip.innerHTML = `<h4>${data.name}</h4><p>${data.desc}</p>`;
      tooltip.classList.add("visible");

      if (isMobile && overlay) {
        overlay.style.display = "block";
        // 点击遮罩关闭
        overlay.onclick = () => {
          tooltip.classList.remove("visible");
          overlay!.style.display = "none";
        };
        // 点击 tooltip 中的 × 关闭
        tooltip.onclick = (ev) => {
          const target = ev.target as HTMLElement;
          if (
            target.tagName === "SPAN" ||
            target.classList.contains("map-tooltip--mobile")
          ) {
            tooltip.classList.remove("visible");
            overlay!.style.display = "none";
          }
        };
      }
    }

    function moveTooltip(e: MouseEvent) {
      if (isMobile) return;
      tooltip.style.left = `${e.clientX + 16}px`;
      tooltip.style.top = `${e.clientY - 10}px`;
    }

    function hideTooltip() {
      tooltip.classList.remove("visible");
      if (overlay) overlay.style.display = "none";
    }

    if (isMobile) {
      region.addEventListener("click", () => showTooltip());
    } else {
      region.addEventListener("mouseenter", () => showTooltip());
      region.addEventListener("mousemove", (e) => moveTooltip(e));
      region.addEventListener("mouseleave", () => hideTooltip());
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initStars();
  initMapTooltips();
});
