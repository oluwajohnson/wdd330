const API_KEY = "47ea24bd4bb64c9788f42f9be7b7cdee"; // <-- replace this
const API_URL = "https://api.spoonacular.com/recipes";

const recipeDetails = document.getElementById("recipeDetails");

// Get ID from URL
const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

loadRecipe(recipeId);

// Fetch recipe details
async function loadRecipe(id) {
  recipeDetails.innerHTML = "Loading recipe...";

  try {
    const res = await fetch(
      `${API_URL}/${id}/information?includeNutrition=false&apiKey=${API_KEY}`
    );

    const data = await res.json();

    displayRecipe(data);

  } catch (error) {
    console.error(error);
    recipeDetails.innerHTML = "<p>Error loading recipe.</p>";
  }
}

// Render recipe data
function displayRecipe(recipe) {
  recipeDetails.innerHTML = `
    <img src="${recipe.image}" alt="${recipe.title}">

    <div class="recipe-header">
      <h2>${recipe.title}</h2>
      <p><strong>Ready in:</strong> ${recipe.readyInMinutes} min</p>
      <p><strong>Servings:</strong> ${recipe.servings}</p>
    </div>

    <div>
      <p class="section-title">Ingredients:</p>
      <ul>
        ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join("")}
      </ul>
    </div>

    <div>
      <p class="section-title">Instructions:</p>
      <p>${recipe.instructions || "No instructions provided."}</p>
    </div>

    <div class="buttons">
      <button class="fav-btn" onclick="addToFavorites(${recipe.id})">Add to Favorites</button>
      <button class="meal-btn" onclick="addToMealPlan(${recipe.id})">Add to Meal Plan</button>
      <button class="nutrition-btn" onclick="viewNutrition('${recipe.title}')">View Nutrition</button>
    </div>
  `;
}

/* -------------------------
   FAVORITES (LOCAL STORAGE)
--------------------------- */

function addToFavorites(id) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favs.includes(id)) {
    favs.push(id);
  }
  localStorage.setItem("favorites", JSON.stringify(favs));
  alert("Added to Favorites!");
}

/* -------------------------
   MEAL PLAN (LOCAL STORAGE)
--------------------------- */

function addToMealPlan(id) {
  let plan = JSON.parse(localStorage.getItem("mealPlan")) || [];
  plan.push({
    id,
    date: new Date().toISOString().split("T")[0] // today
  });

  localStorage.setItem("mealPlan", JSON.stringify(plan));
  alert("Added to Meal Plan!");
}

/* -------------------------
   VIEW NUTRITION (EDAMAM API)
--------------------------- */

function viewNutrition(title) {
  window.location.href = `nutrition.html?food=${encodeURIComponent(title)}`;
}
