const config = window.SITE_CONFIG || {};
document.querySelectorAll("[data-youtube]").forEach(link => link.href = config.youtubeChannelUrl || "#");
document.querySelectorAll('a[href="mailto:hello@example.com"]').forEach(link => link.href = `mailto:${config.contactEmail || "hello@example.com"}`);
document.getElementById("year").textContent = new Date().getFullYear();

const videoGrid = document.getElementById("videoGrid");
(window.VIDEOS || []).forEach((video, index) => {
  const usableId = video.id && !video.id.startsWith("YOUR_");
  const href = usableId ? `https://www.youtube.com/watch?v=${encodeURIComponent(video.id)}` : (config.youtubeChannelUrl || "#");
  const card = document.createElement("article");
  card.className = "video-card";
  card.innerHTML = `<a href="${href}" target="_blank" rel="noopener"><div class="video-thumb"><img src="${video.image}" alt="${video.title}" loading="lazy"><span class="play-icon">▶</span></div><div class="video-meta"><span>${video.category}</span><h3>${video.title}</h3><p>${video.description}</p></div></a>`;
  videoGrid.appendChild(card);
});

const shopGrid = document.getElementById("shopGrid");
(window.PRODUCTS || []).forEach(product => {
  const card = document.createElement("article");
  card.className = "shop-card";
  const safeUrl = product.url || "#";
  card.innerHTML = `<div class="shop-image"><img src="${product.image}" alt="${product.name}" loading="lazy"></div><h3>${product.name}</h3><p>${product.description}</p><a href="${safeUrl}" target="_blank" rel="sponsored nofollow noopener">VIEW PRODUCT ↗</a>`;
  shopGrid.appendChild(card);
});

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
