# Anime Cooking ASMR — website starter

A responsive, anime-inspired landing page for a YouTube cooking/ASMR channel, built with plain HTML, CSS and JavaScript.

## Files
- `index.html` — website structure
- `styles.css` — responsive design
- `config.js` — channel URL and contact email
- `resources.js` — video gallery and affiliate product cards
- `app.js` — renders cards and mobile navigation

## Before publishing
1. Open `config.js` and replace `YOUR_CHANNEL_HANDLE` with your real YouTube channel handle or full channel URL.
2. Open `resources.js` and replace the sample video IDs, titles, descriptions and image URLs.
3. Replace each product `url: "#"` with your actual affiliate link. Do not publish placeholder links as affiliate links.
4. Replace `hello@example.com` with a contact email you control.
5. Check image usage rights and use images you own, have licensed, or are permitted to embed.
6. Add your affiliate disclosure and comply with the rules of the affiliate program you join.

## Deploy with GitHub + Cloudflare Pages
Create a new GitHub repository, for example `anime-cooking-asmr-website`, and upload all files from this folder to the repository root.

In Cloudflare:
1. Open **Workers & Pages**.
2. Choose **Create application** and select the **Pages** tab.
3. Choose **Connect to Git** / **Import an existing Git repository**.
4. Select the GitHub repository and branch `main`.
5. Framework preset: **None** (or no framework).
6. Build command: leave blank (or use `exit 0` if the dashboard requires a command).
7. Build output directory: `/` or `.` depending on the dashboard's accepted value; the repository root must contain `index.html`.
8. Deploy.

Cloudflare Pages Git integration automatically deploys new commits pushed to the connected repository.

## Important
This is a static front-end starter. It does not include a shopping cart, order processing, analytics, or an affiliate account. Affiliate tracking and commissions are handled by the affiliate network. Replace all sample content before public launch.
