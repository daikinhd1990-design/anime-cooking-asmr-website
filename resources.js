/**
 * ============================================================================
 * ANIME COOKING ASMR — DYNAMIC CONTENT & RESOURCES (resources.js)
 * ============================================================================
 * This is the main file you will edit whenever you want to:
 * 1. Add new YouTube videos (VIDEOS array)
 * 2. Update Food Gallery themes (FOOD_GALLERY array)
 * 3. Add or update Shopee Affiliate products (PRODUCTS array)
 *
 * IMPORTANT RULES FOR SHOPEE AFFILIATE:
 * - Only paste real Affiliate links generated from https://affiliate.shopee.vn/
 * - NEVER paste regular Shopee product links or fake URLs.
 * - If a product does not have a real Affiliate link yet, keep affiliateUrl: ""
 *   and the button will automatically show "LINK COMING SOON".
 */

const VIDEOS = [
  {
    id: "E8kWD06Ho18",
    title: "Strawberry Shortcake | Anime Cooking ASMR",
    description:
      "Fresh strawberries, soft whipped cream, and layered sponge cake crafted gently in a sunlit anime kitchen.",
    url: "https://www.youtube.com/shorts/E8kWD06Ho18"
  },
  {
    id: "fUIoV0St-y8",
    title: "Real Anime Beef Stew",
    description:
      "Slow-simmered tender beef, carrots, and rich savory broth bubbling warmly in a classic copper pot.",
    url: "https://www.youtube.com/shorts/fUIoV0St-y8"
  },
  {
    id: "MHXIDJ4M65w",
    title: "Grilled Yakitori | Anime Cooking ASMR",
    description:
      "Savory chicken and scallion skewers glazed with tare sauce and sizzling over glowing charcoal.",
    url: "https://www.youtube.com/shorts/MHXIDJ4M65w"
  }
];

const FOOD_GALLERY = [
  {
    id: "ramen-nights",
    tag: "Midnight Warmth",
    title: "Ramen Nights",
    description:
      "Rich golden broth, soft-boiled ajitama eggs, and rising steam under warm lantern light.",
    palette: ["#342638", "#D97970", "#D9B77B"]
  },
  {
    id: "sushi-stories",
    tag: "Delicate Craft",
    title: "Sushi Stories",
    description:
      "Precision slices, seasoned rice, and serene handmade moments inspired by traditional sushi counters.",
    palette: ["#4A354E", "#EFB8B5", "#FFFAF4"]
  },
  {
    id: "fluffy-desserts",
    tag: "Sweet Escape",
    title: "Fluffy Desserts",
    description:
      "Cloud-soft strawberry shortcakes, soufflé pancakes, and pastel patisserie treats straight out of anime.",
    palette: ["#6B4457", "#EFB8B5", "#D9B77B"]
  },
  {
    id: "cozy-comfort-bowls",
    tag: "Hearty & Homestyle",
    title: "Cozy Comfort Bowls",
    description:
      "Simmering beef stews, warm donburi bowls, and nostalgic home-cooked dinners for rainy evenings.",
    palette: ["#5B3A42", "#D9B77B", "#F8EFE6"]
  }
];

const PRODUCT_CATEGORIES = [
  "All",
  "Japanese Tableware",
  "Kitchen Tools",
  "Cookware",
  "Cute Kitchen"
];

/**
 * SHOPEE AFFILIATE PRODUCTS
 * Add as many products as you want by copying one object below.
 * Remember: Leave affiliateUrl as "" until you paste your real Shopee Affiliate link.
 */
const PRODUCTS = [
  {
    id: "ramen-pho-noodle-bowl",
    name: "Japanese Ramen & Pho Noodle Bowl",
    category: "Kitchen Tools",
    description:
      "Deep, cozy noodle bowl crafted for steaming late-night ramen, pho, and hearty anime comfort broths.",
    imageUrl: "",
    affiliateUrl: "https://s.shopee.vn/2gCr0RD9lh"
  },
  {
    id: "santoku-knife-bamboo-board",
    name: "Japanese Santoku Knife & Bamboo Cutting Board",
    category: "Kitchen Tools",
    description:
      "Balanced everyday chef knife paired with a warm natural bamboo board for crisp, satisfying ASMR prep.",
    imageUrl: "",
    affiliateUrl: ""
  },
  {
    id: "mini-ceramic-hotpot",
    name: "Cozy Mini Japanese Clay Pot (Donabe)",
    category: "Cookware",
    description:
      "Compact heat-retaining pot ideal for simmering individual stews, udon, and bubbling anime comfort meals.",
    imageUrl: "",
    affiliateUrl: ""
  },
  {
    id: "pastel-cat-chopstick-rest",
    name: "Cute Ceramic Cat Chopstick Rest & Spoon Set",
    category: "Cute Kitchen",
    description:
      "Charming pastel Japanese table accent that adds a soft, playful anime touch to every meal setup.",
    imageUrl: "",
    affiliateUrl: ""
  }
];
