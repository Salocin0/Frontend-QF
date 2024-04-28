// Importa las funciones necesarias de Firebase
import { getMessaging } from "@firebase/messaging";
import { initializeApp } from "firebase/app";

// Configuración de tu aplicación en Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBHsEP_E5e53GuwQSDWYQDAfpDcxsJ191c",
  authDomain: "fir-cloud-messaging-63ab1.firebaseapp.com",
  projectId: "fir-cloud-messaging-63ab1",
  storageBucket: "fir-cloud-messaging-63ab1.appspot.com",
  messagingSenderId: "356683367481",
  appId: "1:356683367481:web:b73f5ae632eac608bbb9e8"
};

// Inicializa Firebase con la configuración proporcionada
const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);


