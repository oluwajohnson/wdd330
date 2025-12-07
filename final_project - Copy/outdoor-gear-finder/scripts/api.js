// API module: configure your API_BASE and API_KEY here.
// This project expects the following endpoints on the external API:
// GET {API_BASE}/products/search/{term}
// GET {API_BASE}/product/{id}
const API = (() => {
  // Default placeholders - replace with your Spoonacular or custom API info
  const API_BASE = "https://api.spoonacular.com"; // change to your product API base if needed
  const API_KEY = ""; // <-- INSERT YOUR API KEY here if required

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

  async function searchProducts(term){
    // Attempt to call a common products search route. If your API differs, update this function.
    if(!term) return [];
    // Example: custom route /products/search/{term}
    let url = `${API_BASE}/products/search/${encodeURIComponent(term)}`;
    if(API_KEY) url += `?apiKey=${API_KEY}`;
    try{
      return await fetchJson(url);
    }catch(e){
      // fallback: try spoonacular product search (if API key provided)
      if(API_KEY){
        let alt = `${API_BASE}/food/products/search?query=${encodeURIComponent(term)}&apiKey=${API_KEY}`;
        return await fetchJson(alt);
      }
      // if everything fails, bubble up
      throw e;
    }
  }

  async function getProduct(id){
    if(!id) throw new Error('missing id');
    let url = `${API_BASE}/product/${id}`;
    if(API_KEY) url += `?apiKey=${API_KEY}`;
    try{
      return await fetchJson(url);
    }catch(e){
      if(API_KEY){
        let alt = `${API_BASE}/food/products/${id}?apiKey=${API_KEY}`;
        return await fetchJson(alt);
      }
      throw e;
    }
  }

  return { searchProducts, getProduct };
})();

export default API;
