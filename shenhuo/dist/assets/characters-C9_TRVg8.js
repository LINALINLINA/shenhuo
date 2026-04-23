import{c as p,d as u,e as o}from"./main-DdCMU8om.js";function v(a){const s=a.customBadgeStyle?`style="${a.customBadgeStyle}"`:"",e=a.tagClass?`tag ${a.tagClass} char-detail-card__era-badge`:"tag char-detail-card__era-badge",l=a.relatedStories.map(i=>{const r=o(i);return r?`<strong>${r.title}</strong>`:""}).filter(Boolean).join(" · ");return`
  <div class="char-detail-card" data-id="${a.id}">
    <div class="char-detail-card__top" style="background: ${a.avatarBg}">
      <div class="char-detail-card__avatar-circle" style="background: rgba(255,255,255,0.6); color: ${a.color}">${a.avatarChar}</div>
      <span class="${e}" ${s}>${a.era}</span>
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
        <span class="char-detail-card__related">关联故事: ${l}</span>
        <span class="char-detail-card__enter">查看详情 →</span>
      </div>
    </div>
  </div>`}function _(a){const s=a.fullDesc?a.fullDesc.split(`

`).map(t=>`<p class="detail-hero__desc">${t}</p>`).join(""):`<p class="detail-hero__desc">${a.desc}</p>`,e=a.tags.map(t=>t==="上古大神"||t==="创世"?`<span class="tag tag--cinnabar">${t}</span>`:t==="始祖"?`<span class="tag tag--gold">${t}</span>`:t==="女娲氏"?`<span class="tag tag--jade">${t}</span>`:`<span class="tag">${t}</span>`).join(""),l=a.artifacts&&a.artifacts.length>0?`<div class="char-artifacts">
        <h4>法宝与技能</h4>
        ${a.artifacts.map(t=>`
            <div class="char-artifact">
              <span class="char-artifact__name">${t.name}</span>
              <span class="char-artifact__desc">${t.desc}</span>
            </div>
          `).join("")}
      </div>`:"",i=a.quotes&&a.quotes.length>0?`<div class="char-quotes">
        <h4>经典语录</h4>
        ${a.quotes.map(t=>`
            <blockquote class="char-quote">
              <p>“${t.text}”</p>
              ${t.source?`<cite>—— ${t.source}</cite>`:""}
            </blockquote>
          `).join("")}
      </div>`:"",r=a.relatedStories&&a.relatedStories.length>0?`<div class="char-related">
        <h4>相关故事</h4>
        <div class="char-related__list">
          ${a.relatedStories.map(t=>{const d=o(t);return d?`<a href="stories.html?id=${encodeURIComponent(t)}" class="char-related__link">${d.title}</a>`:""}).filter(Boolean).join("")}
        </div>
      </div>`:"";return`
  <div class="detail-hero">
    <div class="detail-hero__avatar" style="background: ${a.avatarBg}; display: flex; align-items: center; justify-content: center;">
      <span style="font-family: var(--font-brush); font-size: 64px; color: ${a.color}">${a.avatarChar}</span>
    </div>
    <div class="detail-hero__info">
      <h1>${a.name}</h1>
      <p class="detail-hero__subtitle">${a.title}</p>
      <div class="detail-hero__meta">
        <span class="tag tag--cinnabar">${a.era}</span>
        ${e}
      </div>
      ${s}
      ${l}
      ${i}
      ${r}
    </div>
  </div>`}function c(a){const s=document.getElementById("char-grid");if(!s)return;const e=p(a);if(e.length===0){s.innerHTML='<p style="text-align: center; color: var(--ink-muted); padding: 40px 0; grid-column: 1 / -1;">该分类暂无人物</p>';return}s.innerHTML=e.map(v).join(""),s.querySelectorAll(".char-detail-card").forEach(l=>{l.style.cursor="pointer",l.addEventListener("click",()=>{const i=l.dataset.id;i&&n(i)})}),s.querySelectorAll(".char-detail-card").forEach((l,i)=>{l.classList.add("stagger-enter"),setTimeout(()=>l.classList.add("visible"),i*60)})}function n(a){const s=u.find(i=>i.id===a);if(!s)return;const e=document.getElementById("char-detail-area");e&&(e.innerHTML=_(s));const l=document.querySelector(".detail-placeholder");l&&l.scrollIntoView({behavior:"smooth"}),history.pushState(null,"",`#${a}`)}document.addEventListener("DOMContentLoaded",()=>{c("全部");const a=document.querySelectorAll(".filter-btn");a.forEach(e=>{e.addEventListener("click",()=>{a.forEach(l=>l.classList.remove("filter-btn--active")),e.classList.add("filter-btn--active"),c(e.textContent||"全部")})});const s=location.hash.slice(1);s&&n(s),window.addEventListener("popstate",()=>{const e=location.hash.slice(1);e&&n(e)})});
