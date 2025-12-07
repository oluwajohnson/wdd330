// js/favorites.js
const qs = s => document.querySelector(s);
const KEY = 'ogf_favorites_v1';

function loadFavorites(){
  const grid = qs("#favoritesGrid");
  const raw = localStorage.getItem(KEY);
  const list = raw ? JSON.parse(raw) : [];

  if (list.length === 0) {
    grid.innerHTML = "<p>You have no saved items yet.</p>";
    return;
  }

  grid.innerHTML = "";

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="title">${item.title}</div>
      <div class="price">$${item.price}</div>
      <button class="remove-fav">Remove</button>
    `;

    // link to item page
    card.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-fav")) return;
      window.location.href = `item.html?id=${encodeURIComponent(item.id)}`;
    });

    // remove favorite
    card.querySelector(".remove-fav").addEventListener("click", () => {
      const updated = list.filter(f => f.id !== item.id);
      localStorage.setItem(KEY, JSON.stringify(updated));
      loadFavorites();
    });

    qs("#favoritesGrid").appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadFavorites);
