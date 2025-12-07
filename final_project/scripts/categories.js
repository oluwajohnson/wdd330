// js/categories.js
const qs = s => document.querySelector(s);

function createCard(item){
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${item.image}" alt="${item.title}">
    <div class="title">${item.title}</div>
    <div class="price">$${item.price}</div>
  `;
  card.addEventListener('click', ()=> {
    window.location.href = `item.html?id=${encodeURIComponent(item.id)}`;
  });
  return card;
}

function getParam(name){
  return new URLSearchParams(location.search).get(name);
}

async function loadCategory(){
  const cat = getParam('cat') || 'camp';
  const title = getParam('title') || cat;
  qs('#catTitle').textContent = `Category: ${title}`;

  const grid = qs('#productsGrid');
  grid.innerHTML = '<p>Loading...</p>';

  try{
    const items = await API.searchProducts(cat);
    grid.innerHTML = '';
    if(!items || items.length === 0){
      grid.innerHTML = '<p>No items found for this category.</p>';
      return;
    }
    items.forEach(it => grid.appendChild(createCard(it)));
  }catch(e){
    // grid.innerHTML = '<p>Error loading category items. </p>';
    grid.innerHTML = `<p>Error loading category items. ${e}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', loadCategory);
