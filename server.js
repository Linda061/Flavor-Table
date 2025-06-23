const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();  

const app = express();


app.use(cors());  
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/search-recipes', async (req, res) => {
    const ingredients = req.query.ingredients;
    console.log(`Searching for recipes with ingredients: ${ingredients}`);  

    try {
        const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
            params: {
                query: ingredients,
                apiKey: process.env.API_KEY
            }
        });

        console.log('API Response:', response.data);  

        if (response.data && response.data.results) {
            const recipes = [];

            response.data.results.forEach(recipe => {
                recipes.push({
                    title: recipe.title,
                    image: recipe.image,
                    usedIngredients: recipe.usedIngredients ? recipe.usedIngredients.map(ingredient => ingredient.name) : [],
                    missedIngredients: recipe.missedIngredients ? recipe.missedIngredients.map(ingredient => ingredient.name) : []
                });
            });

            res.json(recipes);
        } else {
            console.error('No results found in the API response.');
            res.status(500).send('Error: No results found from API');
        }
    } catch (error) {
        console.error('Error fetching search recipes:', error);
        res.status(500).send('Error occurred while fetching data from API');
    }
});

app.get('/random-recipe', async (req, res) => {
    try {
        const response = await axios.get('https://api.spoonacular.com/recipes/random', {
            params: {
                apiKey: process.env.API_KEY
            }
        });

        console.log('Random Recipe API Response:', response.data);

        const randomRecipe = {
            title: response.data.recipes[0].title,
            image: response.data.recipes[0].image,
            instructions: response.data.recipes[0].instructions,
            ingredients: response.data.recipes[0].extendedIngredients.map(ingredient => ingredient.name)
        };
        res.json(randomRecipe);
    } catch (error) {
        console.error('Error fetching random recipe:', error);
        res.status(500).send('Error occurred while fetching random recipe');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
