import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventoEncargado from "../ComponentesEventos/EventoEncargado";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";

const AsociarPuestoAEvento = () => {
  const { puestoId } = useParams();
  const { user } = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const Colors = useDynamicColors();

  const recargarComponente = () => {
    setRecargar(+1);
  };

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      fetch(`${process.env?.REACT_APP_BACK_URL}evento/enEstado/EnPreparacion`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setEventos(data.data);
        })
        .catch((error) => console.log("No existen carritos.", error));

      fetch(`${process.env?.REACT_APP_BACK_URL}asociacion/`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setAsociaciones(data.data);
        })
        .catch((error) => console.log("No existen carritos.", error));
    }
  }, [user, recargar]);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      margin: 0,
      padding: 0,
      height: "100vh",
      backgroundColor: Colors.GrisAzuladoOscuro,
    },
    mainContent: {
      width: "80%",
      padding: "0 2rem",
      marginLeft: "20%",
    },
    titleContainer: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1rem",
    },
    title: {
      paddingTop: "1rem",
      paddingBottom: "0.5rem",
      fontSize: "2rem",
      color: Colors.Naranja,
    },
    separator: {
      color: Colors.Naranja,
    },
    eventsContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    eventsList: {
      paddingTop: "1rem",
      paddingBottom: "1.5rem",
      width: "100%",
    },
    noEventsMessage: {
      fontSize: "1.5rem",
      color: Colors.Naranja,
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <Sidebar tipoUsuario={user?.tipoUsuario} />
      <div style={styles.mainContent}>
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>Asociate a un Evento</h1>
        </div>
        <hr style={styles.separator} />
        <div style={styles.eventsContainer}>
          <div style={styles.eventsList}>
            {Array.isArray(eventos) && eventos.length > 0 ? (
              <div>
                {eventos.map((evento, index) => (
                  <div key={index}>
                    <EventoEncargado
                      evento={evento}
                      puestoId={puestoId}
                      recargar={recargarComponente}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <h2 style={styles.noEventsMessage}>
                No hay eventos activos en este momento.
              </h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsociarPuestoAEvento;
