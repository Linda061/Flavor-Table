const express = require('express');
const axios = require('axios');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

router.get('/search-recipes', async (req, res) => {
    const ingredients = req.query.ingredients;
    try {
        console.log(`Fetching recipes for ingredients: ${ingredients}`);
        const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
            params: {
                query: ingredients,
                apiKey: process.env.API_KEY
            }
        });
        console.log('API response received:', response.data);
        const recipes = response.data.results.map(recipe => ({
            title: recipe.title,
            image: recipe.image,
            usedIngredients: recipe.usedIngredients.map(ingredient => ingredient.name),
            missedIngredients: recipe.missedIngredients.map(ingredient => ingredient.name)
        }));
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching search recipes:', error);
        res.status(500).send('Error occurred while fetching data from API');
    }
});

router.get('/random-recipe', async (req, res) => {
    try {
        const response = await axios.get('https://api.spoonacular.com/recipes/random', {
            params: {
                apiKey: process.env.API_KEY
            }
        });
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

module.exports = router;
