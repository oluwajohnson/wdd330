// Main UI logic - uses the API and Favorites modules
import API from './api.js';
import Favorites from './favorites.js';

const CATEGORIES = [
  {id:'tents', title:'Tents', desc:'Shelter for 1-4 people', example:'tent'},
  {id:'backpacks', title:'Backpacks', desc:'Daypacks and multi-day packs', example:'backpack'},
  {id:'sleeping-bags', title:'Sleeping Bags', desc:'Warm and compact sleeping bags', example:'sleeping bag'},
  {id:'hammocks', title:'Hammocks', desc:'Lightweight resting hammocks', example:'hammock'}
];

const qs = sel => document.querySelector(sel);
const qsa = sel => [...document.querySelectorAll(sel)];

function showToast(txt, ms=2200){
  const t = qs('#toast');
  t.textContent = txt;
  t.classList.remove('hide');
  setTimeout(()=>t.classList.add('hide'), ms);
}

function renderCategories(){
  const el = qs('#categories');
  el.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'category-card';
    card.innerHTML = `<h3>${cat.title}</h3><p>${cat.desc}</p><small>Try: "${cat.example}"</small>`;
    card.addEventListener('click', ()=>loadCategory(cat));
    el.appendChild(card);
  });
}

async function loadCategory(cat){
  showSection('results');
  qs('#resultsTitle').textContent = `Category: ${cat.title}`;
  qs('#productsGrid').innerHTML = '<p>Loading...</p>';
  try{
    const data = await API.searchProducts(cat.example);
    // support common shapes: if data.products or data.results, normalize to array of items
    let items = data?.products || data?.results || data || [];
    if(!Array.isArray(items)) items = Object.values(items);
    if(items.length === 0) qs('#productsGrid').innerHTML = '<p>No items found.</p>';
    else renderProducts(items);
  }catch(e){
    qs('#productsGrid').innerHTML = '<p class="error">API error or no results. See console for details.</p>';
  }
}

function renderProducts(items){
  const grid = qs('#productsGrid');
  grid.innerHTML = '';
  items.forEach(it => {
    // normalize fields used by UI
    const id = it.id ?? it.productId ?? it._id ?? Math.random().toString(36).slice(2,9);
    const title = it.title || it.name || it.productName || 'Untitled';
    const price = (it.price || it.pricePerUnit || it.amount || 0).toString();
    const img = it.image || it.images?.[0] || 'images/placeholder.jpg';
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img loading="lazy" src="${img}" alt="${title}">
      <div class="title">${title}</div>
      <div class="price">$${price}</div>
      <div class="row" style="display:flex;gap:8px;margin-top:auto">
        <button data-id="${id}" class="viewBtn">View</button>
        <button data-id="${id}" class="favBtn">❤</button>
      </div>
    `;
    // attach events
    card.querySelector('.viewBtn').addEventListener('click', ()=>viewProduct(it));
    card.querySelector('.favBtn').addEventListener('click', ()=>{
      Favorites.toggle({ id, title, price, image: img });
      renderFavorites();
      showToast('Updated favorites');
    });
    grid.appendChild(card);
  });
}

async function viewProduct(it){
  showSection('detail');
  const id = it.id ?? it.productId ?? it._id;
  const detailEl = qs('#detail');
  detailEl.innerHTML = '<p>Loading...</p>';
  try{
    let product = it;
    if(id && (!it.description && !it.details)){
      product = await API.getProduct(id).catch(()=>it);
    }
    const title = product.title || product.name || 'Product';
    const img = product.image || product.images?.[0] || 'images/placeholder.jpg';
    const price = product.price || product.pricePerUnit || '0';
    const desc = product.description || product.summary || 'No description provided by API.';
    detailEl.innerHTML = `
      <div class="detail">
        <button id="backBtn">← Back</button>
        <div style="display:flex;gap:16px;margin-top:12px">
          <img src="${img}" alt="${title}" style="width:320px;max-width:40vw;height:260px;object-fit:cover;border-radius:10px">
          <div>
            <h2>${title}</h2>
            <p class="price">$${price}</p>
            <p>${desc}</p>
            <div style="margin-top:12px">
              <button id="favDetail">Save to Favorites</button>
            </div>
          </div>
        </div>
      </div>
    `;
    qs('#backBtn').addEventListener('click', ()=> showSection('results'));
    qs('#favDetail').addEventListener('click', ()=>{
      Favorites.add({id, title, price, image: img});
      renderFavorites();
      showToast('Saved to favorites');
    });
    // store recently viewed
    try{
      let rv = JSON.parse(localStorage.getItem('ogf_recent')||'[]');
      rv = rv.filter(x=>x.id!==id);
      rv.unshift({id,title,price,image:img});
      localStorage.setItem('ogf_recent', JSON.stringify(rv.slice(0,8)));
    }catch(e){}
  }catch(e){
    detailEl.innerHTML = '<p>Error loading product details.</p>';
  }
}

function renderFavorites(){
  const panel = qs('#favoritesList');
  const list = Favorites.load();
  if(!list.length) panel.innerHTML = '<p>No favorites yet.</p>';
  else panel.innerHTML = list.map(i=>`
    <div class="card" style="display:flex;gap:8px;align-items:center">
      <img src="${i.image}" style="width:64px;height:48px;object-fit:cover;border-radius:6px">
      <div style="flex:1">
        <div style="font-weight:600">${i.title}</div>
        <div style="color:#666">$${i.price}</div>
      </div>
      <button data-id="${i.id}" class="removeFav">Remove</button>
    </div>
  `).join('');
  qsa('.removeFav').forEach(btn=>btn.addEventListener('click', e=>{
    Favorites.remove(e.target.dataset.id);
    renderFavorites();
    showToast('Removed');
  }));
}

function showSection(name){
  qs('#categories').classList.toggle('hide', name!=='categories');
  qs('#results').classList.toggle('hide', name!=='results');
  qs('#detail').classList.toggle('hide', name!=='detail');
}

function wireUp(){
  renderCategories();
  renderFavorites();

  qs('#searchBtn').addEventListener('click', async ()=>{
    const term = qs('#searchInput').value.trim();
    if(!term) { showToast('Type a search term'); return; }
    showSection('results');
    qs('#resultsTitle').textContent = `Search: ${term}`;
    qs('#productsGrid').innerHTML = '<p>Loading...</p>';
    try{
      const data = await API.searchProducts(term);
      let items = data?.products || data?.results || data || [];
      if(!Array.isArray(items)) items = Object.values(items);
      renderProducts(items);
    }catch(e){
      qs('#productsGrid').innerHTML = '<p class="error">Search failed.</p>';
    }
  });

  qs('#favoritesToggle').addEventListener('click', ()=>{
    qs('#favoritesPanel').classList.toggle('hide');
  });

  qs('#sortSelect').addEventListener('change', ()=>{
    const sel = qs('#sortSelect').value;
    const cards = [...qs('#productsGrid').children].map(c=>{
      const title = c.querySelector('.title')?.textContent || '';
      const priceText = c.querySelector('.price')?.textContent.replace('$','')||'0';
      const price = parseFloat(priceText) || 0;
      return {el:c, price, title};
    });
    if(sel==='price-asc') cards.sort((a,b)=>a.price-b.price);
    else if(sel==='price-desc') cards.sort((a,b)=>b.price-a.price);
    qs('#productsGrid').innerHTML = '';
    cards.forEach(c=>qs('#productsGrid').appendChild(c.el));
  });

  // initial view
  showSection('categories');
}

document.addEventListener('DOMContentLoaded', wireUp);
