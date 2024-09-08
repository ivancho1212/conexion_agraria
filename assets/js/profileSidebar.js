import { auth } from './firebaseConfig.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Función para mostrar el spinner del sidebar
function showSidebarSpinner() {
    const sidebarSpinnerContainer = document.getElementById('sidebarSpinnerContainer');
    if (sidebarSpinnerContainer) {
        sidebarSpinnerContainer.style.display = 'flex'; // Muestra el spinner del sidebar
    }
}

// Función para ocultar el spinner del sidebar
function hideSidebarSpinner() {
    const sidebarSpinnerContainer = document.getElementById('sidebarSpinnerContainer');
    if (sidebarSpinnerContainer) {
        sidebarSpinnerContainer.style.display = 'none'; // Oculta el spinner del sidebar
    }
}

// Función para registrar un nuevo usuario y mostrar su perfil
function signUp(email, password, nombre, numero_documento, role_id, telefono) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const uid = user.uid;

            const db = getDatabase();
            set(ref(db, 'Api/Users/' + uid), {
                correo: email,
                nombre: nombre,
                numero_documento: numero_documento,
                role_id: role_id, // Guardamos el rol seleccionado aquí
                telefono: telefono
            }).then(() => {
                console.log("Usuario registrado y datos adicionales guardados en la base de datos.");

                // Mostrar un mensaje de éxito
                alert('Registro exitoso. Redirigiendo al perfil...');

                // Ocultar el formulario de registro
                document.getElementById('registerForm').style.display = 'none';

                // Mostrar el perfil del usuario
                document.getElementById('userProfile').style.display = 'block';

                // **Actualizar el título del sidebar a "Perfil de Usuario"**
                document.getElementById('sidebarTitle').innerText = "Perfil de Usuario";

                // Cargar la información del perfil del usuario
                loadUserProfile(uid);

            }).catch((error) => {
                console.error("Error al guardar datos adicionales en la base de datos:", error.message);
            });
        })
        .catch((error) => {
            console.error("Error en el registro:", error.message);
        });
}


// Función para iniciar sesión
function login(email, password) {
    showSidebarSpinner(); // Mostrar el spinner del sidebar mientras se cierra sesión

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log('Usuario logueado:', user);
            document.getElementById('userName').textContent = user.email;

            showProfile(); // Asegúrate de definir esta función
            loadUserProfile(user.uid);
        })
        .then(() => {
            hideSidebarSpinner(); // Ocultar el spinner después de cargar el perfil
        })
        .catch((error) => {
            console.error('Error en el login:', error.code, error.message);
            alert('Error en el login: ' + error.message);
            hideSidebarSpinner(); // Ocultar el spinner del sidebar cuando se cierra sesión
        });
}

// Función para cerrar sesión
function logout() {
    showSidebarSpinner(); // Mostrar el spinner del sidebar mientras se cierra sesión

    signOut(auth)
        .then(() => {
            console.log('Sesión cerrada');
            hideProfile();  // Ocultar el perfil después de cerrar sesión
            hideSidebarSpinner(); // Ocultar el spinner del sidebar cuando se cierra sesión

            // Restablecer la imagen del perfil en el navbar a la predeterminada
            const navbarProfileIcon = document.getElementById('navbarProfileIcon');
            if (navbarProfileIcon) {
                navbarProfileIcon.src = 'assets/img/icons/icono_campecino.png'; // Imagen predeterminada
            }

            // Restablecer la imagen del perfil en el perfil (sidebar) a la predeterminada
            const profileImage = document.getElementById('profileImage');
            if (profileImage) {
                profileImage.src = 'assets/img/icons/icono_campecino-gris.png'; // Imagen predeterminada
            }

            // Ocultar opciones de perfil y mostrar opciones de inicio de sesión
            document.getElementById('profileButton').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'none';
            document.getElementById('loginButton').style.display = 'block';
            document.getElementById('registerButton').style.display = 'block';
        })
        .catch((error) => {
            console.error('Error al cerrar sesión:', error);
            alert('Error al cerrar sesión: ' + error.message);
            hideSidebarSpinner(); // Ocultar el spinner del sidebar cuando se cierra sesión
        });
}

// Función para monitorizar el estado de autenticación
function monitorAuthState() {
    showSidebarSpinner(); // Mostrar el spinner mientras se verifica el estado de autenticación

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Usuario autenticado
            console.log('Usuario logueado:', user);
            document.getElementById('userName').textContent = user.email;

            // Cargar y mostrar la información del perfil
            loadUserProfile(user.uid);

            // Mostrar el perfil y las opciones de cerrar sesión
            document.getElementById('userProfile').style.display = 'block';
            document.getElementById('loginForm').style.display = 'none';

            // Mostrar las opciones de perfil y cerrar sesión
            document.getElementById('profileButton').style.display = 'block';
            document.getElementById('logoutButton').style.display = 'block';
            document.getElementById('loginButton').style.display = 'none';
            document.getElementById('registerButton').style.display = 'none';

            hideSidebarSpinner(); // Ocultar el spinner después de cargar el perfil
        } else {
            // Usuario no autenticado
            console.log('No hay usuario logueado');

            hideSidebarSpinner(); // Ocultar el spinner si no hay usuario

            // Mostrar el formulario de inicio de sesión y ocultar el perfil
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('userProfile').style.display = 'none';

            // Mostrar las opciones de iniciar sesión y registrarse
            document.getElementById('loginButton').style.display = 'block';
            document.getElementById('registerButton').style.display = 'block';
            document.getElementById('profileButton').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'none';
        }
    });
}


// Función para cargar y mostrar la información del perfil del usuario
function loadUserProfile(uid) {
    const db = getDatabase();
    const userRef = ref(db, 'Api/Users/' + uid);

    get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
            const userData = snapshot.val();

            const profileFirstName = document.getElementById('profileFirstName');
            const profileDocument = document.getElementById('profileDocument');
            const profilePhone = document.getElementById('profilePhone');
            const userName = document.getElementById('userName');
            const profileImage = document.getElementById('profileImage');
            const navbarProfileIcon = document.getElementById('navbarProfileIcon'); // Icono del nav

            if (profileFirstName && profileDocument && profilePhone && userName && profileImage) {
                profileFirstName.textContent = userData.nombre || 'Nombre no disponible';
                profileDocument.textContent = userData.numero_documento || 'Número de documento no disponible';
                profilePhone.textContent = userData.telefono || 'Teléfono no disponible';
                userName.textContent = userData.correo || 'Correo no disponible';

                // Cambiar el ícono del navbar por la imagen del perfil
                if (userData.profileImageUrl) {
                    profileImage.src = userData.profileImageUrl;
                    navbarProfileIcon.src = userData.profileImageUrl; // Cambiar el icono del nav
                    navbarProfileIcon.classList.add('profile-loaded'); // Añadimos una clase para poder hacer otros estilos si es necesario
                } else {
                    // Si no hay imagen del perfil, puedes usar una imagen predeterminada
                    navbarProfileIcon.src = 'assets/img/icons/icono_campecino.png'; // Imagen predeterminada
                }

            } else {
                console.error('Uno o más elementos del perfil no están disponibles.');
            }
        } else {
            console.log('No se encontró la información del usuario.');
        }
    }).catch((error) => {
        console.error('Error al cargar el perfil:', error);
    }).finally(() => {
        // Aseguramos que el spinner se oculta después de intentar cargar el perfil, exitoso o no
        hideSidebarSpinner();
    });
}

// Función para mostrar el perfil
function showProfile() {
    document.getElementById("profileButton").style.display = "block";
    document.getElementById("logoutButton").style.display = "block";
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("registerButton").style.display = "none";
    document.getElementById("userProfile").style.display = "block";
    document.getElementById("loginForm").style.display = "none";  // Oculta el formulario de inicio de sesión
}

// Función para ocultar el perfil
function hideProfile() {
    document.getElementById("profileButton").style.display = "none";
    document.getElementById("logoutButton").style.display = "none";
    document.getElementById("loginButton").style.display = "block";
    document.getElementById("registerButton").style.display = "block";
    document.getElementById("userProfile").style.display = "none";
    document.getElementById("loginForm").style.display = "block";  // Muestra el formulario de inicio de sesión
}

// Función para abrir el sidebar y cambiar el contenido según el tipo de formulario (login, register, profile)
function openSidebar(formType) {
    const sidebar = document.getElementById("loginSidebar");
    sidebar.classList.add('open'); // Muestra el sidebar
    document.body.classList.add('sidebar-open'); // Previene el scroll en el body

    if (formType === "login") {
        document.getElementById("loginForm").style.display = "block";
        document.getElementById("registerForm").style.display = "none";
        document.getElementById("userProfile").style.display = "none";
        document.getElementById("sidebarTitle").innerText = "Iniciar Sesión"; // Cambia el título
    } else if (formType === "register") {
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("registerForm").style.display = "block";
        document.getElementById("userProfile").style.display = "none";
        document.getElementById("sidebarTitle").innerText = "Registrarse";
    } else if (formType === "profile") {
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("registerForm").style.display = "none";
        document.getElementById("userProfile").style.display = "block";
        document.getElementById("sidebarTitle").innerText = "Perfil de Usuario";
        // Aquí llamas a la función que carga el perfil del usuario
        monitorAuthState(); // Verifica si el usuario está autenticado y carga los datos
    }
}

// Función para cerrar el sidebar
function closeSidebar() {
    const sidebar = document.getElementById("loginSidebar");
    sidebar.classList.remove('open');
    document.body.classList.remove('sidebar-open'); // Permite scroll nuevamente
}

// Cerrar el sidebar si se hace clic fuera de él
window.addEventListener("click", function (event) {
    const sidebar = document.getElementById("loginSidebar");
    if (!sidebar.contains(event.target) && event.target.closest('.nav-item.dropdown') === null) {
        closeSidebar();
    }
});

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


// Llama a la función para monitorizar el estado de autenticación
monitorAuthState();

// Lógica del sidebar para abrir
document.getElementById("loginButton").addEventListener("click", function () {
    openSidebar("login");
});

document.getElementById("registerButton").addEventListener("click", function () {
    openSidebar("register");
});

document.getElementById("profileButton").addEventListener("click", function () {
    openSidebar("profile"); // Abre el perfil del usuario
});

document.getElementById("showRegisterFormButton").addEventListener("click", function () {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registerForm").style.display = "block";
    document.getElementById("sidebarTitle").innerText = "Registrarse";
});

document.getElementById("showLoginFormButton").addEventListener("click", function () {
    document.getElementById("registerForm").style.display = "none";
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("sidebarTitle").innerText = "Iniciar Sesión";
});

document.addEventListener("DOMContentLoaded", function () {
    // Configura el evento para el botón de cerrar sesión en el perfil (sidebar)
    const profileLogoutButton = document.getElementById("profileLogoutButton");
    if (profileLogoutButton) {
        profileLogoutButton.addEventListener("click", function () {
            logout(); // Llama a la función logout para cerrar sesión
        });
    }

    // Configura el evento para el botón de cerrar sesión en el navbar
    const navbarLogoutButton = document.getElementById("logoutButton");
    if (navbarLogoutButton) {
        navbarLogoutButton.addEventListener("click", function () {
            logout(); // Llama a la función logout para cerrar sesión
        });
    }
});

// Evento para manejar el submit de login
document.getElementById('submitLogin').addEventListener('click', function (event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    login(email, password);
});

// Evento para manejar el submit de registro
document.getElementById('submitRegister').addEventListener('click', function (event) {
    event.preventDefault();

    showSidebarSpinner(); // Mostrar el spinner del sidebar
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const nombre = document.getElementById('registerNombre').value;
    const numero_documento = document.getElementById('registerNumeroDocumento').value;
    const role_id = document.getElementById('registerRole').value;
    const telefono = document.getElementById('registerTelefono').value;

    // Validación de email
    if (!validateEmail(email)) {
        alert('Por favor, ingresa un email válido.');
        hideSidebarSpinner(); // Ocultar el spinner si hay un error
        return;
    }

    signUp(email, password, nombre, numero_documento, role_id, telefono);
    hideSidebarSpinner(); // Ocultar el spinner después de completar el registro
});


export { login, logout, signUp };
