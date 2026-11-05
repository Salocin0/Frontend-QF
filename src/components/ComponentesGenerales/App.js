import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Main from "./Main";
import NotificationHandler from './NotificationHandler'; // Ajusta la ruta según tu estructura de proyecto
import AsignacionRepartidorAlert from './AsignacionRepartidorAlert';
import { UserProvider } from './UserContext';
import './Notifications.css';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Main />
      </Router>
      <ToastContainer
        position="top-right" // Posición en la esquina superior derecha
        autoClose={4500}
        hideProgressBar={false}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="light"
        className="qf-toast-container"
        toastClassName="qf-toast"
        limit={3}
      />
      <NotificationHandler />
      <AsignacionRepartidorAlert />
    </UserProvider>
  );
};

export default App;
