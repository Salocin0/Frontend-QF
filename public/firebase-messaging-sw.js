// Importa las funciones necesarias de Firebase
importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js");

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
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

messaging.onBackgroundMessage((payload) => {
  console.log("Recibiste mientras no estabas", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png"
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
});
