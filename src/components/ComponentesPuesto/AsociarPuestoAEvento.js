import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EventoEncargado from "../ComponentesEventos/EventoEncargado";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import LoandingComponent from "../ComponentesGenerales/LoandingComponent";
import Footer from "../ComponentesGenerales/Footer";

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
      const estadosEnPreparacion = ["EnPreparacion1", "EnPreparacion2", "EnPreparacion3", "Confirmado"];
      Promise.all(
        estadosEnPreparacion.map((estado) =>
          fetch(`${process.env?.REACT_APP_BACK_URL}evento/enEstado/${estado}`, {
            method: "GET",
            headers: headers,
          })
            .then((response) => response.json())
            .then((data) => (Array.isArray(data.data) ? data.data : []))
            .catch(() => [])
        )
      )
        .then((resultados) => setEventos(resultados.flat()))
        .catch((error) => console.log("No existen eventos.", error))
        .finally(() => setIsLoading(false));
    }
  }, [user, recargar]);

  const styles = {
    pagina: {
      display: "flex",
      flexDirection: "column",
    },
    tituloSeccion: {
      textAlign: "center",
      paddingTop: "1rem",
      fontSize: "2rem",
      color: "var(--qf-naranja)",
      margin: 0,
    },
    hrFull: {
      border: "none",
      borderTop: "1px solid var(--qf-naranja)",
      margin: "10px 0",
      width: "100%",
    },
    breadcrumbWrapper: {
      width: "100%",
      marginBottom: "10px",
    },
    eventsContainer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    eventsList: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      paddingBottom: "1.5rem",
      width: "100%",
    },
    noEventsMessage: {
      fontSize: "1.5rem",
      color: "var(--qf-naranja)",
      textAlign: "center",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Puestos", url: "/listado-puestos-encargado" },
    { title: "Asociarme a un Evento", url: `/asociarPuestoAEvento/${puestoId}` },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.pagina}>
        {/* Título centrado */}
        <h1 style={styles.tituloSeccion}>Asociate a un Evento</h1>

        <hr style={styles.hrFull} />

        <div className="qf-page-content">
          <div className="qf-page-content__main">
            {/* Breadcrumb a ancho completo */}
            <div style={styles.breadcrumbWrapper}>
              <Breadcrumb
                items={breadcrumbItems}
                style={{ width: "100%", margin: "8px 0" }}
              />
            </div>

            {/* Lista de eventos */}
            <div style={styles.eventsContainer}>
              <div style={styles.eventsList}>
                {isLoading ? (
                  <LoandingComponent />
                ) : Array.isArray(eventos) && eventos.length > 0 ? (
                    eventos.map((evento, index) => (
                      <EventoEncargado
                        key={index}
                        evento={evento}
                        puestoId={puestoId}
                        recargar={recargarComponente}
                      />
                    ))
                ) : (
                  <h2 style={styles.noEventsMessage}>
                    No hay eventos activos en este momento.
                  </h2>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default AsociarPuestoAEvento;
