const searchButton = document.getElementById("searchButton");
const ingredientInput = document.getElementById("ingredientField");
const contentWrapper = document.getElementById("contentContainer");
const randomRecipeBox = document.getElementById("randomRecipeBox");

async function fetchRandomDishes() {
  contentWrapper.innerHTML = ""; 

  try {
    const response = await fetch("/recipes/random");
    const dishes = await response.json();

    if (!Array.isArray(dishes) || dishes.length === 0) {
      randomRecipeBox.innerHTML = "<p>No random dishes found</p>";
      return;
    }

    dishes.forEach(dish => {
      const dishCard = createDishCard(dish);
      randomRecipeBox.appendChild(dishCard);
    });
  } catch (error) {
    randomRecipeBox.innerHTML = "<p>There was an error fetching the dishes, please try again later</p>";
    console.error(error);
  }
}

function createDishCard(dish) {
  const dishCard = document.createElement("div");
  dishCard.classList.add("dish-card");

  const usedIngredients = dish.usedIngredients?.join(", ") || dish.ingredients?.join(", ") || "-";
  const missingIngredients = dish.missedIngredients?.join(", ") || "-";

  dishCard.innerHTML = `
    <h3>${dish.title}</h3>
    <img src="${dish.image}" alt="${dish.title}" class="dish-image">
    <p><strong>Used Ingredients:</strong> ${usedIngredients}</p>
    <p><strong>Missing Ingredients:</strong> ${missingIngredients}</p>
    <button class="addFavoriteBtn">Add to Favorites</button>
    ${dish.id ? `<a href="recipeDetails.html?id=${dish.id}" class="view-recipe-link">View Recipe</a>` : ""}
  `;

  dishCard.querySelector(".addFavoriteBtn").addEventListener("click", () => {
    addToFavorites(dish);
  });

  return dishCard;
}

searchButton.addEventListener("click", async () => {
  const ingredients = ingredientInput.value.trim();
  randomRecipeBox.innerHTML = "";
  contentWrapper.innerHTML = "";

  if (!ingredients) {
    contentWrapper.innerHTML = "<p>Please enter some ingredients to search for</p>";
    return;
  }

  try {
    const response = await fetch(`/recipes/search?ingredients=${encodeURIComponent(ingredients)}`);
    const searchResults = await response.json();

    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      contentWrapper.innerHTML = "<p>No recipes found with the given ingredients</p>";
      return;
    }

    searchResults.forEach(dish => {
      const dishCard = createDishCard(dish);
      contentWrapper.appendChild(dishCard);
    });
  } catch (error) {
    contentWrapper.innerHTML = "<p>There was an error fetching the recipes, please try again later</p>";
    console.error(error);
  }
});

function addToFavorites(dish) {
  fetch('/recipes/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipe_id: dish.id || null,
      user_id: 1, // ضع رقم معرف المستخدم هنا
    }),
  })
  .then(response => response.json())
  .then(data => {
    alert("Recipe added to favorites");
  })
  .catch(error => console.error("Error adding recipe:", error));
}

document.addEventListener("DOMContentLoaded", fetchRandomDishes);
