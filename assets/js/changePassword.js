import { auth } from './firebaseConfig.js';  // Ajusta la ruta según sea necesario
import { signInWithEmailAndPassword, updatePassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", function () {
    // Referencias a los botones y secciones
    const forgotPasswordButton = document.getElementById('forgotPasswordButton');
    const changePasswordButton = document.getElementById('changePasswordButton');
    const changePasswordSection = document.getElementById('changePasswordSection');
    const hideChangePasswordButton = document.getElementById('hideChangePasswordButton');

    // Referencias al formulario y campos
    const passwordChangeForm = document.getElementById('passwordChangeForm');
    const emailField = document.getElementById('email');  // Verifica que este ID sea correcto
    const currentPasswordField = document.getElementById('currentPassword');
    const newPasswordField = document.getElementById('newPassword');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const passwordChangeMessage = document.getElementById('passwordChangeMessage');

    // Verifica si el campo de correo se encuentra en el DOM
    console.log(emailField);  // Deberías ver el elemento de input en la consola

    // Referencias a otras visuales
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const userProfile = document.getElementById('userProfile');

    // Elimina o comenta esta línea si ya no necesitas asignar el valor manualmente
    // emailField.value = "usuario@example.com";
    console.log("Correo asignado manualmente:", emailField.value);

    // Función para ocultar todas las visuales
    function hideAllSections() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'none';
        userProfile.style.display = 'none';
        changePasswordSection.style.display = 'none';
    }

    // Mostrar el formulario de cambio de contraseña
    const showChangePasswordForm = () => {
        hideAllSections(); // Ocultar todas las visuales
        changePasswordSection.style.display = 'block'; // Mostrar el formulario de cambio de contraseña
    };

    // Ocultar el formulario de cambio de contraseña
    const hideChangePasswordForm = () => {
        changePasswordSection.style.display = 'none'; // Ocultar el formulario de cambio de contraseña
        if (userProfile.style.display === 'none') {
            loginForm.style.display = 'block'; // Mostrar el login si el perfil está oculto
        } else {
            userProfile.style.display = 'block'; // Mostrar el perfil si está oculto
        }
    };

    // Event listeners para los botones
    forgotPasswordButton.addEventListener('click', showChangePasswordForm);
    changePasswordButton.addEventListener('click', showChangePasswordForm);
    hideChangePasswordButton.addEventListener('click', hideChangePasswordForm);

    // Manejo del cambio de contraseña
    passwordChangeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        console.log("Formulario enviado");
        const email = emailField.value.trim();
        console.log("Correo ingresado al enviar el formulario:", email);  // Asegúrate de que este valor no sea restablecido

        if (!email || !validateEmail(email)) {
            passwordChangeMessage.textContent = 'Por favor ingresa un correo válido.';
            return;
        }

        const currentPassword = currentPasswordField.value.trim();
        const newPassword = newPasswordField.value.trim();
        const confirmPassword = confirmPasswordField.value.trim();

        if (newPassword !== confirmPassword) {
            passwordChangeMessage.textContent = 'Las nuevas contraseñas no coinciden.';
            return;
        }

        try {
            // Reautenticar al usuario con el correo y la contraseña actual
            const userCredential = await signInWithEmailAndPassword(auth, email, currentPassword);
            const user = userCredential.user;

            // Actualizar la contraseña del usuario
            await updatePassword(user, newPassword);

            passwordChangeMessage.textContent = 'Contraseña actualizada con éxito.';
        } catch (error) {
            passwordChangeMessage.textContent = `Error al cambiar la contraseña: ${error.message}`;
        }
    });

    // Función para validar el formato del correo electrónico
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});
