import { 
  getCategories,
  getAllProducts,
  searchProducts
} from "./api.js";

// DOM elements
const app = document.getElementById("app");

// INITIAL PAGE LOAD
initHomePage();

async function initHomePage() {
  app.innerHTML = `
    <div class="search-container">
      <input id="searchBar" placeholder="Search for outdoor gear…" />
    </div>

    <section class="category-section">
      <h2 class="section-title">Categories</h2>
      <div id="categoryGrid" class="category-grid"></div>
    </section>

    <section class="product-section">
      <h2 class="section-title">Featured Products</h2>
      <div id="productGrid" class="product-grid"></div>
    </section>
  `;

  loadCategories();
  loadFeaturedProducts();

  document.getElementById("searchBar").addEventListener("input", handleSearch);
}

// LOAD CATEGORIES
async function loadCategories() {
  const categories = await getCategories();
  const container = document.getElementById("categoryGrid");

  container.innerHTML = "";

  categories.forEach(cat => {
    const card = document.createElement("div");
    card.className = "category-card";
    card.textContent = cat;

    card.addEventListener("click", () => {
      window.location.href = `product-list.html?category=${cat}`;
    });

    container.appendChild(card);
  });
}

// LOAD FEATURED PRODUCTS
async function loadFeaturedProducts() {
  let products = await getAllProducts();
  products = products.slice(0, 8); // Show first 8 items

  displayProducts(products, "productGrid");
}

// SEARCH HANDLER
async function handleSearch(e) {
  const term = e.target.value.trim();

  if (term === "") {
    loadFeaturedProducts();
    return;
  }

  const results = await searchProducts(term);
  displayProducts(results, "productGrid");
}

// DISPLAY SHARED
function displayProducts(products, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h4>${p.title}</h4>
      <p>$${p.price}</p>
    `;

    card.addEventListener("click", () => {
      window.location.href = `product-detail.html?id=${p.id}`;
    });

    container.appendChild(card);
  });
}
