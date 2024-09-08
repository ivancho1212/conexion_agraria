// Importar módulos de Firebase necesarios
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, updatePassword, sendEmailVerification, deleteUser } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getDatabase, ref, set, update, remove } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getStorage, ref as storageRef, deleteObject } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDSe_2lz8x6UVV5gcLGuLD0aguzc3voMqY",
    authDomain: "conexion-agraria.firebaseapp.com",
    databaseURL: "https://conexion-agraria-default-rtdb.firebaseio.com",
    projectId: "conexion-agraria",
    storageBucket: "conexion-agraria.appspot.com",
    messagingSenderId: "875677956740",
    appId: "1:875677956740:web:a66b0f292ae7d70608a0d1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const storage = getStorage(app);

// Exportar las instancias y funciones necesarias
export { auth, database, storage, ref, set, update, remove, storageRef, deleteObject, updatePassword, sendEmailVerification, deleteUser };
