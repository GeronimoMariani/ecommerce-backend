import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import MongoStore from "connect-mongo";
import passport from "passport";
import session from "express-session";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import sessionRouter from "./routes/session.routes.js";
import initializePassport from "./configs/passport.config.js";
import { getVariables } from "./configs/config.js";
import { ErrorHandler } from "./middlewares/error.js";
import { addLogger } from "./utils/logger.js";
import testRouter from "./routes/test.routes.js";
import usersRouter from "./routes/users.routes.js";
import { swaggerConfig } from "./configs/swagger-config.js";

const { port, mongoUrl, secret, nodeEnv, mongoUrlTest } = getVariables();
const app = express();

const specs = swaggerJSDoc(swaggerConfig);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(addLogger);

app.use(session({
    secret: secret,
    store: MongoStore.create({
        mongoUrl: mongoUrl
    }),
    resave: true,
    saveUninitialized: true
}))

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
    }
});

app.engine("handlebars", hbs.engine);
app.set("views", "src/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/test", testRouter);
app.use("/api/users", usersRouter);

app.use(ErrorHandler);

const httpServer = app.listen(port, async () => {
    try {
        await mongoose.connect(mongoUrl);
        console.log(`Server on`);
    } catch (err) {
        console.log(err);
    }
});


/* const io = new Server(httpServer);

io.on("connect", socket => {
    console.log("Cliente conectado");
    sendProducts(socket);
});

const sendProducts = async (io) => {
    try {
        const products = await productManager.getProducts();
        io.emit("products", products);
    } catch (error) {
        console.log(error.message);
    }
} */