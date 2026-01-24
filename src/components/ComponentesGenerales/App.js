import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Main from "./Main";
import NotificationHandler from './NotificationHandler'; // Ajusta la ruta según tu estructura de proyecto
import { UserProvider } from './UserContext';

console.log("App.js - Global Diagnostic:", {
  Main: typeof Main,
  NotificationHandler: typeof NotificationHandler,
  UserProvider: typeof UserProvider,
  Router: typeof Router,
  ToastContainer: typeof ToastContainer
});

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Main />
      </Router>
      <ToastContainer
        position="top-right" // Posición en la esquina superior derecha
        autoClose={2000}
        hideProgressBar={true}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="colored"
        style={{ width: "400px" }} // Ajustar el ancho del ToastContainer
        toastStyle={{ fontSize: "16px" }} // Ajustar el tamaño de fuente de los toasts
      />
      <NotificationHandler />
    </UserProvider>
  );
};

export default App;
