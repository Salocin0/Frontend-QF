// firebase.js
import { getMessaging, getToken, isSupported } from "@firebase/messaging";
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
let messaging = null; // will be initialized if supported

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registrado:', registration);
    })
    .catch((error) => {
      console.error('Error al registrar el Service Worker:', error);
    });
}

const ensureMessagingSupported = async () => {
  try {
    const supported = await isSupported();
    if (supported && !messaging) {
      messaging = getMessaging(app);
    }
    return supported;
  } catch (err) {
    console.warn('Error comprobando soporte de messaging:', err);
    return false;
  }
};

const fetchToken = async () => {
  try {
    const supported = await ensureMessagingSupported();
    if (!supported) {
      console.log('Firebase messaging no está disponible en este navegador.');
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    const currentToken = await getToken(messaging, {
      vapidKey:
        'BD9cxckj-2F0CSMqdTEBcR5HzxidWWBnJwgZQXeFILXO6n2yDUPOUQbwU3YR4Y9X1b1mmPZix0T_LZ1QCFe_59o',
      serviceWorkerRegistration: registration,
    });

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

export { fetchToken, ensureMessagingSupported, messaging };
