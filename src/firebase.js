import { getMessaging, getToken } from "@firebase/messaging";
import { initializeApp } from "firebase/app";
import { onMessage } from "firebase/messaging";

// Configuración de tu aplicación en Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBHsEP_E5e53GuwQSDWYQDAfpDcxsJ191c",
  authDomain: "fir-cloud-messaging-63ab1.firebaseapp.com",
  projectId: "fir-cloud-messaging-63ab1",
  storageBucket: "fir-cloud-messaging-63ab1.appspot.com",
  messagingSenderId: "356683367481",
  appId: "1:356683367481:web:b73f5ae632eac608bbb9e8"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

getToken(messaging, { vapidKey: 'BD9cxckj-2F0CSMqdTEBcR5HzxidWWBnJwgZQXeFILXO6n2yDUPOUQbwU3YR4Y9X1b1mmPZix0T_LZ1QCFe_59o' }).then((currentToken) => {
  if (currentToken) {
    console.log('Token de registro:', currentToken);
  } else {
    console.log('No se pudo obtener el token de registro.');
  }
}).catch((err) => {
  console.log('Error al obtener el token de registro:', err);
});





// Manejar mensajes entrantes
onMessage(messaging, (message) => {
  console.log('Mensaje recibido:', message);
  // Aquí puedes manejar el mensaje entrante como lo desees
});
