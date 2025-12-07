// js/item.js
const qs = s => document.querySelector(s);

function getParam(name){ return new URLSearchParams(location.search).get(name); }

function saveFavorite(item){
  try{
    const KEY = 'ogf_favorites_v1';
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    if(!list.find(i => i.id == item.id)){
      list.unshift({id:item.id,title:item.title,price:item.price,image:item.image});
      localStorage.setItem(KEY, JSON.stringify(list));
      alert('Saved to favorites');
    } else {
      alert('Already in favorites');
    }
  }catch(e){ console.error(e); }
}

async function loadItem(){
  const id = getParam('id');
  if(!id){
    qs('#itemDetails').innerHTML = '<p>Missing item id</p>';
    return;
  }
  qs('#itemDetails').innerHTML = '<p>Loading...</p>';
  try{
    const it = await API.getProduct(id);
    qs('#itemDetails').innerHTML = `
      <div class="detail">
        <div style="display:flex;gap:16px;flex-wrap:wrap">
          <img src="${it.image}" alt="${it.title}" style="width:340px;max-width:100%;height:260px;object-fit:cover;border-radius:8px">
          <div style="flex:1;min-width:220px">
            <h2>${it.title}</h2>
            <p class="price">$${it.price}</p>
            <p>${it.description || 'No description available.'}</p>
            <div style="margin-top:12px">
              <button id="favBtn">Save to Favorites</button>
            </div>
          </div>
        </div>
      </div>
    `;
    qs('#favBtn').addEventListener('click', ()=>saveFavorite(it));
  }catch(e){
    qs('#itemDetails').innerHTML = '<p>Error loading item details.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadItem);
