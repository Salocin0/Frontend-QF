import React, { useEffect, useState, useContext } from "react";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Footer from "../ComponentesGenerales/Footer";
import { UserContext } from "../ComponentesGenerales/UserContext";
import CardNotificaciones from "./CardNotificaicones";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { CircularProgress } from "@mui/material";
import LoadingSpinner from "../ComponentesGenerales/LoadingSpinner";

const Notificaciones = () => {
  const { user } = useContext(UserContext);
  const [notificaciones, setNotificaciones] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const recargarComponente = () => {
    setRecargar((prevRecargar) => prevRecargar + 1);
  };

  useEffect(() => {
    const fetchNotificaciones = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}notificaciones/web`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ConsumidorId: user.consumidorId,
            },
          }
        );
        const responseJson = await response.json();
        setNotificaciones(Array.isArray(responseJson.notificaciones) ? responseJson.notificaciones : []);
      } catch (error) {
        console.error("Error fetching notificaciones:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotificaciones();
  }, [user.consumidorId, recargar]);

  const styles = {
    mainContent: {
      width: "100%",
      padding: "48px 24px 24px",
      boxSizing: "border-box",
      minWidth: 0,
      marginBottom: "5rem",
    },
    titleSection: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1rem",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "400px",
      gap: "20px",
      marginTop: "40px",
    },
    loadingText: {
      fontSize: "16px",
      color: "var(--qf-text-primary)",
      fontWeight: "bold",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Notificaciones", url: "/notificaciones" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user.tipoUsuario }}>
      <div className="qf-notifications-page" style={styles.mainContent}>
        <div style={styles.titleSection}>
          <h1 className="qf-page-title">Notificaciones</h1>
        </div>
        <Breadcrumb
          items={breadcrumbItems}
          style={{ width: "100%", margin: "10px 0" }}
        />
        {isLoading ? (
          <div style={styles.loadingContainer}>
            <CircularProgress style={{ color: "var(--qf-naranja)" }} size={50} />
            <div style={styles.loadingText}><LoadingSpinner label="Cargando notificaciones..." /></div>
          </div>
        ) : notificaciones.length > 0 ? (
          notificaciones.map((notificacion) => (
            <CardNotificaciones
              key={notificacion.id}
              notificacion={notificacion}
              recargarComponente={recargarComponente}
            />
          ))
        ) : (
          <div className="qf-notifications-empty"><h2>Estás al día</h2><p>Los avisos sobre tus pedidos y eventos aparecerán acá.</p></div>
        )}
      </div>
      <Footer />
    </PageLayout>
  );
};

export default Notificaciones;
