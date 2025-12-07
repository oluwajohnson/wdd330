// js/search.js
const qs = s => document.querySelector(s);
function getParam(name){ return new URLSearchParams(location.search).get(name); }

function createCard(item){
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${item.image}" alt="${item.title}">
    <div class="title">${item.title}</div>
    <div class="price">$${item.price}</div>
  `;
  card.addEventListener('click', ()=> window.location.href = `item.html?id=${encodeURIComponent(item.id)}`);
  return card;
}

async function runSearch(){
  const q = getParam('q') || '';
  qs('#searchTitle').textContent = `Search: ${q}`;
  const grid = qs('#productsGrid');
  grid.innerHTML = '<p>Loading...</p>';
  try{
    const items = await API.searchProducts(q);
    grid.innerHTML = '';
    if(!items || items.length === 0) {
      grid.innerHTML = '<p>No results found.</p>';
      return;
    }
    items.forEach(it => grid.appendChild(createCard(it)));
  }catch(e){
    grid.innerHTML = '<p>Error searching items.</p>';
  }
}

document.addEventListener('DOMContentLoaded', runSearch);
