import"./main-CvTj3pQc.js";import{g as e}from"./stories-BUp7AVYm.js";import{g as n}from"./characters-rcsrsEmK.js";function c(a){const t=a.tags.map(r=>`<span class="${r==="经典必读"?"tag tag--gold":r==="孩子最爱"?"tag tag--cinnabar":"tag"}">${r}</span>`).join("");return`
  <div class="story-card">
    <div class="story-card__visual" style="background: ${a.gradient}">
      <div class="story-card__visual-bg" style="filter: brightness(0.9)">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="32" r="18" fill="rgba(245,240,232,0.2)"/>
          <path d="M30 50 Q40 45 50 50 Q55 60 40 65 Q25 60 30 50Z" fill="rgba(245,240,232,0.15)"/>
        </svg>
      </div>
      <span class="tag tag--cinnabar story-card__era">${a.era}</span>
    </div>
    <div class="story-card__body">
      <h3 class="story-card__title">${a.title}</h3>
      <p class="story-card__summary">${a.summary}</p>
      <div class="story-card__meta">
        ${t}
        <span class="story-card__reading-time">阅读约 ${a.readingTime} 分钟</span>
      </div>
    </div>
  </div>`}function i(a){const t=a.tags.slice(0,2).map(s=>`<span class="${s==="上古大神"?"tag tag--cinnabar":s==="封神"?"tag tag--jade":s==="始祖"?"tag tag--gold":s==="中秋"?"tag tag--cinnabar":"tag"}">${s}</span>`).join(""),r=a.title.split(" · ").slice(1).join(" · ")||a.title;return`
  <div class="char-card">
    <div class="char-card__avatar" style="background: ${a.avatarBg}">
      <span style="font-family: var(--font-brush); font-size: 36px; color: ${a.brushColor}">${a.avatarChar}</span>
    </div>
    <h3 class="char-card__name">${a.name}</h3>
    <p class="char-card__role">${r}</p>
    <div class="char-card__tags">${t}</div>
  </div>`}function o(){const a=document.querySelectorAll(".story-card, .char-card, .culture-link-item, .culture-visual, .culture-text");a.forEach(r=>r.classList.add("fade-in-up"));const t=new IntersectionObserver(r=>{r.forEach(s=>{s.isIntersecting&&(s.target.classList.add("visible"),t.unobserve(s.target))})},{threshold:.15});a.forEach(r=>t.observe(r))}function l(){const a=document.querySelector(".hero__scroll-hint"),t=document.querySelector(".section");!a||!t||(a.addEventListener("click",()=>{t.scrollIntoView({behavior:"smooth"})}),a.style.cursor="pointer")}document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("featured-stories"),t=document.getElementById("featured-characters");a&&(a.innerHTML=e().map(c).join("")),t&&(t.innerHTML=n().map(i).join("")),o(),l()});
