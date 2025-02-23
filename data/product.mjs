import Ingredient from "./ingredient.mjs";

class Product {
    constructor(name, category) {
        this.name = name;
        this.category = category;
        this.ingredients = [];
    }

    addIngredient(ingredient) {
        if (ingredient instanceof Ingredient) {
            this.ingredients.push(ingredient);
        } else {
            throw new Error("Only Ingredients can be added.");
        }
    }
}

export default Product;
