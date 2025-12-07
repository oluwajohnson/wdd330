// // API module: configured for Spoonacular REAL endpoints

// const API = (() => {
//   const API_BASE = "https://api.spoonacular.com";
//   const API_KEY = "47ea24bd4bb64c9788f42f9be7b7cdee";

//   // Simple fetch helper
//   async function fetchJson(url) {
//     try {
//       const res = await fetch(url);
//       if (!res.ok) throw new Error("HTTP " + res.status);
//       return await res.json();
//     } catch (e) {
//       console.error("API error:", e);
//       throw e;
//     }
//   }

//   // =============== SEARCH PRODUCTS ===============
//   async function searchProducts(term) {
//     if (!term) return [];

//     const url =
//       `${API_BASE}/food/products/search?query=${encodeURIComponent(term)}&apiKey=${API_KEY}`;

//     const data = await fetchJson(url);

//     if (!data.products) return [];

//     // Normalize the response to your project format
//     return data.products.map(item => ({
//       id: item.id,
//       title: item.title,
//       image: item.image,
//       price: item.price || "N/A",
//       rating: item.score || 0,
//       category: "general"
//     }));
//   }

//   // =============== GET PRODUCT DETAILS ===============
//   async function getProduct(id) {
//     const url =
//       `${API_BASE}/food/products/${id}?apiKey=${API_KEY}`;

//     const item = await fetchJson(url);

//     return {
//       id: item.id,
//       title: item.title,
//       image: item.image || "",
//       description: item.description || "No description available",
//       price: item.price || "N/A",
//       rating: item.nutrition?.nutrients?.[0]?.amount || 0
//     };
//   }

//   return { searchProducts, getProduct };
// })();

// export default API;






// script/api.js
(function(){
  const API_BASE = "https://api.spoonacular.com";
  const API_KEY = "47ea24bd4bb64c9788f42f9be7b7cdee"; // replace if needed

  async function fetchJson(url){
    try{
      const res = await fetch(url);
      if(!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    }catch(e){
      console.error('API fetch error', e);
      throw e;
    }
  }

  function normalizeImage(img){
    if(!img) return 'assets/placeholder.jpg'; // add a placeholder file here
    // Spoonacular sometimes returns a filename; prefix if needed
    if(!img.startsWith('http')){
      // common Spoonacular product image prefix
      return `https://spoonacular.com/productImages/${img}`;
    }
    return img;
  }

  async function searchProducts(term){
    if(!term) return [];
    const url = `${API_BASE}/food/products/search?query=${encodeURIComponent(term)}&apiKey=${API_KEY}`;
    const data = await fetchJson(url);
    if(!data || !Array.isArray(data.products)) return [];
    return data.products.map(it => ({
      id: it.id,
      title: it.title,
      image: normalizeImage(it.image),
      price: it.price ?? "0",
      description: it.description ?? it.summary ?? "",
      raw: it
    }));
  }

  async function getProduct(id){
    if(!id) throw new Error('missing id');
    const url = `${API_BASE}/food/products/${id}?apiKey=${API_KEY}`;
    const it = await fetchJson(url);
    return {
      id: it.id,
      title: it.title,
      image: normalizeImage(it.image),
      price: it.price ?? "0",
      description: it.description ?? it.summary ?? "",
      raw: it
    };
  }


  // expose globally
  window.API = {
    searchProducts,
    getProduct
  };
})();


document.getElementById('timestamp').value = new Date().toISOString();// Footer last modified
document.getElementById("lastModified").textContent = document.lastModified;

// Current year
document.getElementById("currentyear").textContent = new Date().getFullYear();