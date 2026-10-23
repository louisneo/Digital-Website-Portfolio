// Shared navigation, footer, and scroll animation
const pages=[["index.html","Home"],["profile.html","Profile"],["analyses.html","Analyses"],["favorite.html","Favorite"],["summary.html","Summary"],["reflection.html","Reflection"]];
const cur=location.pathname.split("/").pop()||"index.html";
document.body.insertAdjacentHTML("afterbegin",`<nav><a class="brand" href="index.html">My Literary Journey</a><ul>${pages.map(([h,t])=>`<li><a href="${h}" class="${h===cur?"active":""}">${t}</a></li>`).join("")}</ul></nav>`);
document.body.insertAdjacentHTML("beforeend",`<footer>My Literary Journey: A Great Books Digital Portfolio &middot; Images: Wikimedia Commons / own work &middot; Replace highlighted text with your own content.</footer>`);
const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add("show")),{threshold:.1});
document.querySelectorAll(".fade").forEach(el=>io.observe(el));
