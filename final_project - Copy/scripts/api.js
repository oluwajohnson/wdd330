const API_BASE = "https://fakestoreapi.com/products";

export async function getAllProducts() {
  return fetch(API_BASE).then(res => res.json());
}

export async function getCategories() {
  return fetch(`${API_BASE}/categories`).then(res => res.json());
}

export async function getProductsByCategory(cat) {
  return fetch(`${API_BASE}/category/${cat}`).then(res => res.json());
}

export async function searchProducts(term) {
  return fetch(`${API_BASE}?limit=100`)
    .then(res => res.json())
    .then(products =>
      products.filter(p =>
        p.title.toLowerCase().includes(term.toLowerCase())
      )
    );
}

export async function getProductDetail(id) {
  return fetch(`${API_BASE}/${id}`).then(res => res.json());
}
