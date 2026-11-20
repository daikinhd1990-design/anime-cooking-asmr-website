/**
 * ============================================================================
 * ANIME COOKING ASMR — APPLICATION LOGIC (app.js)
 * ============================================================================
 * Handles:
 * - Applying SITE_CONFIG brand details and official logo/banner/favicon
 * - Rendering YouTube Shorts videos with official thumbnails
 * - Rendering the Food Gallery moodboard
 * - Loading Shopee Affiliate products from Google Sheets (CSV) with
 *   automatic fallback to resources.js if offline or unavailable
 * - Rendering category filter tabs and validating Affiliate URLs
 *   (shows "LINK COMING SOON" when empty/invalid, "SHOP NOW" when valid)
 * - Mobile navigation toggle
 */

(function () {
  "use strict";

  let activeCategory = "All";
  let currentProducts = typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS) ? PRODUCTS.slice() : [];

  /**
   * Escape HTML to keep dynamic text safe.
   */
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Validate whether a product has a real, safe Affiliate URL.
   * Rejects empty strings, placeholders, non-HTTP(S) schemes, and fake links.
   */
  function isValidAffiliateUrl(url) {
    if (typeof url !== "string") return false;
    const trimmed = url.trim();
    if (!trimmed) return false;

    const lower = trimmed.toLowerCase();
    if (
      lower === "#" ||
      lower.includes("placeholder") ||
      lower.includes("example.com") ||
      lower.includes("coming-soon")
    ) {
      return false;
    }

    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch (err) {
      return false;
    }
  }

  /**
   * RFC-4180 compliant CSV parser (supports commas & newlines inside quotes).
   */
  function parseCsv(csvText) {
    const rows = [];
    let currentRow = [];
    let currentField = "";
    let inQuotes = false;

    const text = String(csvText || "").replace(/^\uFEFF/, "");

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];

      if (inQuotes) {
        if (char === '"' && nextChar === '"') {
          currentField += '"';
          i++;
        } else if (char === '"') {
          inQuotes = false;
        } else {
          currentField += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ",") {
          currentRow.push(currentField);
          currentField = "";
        } else if (char === "\r" && nextChar === "\n") {
          currentRow.push(currentField);
          rows.push(currentRow);
          currentRow = [];
          currentField = "";
          i++;
        } else if (char === "\n" || char === "\r") {
          currentRow.push(currentField);
          rows.push(currentRow);
          currentRow = [];
          currentField = "";
        } else {
          currentField += char;
        }
      }
    }

    if (currentField.length > 0 || currentRow.length > 0) {
      currentRow.push(currentField);
      rows.push(currentRow);
    }

    return rows;
  }

  /**
   * Convert parsed CSV rows into product objects using Row 1 headers.
   */
  function mapCsvRowsToProducts(rows) {
    if (!Array.isArray(rows) || rows.length < 2) return [];

    const headers = rows[0].map((h) => String(h || "").trim().toLowerCase());
    const idxId = headers.indexOf("id");
    const idxName = headers.indexOf("name");
    const idxCategory = headers.indexOf("category");
    const idxDescription = headers.indexOf("description");
    const idxImageUrl = headers.indexOf("imageurl");
    const idxAffiliateUrl = headers.indexOf("affiliateurl");

    if (idxName === -1) return [];

    const products = [];
    for (let r = 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || !row.length) continue;

      const name = String(row[idxName] || "").trim();
      if (!name) continue;

      const rawId = idxId !== -1 ? String(row[idxId] || "").trim() : "";
      const category = idxCategory !== -1 ? String(row[idxCategory] || "").trim() : "Kitchen Tools";
      const description = idxDescription !== -1 ? String(row[idxDescription] || "").trim() : "";
      const imageUrl = idxImageUrl !== -1 ? String(row[idxImageUrl] || "").trim() : "";
      const affiliateUrl = idxAffiliateUrl !== -1 ? String(row[idxAffiliateUrl] || "").trim() : "";

      products.push({
        id: rawId || `sheet-product-${r}`,
        name: name,
        category: category || "Kitchen Tools",
        description: description,
        imageUrl: imageUrl,
        affiliateUrl: affiliateUrl
      });
    }

    return products;
  }

  /**
   * Fetch products from Google Sheets CSV URL (falls back to resources.js on error).
   */
  async function loadProductsFromGoogleSheet() {
    if (
      typeof SITE_CONFIG === "undefined" ||
      !SITE_CONFIG.productsSheetCsvUrl ||
      !SITE_CONFIG.productsSheetCsvUrl.trim()
    ) {
      return;
    }

    const csvUrl = SITE_CONFIG.productsSheetCsvUrl.trim();

    try {
      const response = await fetch(csvUrl, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const csvText = await response.text();
      const rows = parseCsv(csvText);
      const sheetProducts = mapCsvRowsToProducts(rows);

      if (sheetProducts.length > 0) {
        currentProducts = sheetProducts;
        renderStoreFilters();
        renderProducts(activeCategory);
      }
    } catch (err) {
      console.warn("Could not load products from Google Sheets, using resources.js fallback:", err);
    }
  }

  /**
   * Apply general configuration from config.js
   */
  function applySiteConfig() {
    if (typeof SITE_CONFIG === "undefined") return;

    // Brand names
    document.querySelectorAll("[data-brand-name]").forEach((el) => {
      el.textContent = SITE_CONFIG.brandName;
    });

    // Official YouTube channel links
    if (SITE_CONFIG.youtubeChannelUrl) {
      document.querySelectorAll("[data-youtube-channel]").forEach((link) => {
        link.href = SITE_CONFIG.youtubeChannelUrl;
      });
    }

    // Contact email
    if (SITE_CONFIG.contactEmail) {
      const emailText = document.getElementById("footer-contact-email");
      const emailLink = document.getElementById("footer-contact-link");
      if (emailText) emailText.textContent = SITE_CONFIG.contactEmail;
      if (emailLink) emailLink.href = `mailto:${SITE_CONFIG.contactEmail}`;
    }

    // Affiliate disclosure
    if (SITE_CONFIG.affiliateDisclosure) {
      const storeDisclosure = document.getElementById("store-affiliate-disclosure");
      const footerDisclosure = document.getElementById("footer-affiliate-disclosure");
      if (storeDisclosure) storeDisclosure.textContent = SITE_CONFIG.affiliateDisclosure;
      if (footerDisclosure) footerDisclosure.textContent = SITE_CONFIG.affiliateDisclosure;
    }

    // Official branding assets
    if (SITE_CONFIG.branding) {
      const { logoUrl, heroBannerUrl, characterCardUrl, faviconUrl } = SITE_CONFIG.branding;

      if (logoUrl && logoUrl.trim()) {
        document.querySelectorAll(".brand-emblem").forEach((wrap) => {
          wrap.innerHTML = `<img src="${escapeHtml(logoUrl.trim())}" alt="${escapeHtml(SITE_CONFIG.brandName)} Logo" />`;
        });
      }

      if (heroBannerUrl && heroBannerUrl.trim()) {
        const heroBackdrop = document.getElementById("hero-backdrop");
        if (heroBackdrop) {
          heroBackdrop.style.backgroundImage = `url('${heroBannerUrl.trim()}')`;
        }
      }

      if (characterCardUrl && characterCardUrl.trim()) {
        const charImg = document.getElementById("character-card-img");
        if (charImg) {
          charImg.src = characterCardUrl.trim();
        }
      }

      if (faviconUrl && faviconUrl.trim()) {
        let favicon = document.querySelector("link[rel='icon']");
        if (!favicon) {
          favicon = document.createElement("link");
          favicon.rel = "icon";
          document.head.appendChild(favicon);
        }
        favicon.href = faviconUrl.trim();
      }
    }

    // Dynamic copyright year
    const yearEl = document.getElementById("copyright-year");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  /**
   * Render YouTube Shorts from resources.js
   */
  function renderVideos() {
    const grid = document.getElementById("videos-grid");
    if (!grid || typeof VIDEOS === "undefined") return;

    if (!VIDEOS.length) {
      grid.innerHTML = `<div class="empty-state">New anime cooking videos are simmering. Check back soon!</div>`;
      return;
    }

    grid.innerHTML = VIDEOS.map((video) => {
      const videoId = escapeHtml(video.id);
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      const videoUrl = escapeHtml(video.url || `https://www.youtube.com/shorts/${videoId}`);
      const title = escapeHtml(video.title);
      const description = escapeHtml(video.description);

      return `
        <article class="video-card">
          <a href="${videoUrl}" class="video-thumb-link" target="_blank" rel="noopener noreferrer" aria-label="Watch ${title} on YouTube">
            <img src="${thumbnailUrl}" alt="${title}" class="video-thumb" loading="lazy" />
            <span class="video-badge">YouTube Short</span>
            <span class="video-play-btn" aria-hidden="true">
              <span class="video-play-circle">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </span>
            </span>
          </a>
          <div class="video-body">
            <h3 class="video-title">${title}</h3>
            <p class="video-desc">${description}</p>
            <a href="${videoUrl}" class="btn btn-primary video-watch-btn" target="_blank" rel="noopener noreferrer">
              Watch Video
            </a>
          </div>
        </article>
      `;
    }).join("");
  }

  /**
   * Generate a warm anime-styled SVG illustration for each Food Gallery theme
   */
  function createGallerySvg(item) {
    const [c1, c2, c3] = item.palette || ["#342638", "#D97970", "#D9B77B"];
    const motifs = {
      "ramen-nights": `
        <path d="M75 118C75 152 103 172 140 172C177 172 205 152 205 118H75Z" fill="#342638" stroke="${c3}" stroke-width="2.5"/>
        <ellipse cx="140" cy="118" rx="65" ry="14" fill="${c3}"/>
        <ellipse cx="140" cy="118" rx="58" ry="10" fill="${c2}"/>
        <ellipse cx="120" cy="116" rx="14" ry="8" fill="#FFFAF4"/>
        <circle cx="120" cy="116" r="5" fill="${c3}"/>
        <path d="M122 92C118 80 128 72 124 60" stroke="#FFFAF4" stroke-opacity="0.8" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M148 88C144 76 154 68 150 56" stroke="#FFFAF4" stroke-opacity="0.8" stroke-width="2.5" stroke-linecap="round"/>
      `,
      "sushi-stories": `
        <rect x="64" y="130" width="152" height="22" rx="6" fill="#342638"/>
        <rect x="82" y="106" width="44" height="24" rx="10" fill="#FFFAF4"/>
        <path d="M80 112C88 100 118 100 128 112C118 116 90 116 80 112Z" fill="#D97970"/>
        <rect x="148" y="106" width="44" height="24" rx="10" fill="#FFFAF4"/>
        <path d="M146 112C154 100 184 100 194 112C184 116 156 116 146 112Z" fill="#EFB8B5"/>
        <rect x="164" y="102" width="12" height="28" fill="#342638"/>
      `,
      "fluffy-desserts": `
        <ellipse cx="140" cy="158" rx="68" ry="12" fill="#FFFAF4" fill-opacity="0.9"/>
        <path d="M95 148V106C95 96 105 90 140 90C175 90 185 96 185 106V148H95Z" fill="#FFFAF4"/>
        <rect x="95" y="120" width="90" height="10" fill="#EFB8B5"/>
        <circle cx="140" cy="82" r="13" fill="#D97970"/>
        <path d="M134 71C140 66 146 66 148 72" stroke="#D9B77B" stroke-width="2.5" stroke-linecap="round"/>
      `,
      "cozy-comfort-bowls": `
        <ellipse cx="140" cy="156" rx="64" ry="14" fill="#2A1C2D" fill-opacity="0.3"/>
        <rect x="82" y="108" width="116" height="46" rx="18" fill="#8C4E3C" stroke="#D9B77B" stroke-width="2.5"/>
        <ellipse cx="140" cy="108" rx="58" ry="13" fill="#D9B77B"/>
        <circle cx="122" cy="108" r="8" fill="#D97970"/>
        <circle cx="152" cy="106" r="9" fill="#FFFAF4" fill-opacity="0.9"/>
        <path d="M138 86C134 74 146 66 140 54" stroke="#FFFAF4" stroke-opacity="0.85" stroke-width="2.5" stroke-linecap="round"/>
      `
    };

    const artwork = motifs[item.id] || motifs["ramen-nights"];

    return `
      <svg viewBox="0 0 280 210" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeHtml(item.title)} illustration">
        <defs>
          <linearGradient id="grad-${escapeHtml(item.id)}" x1="0" y1="0" x2="280" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="${c1}"/>
            <stop offset="100%" stop-color="${c2}"/>
          </linearGradient>
        </defs>
        <rect width="280" height="210" fill="url(#grad-${escapeHtml(item.id)})"/>
        <circle cx="220" cy="48" r="46" fill="${c3}" fill-opacity="0.22"/>
        ${artwork}
      </svg>
    `;
  }

  /**
   * Render Food Gallery from resources.js
   */
  function renderFoodGallery() {
    const grid = document.getElementById("gallery-grid");
    if (!grid || typeof FOOD_GALLERY === "undefined") return;

    grid.innerHTML = FOOD_GALLERY.map((item) => {
      return `
        <article class="gallery-card">
          <div class="gallery-art">
            ${createGallerySvg(item)}
          </div>
          <div class="gallery-info">
            <span class="gallery-tag">${escapeHtml(item.tag)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </div>
        </article>
      `;
    }).join("");
  }

  /**
   * Generate a tasteful placeholder SVG when a product does not have an imageUrl yet
   */
  function createProductPlaceholderSvg(category) {
    const label = escapeHtml(category);
    return `
      <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="product-image" role="img" aria-label="${label} preview">
        <rect width="320" height="240" fill="#F6EDE2"/>
        <circle cx="160" cy="108" r="54" fill="#F3B7A8" fill-opacity="0.45"/>
        <circle cx="160" cy="108" r="38" fill="#FFF9F2" stroke="#DDA96B" stroke-width="2"/>
        <path d="M138 110C138 122 148 130 160 130C172 130 182 122 182 110H138Z" fill="#4A332D"/>
        <path d="M134 109H186" stroke="#D95B57" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M153 98C153 93 156 92 156 88" stroke="#DDA96B" stroke-width="2" stroke-linecap="round"/>
        <path d="M164 98C164 93 167 92 167 88" stroke="#DDA96B" stroke-width="2" stroke-linecap="round"/>
        <text x="160" y="190" text-anchor="middle" fill="#7A5E56" font-family="DM Sans, sans-serif" font-size="13" font-weight="600">${label}</text>
      </svg>
    `;
  }

  /**
   * Build category list (default categories + any new categories from Google Sheets)
   */
  function getCategoriesList() {
    const base =
      typeof PRODUCT_CATEGORIES !== "undefined" && Array.isArray(PRODUCT_CATEGORIES)
        ? PRODUCT_CATEGORIES.slice()
        : ["All", "Japanese Tableware", "Kitchen Tools", "Cookware", "Cute Kitchen"];

    currentProducts.forEach((product) => {
      if (product.category && !base.includes(product.category)) {
        base.push(product.category);
      }
    });

    return base;
  }

  /**
   * Render store category filter buttons
   */
  function renderStoreFilters() {
    const filterContainer = document.getElementById("store-filters");
    if (!filterContainer) return;

    const categories = getCategoriesList();

    filterContainer.innerHTML = categories
      .map((category) => {
        const isActive = category === activeCategory;
        return `
          <button
            type="button"
            class="filter-btn ${isActive ? "is-active" : ""}"
            role="tab"
            aria-selected="${isActive ? "true" : "false"}"
            data-category="${escapeHtml(category)}"
          >
            ${escapeHtml(category)}
          </button>
        `;
      })
      .join("");

    filterContainer.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeCategory = btn.getAttribute("data-category") || "All";
        renderStoreFilters();
        renderProducts(activeCategory);
      });
    });
  }

  /**
   * Render Shopee Affiliate products
   */
  function renderProducts(categoryFilter) {
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    const filtered =
      !categoryFilter || categoryFilter === "All"
        ? currentProducts
        : currentProducts.filter((product) => product.category === categoryFilter);

    if (!filtered.length) {
      grid.innerHTML = `<div class="empty-state">More cozy kitchen items in this category are coming soon.</div>`;
      return;
    }

    grid.innerHTML = filtered
      .map((product) => {
        const name = escapeHtml(product.name);
        const category = escapeHtml(product.category);
        const description = escapeHtml(product.description);
        const hasImage = typeof product.imageUrl === "string" && product.imageUrl.trim().length > 0;
        const hasValidAffiliateLink = isValidAffiliateUrl(product.affiliateUrl);

        const imageMarkup = hasImage
          ? `<img src="${escapeHtml(product.imageUrl.trim())}" alt="${name}" class="product-image" loading="lazy" />`
          : createProductPlaceholderSvg(product.category);

        const actionMarkup = hasValidAffiliateLink
          ? `<a href="${escapeHtml(product.affiliateUrl.trim())}" class="btn btn-shopee" target="_blank" rel="sponsored nofollow noopener">SHOP NOW</a>`
          : `<button type="button" class="btn btn-coming-soon" disabled aria-disabled="true">LINK COMING SOON</button>`;

        return `
          <article class="product-card">
            <div class="product-image-wrap">
              ${imageMarkup}
              <span class="product-category-badge">${category}</span>
            </div>
            <div class="product-body">
              <h3 class="product-name">${name}</h3>
              <p class="product-desc">${description}</p>
              ${actionMarkup}
            </div>
          </article>
        `;
      })
      .join("");
  }

  /**
   * Mobile menu interaction
   */
  function initMobileNav() {
    const toggleBtn = document.getElementById("mobile-menu-toggle");
    const nav = document.getElementById("main-nav");
    if (!toggleBtn || !nav) return;

    function closeMenu() {
      nav.classList.remove("is-open");
      toggleBtn.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    }

    toggleBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggleBtn.classList.toggle("is-open", isOpen);
      toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  /**
   * Initialize website on DOM ready
   */
  document.addEventListener("DOMContentLoaded", () => {
    applySiteConfig();
    renderVideos();
    renderFoodGallery();
    renderStoreFilters();
    renderProducts(activeCategory);
    initMobileNav();
    loadProductsFromGoogleSheet();
  });
})();
