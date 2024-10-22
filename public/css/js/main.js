const nav = document.querySelector('#nav');
const abrir = document.querySelector('#abrmenu');
const cerrar = document.querySelector('#crrmenu');

document.addEventListener('DOMContentLoaded', () => {
    abrir.addEventListener("click", () => {
        nav.classList.add("visible");
    });
    
    cerrar.addEventListener("click", () => {
        nav.classList.remove("visible");
    })
})
