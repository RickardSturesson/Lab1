import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
    {
        cookingTime: {type: Number, required: true },
        ingredients: {type: Array, required: true },
        instructions: {type: String, required: true },
        title: { type: String, required: true, unique: true }
      },
      {collection: "recipe"}
);

export default mongoose.model("recipe", recipeSchema);