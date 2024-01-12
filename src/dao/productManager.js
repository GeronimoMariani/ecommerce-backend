import fs from 'fs';

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async addProduct(product) {
        if (!product.title || !product.description || !product.price || !product.thumnail || !product.code || !product.stock) {
            console.error("Todos los campos son obligatorios.")
            return;
        }
        const { title, description, category, price, thumnail, code, stock } = product;
        const products = await this.getProducts();
        const newProduct = {
            id: products.length + 1,
            status: true,
            title,
            description,
            category,
            price,
            thumnail,
            code,
            stock
        }
        products.push(newProduct);
        const productsFile = await fs.promises.writeFile(this.path, JSON.stringify(products), "utf-8");
    }
    
    async getProducts() {
        try {
            const products = await fs.promises.readFile(this.path, "utf-8");
            const parsedData = JSON.parse(products);
            return parsedData;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        const productId = products.find(product => product.id === +id);
        if (productId) {
            return productId;
        } else {
            return({error:`El producto con el ID ${id} no fue encontrado o no existe`});
        }
    }

    async updateProduct(product, id) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === +id);
        if (index !== -1) {
            products[index] = { ...products[index], ...product };
            await fs.promises.writeFile(this.path, JSON.stringify(products), "utf-8")
            console.log(`Producto con ID ${id} actualizado exitosamente.`);
        } else {
            console.log(`No se encontró un producto con el ID ${id}.`);
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const productId = products.findIndex(product => product.id === +id);
        if (productId !== -1) {
            products.splice(productId, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products), "utf-8")
            console.log(`El producto con el ID ${id} fue eliminado.`)
        } else {
            console.error(`No se encontró un producto con el ID ${id}.`);
        }
    }
}

export default ProductManager;