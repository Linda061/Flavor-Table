function getRandomRecipe() {
    fetch('/random-recipe')
        .then(response => response.json())
        .then(data => {
            if (data && data.title) {
                const randomRecipe = `
                    <h3>${data.title}</h3>
                    <img src="${data.image}" alt="${data.title}" style="width: 200px; height: auto;">
                    <p>${data.instructions || 'No instructions available'}</p>
                    <ul>
                        ${data.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                    </ul>
                    <button onclick="saveToFavorites(${JSON.stringify(data)})">Save to Favorites</button>
                `;
                document.getElementById('randomRecipe').innerHTML = randomRecipe;
            } else {
                document.getElementById('randomRecipe').innerHTML = '<p>No random recipe found.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching random recipe:', error);
            document.getElementById('randomRecipe').innerHTML = '<p>Error occurred while fetching the random recipe. Please try again later.</p>';
        });
}

function saveToFavorites(recipe) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(recipe);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert('Recipe saved to favorites!');
    
    window.location.href = 'favorites.html';  
}
