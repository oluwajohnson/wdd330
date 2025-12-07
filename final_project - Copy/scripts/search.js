// CONFIG
const API_BASE = "https://api.spoonacular.com/recipes/complexSearch";
const API_KEY = "47ea24bd4bb64c9788f42f9be7b7cdee"; // <-- replace this

// DOM ELEMENTS
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("results");

// Search Handler
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const query = searchInput.value.trim();

  if (query === "") {
    resultsContainer.innerHTML = "<p>Please enter a search term.</p>";
    return;
  }

  searchRecipes(query);
});

// Search Function
async function searchRecipes(query) {
  resultsContainer.innerHTML = "<p>Loading recipes...</p>";

  try {
    const res = await fetch(
      `${API_BASE}?query=${encodeURIComponent(query)}&number=20&apiKey=${API_KEY}`
    );

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      resultsContainer.innerHTML = "<p>No recipes found.</p>";
      return;
    }

    displayRecipes(data.results);

  } catch (error) {
    console.error(error);
    resultsContainer.innerHTML = "<p>Error fetching recipes.</p>";
  }
}

// Display Results
function displayRecipes(recipes) {
  resultsContainer.innerHTML = "";

  recipes.forEach(recipe => {
    const card = document.createElement("div");
    card.className = "recipe-card";

    card.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <button onclick="viewRecipe(${recipe.id})">View Recipe</button>
    `;

    resultsContainer.appendChild(card);
  });
}

// Redirect to detailed recipe page
function viewRecipe(id) {
  window.location.href = `recipe.html?id=${id}`;
}
