function searchRecipes() {
    const ingredients = document.getElementById('ingredients').value;
    
    if (!ingredients) {
        document.getElementById('results').innerHTML = '<p>Please enter ingredients to search.</p>';
        return;
    }

    fetch(`/search-recipes?ingredients=${ingredients}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                let tableContent = `
                    <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th>Recipe Name</th>
                                <th>Image</th>
                                <th>Missing Ingredients</th>
                                <th>Save to Favorites</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                const results = data.map(recipe => {
                    const missingIngredients = recipe.missedIngredients.length > 0 ? recipe.missedIngredients.join(', ') : 'No missing ingredients';
                    
                    return `
                        <tr>
                            <td>${recipe.title}</td>
                            <td><img src="${recipe.image}" alt="${recipe.title}" style="width: 100px; height: auto;"></td>
                            <td>${missingIngredients}</td>
                            <td><button onclick="saveToFavorites(${JSON.stringify(recipe)})">Save to Favorites</button></td>
                        </tr>
                    `;
                }).join('');
                tableContent += results + '</tbody></table>';
                document.getElementById('results').innerHTML = tableContent;
            } else {
                document.getElementById('results').innerHTML = '<p>No recipes found for these ingredients</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById('results').innerHTML = '<p>Error occurred while fetching data. Please try again later.</p>';
        });
}

function saveToFavorites(recipe) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.push(recipe);
    localStorage.setItem("favorites", JSON.stringify(favorites));  
    alert('Recipe saved to favorites!');
    
    window.location.href = 'favorites.html';  
}
