import"./main-CvTj3pQc.js";import{a as i,c as d}from"./characters-rcsrsEmK.js";function c(a){const s=a.customBadgeStyle?`style="${a.customBadgeStyle}"`:"",t=a.tagClass?`tag ${a.tagClass} char-detail-card__era-badge`:"tag char-detail-card__era-badge",e=a.relatedStories.map(l=>`<strong>${l}</strong>`).join(" · ");return`
  <div class="char-detail-card" data-id="${a.id}">
    <div class="char-detail-card__top" style="background: ${a.avatarBg}">
      <div class="char-detail-card__avatar-circle" style="background: rgba(255,255,255,0.6); color: ${a.color}">${a.avatarChar}</div>
      <span class="${t}" ${s}>${a.era}</span>
      <div class="char-detail-card__element" style="color: ${a.color}">${a.elementIcon}</div>
    </div>
    <div class="char-detail-card__body">
      <div class="char-detail-card__name-row">
        <span class="char-detail-card__name">${a.name}</span>
        <span class="char-detail-card__alt-name">${a.altName}</span>
      </div>
      <p class="char-detail-card__title">${a.title}</p>
      <p class="char-detail-card__desc">${a.desc}</p>
      <div class="char-detail-card__footer">
        <span class="char-detail-card__related">关联故事: ${e}</span>
        <span class="char-detail-card__enter">查看详情 →</span>
      </div>
    </div>
  </div>`}function o(a){const s=a.fullDesc?a.fullDesc.split(`

`).map(e=>`<p class="detail-hero__desc">${e}</p>`).join(""):`<p class="detail-hero__desc">${a.desc}</p>`,t=a.tags.map(e=>e==="上古大神"||e==="创世"?`<span class="tag tag--cinnabar">${e}</span>`:e==="始祖"?`<span class="tag tag--gold">${e}</span>`:e==="女娲氏"?`<span class="tag tag--jade">${e}</span>`:`<span class="tag">${e}</span>`).join("");return`
  <div class="detail-hero">
    <div class="detail-hero__avatar" style="background: ${a.avatarBg}; display: flex; align-items: center; justify-content: center;">
      <span style="font-family: var(--font-brush); font-size: 64px; color: ${a.color}">${a.avatarChar}</span>
    </div>
    <div class="detail-hero__info">
      <h1>${a.name}</h1>
      <p class="detail-hero__subtitle">${a.title}</p>
      <div class="detail-hero__meta">
        <span class="tag tag--cinnabar">${a.era}</span>
        ${t}
      </div>
      ${s}
    </div>
  </div>`}function r(a){const s=document.getElementById("char-grid");if(!s)return;const t=i(a);if(t.length===0){s.innerHTML='<p style="text-align: center; color: var(--ink-muted); padding: 40px 0; grid-column: 1 / -1;">该分类暂无人物</p>';return}s.innerHTML=t.map(c).join(""),s.querySelectorAll(".char-detail-card").forEach(e=>{e.style.cursor="pointer",e.addEventListener("click",()=>{const l=e.dataset.id;l&&n(l)})})}function n(a){const s=d.find(l=>l.id===a);if(!s)return;const t=document.getElementById("char-detail-area");t&&(t.innerHTML=o(s));const e=document.querySelector(".detail-placeholder");e&&e.scrollIntoView({behavior:"smooth"}),history.pushState(null,"",`#${a}`)}document.addEventListener("DOMContentLoaded",()=>{r("全部");const a=document.querySelectorAll(".filter-btn");a.forEach(t=>{t.addEventListener("click",()=>{a.forEach(e=>e.classList.remove("filter-btn--active")),t.classList.add("filter-btn--active"),r(t.textContent||"全部")})});const s=location.hash.slice(1);s&&n(s),window.addEventListener("popstate",()=>{const t=location.hash.slice(1);t&&n(t)})});
