import { userModel } from "../models/user.model.js";
import { createHash } from "../utils/bcrypt.js";

export const register = (req, res) => {
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol
    }
    res.redirect("/products");
};

export const login = (req, res) => {
    if (!req.user) {
        return res.status(401).send({message: "Error with credentials"});
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol
    }
    res.redirect("/products");
};

export const logout = (req, res) => {
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
};

export const restorePassword = async (req, res) => {
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
};

export const gitHubCallback = (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
};