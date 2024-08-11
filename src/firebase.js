// firebase.js
import { getMessaging, getToken } from "@firebase/messaging";
import { initializeApp } from "firebase/app";
import "react-toastify/dist/ReactToastify.css";

// Configuración de tu aplicación en Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBHsEP_E5e53GuwQSDWYQDAfpDcxsJ191c",
  authDomain: "fir-cloud-messaging-63ab1.firebaseapp.com",
  projectId: "fir-cloud-messaging-63ab1",
  storageBucket: "fir-cloud-messaging-63ab1",
  messagingSenderId: "356683367481",
  appId: "1:356683367481:web:b73f5ae632eac608bbb9e8"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const fetchToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: 'BD9cxckj-2F0CSMqdTEBcR5HzxidWWBnJwgZQXeFILXO6n2yDUPOUQbwU3YR4Y9X1b1mmPZix0T_LZ1QCFe_59o' });
    if (currentToken) {
      console.log('Token de registro:', currentToken);
      return currentToken;
    } else {
      console.log('No se pudo obtener el token de registro.');
      return null;
    }
  } catch (err) {
    console.log('Error al obtener el token de registro:', err);
    return null;
  }
};

export { fetchToken, messaging };
