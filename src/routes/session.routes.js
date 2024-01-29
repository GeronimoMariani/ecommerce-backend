import { Router } from "express";
import { userModel } from "../models/user.model.js";

const sessionRouter = Router();

sessionRouter.post("/register", async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const user = await userModel.create({
            first_name, last_name, email, age, password
        });
        req.session.user = user;
        res.redirect("/products");
    } catch (error) {
        console.error(error);
        res.status(400).send({error});
    }
});

sessionRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email === "adminCoder@coder.com" && password === "adminCoder") {
            const adminUser = await userModel.findOne({email: "adminCoder@coder.com"});
            if (adminUser) {
                req.session.user = adminUser;
                res.redirect("/products");
                return;
            } else {
                const newUserAdmin = await userModel.create({
                    first_name: "Coder",
                    last_name: "Admin",
                    email: "adminCoder@coder.com" ,
                    age: 0,
                    password: "adminCoder",
                    rol: "Admin"
                });
                req.session.user = newUserAdmin;
                res.redirect("/products");
                return;
            }
        }
        const user = await userModel.findOne({email});
        if(!user) {
            return res.status(404).send({message: "User not found"});
        }
        if(user.password !== password) {
            return res.status(201).send({message: "Invalid credentials"});
        }
        req.session.user = user;
        res.redirect("/products");
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
});

sessionRouter.post("/logout", async (req, res) => {
    try {
        req.session.destroy((err) => {
            if(err) {
                return res.status(500).send({message: "Logout failed"});
            }
        });
        res.send({redirect: "http://localhost:8080/login"});
    } catch (error) {
        console.error(error);
        res.status(400).send({error});
    }
})

export default sessionRouter;