import { auth } from './firebaseConfig.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');
    const profileButton = document.getElementById('profileButton');
    const logoutButton = document.getElementById('logoutButton');
    const sidebar = document.getElementById('sidebar');
    const userEmail = document.getElementById('userEmail');
    const userName = document.getElementById('userName');

    // Verifica si los elementos existen
    if (!loginButton || !registerButton || !profileButton || !logoutButton || !sidebar || !userEmail || !userName) {
        console.error('Uno o más elementos del DOM no se encontraron.');
        return;
    }

    // Observador de estado de autenticación
    onAuthStateChanged(auth, user => {
        if (user) {
            // El usuario está autenticado
            userEmail.textContent = `Correo: ${user.email}`;
            userName.textContent = `Nombre: ${user.displayName || "Usuario"}`;
            loginButton.style.display = 'none';
            registerButton.style.display = 'none';
            profileButton.style.display = 'block';
            logoutButton.style.display = 'block';
        } else {
            // No hay usuario autenticado
            loginButton.style.display = 'block';
            registerButton.style.display = 'block';
            profileButton.style.display = 'none';
            logoutButton.style.display = 'none';
            closeSidebar();  // Cerrar el sidebar si el usuario cierra sesión
        }
    });

    // Lógica de cerrar sesión
    logoutButton.addEventListener('click', () => {
        signOut(auth).then(() => {
            console.log("Sesión cerrada");
        }).catch(error => {
            console.error("Error al cerrar sesión", error);
        });
    });
});

// Funciones para abrir y cerrar el sidebar
function openSidebar() {
    document.getElementById("sidebar").style.width = "250px";
    document.getElementById("main").style.marginRight = "250px";
}

function closeSidebar() {
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("main").style.marginRight = "0";
}
