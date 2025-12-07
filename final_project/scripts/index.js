// js/index.js
const CATEGORIES = [
  {id:'tents', title:'Tents', example:'tent'},
  {id:'backpacks', title:'Backpacks', example:'backpack'},
  {id:'sleeping-bags', title:'Sleeping Bags', example:'sleeping bag'},
  {id:'hammocks', title:'Hammocks', example:'hammock'}
];

const qs = s => document.querySelector(s);

function createCard(item){
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${item.image}" alt="${escapeHtml(item.title)}">
    <div class="title">${escapeHtml(item.title)}</div>
    <div class="price">$${item.price}</div>
  `;
  card.addEventListener('click', ()=> {
    window.location.href = `item.html?id=${encodeURIComponent(item.id)}`;
  });
  return card;
}

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function renderCategories(){
  const el = qs('#categories');
  el.innerHTML = '';
  CATEGORIES.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-btn';
    btn.textContent = cat.title;
    btn.addEventListener('click', ()=> {
      // navigate to category page
      window.location.href = `categories.html?cat=${encodeURIComponent(cat.example)}&title=${encodeURIComponent(cat.title)}`;
    });
    el.appendChild(btn);
  });
}

async function loadFeatured(){
  const grid = qs('#productsGrid');
  grid.innerHTML = '<p>Loading...</p>';
  try{
    // a broad search term to show many items on home page
    const items = await API.searchProducts('camp');
    grid.innerHTML = '';
    if(!items || items.length === 0){
      grid.innerHTML = '<p>No items found.</p>';
      return;
    }
    items.forEach(it => grid.appendChild(createCard(it)));
  }catch(e){
    grid.innerHTML = '<p>Error loading items.</p>';
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderCategories();
  loadFeatured();

  const form = qs('#searchForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const q = qs('#searchInput').value.trim();
    if(!q) return;
    window.location.href = `search.html?q=${encodeURIComponent(q)}`;
  });
});
