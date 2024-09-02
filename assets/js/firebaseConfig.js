import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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

export { auth };
