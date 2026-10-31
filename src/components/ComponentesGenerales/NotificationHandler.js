import { onMessage } from "@firebase/messaging";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { ensureMessagingSupported, messaging } from "../../firebase.js"; // Ajusta la ruta según tu estructura de proyecto

const NotificationHandler = () => {
  useEffect(() => {
    let unsubscribe = null;

    (async () => {
      const supported = await ensureMessagingSupported();
      if (!supported) return;

      unsubscribe = onMessage(messaging, (message) => {

        const { notification } = message || {};
        if (notification && notification.title && notification.body) {
          toast.info(
            <div className="qf-toast-message"><strong>{notification.title}</strong><p>{notification.body}</p></div>
          );
        } else {
          toast.info('Mensaje recibido sin título ni cuerpo');
        }
      });
    })();

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  return null;
};

export default NotificationHandler;
