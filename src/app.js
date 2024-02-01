import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import session from "express-session";
import sessionRouter from "./routes/session.routes.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";


const PORT = 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: "ecommerce-backend",
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://geronimomariani:Gero_421869@coder-backend.639rc1a.mongodb.net/ecommerce"
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

const httpServer = app.listen(PORT, async () => {
    try {
        await mongoose.connect(
        'mongodb+srv://geronimomariani:Gero_421869@coder-backend.639rc1a.mongodb.net/ecommerce'
        );
        console.log(`Server listening on ${PORT}`);
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