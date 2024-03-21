import Users from "../dao/mongo/users.mongo.js";
import { createHash } from "../utils/bcrypt.js";

const userService = new Users();

export const register = (req, res) => {
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol
    }
    req.logger.info(`User registered: ${req.user.email}`);
    res.redirect("/products");
};

export const login = (req, res) => {
    if (!req.user) {
        req.logger.error("Error with credentials");
        return res.status(401).send({message: "Error with credentials"});
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        rol: req.user.rol
    }
    req.logger.info(`User logged: ${req.user.email}`);
    res.redirect("/products");
};

export const logout = (req, res) => {
    try {
        req.session.destroy((err) => {
            if(err) {
                req.logger.error("Logout failed");
                return res.status(500).send({message: "Logout failed"});
            }
        });
        req.logger.info("User unlogged");
        res.send({redirect: "http://localhost:8080/login"});
    } catch (error) {
        req.logger.error(error);
        res.status(400).send({error});
    }
};

export const restorePassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userService.getUser(email);
        if (!user) {
            req.logger.error("Unauthorized");
            return res.status(401).send({message: "Unauthorized"});
        }
        user.password = createHash(password);
        await user.save();
        req.logger.info("Password saved");
        res.redirect("/login");
    } catch (error) {
        req.logger.error(error);
        res.status(400).send({error});
    }
};

export const gitHubCallback = (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
};