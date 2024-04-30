document.addEventListener("DOMContentLoaded", async function () {
    const newRecipeForm = document.getElementById("new-form");

    newRecipeForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        
        const formData = new FormData(newRecipeForm);
        const newRecipe = {};

        const ingredientsString = formData.get("ingredients");
        const ingredientsArray = ingredientsString.split(",").map(ingredient => ingredient.trim());

        newRecipe["ingredients"] = ingredientsArray;

        formData.forEach((value, key) => {
            if (key !== "ingredients") {
                newRecipe[key] = value;
            }
        });

        try {
            const response = await fetch("https://lab1-uf27.onrender.com/api/recipes",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newRecipe)
            });

            if (response.ok) {
                console.log(newRecipe);
                console.log("Recipe created");
                alert(`Recipe "${newRecipe["title"]}" has been created`);
                window.location.href = "index.html"
            } else {
                console.error("Failed to create recipe");
            }                
        } catch (error) {
            console.error("Error while creating recipe", error);
        }
    })
});