// import connectDB 
const {connectDB} = require('./db/db.connect')
connectDB()

// import express
const express = require('express')
const app = express()
app.use(express.json())

// import cors
const cors = require('cors')
app.use(cors())

// import model
const Recipe = require('./models/recipe.models')

//* (3, 4, 5) Create a new recipe in recipe database
async function createNewRecipe(recipeDetails) {
    try {
        const newRecipe = new Recipe(recipeDetails)
        const saveRecipe = await newRecipe.save()
        return saveRecipe
    }  catch(error) {
        console.log(error)
    }
}

app.post("/recipes", async(req, res) => {
    try {
        const newRecipe = await createNewRecipe(req.body)
        if(newRecipe) {
            res.status(201).json({message: "Recipe created successfully", created: newRecipe})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to add new recipe."})
    }
})

//* (6) API to read all recipes in the database
async function readAllRecipes() {
    try {
        const recipes = await Recipe.find()
        return recipes
    } catch (error) {
        console.log(error)
    }
}

app.get("/recipes", async(req, res) => {
    try {
        const recipes = await readAllRecipes()
        if(recipes.length != 0) {
            res.json(recipes)
        } else {
            res.status(404).json({error: "Recipe's not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch recipe details"})
    }
})

//* (7) API to read recipe details by title
async function readRecipeByTitle(recipeTitle) {
    try {
        const recipe = await Recipe.findOne({title: recipeTitle})
        return recipe
    } catch(error) {
        console.log(error)
    }
}

app.get("/recipes/:recipeTitle", async(req, res) => {
    try {
        const recipe = await readRecipeByTitle(req.params.recipeTitle)
        if(recipe) {
            res.json(recipe)
        } else {
            res.status(404).json({error: "Recipe not found."})
        }
    } catch(error) {
        res.status(500).json({error: "Failed to fetch recipe details"})
    }
})

//* (8) API to read all recipes by author
async function readRecipesByAuthor(authorName) {
    try {
        const recipes = await Recipe.find({author: authorName})
        return recipes
    } catch (error) {
        console.log(error)
    }
}

app.get("/recipes/authors/:authorName", async(req, res) => {
    try {
        const recipes = await readRecipesByAuthor(req.params.authorName)
        if(recipes.length !=0) {
            res.json(recipes)
        } else {
            res.status(404).json({error: "Recipes not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch recipes"})
    }
})

//* (9) API to read all recipes by difficulty level
async function readRecipesByDifficulty(difficultyLevel) {
    try {
        const recipes = await Recipe.find({difficulty: difficultyLevel})
        return recipes
    } catch (error) {
        console.log(error)
    }
}

app.get("/recipes/difficulty/:difficultyLevel", async(req, res) => {
    try {
        const recipes = await readRecipesByDifficulty(req.params.difficultyLevel)
        if(recipes.length !=0) {
            res.json(recipes)
        } else {
            res.status(404).json({error: "Recipes not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to fetch recipes"})
    }
})

//* (10) API to update recipes by id
async function updateRecipesById(recipeId, dataToUpdate) {
    try {
        const recipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, {new: true})
        return recipe
    } catch(error) {
        console.log(error)
    }
}

app.post("/recipes/id/:recipeId", async(req, res) => {
    try {
        const updated = await updateRecipesById(req.params.recipeId, req.body)
        if(updated) {
            res.status(200).json({message: "Recipe updated successfully", updated: updated})
        } else {
            res.status(404).json({error: "Recipe not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to update recipe data"})
    }
})

//* (11) API to update recipes by title
async function updateRecipesByTitle(recipeTitle, dataToUpdate) {
    try {
        const recipe = await Recipe.findOneAndUpdate({title: recipeTitle}, dataToUpdate, {new: true})
        return recipe
    } catch(error) {
        console.log(error)
    }
}

app.post("/recipes/:recipeTitle", async(req, res) => {
    try {
        const updated = await updateRecipesByTitle(req.params.recipeTitle, req.body)
        if(updated) {
            res.status(200).json({message: "Recipe updated successfully", updated: updated})
        } else {
            res.status(404).json({error: "Recipe not found."})
        }
    } catch (error) {
        res.status(500).json({error: "Failed to updated recipe data"})
    }
})

//* (11) API to delete recipes by id
async function deleteRecipeById(recipeId) {
    try {
        const recipe = await Recipe.findByIdAndDelete(recipeId)
        return recipe
    } catch (error) {
        console.log(error)
    }
}

app.delete("/recipes/id/:recipeId", async(req, res) => {
    try {
        const deleted = await deleteRecipeById(req.params.recipeId)
        if(deleted){
            res.status(200).json({message: "Recipe deleted successfully", deleted: deleted})
        } else {
            res.status(404).json({error: "Recipe not found."})
        }
    } catch(error) {
        res.status(500).json({error: "Failed to delete data"})
    }
})

// Start the server
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})