import { Router } from "express";
import passport from "passport";
import { gitHubCallback, login, logout, register, restorePassword } from "../controllers/session.controller.js";

const sessionRouter = Router();

sessionRouter.post("/register", passport.authenticate("register", {failureRedirect: "/fail-register"}), register);
sessionRouter.post("/login", passport.authenticate("login", {failureRedirect: "/fail-login"}), login);
sessionRouter.post("/logout", logout);
sessionRouter.post("/restore-password", restorePassword);
sessionRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }), (req, res) => {
});
sessionRouter.get("/githubcallback", passport.authenticate("github", {failureRedirect: "/login"}), gitHubCallback);

export default sessionRouter;