document.addEventListener("DOMContentLoaded", async function () {
    const recipes = await createData();
    console.log(recipes);

    const recipeTable = document.getElementById("table-body");

    recipes.forEach(recipe => {
        let rowInTable = document.createElement("tr");

        let recipeTitle = document.createElement("td");
        recipeTitle.textContent = recipe.title;
        rowInTable.appendChild(recipeTitle);

        let recipeCookingTime = document.createElement("td");
        recipeCookingTime.textContent = recipe.cookingTime;
        rowInTable.appendChild(recipeCookingTime);

        let recipeIngredients = document.createElement("td");
        recipeIngredients.textContent = recipe.ingredients.join(", ");
        rowInTable.appendChild(recipeIngredients);

        let recipeInstructions = document.createElement("td");
        recipeInstructions.textContent = recipe.instructions;
        rowInTable.appendChild(recipeInstructions);

        let updateBotton = document.createElement("button");
        updateBotton.textContent = "Update";
        let updateButtonCell = document.createElement("td");
        updateButtonCell.appendChild(updateBotton);
        rowInTable.appendChild(updateButtonCell);
        let modal = document.getElementById("my-modal");
        updateBotton.dataset.recipeId = recipe._id;
        updateBotton.addEventListener("click", async () => {
            const recipeId = updateBotton.dataset.recipeId;
            const recipe = recipes.find(recipe => recipe._id === recipeId);
            document.getElementById("edit-title").value = recipe.title;
            document.getElementById("edit-cooking-time").value = recipe.cookingTime;
            document.getElementById("edit-ingredients").value = recipe.ingredients.join(", ");
            document.getElementById("edit-instructions").value = recipe.instructions;
            modal.showModal();
        });

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        let deleteButtonCell = document.createElement("td");
        deleteButtonCell.appendChild(deleteButton);
        deleteButton.addEventListener("click", async () => {
            if (confirm("This will delete the recipe.")) {
                deleteRecipe(recipe._id);
                rowInTable.remove();
            }
        });
        rowInTable.appendChild(deleteButtonCell);
        recipeTable.appendChild(rowInTable);

        const cancelButton = document.getElementById("form-cancel-button");
        cancelButton.addEventListener("click", () => {
            modal.close();
        })

        const updateForm = document.getElementById("update-form");
        updateForm.dataset.recipeId = recipe._id;
        updateForm.addEventListener("submit", async (event) => {
        
            const formData = new FormData(updateForm);
            const updatedRecipe = {};

            formData.forEach((value, key) => {
                updatedRecipe[key] = value;
            });

            const recipeId = updateForm.dataset.recipeId;

            try {
                const response = await fetch(`http://localhost:3000/api/recipes/${recipeId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedRecipe)
                });

                if (response.ok) {
                    console.log("Recipe updated");
                } else {
                    console.error("Failed to update recipe");
                }                
            } catch (error) {
                log.error("Error while updating recipe", error);
            }
        })
    });

    async function createData() {
        try{
            const response = await fetch("http://localhost:3000/api/recipes/");
            const recipes = await response.json();
            console.log("Data fetched")
            return recipes.recipes;
        } catch(error){
            console.error("Error fetching data", error);
        }
    }

    async function deleteRecipe(recipeId) {
        try {
            const response = await fetch (`http://localhost:3000/api/recipes/${recipeId}`,
            { method: "DELETE" }
            );
            console.log("Recipe removed");
        } catch (error) {
            console.error("Error while deleting recipe", error);
        }
    }

});