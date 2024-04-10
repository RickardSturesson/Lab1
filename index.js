import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectToMongo } from "./db/dbConnection.js";
import Recipe from "./db/recipes.js";
import cors from "cors";
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const publicPath = path.join(__dirname, 'public');

dotenv.config();

app.use(express.static(publicPath));
app.use(express.json());
app.use(cors());

connectToMongo();

app.get("/", (req, res) => {
    const filePath = path.join(__dirname, "public", "index.html")
    res.sendFile(filePath);
})

app.get("/api/recipes", async (req, res) => {
    try {    
        const recipes = await Recipe.find();
        res.status(200).json({recipes: recipes});
    } catch(error) {
        res.status(404).status({message: "Not found"});
    };
})

app.get("/api/recipes/:title", async (req, res) => {
    try {
    const paramsTitle = req.params.title;
    const recipeTitle = paramsTitle.replace(/-/g, " ");
    const recipe = await Recipe.find({title: recipeTitle});
    
    if (recipe.length > 0) {
        res.status(200).json({recipe: recipe});
    } else {
        res.status(404).json({message: "Not found"})
    }
    } catch(error) {
        res.status(500).json({message: "Can not recieve data"});
    }
})

app.post("/api/recipes", async (req, res) => {
    const title = req.body.title;
    const cookingTime = req.body.cookingTime;
    const ingredients = req.body.ingredients;
    const instructions = req.body.instructions;

    if (!title || !cookingTime || !ingredients || !instructions) {
        return res.json({message: "Fields can not be empty"});
    }

    const newTitle = await Recipe.find({title: title})
    if (newTitle > 0) {
        return res.status(409).json({message: `${title} allready exists.` })
    }

    const newRecipe = new Recipe({
        cookingTime: cookingTime,
        ingredients: ingredients,
        instructions: instructions,
        title: title
    });

    console.log(newRecipe)

    try {
        const recipe = await newRecipe.save();
        res.status(201).json({message: recipe})
        return recipe;
    } catch(error) {
        res.status(500).json({message: "Can not save data"})
    }
});

app.put("/api/recipes/:id", async (req, res) => {
    const {id} = req.params;
    const updatedRecipeData = req.body;
    try {
        let recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({message: "Recipe not found"})
        };

        Object.keys(updatedRecipeData).forEach(key => {
            if (!updatedRecipeData[key]) {
                updatedRecipeData[key] = recipe[key];
            }
        });

        recipe = await Recipe.findByIdAndUpdate(id, updatedRecipeData, {new: true});
        res.status(200).json({message: recipe})
    } catch (error) {
        console.log("Could not update recipe", error)
        res.status(500).json({message: "Recipe could not be updated."})
    }
});

app.delete("/api/recipes/:id", async (req, res) => {
    const {id} = req.params;
    try {
        let recipeToDelete = await Recipe.findByIdAndDelete(id);
        if (!recipeToDelete) {
            return res.status(404).json({message: "Recipe not found"})
        };
        res.status(200).json({message: "Recipe deleted", recipeToDelete})
    } catch (error) {
        console.log("Could not delete recipe", error)
        res.status(500).json({message: "Recipe could not be deleted."})
    }
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Seriver listen to http://localhost:${port}/`)
});