import Product from "./product.mjs";

class User {
    constructor(username, skinType, skinConcerns) {
        this.username = username;
        this.skinType = skinType;
        this.skinConcerns = skinConcerns;
        this.products = [];
    }

    addProduct(product) {
        if (product instanceof Product) {
            this.products.push(product);
        } else {
            throw new Error("Only Product instances can be added.");
        }
    }
}

export default User;
