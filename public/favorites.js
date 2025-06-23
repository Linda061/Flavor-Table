document.addEventListener("DOMContentLoaded", function () {
    loadFavorites();  
    const deleteAllButton = document.getElementById("deleteAll");

    
    if (deleteAllButton) {
        deleteAllButton.addEventListener("click", function () {
            localStorage.removeItem("favorites"); 
            alert("All items removed from favorites.");
            loadFavorites();  
        });
    }
});


function loadFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    
   
    if (!favoritesList) {
        console.error("favoritesList element not found!");
        return;
    }

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let favoritesContent = '';

    
    if (favorites.length === 0) {
        favoritesContent = '<p>No favorite recipes saved yet.</p>';
    } else {
        favorites.forEach((recipe, index) => {
            favoritesContent += `
                <div>
                    <h3>${recipe.title}</h3>
                    <img src="${recipe.image}" alt="${recipe.title}" style="width: 100px; height: auto;">
                    <p>${recipe.description || 'No description available'}</p>
                    <button onclick="removeFavorite(${index})">Remove from Favorites</button>
                </div>
            `;
        });
    }

    favoritesList.innerHTML = favoritesContent;  
}


function removeFavorite(index) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.splice(index, 1);  
    localStorage.setItem("favorites", JSON.stringify(favorites));  
    loadFavorites();  
}
