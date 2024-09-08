import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { auth } from './firebaseConfig.js';

// Maneja el evento de selección de archivo
document.getElementById('uploadImage').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        // Genera un hash único para el nombre del archivo
        const hash = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const fileName = `${hash}_${file.name}`;

        // Obtén una referencia al storage
        const storage = getStorage();
        const storagePath = `users/${fileName}`;
        const fileRef = storageRef(storage, storagePath);

        // Sube el archivo al storage
        uploadBytes(fileRef, file).then((snapshot) => {
            console.log('Archivo subido exitosamente.');

            // Obtén la URL de descarga del archivo
            getDownloadURL(fileRef).then((url) => {
                console.log('URL de la imagen:', url);

                // Actualiza el perfil del usuario en Realtime Database con la URL de la imagen
                const user = auth.currentUser;
                if (user) {
                    const db = getDatabase();
                    const userRef = ref(db, 'Api/Users/' + user.uid);
                    update(userRef, { profileImageUrl: url }).then(() => {
                        console.log('URL de la imagen actualizada en la base de datos.');
                        // Actualizar la imagen en el perfil y navbar sin refrescar la página
                        const profileImage = document.getElementById('profileImage'); // Imagen en la vista de perfil
                        const navbarProfileIcon = document.getElementById('navbarProfileIcon'); // Imagen en el navbar

                        if (profileImage) {
                            profileImage.src = url; // Actualiza la imagen en la vista de perfil
                        }
                        if (navbarProfileIcon) {
                            navbarProfileIcon.src = url; // Actualiza la imagen en el navbar
                        }

                    }).catch((error) => {
                        console.error('Error al actualizar la base de datos:', error);
                    });
                }
            }).catch((error) => {
                console.error('Error al obtener la URL de descarga:', error);
            });
        }).catch((error) => {
            console.error('Error al subir el archivo:', error);
        });
    }
});