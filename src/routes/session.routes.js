import { Router } from "express";
import { userModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import passport from "passport";

const sessionRouter = Router();

sessionRouter.post("/register", passport.authenticate("register", {failureRedirect: "/fail-register"}), async (req, res) => {
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
    }
    res.redirect("/products");
});

sessionRouter.post("/login", passport.authenticate("login", {failureRedirect: "/fail-login"}), async (req, res) => {
    if (!req.user) {
        return res.status(401).send({message: "Error with credentials"});
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age
    }
    res.redirect("/products");
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

sessionRouter.post("/restore-password", async (req, res) => { 
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(401).send({message: "Unauthorized"});
        }
        user.password = createHash(password);
        await user.save();
        res.redirect("/login");
    } catch (error) {
        console.error(error);
        res.status(400).send({error});
    }
});

sessionRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }), (req, res) => {
});

sessionRouter.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
});

export default sessionRouter;