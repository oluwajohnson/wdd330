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


// SEARCH FUNCTION
searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.toLowerCase().trim();

  // if search box is empty → reload all products
  if (query === "") {
    loadAllProducts();
    return;
  }

  const res = await fetch(API_URL);
  const data = await res.json();

  const results = data.filter(item =>
    item.title.toLowerCase().includes(query)
  );

  displayProducts(results);
});


// Clear search results when input is cleared
searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() === "") {
    loadAllProducts();  // show everything again
  }
});




// DISPLAY PRODUCTS
function displayProducts(products) {
  productList.innerHTML = "";

  if (products.length === 0) {
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
