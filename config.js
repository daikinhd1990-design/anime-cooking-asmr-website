/**
 * ============================================================================
 * ANIME COOKING ASMR — GENERAL WEBSITE CONFIGURATION (config.js)
 * ============================================================================
 * Official branding assets (avatar, banner, favicon) and Google Sheets
 * live product feed (CSV) are configured here.
 */

const SITE_CONFIG = {
  brandName: "Anime Cooking ASMR",
  slogan: "A little anime magic in every bite.",
  youtubeChannelUrl: "https://www.youtube.com/channel/UCTxSZlfMkxZZ88-GN22Z1sg",
  contactEmail: "hello@animecookingasmr.com",
  affiliateDisclosure:
    "Disclosure: This website may contain Shopee Affiliate links. If you make a qualifying purchase through these links, we may earn a commission at no additional cost to you.",

  /**
   * GOOGLE SHEETS PRODUCT DATABASE (Published CSV URL)
   * Leave empty ("") to use the local PRODUCTS list in resources.js instead.
   */
  productsSheetCsvUrl:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRmM4YH0nlME5QwybEWme-em5TBVFPli1N_fpKtCPqPIn6paFd7AKQPqfT7OglpEH0luwpFaBZy9Adh/pub?gid=0&single=true&output=csv",

  branding: {
    logoUrl: "assets/avatar.jpg",
    heroBannerUrl: "assets/banner.jpg",
    characterCardUrl: "assets/character-card.jpg",
    faviconUrl: "assets/favicon.png"
  }
};
