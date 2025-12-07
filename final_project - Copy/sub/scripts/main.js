// Main UI logic - uses the API and Favorites modules
import API from './api.js';
import Favorites from './favorites.js';

const CATEGORIES = [
  {id:'tents', title:'Tents', example:'tent'},
  {id:'backpacks', title:'Backpacks', example:'backpack'},
  {id:'sleeping-bags', title:'Sleeping Bags', example:'sleeping bag'},
  {id:'hammocks', title:'Hammocks', example:'hammock'}
];

const qs = sel => document.querySelector(sel);
const qsa = sel => [...document.querySelectorAll(sel)];

function showToast(txt, ms=2000){
  const t = qs('#toast');
  t.textContent = txt;
  t.classList.remove('hide');
  setTimeout(()=>t.classList.add('hide'), ms);
}

/* ----------------------------
   Render simple category buttons
-----------------------------*/
function renderCategories(){
  const el = qs('#categories');
  el.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.textContent = cat.title;
    btn.addEventListener('click', ()=>loadCategory(cat));
    el.appendChild(btn);
  });
}

/* ----------------------------
   Load category items
-----------------------------*/
async function loadCategory(cat){
  showSection('results');
  qs('#resultsTitle').textContent = `Category: ${cat.title}`;
  qs('#productsGrid').innerHTML = '<p>Loading...</p>';

  try {
    const data = await API.searchProducts(cat.example);
    let items = data?.products || data?.results || data || [];
    if(!Array.isArray(items)) items = Object.values(items);
    if(items.length === 0) qs('#productsGrid').innerHTML = '<p>No items found.</p>';
    else renderProducts(items);
  } catch {
    qs('#productsGrid').innerHTML = '<p class="error">API error.</p>';
  }
}

/* ----------------------------
   Render product cards
-----------------------------*/
function renderProducts(items){
  const grid = qs('#productsGrid');
  grid.innerHTML = '';

  items.forEach(it => {
    const id = it.id ?? it.productId ?? Math.random().toString(36).slice(2,9);
    const title = it.title || it.name || 'Untitled';
    const price = it.price || it.amount || 0;
    const img = it.image || it.images?.[0] || 'images/placeholder.jpg';

    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img loading="lazy" src="${img}" alt="${title}">
      <div class="title">${title}</div>
      <div class="price">$${price}</div>
      <div class="row" style="display:flex;gap:8px;margin-top:auto">
        <button class="viewBtn">View</button>
        <button class="favBtn">❤</button>
      </div>
    `;

    card.querySelector('.viewBtn').addEventListener('click', ()=>viewProduct(it));
    card.querySelector('.favBtn').addEventListener('click', ()=>{
      Favorites.toggle({ id, title, price, image:img });
      renderFavorites();
      showToast('Updated favorites');
    });

    grid.appendChild(card);
  });
}

/* ----------------------------
   Product detail view
-----------------------------*/
async function viewProduct(it){
  showSection('detail');
  const detailEl = qs('#detail');
  detailEl.innerHTML = '<p>Loading...</p>';

  const id = it.id ?? it.productId;

  try {
    let product = it;
    if(id && !it.description){
      product = await API.getProduct(id).catch(()=>it);
    }

    const title = product.title || product.name;
    const img = product.image || product.images?.[0] || 'images/placeholder.jpg';
    const price = product.price || 0;
    const desc = product.description || 'No description available.';

    detailEl.innerHTML = `
      <button id="backBtn">← Back</button>
      <div style="display:flex; gap:16px; margin-top:12px">
        <img src="${img}" style="width:320px; height:260px; object-fit:cover; border-radius:10px">
        <div>
          <h2>${title}</h2>
          <p class="price">$${price}</p>
          <p>${desc}</p>
          <button id="favDetail">Save to Favorites</button>
        </div>
      </div>
    `;

    qs('#backBtn').addEventListener('click', ()=>showSection('results'));
    qs('#favDetail').addEventListener('click', ()=>{
      Favorites.add({id, title, price, image:img});
      renderFavorites();
      showToast('Saved');
    });

  } catch {
    detailEl.innerHTML = '<p>Error loading details</p>';
  }
}

/* ----------------------------
   Favorites Panel
-----------------------------*/
function renderFavorites(){
  const panel = qs('#favoritesList');
  const list = Favorites.load();

  if(!list.length){
    panel.innerHTML = '<p>No favorites yet.</p>';
    return;
  }

  panel.innerHTML = list.map(i => `
    <div class="card" style="display:flex;gap:8px;align-items:center">
      <img src="${i.image}" style="width:64px;height:48px;object-fit:cover;border-radius:6px">
      <div style="flex:1">
        <div style="font-weight:600">${i.title}</div>
        <div style="color:#666">$${i.price}</div>
      </div>
      <button class="removeFav" data-id="${i.id}">Remove</button>
    </div>
  `).join('');

  qsa('.removeFav').forEach(btn =>
    btn.addEventListener('click', e=>{
      Favorites.remove(e.target.dataset.id);
      renderFavorites();
    })
  );
}

/* ----------------------------
   Show/hide sections
-----------------------------*/
// function showSection(name){
//   qs('#categories').classList.toggle('hide', name !== 'categories');
//   qs('#results').classList.toggle('hide', name !== 'results');
//   qs('#detail').classList.toggle('hide', name !== 'detail');
// }
function showSection(name){
  // Categories should ALWAYS be visible
  qs('#categories').classList.remove('hide');

  // Only toggle results + detail
  qs('#results').classList.toggle('hide', name !== 'results');
  qs('#detail').classList.toggle('hide', name !== 'detail');
}

/* ----------------------------
   Wire Page Events
-----------------------------*/
function wireUp(){
  renderCategories();
  renderFavorites();

  // SEARCH BUTTON
  qs('#searchBtn').addEventListener('click', async ()=>{
    const term = qs('#searchInput').value.trim();
    if(!term) return showToast('Type something');

    showSection('results');
    qs('#resultsTitle').textContent = `Search: ${term}`;
    qs('#productsGrid').innerHTML = '<p>Loading...</p>';

    try {
      const data = await API.searchProducts(term);
      let items = data?.products || data?.results || data || [];
      if(!Array.isArray(items)) items = Object.values(items);
      renderProducts(items);
    } catch {
      qs('#productsGrid').innerHTML = '<p>Error loading results</p>';
    }
  });

  // TOGGLE FAVORITES PANEL
  qs('#favoritesToggle').addEventListener('click', ()=>{
    qs('#favoritesPanel').classList.toggle('hide');
  });

  // DEFAULT VIEW → LOAD ITEMS IMMEDIATELY
  loadInitialProducts();
}

/* ----------------------------
   NEW: Load default items on page load
-----------------------------*/
// async function loadInitialProducts(){
//   showSection('results');
//   qs('#resultsTitle').textContent = 'All Items';
//   qs('#productsGrid').innerHTML = '<p>Loading...</p>';

//   try {
//     const data = await API.searchProducts("camp");
//     let items = data?.products || data?.results || data || [];
//     if(!Array.isArray(items)) items = Object.values(items);

//     if(items.length === 0)
//       qs('#productsGrid').innerHTML = '<p>No items found.</p>';
//     else
//       renderProducts(items);
//   } catch {
//     qs('#productsGrid').innerHTML = '<p>Error loading items.</p>';
//   }
// }



async function loadInitialProducts(){
  // DO NOT hide categories — leave page layout visible
  qs('#results').classList.remove('hide');
  qs('#resultsTitle').textContent = 'All Items';
  qs('#productsGrid').innerHTML = '<p>Loading...</p>';

  try {
    const data = await API.searchProducts("camp");
    let items = data || [];
    if(!Array.isArray(items)) items = Object.values(items);
    renderProducts(items);
  } catch {
    qs('#productsGrid').innerHTML = '<p>Error loading items</p>';
  }
}



document.addEventListener('DOMContentLoaded', wireUp);
