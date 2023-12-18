const socket = io();

const listProducts = document.getElementById("list");

socket.on("products", (data) => {
    listProducts.innerText = "";
    data.forEach(product => {
        const li = document.createElement("li");
        const br = document.createElement("br");
        li.innerHTML = `Nombre: ${product.title} Id: ${product.id} Precio: ${product.price}`;
        listProducts.appendChild(li);
        listProducts.appendChild(br);
    });
});


