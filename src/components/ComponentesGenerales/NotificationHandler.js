import { onMessage } from "@firebase/messaging";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { messaging } from "../../firebase.js"; // Ajusta la ruta según tu estructura de proyecto

const NotificationHandler = () => {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (message) => {
      console.log('Mensaje recibido:', message);

      // Desestructurar el objeto notification del mensaje recibido
      const { notification } = message;
      console.log(notification.body);

      // Verificar que notification, title y body estén presentes antes de mostrar el toast
      if (notification.title && notification.body) {
        toast.info(`${notification.title}: ${notification.body}`);
      } else {
        toast.info('Mensaje recibido sin título ni cuerpo');
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return null;
};

export default NotificationHandler;
