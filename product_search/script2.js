const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const productList = document.getElementById("productList");
const categoryList = document.getElementById("categoryList");

const API_URL = "https://fakestoreapi.com/products";

// Initialize page
loadCategories();
loadAllProducts();


// LOAD CATEGORIES
async function loadCategories() {
  const res = await fetch(`${API_URL}/categories`);
  const categories = await res.json();

  categoryList.innerHTML = "";
  categories.forEach(cat => {
    const div = document.createElement("div");
    div.className = "category-item";
    div.textContent = cat;
    div.addEventListener("click", () => loadProductsByCategory(cat));
    categoryList.appendChild(div);
  });
}


// LOAD ALL PRODUCTS
async function loadAllProducts() {
  const res = await fetch(API_URL);
  const products = await res.json();
  displayProducts(products);
}


// LOAD BY CATEGORY
async function loadProductsByCategory(category) {
  const res = await fetch(`${API_URL}/category/${category}`);
  const products = await res.json();
  displayProducts(products);
}


// SEARCH FUNCTION — using the required API endpoint
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.toLowerCase().trim();

  if (query === "") {
    loadAllProducts();
    return;
  }

  try {
    const res = await fetch(`${API_URL}/search/${query}`);
    let results = await res.json();

    // If the API returns nothing or errors → fallback filter
    if (!results || results.length === 0) {
      const all = await fetch(API_URL).then(r => r.json());
      results = all.filter(item =>
        item.title.toLowerCase().includes(query)
      );
    }

    displayProducts(results);

  } catch (err) {
    console.log("Search API failed, using fallback.");
    const all = await fetch(API_URL).then(r => r.json());
    const results = all.filter(item =>
      item.title.toLowerCase().includes(query)
    );
    displayProducts(results);
  }
});


// Show all products again when search input is cleared
searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() === "") {
    loadAllProducts();
  }
});


// PRODUCT DETAIL LOADER — corrected endpoint
async function loadProductDetail(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const product = await res.json();
  displaySingleProduct(product);
}


// DISPLAY PRODUCTS
function displayProducts(products) {
  productList.innerHTML = "";

  if (!products || products.length === 0) {
    productList.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>$${product.price}</p>
      <button>Add to Cart</button>
    `;

    productList.appendChild(card);
  });
}
