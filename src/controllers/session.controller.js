import Users from "../dao/mongo/users.mongo.js";
import MailingService from "../services/mailing.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { generateToken, verifyToken } from "../utils/crypto.js";

const userService = new Users();
const mailingService = new MailingService();

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

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const tokenObj = generateToken();
        const user = await userService.getUser(email);
        await userService.updateUser(user._id, { tokenPassword: tokenObj });
        await mailingService.sendSimpleMail({
            from: "NodeMailer Contant",
            to: email,
            subject: "Cambiar contraseña",
            html: `
                <h1>Hola!!</h1>
                <p>Haz clic en este <a href="http://localhost:8080/api/sessions/restore-password/${tokenObj.token}">enlace</a> para restablecer tu contraseña.</p>
            `
        });
        const emailSend = true;
        req.logger.info(`Email sent to ${email}`);
        res.render("forgot-password", { emailSend });
    } catch (error) {
        req.logger.error(error);
        res.status(400).send({error});
    }
};

export const restorePasswordToken = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await userService.getUserToken(token);
        if (!user) {
            const newTitle = true;
            return res.render("forgot-password", { newTitle });
        }
        const tokenObj = user.tokenPassword;
        if (tokenObj && verifyToken(tokenObj)) {
            res.redirect("/restore-password");
        } else {
            const newTitle = true;
            res.render("forgot-password", { newTitle });
        }
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
        if (isValidPassword(user, password)) {
            const samePassword = true;
            return res.render("restore-password", { samePassword });
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