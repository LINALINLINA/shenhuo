import "./styles/global.css";

/* === 导航 active 状态自动识别 === */
function setActiveNav() {
  const links = document.querySelectorAll<HTMLAnchorElement>(".nav__links a");
  const path = location.pathname.split("/").pop() || "index.html";
  links.forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href === path || (path === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/* === 移动端汉堡菜单 === */
function initMobileMenu() {
  const btn = document.querySelector<HTMLButtonElement>(".nav__hamburger");
  const links = document.querySelector<HTMLUListElement>(".nav__links");
  if (!btn || !links) return;

  btn.addEventListener("click", () => {
    btn.classList.toggle("open");
    links.classList.toggle("mobile-open");
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      btn.classList.remove("open");
      links.classList.remove("mobile-open");
    });
  });
}

/* === 初始化 === */
document.addEventListener("DOMContentLoaded", () => {
  setActiveNav();
  initMobileMenu();
});
