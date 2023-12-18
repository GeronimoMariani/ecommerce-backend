import express from "express";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import ProductManager from "./utils/productManager.js";

const productManager = new ProductManager("src/data/products.json");

const PORT = 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.engine("handlebars", handlebars.engine());
app.set("views", "src/views");
app.set("view engine", "handlebars");

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);


const httpServer = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});


const io = new Server(httpServer);

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
}