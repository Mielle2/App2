import express from "express";
import User from "../data/user.mjs";
import Product from "../data/product.mjs";

const userRouter = express.Router();
userRouter.use(express.json());

const users = {};

userRouter.post("/create", (req, res) => {
    const { username, skinType, skinConcerns } = req.body;
    
    if (!username || !skinType) {
        return res.status(400).json({ message: "Username and skinType are required." });
    }

    const newUser = new User(username, skinType, skinConcerns || []);
    users[username] = newUser;
    
    res.status(201).json({ message: "User created successfully!", user: newUser });
});

userRouter.get("/:username", (req, res) => {
    const { username } = req.params;
    
    if (!users[username]) {
        return res.status(404).json({ message: "User not found." });
    }

    res.json(users[username]);
});

userRouter.patch("/:username", (req, res) => {
    const { username } = req.params;
    const { skinType, skinConcerns } = req.body;

    if (!users[username]) {
        return res.status(404).json({ message: "User not found." });
    }

    if (skinType) users[username].skinType = skinType;
    if (skinConcerns) users[username].skinConcerns = skinConcerns;

    res.json({ message: "User updated successfully!", user: users[username] });
});

userRouter.delete("/:username", (req, res) => {
    const { username } = req.params;

    if (!users[username]) {
        return res.status(404).json({ message: "User not found." });
    }

    delete users[username];
    res.json({ message: "User deleted successfully." });
});

userRouter.post("/:username/add-product", (req, res) => {
    const { username } = req.params;
    const { name, category } = req.body;

    if (!users[username]) {
        return res.status(404).json({ message: "User not found." });
    }

    if (!name || !category) {
        return res.status(400).json({ message: "Product name and category are required." });
    }

    const newProduct = new Product(name, category);
    users[username].addProduct(newProduct);

    res.json({ message: "Product added successfully!", user: users[username] });
});

export default userRouter;
