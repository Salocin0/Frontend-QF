import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.css";
import EventoRepartidor from "./EventoRepartidor";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

const AsociarRepartidorAEvento = () => {
  const {user} = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
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


    }
  }, [user, recargar]);

  const styles = {
    container: {
      marginLeft: "0",
      backgroundColor: Colors.GrisAzuladoOscuro,
      height: "100vh",
    },
    contentCol: {
      marginLeft: "20%",
    },
    titleSection: {
      display: "flex",
      justifyContent: "center",
      fontWeight: "bold",
      fontSize: "1.5rem",
      textAlign: "center",
      color: Colors.Naranja,
    },
    titleText: {
      paddingTop: "0.5rem",
    },
    separator: {
      color: Colors.Naranja,
    },
    noEvents: {
      color: "red",
      fontWeight: "bold",
      textAlign: "center",
    },
    eventsContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    eventsList: {
      paddingTop: "1rem",
      paddingBottom: "2rem",
      height: "100%",
      width: "100%",
    },
    breadcrumbWrapper: {
      width: "Calc(100%)",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Asociarte a evento", url: "/asociarRepartidorAEvento" },
  ];

  return (
    <div style={styles.container}>
        <Sidebar tipoUsuario={user?.tipoUsuario} />
      <div style={styles.contentCol}>
        <div style={styles.titleSection}>
          <h1 style={styles.titleText}>Asociate a un Evento</h1>
        </div>
        <hr style={styles.separator} />
        <div style={styles.breadcrumbWrapper}>
                  <Breadcrumb
                    items={breadcrumbItems}
                    style={{
                      width: "Calc(100% - 40px)",
                      marginLeft: "Calc(20px)",
                    }}
                  />
                </div>
        <div style={styles.eventsContainer}>
          <div style={styles.eventsList}>
            {Array.isArray(eventos) && eventos.length > 0 ? (
              <div>
                {eventos.map((evento, index) => (
                  <div key={index}>
                    <EventoRepartidor
                      evento={evento}
                      recargar={recargarComponente}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <h2 style={styles.noEvents}>
                No hay eventos activos en este momento.
              </h2>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsociarRepartidorAEvento;
