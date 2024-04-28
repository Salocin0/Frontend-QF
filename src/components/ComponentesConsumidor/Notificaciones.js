import { getToken } from '@firebase/messaging';
import { getAuth, signInAnonymously } from "firebase/auth";
import { onMessage } from 'firebase/messaging';
import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { messaging } from '../../firebase';


const Notificaciones = () => {

    const loguearse = () => {
        signInAnonymously(getAuth()).then(usuario => console.log(usuario));
    }

    const activarMensajes = async () => {
        const token = await getToken(messaging, {
            vapidKey: "BD9cxckj-2F0CSMqdTEBcR5HzxidWWBnJwgZQXeFILXO6n2yDUPOUQbwU3YR4Y9X1b1mmPZix0T_LZ1QCFe_59o"
        }).catch(error => console.log("Error"));

        if (token) console.log("Tu token:", token);
        if (!token) console.log("No tienes token");
    }
    useEffect(() => {
      const unsubscribe = onMessage(messaging, (message) => {
        console.log("Tu mensaje", message);
        toast(message.notification.title);
      });

      return () => {
        unsubscribe();
      };
    }, []);

    return (
        <div>
            <h1>Bienvenido</h1>
            <ToastContainer />
            <button onClick={loguearse}>Loguearse</button>
            <button onClick={activarMensajes}>Generar Token</button>
        </div>
    );
}

export default Notificaciones;
