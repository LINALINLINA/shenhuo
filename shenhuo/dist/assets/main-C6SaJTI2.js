import{g as n,a as c,b as o}from"./main-DdCMU8om.js";const i=[{id:"festivals",title:"节日与神话",icon:"节",dotColor:"var(--gold)",content:"中国的每一个传统节日背后几乎都有一个神话故事。春节赶年兽、清明祭祖、端午赛龙舟、七夕鹊桥、中秋赏月——这些流传千年的习俗，都是神话在现代生活中的延续。了解这些故事，让孩子过节时更有仪式感。"},{id:"folklore",title:"民俗溯源",icon:"俗",dotColor:"var(--cinnabar)",content:"从剪纸到糖画，从龙舟到舞狮，中国丰富的民间艺术形式都源于神话传说。门神是驱邪的，灶王爷保灶台的，财神管财运——这些民间信仰的背后，都有一个神话原型。"},{id:"symbolism",title:"象征与寓意",icon:"寓",dotColor:"var(--jade)",content:"龙是中华文明的象征，凤代表祥瑞，莲花象征高洁，松柏代表坚韧。这些符号遍布建筑、服饰和日常生活中，每个背后都有一段神话传说。"},{id:"geography",title:"地理与传说",icon:"地",dotColor:"var(--mountain-mid)",content:"昆仑山、蓬莱仙岛、不周山、桃花源——中国大地上的许多山川都有对应的神话传说。三山五岳、四海八荒，每处山水都有一段传奇。"}];function l(t){const r=t.tags.map(a=>`<span class="${a==="经典必读"?"tag tag--gold":a==="孩子最爱"?"tag tag--cinnabar":"tag"}">${a}</span>`).join(""),e=(t.relatedCharacters||[]).slice(0,2).map(a=>{const s=o(a);return s?`<span class="story-card__char-chip">
      <span class="story-card__char-avatar" style="background: ${s.avatarBg}; color: ${s.color}">${s.avatarChar.charAt(0)}</span>
      ${s.name}
    </span>`:""}).join("");return`
  <div class="story-card" data-id="${t.id}">
    <div class="story-card__visual" style="background: ${t.gradient}">
      <div class="story-card__visual-bg" style="filter: brightness(0.9)">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="32" r="18" fill="rgba(245,240,232,0.2)"/>
          <path d="M30 50 Q40 45 50 50 Q55 60 40 65 Q25 60 30 50Z" fill="rgba(245,240,232,0.15)"/>
        </svg>
      </div>
      <span class="tag tag--cinnabar story-card__era">${t.era}</span>
    </div>
    <div class="story-card__body">
      <h3 class="story-card__title">${t.title}</h3>
      <p class="story-card__summary">${t.summary}</p>
      <div class="story-card__meta">
        ${r}
        <span class="story-card__reading-time">阅读约 ${t.readingTime} 分钟</span>
      </div>
      <div class="story-card__chars">${e}</div>
    </div>
  </div>`}function d(t){const r=t.tags.slice(0,2).map(a=>`<span class="${a==="上古大神"?"tag tag--cinnabar":a==="封神"?"tag tag--jade":a==="始祖"?"tag tag--gold":a==="中秋"?"tag tag--cinnabar":"tag"}">${a}</span>`).join(""),e=t.title.split(" · ").slice(1).join(" · ")||t.title;return`
  <div class="char-card">
    <div class="char-card__avatar" style="background: ${t.avatarBg}">
      <span style="font-family: var(--font-brush); font-size: 36px; color: ${t.brushColor}">${t.avatarChar}</span>
    </div>
    <h3 class="char-card__name">${t.name}</h3>
    <p class="char-card__role">${e}</p>
    <div class="char-card__tags">${r}</div>
  </div>`}function u(t){return`
  <div class="culture-link-item">
    <span class="dot" style="background: ${t.dotColor}"></span>
    ${t.title}
    <p class="culture-link-item__desc">${t.content}</p>
  </div>`}function g(){const t=document.querySelectorAll(".story-card, .char-card, .culture-link-item, .culture-visual, .culture-text");t.forEach(e=>e.classList.add("fade-in-up"));const r=new IntersectionObserver(e=>{e.forEach(a=>{a.isIntersecting&&(a.target.classList.add("visible"),r.unobserve(a.target))})},{threshold:.15});t.forEach(e=>r.observe(e))}function m(){const t=document.querySelector(".hero__scroll-hint"),r=document.querySelector(".section");!t||!r||(t.addEventListener("click",()=>{r.scrollIntoView({behavior:"smooth"})}),t.style.cursor="pointer")}document.addEventListener("DOMContentLoaded",()=>{const t=document.getElementById("featured-stories"),r=document.getElementById("featured-characters");t&&(t.innerHTML=n().map(l).join(""),t.querySelectorAll(".story-card").forEach(a=>{a.style.cursor="pointer",a.addEventListener("click",()=>{const s=a.dataset.id;s&&(window.location.href=`stories.html?id=${encodeURIComponent(s)}`)})})),r&&(r.innerHTML=c().map(d).join(""));const e=document.getElementById("culture-links");e&&(e.innerHTML=i.map(u).join("")),g(),m(),h()});function h(){const t=document.querySelector(".hero");if(t)for(let r=0;r<8;r++){const e=document.createElement("span");e.className="petal",e.style.animationDelay=`${Math.random()*15}s`,e.style.left=`${Math.random()*100}%`,e.style.animationDuration=`${8+Math.random()*10}s`,t.appendChild(e)}}
