document.addEventListener("DOMContentLoaded", function () {
    const firebaseUser = new FirebaseUser();
    const formUser = document.getElementById("contactForm");
    const phoneInput = document.getElementById('phone');
    const nameInput = document.getElementById('name');

    // Agregar el listener para filtrar caracteres no numéricos en el teléfono
    phoneInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, ''); // Remover caracteres no numéricos
    });

    // Agregar el listener para filtrar caracteres no alfabéticos en el nombre
    nameInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^a-zA-Z\s]/g, ''); // Remover caracteres no alfabéticos
    });

    if (formUser) {
        formUser.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("Formulario enviado");

            const nombre = document.getElementById("name").value.trim();
            const telefono = document.getElementById("phone").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();

            // Capturar el valor del predioId
            const predioId = document.getElementById("predioId").value.trim();

            // Validaciones
            if (!validateName(nombre)) {
                alert("Por favor, ingrese un nombre y apellido válidos.");
                return;
            }

            if (!validatePhone(telefono)) {
                alert("Por favor, ingrese un número de teléfono válido.");
                return;
            }

            if (!validateEmail(email)) {
                alert("Por favor, ingrese un correo electrónico válido.");
                return;
            }

            if (message.length < 10) {
                alert("El mensaje debe tener al menos 10 caracteres.");
                return;
            }

            const userData = {
                nombre: nombre,
                telefono: telefono,
                correo: email,
                descripcion: message,
                predioId: predioId // Asegurarse de incluir predioId
            };

            try {
                await firebaseUser.setCreateUser(userData);
                alert("Mensaje enviado correctamente.");
                $('#gameModal').modal('hide');
            } catch (error) {
                console.error("Error al enviar el mensaje:", error);
                alert("Hubo un error al enviar el mensaje. Por favor, inténtelo de nuevo.");
            }
        });
    }

    // Función para validar el nombre y apellido
    function validateName(name) {
        const nameRegex = /^[a-zA-Z\s]+$/;
        return nameRegex.test(name) && name.length >= 3 && name.length <= 50;
    }

    // Función para validar el teléfono
    function validatePhone(phone) {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    }

    // Función para validar el correo electrónico
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});
