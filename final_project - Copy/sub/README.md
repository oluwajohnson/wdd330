# Outdoor Gear Finder (HTML + JS)

This is a school final project scaffold — a pure frontend app (HTML, CSS, JavaScript) that integrates with an external API (you asked to use api.spoonacular.com).

## Folder structure created
- index.html
- css/styles.css
- scripts/api.js
- scripts/main.js
- scripts/favorites.js
- data/mockProducts.json

## How to use
1. Unzip the package and open `index.html` in a modern browser.
2. Configure the API in `scripts/api.js`:
   - Set `API_BASE` to your product API base (or Spoonacular base if you have an API key).
   - Set `API_KEY` if required.
3. The project expects endpoints like:
   - `GET {API_BASE}/products/search/{term}`
   - `GET {API_BASE}/product/{id}`
   If your API differs, edit `scripts/api.js` to adapt the URLs.
4. A local fallback `data/mockProducts.json` is included for testing; you can fetch that file locally or serve via static server.

## Notes & Next steps
- Add real product images into an `images/` folder (placeholders used).
- Improve accessibility and add keyboard navigation where necessary.
- Optionally implement a simple router to keep URL in sync with the selected product/category.
