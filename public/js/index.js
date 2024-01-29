/* const socket = io();

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
}); */

const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", async () => {
    const result = await fetch("http://localhost:8080/api/sessions/logout", {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const { redirect } = await result.json();
    window.location.href = redirect;
});


