import"./main-CvTj3pQc.js";import{s as S,a as h,b as $}from"./stories-BUp7AVYm.js";function L(t){const n=t.tags.map(e=>e==="经典必读"?`<span class="tag tag--gold">${e}</span>`:e==="孩子最爱"?`<span class="tag tag--cinnabar">${e}</span>`:e==="适合讨论"?`<span class="tag tag--jade">${e}</span>`:`<span class="tag">${e}</span>`).join("");return`
  <div class="story-row-card" data-id="${t.id}">
    <div class="story-row-card__cover" style="background: ${t.gradient}">
      <span class="story-row-card__cover-art" style="color: ${q(t)}">${t.title.charAt(0)}${t.title.length>2?t.title.charAt(1):""}</span>
    </div>
    <div class="story-row-card__content">
      <div class="story-row-card__top">
        <h3 class="story-row-card__title">${t.title}</h3>
        ${n}
      </div>
      <p class="story-row-card__summary">${t.summary}</p>
      <div class="story-row-card__meta">
        <span class="tag">${t.tags[0]||""}</span>
        <span>阅读约 ${t.readingTime} 分钟</span>
        <span>适合 ${t.ageRange}</span>
      </div>
    </div>
  </div>`}function q(t){const n=t.gradient.match(/#[0-9a-fA-F]{6}/g);return n?n[n.length-1]:"#333"}function C(t){const n=t.content?`<article class="story-text">${t.content}</article>`:'<article class="story-text"><p>该故事的完整内容正在撰写中，敬请期待。</p></article>',e=t.discussion?`<div class="discussion-box">
        <h3>与孩子聊聊这个故事</h3>
        <p>读完故事后，可以和孩子讨论下面这些话题：</p>
        <ul class="discussion-questions">
          ${t.discussion.map((r,o)=>`<li><span class="num">${o+1}</span><span>${r}</span></li>`).join("")}
        </ul>
      </div>`:"";return`
  <div class="story-reader__header">
    <p class="story-reader__category">${t.era} · ${t.category}</p>
    <h1 class="story-reader__title">${t.title}</h1>
    <p class="story-reader__subtitle">中国经典神话故事</p>
    <div class="story-reader__divider"><span>◆</span></div>
  </div>
  ${n}
  ${e}`}function f(t){const n=document.getElementById("stories-list-content");if(!n)return;const e=h(t);if(e.length===0){n.innerHTML='<p style="text-align: center; color: var(--ink-muted); padding: 40px 0;">该分类暂无故事</p>';return}const r=new Map;e.forEach(s=>{const c=s.category;r.has(c)||r.set(c,[]),r.get(c).push(s)});let o="";r.forEach((s,c)=>{o+=`<h3 class="stories-list__group-title">${c}</h3>`,s.forEach(d=>{o+=L(d)})}),n.innerHTML=o,n.querySelectorAll(".story-row-card").forEach(s=>{s.style.cursor="pointer",s.addEventListener("click",()=>{const c=s.dataset.id;c&&p(c,t)})})}let l=null,i="";function p(t,n){const e=$(t);if(!e)return;l=t,i=n||"";const r=document.getElementById("story-reader-content");r&&(r.innerHTML=C(e));const o=document.querySelector('[style*="paper-deep"]');o&&o.scrollIntoView({behavior:"smooth"}),history.pushState(null,"",`?category=${encodeURIComponent(i)}&id=${t}`),y()}function B(){const t=document.querySelectorAll(".category-chip");t.forEach(n=>{const e=n.querySelector(".category-chip__count"),r=n.querySelector(".category-chip__label");if(!e||!r)return;const o=r.textContent||"";if(o==="全部故事")e.textContent=`${S.length} 篇`;else{const s=S.filter(c=>c.category===o).length;e.textContent=`${s} 篇`}}),t.forEach(n=>{n.addEventListener("click",()=>{t.forEach(o=>o.classList.remove("category-chip--active")),n.classList.add("category-chip--active");const e=n.querySelector(".category-chip__label"),r=(e==null?void 0:e.textContent)||"";r==="全部故事"?(i="",history.pushState(null,"","")):(i=r,history.pushState(null,"",`?category=${encodeURIComponent(r)}`)),f(i)})})}function I(){const t=document.querySelector(".reader-toolbar"),n=document.querySelector('[style*="paper-deep"]');if(!t)return;let e=17;const r=t.querySelectorAll("button"),o=r[0],s=r[1];o&&o.addEventListener("click",()=>{e=Math.max(14,e-1);const a=document.querySelector(".story-text");a&&(a.style.fontSize=`${e}px`)}),s&&s.addEventListener("click",()=>{e=Math.min(24,e+1);const a=document.querySelector(".story-text");a&&(a.style.fontSize=`${e}px`)});const c=r[2],d=r[3];c&&c.addEventListener("click",()=>_(-1)),d&&d.addEventListener("click",()=>_(1));const u=r[4];u&&u.addEventListener("click",()=>{if(!l)return;const a=x();a[l]=!a[l],localStorage.setItem("favorites",JSON.stringify(a)),y()});const m=document.querySelector(".reader-toolbar__progress-bar");function b(){if(!m)return;const a=document.querySelector(".story-text");if(!a)return;const g=a.scrollHeight-a.clientHeight,w=-a.getBoundingClientRect().top,E=Math.min(100,Math.max(0,w/g*100));m.style.width=`${E}%`}function v(){if(!n)return;const a=n.getBoundingClientRect(),g=a.top<window.innerHeight&&a.bottom>0;t.classList.toggle("hidden",!g)}window.addEventListener("scroll",()=>{b(),v()}),v(),y()}function _(t){if(!l||!$(l))return;const e=h(i).sort((s,c)=>s.order-c.order),r=e.findIndex(s=>s.id===l);if(r===-1)return;const o=r+t;o<0||o>=e.length||p(e[o].id,i)}function x(){try{return JSON.parse(localStorage.getItem("favorites")||"{}")}catch{return{}}}function y(){const t=document.querySelector(".reader-toolbar");if(!t)return;const n=t.querySelectorAll("button"),e=n[4];if(e&&l){const s=x();e.textContent=s[l]?"★":"☆"}const r=n[2],o=n[3];if(l){const s=h(i).sort((d,u)=>d.order-u.order),c=s.findIndex(d=>d.id===l);r&&(r.disabled=c<=0),o&&(o.disabled=c>=s.length-1)}}document.addEventListener("DOMContentLoaded",()=>{const t=new URLSearchParams(location.search),n=t.get("category")||"",e=t.get("id")||"";i=n,B(),f(n),I(),e&&p(e,n),window.addEventListener("popstate",()=>{const r=new URLSearchParams(location.search);i=r.get("category")||"";const o=r.get("id")||"";f(i),o&&p(o,i)})});
