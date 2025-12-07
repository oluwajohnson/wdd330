// API module: configured for Spoonacular REAL endpoints

const API = (() => {
  const API_BASE = "https://api.spoonacular.com";
  const API_KEY = "47ea24bd4bb64c9788f42f9be7b7cdee";

  // Simple fetch helper
  async function fetchJson(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } catch (e) {
      console.error("API error:", e);
      throw e;
    }
  }

  // =============== SEARCH PRODUCTS ===============
  async function searchProducts(term) {
    if (!term) return [];

    const url =
      `${API_BASE}/food/products/search?query=${encodeURIComponent(term)}&apiKey=${API_KEY}`;

    const data = await fetchJson(url);

    if (!data.products) return [];

    // Normalize the response to your project format
    return data.products.map(item => ({
      id: item.id,
      title: item.title,
      image: item.image,
      price: item.price || "N/A",
      rating: item.score || 0,
      category: "general"
    }));
  }

  // =============== GET PRODUCT DETAILS ===============
  async function getProduct(id) {
    const url =
      `${API_BASE}/food/products/${id}?apiKey=${API_KEY}`;

    const item = await fetchJson(url);

    return {
      id: item.id,
      title: item.title,
      image: item.image || "",
      description: item.description || "No description available",
      price: item.price || "N/A",
      rating: item.nutrition?.nutrients?.[0]?.amount || 0
    };
  }

  return { searchProducts, getProduct };
})();

export default API;
