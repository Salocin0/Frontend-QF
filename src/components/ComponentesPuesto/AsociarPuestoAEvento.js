import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventoEncargado from "../ComponentesEventos/EventoEncargado";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import LoandingComponent from "../ComponentesGenerales/LoandingComponent";

const AsociarPuestoAEvento = () => {
  const { puestoId } = useParams();
  const { user } = useContext(UserContext);
  const [eventos, setEventos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const recargarComponente = () => {
    setRecargar(+1);
  };

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      setIsLoading(true);
      fetch(`${process.env?.REACT_APP_BACK_URL}evento/enEstado/EnPreparacion`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setEventos(data.data);
        })
        .catch((error) => console.log("No existen carritos.", error))
        .finally(() => setIsLoading(false));


    }
  }, [user, recargar]);

  const styles = {
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
      color: "var(--qf-naranja)",
    },
    separator: {
      color: "var(--qf-naranja)",
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
      color: "var(--qf-naranja)",
      textAlign: "center",
    },
    breadcrumbWrapper: {
      width: "Calc(100%)",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Puestos", url: "/listado-puestos-encargado" },
    { title: "Asociarme a un Evento", url: `/asociarPuestoAEvento/${puestoId}` },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.mainContent}>
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>Asociate a un Evento</h1>
        </div>
        <hr style={styles.separator} />
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "Calc(100%)" }}
          />
        </div>
        <div style={styles.eventsContainer}>
          <div style={styles.eventsList}>
            {isLoading ? (
              <LoandingComponent />
            ) : Array.isArray(eventos) && eventos.length > 0 ? (
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
    </PageLayout>
  );
};

export default AsociarPuestoAEvento;
