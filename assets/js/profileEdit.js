import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, update, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { auth } from './firebaseConfig.js';
import { getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// Función para activar los campos de edición y manejar la validación
function activateEditMode(fieldId, inputId, editIconId, saveIconId, dbField) {
    const editIcon = document.getElementById(editIconId);
    const saveIcon = document.getElementById(saveIconId);

    if (editIcon) {
        editIcon.addEventListener('click', () => {
            const field = document.getElementById(fieldId);
            const input = document.getElementById(inputId);
            input.style.display = 'block';  // Mostrar el campo de texto
            field.style.display = 'none';  // Ocultar el campo actual
            editIcon.style.display = 'none';  // Ocultar ícono de lápiz
            saveIcon.style.display = 'block';  // Mostrar ícono de check
            input.value = field.textContent;  // Llenar el input con el valor actual
        });
    }

    // Evento para el ícono de guardar (check)
    if (saveIcon) {
        saveIcon.addEventListener('click', () => {
            const field = document.getElementById(fieldId);
            const input = document.getElementById(inputId);

            if (input.value !== "") {
                field.textContent = input.value;

                // Actualizar en Firebase
                const user = auth.currentUser;
                if (user) {
                    const db = getDatabase();
                    const userRef = ref(db, 'Api/Users/' + user.uid);

                    const updateData = {};
                    updateData[dbField] = input.value;

                    // Actualizar en la base de datos
                    update(userRef, updateData)
                        .then(() => {
                            console.log('Datos actualizados en Firebase:', dbField);

                            input.style.display = 'none';
                            field.style.display = 'block';
                            saveIcon.style.display = 'none';
                            editIcon.style.display = 'block';
                        })
                        .catch((error) => {
                            console.error('Error al actualizar los datos en Firebase:', error);
                        });
                }
            }
        });
    } else {
        console.error('saveIcon is null');
    }
}

// Función para guardar los cambios del perfil
function saveProfileChanges() {
    const user = auth.currentUser;
    if (user) {
        const db = getDatabase();
        const userRef = ref(db, 'Api/Users/' + user.uid);

        // Obtener los valores de los campos editados
        const firstName = document.getElementById('editFirstName')?.value;
        const document = document.getElementById('editDocument')?.value;
        const phone = document.getElementById('editPhone')?.value;

        // Actualizar los campos en la base de datos
        update(userRef, {
            nombre: firstName,
            numero_documento: document,
            telefono: phone
        }).then(() => {
            console.log('Perfil actualizado exitosamente.');

            // Actualizar la interfaz de usuario
            const profileFirstName = document.getElementById('profileFirstName');
            const profileDocument = document.getElementById('profileDocument');
            const profilePhone = document.getElementById('profilePhone');
            const editFirstName = document.getElementById('editFirstName');
            const editDocument = document.getElementById('editDocument');
            const editPhone = document.getElementById('editPhone');
            const saveButton = document.getElementById('profileSaveButton');

            if (profileFirstName && profileDocument && profilePhone && editFirstName && editDocument && editPhone && saveButton) {
                profileFirstName.textContent = firstName;
                profileDocument.textContent = document;
                profilePhone.textContent = phone;

                // Ocultar campos de edición
                editFirstName.style.display = 'none';
                profileFirstName.style.display = 'block';
                editDocument.style.display = 'none';
                profileDocument.style.display = 'block';
                editPhone.style.display = 'none';
                profilePhone.style.display = 'block';
                saveButton.style.display = 'none';
            }
        }).catch((error) => {
            console.error('Error al actualizar el perfil:', error);
        });
    }
}

// Función para reautenticar al usuario
function reauthenticateUser(email, password) {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(email, password);

    return reauthenticateWithCredential(user, credential)
        .then(() => {
            console.log("Reautenticación exitosa.");
        })
        .catch((error) => {
            console.error("Error en la reautenticación:", error);

            // Manejo de errores específicos
            switch (error.code) {
                case 'auth/invalid-email':
                    alert("El correo electrónico proporcionado no es válido.");
                    break;
                case 'auth/wrong-password':
                    alert("La contraseña es incorrecta.");
                    break;
                case 'auth/user-mismatch':
                    alert("El correo electrónico no coincide con el usuario actual.");
                    break;
                default:
                    alert("Error en la reautenticación: " + error.message);
            }

            throw error;
        });
}

// Función para validar la contraseña
function validatePassword(password) {
    // Validación básica: mínimo 6 caracteres
    if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres.");
        return false;
    }
    return true;
}


// Función para eliminar archivos y datos del usuario
async function disableAccount() {
    const user = auth.currentUser;
    if (user) {
        try {
            // Crear una referencia al archivo en el almacenamiento
            const userFilesRef = ref(storage, 'userFiles/' + user.uid);

            // Obtener la URL del archivo para verificar si existe
            const url = await getDownloadURL(userFilesRef).catch((error) => {
                if (error.code === 'storage/object-not-found') {
                    // El archivo no existe
                    console.log("El archivo no existe.");
                    return null;
                }
                throw error;
            });

            // Si el archivo existe, proceder a eliminarlo
            if (url) {
                await deleteObject(userFilesRef);
                console.log("Archivo eliminado correctamente.");
            }

            // Eliminar los datos del usuario en la base de datos
            await remove(ref(database, 'users/' + user.uid));
            console.log("Datos del usuario eliminados de la base de datos.");

            // Eliminar la cuenta del usuario
            await deleteUser(user);
            console.log("Cuenta del usuario eliminada.");

        } catch (error) {
            console.error("Error al eliminar archivos, datos del usuario o cuenta:", error);
        }
    } else {
        console.error("No hay un usuario autenticado.");
    }
}


document.addEventListener('DOMContentLoaded', () => {
    activateEditMode('profileFirstName', 'editFirstName', 'editFirstNameIcon', 'saveFirstNameIcon', 'nombre');
    activateEditMode('profileDocument', 'editDocument', 'editDocumentIcon', 'saveDocumentIcon', 'numero_documento');
    activateEditMode('profilePhone', 'editPhone', 'editPhoneIcon', 'savePhoneIcon', 'telefono');

    const saveButton = document.getElementById('profileSaveButton');
    if (saveButton) {
        saveButton.addEventListener('click', saveProfileChanges);
    }
});

// Event listener para el botón de inhabilitar cuenta
document.getElementById('disableAccountButton').addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres inhabilitar tu cuenta? Esta acción es irreversible.')) {
        disableAccount();
    }
});

export { activateEditMode, saveProfileChanges };
