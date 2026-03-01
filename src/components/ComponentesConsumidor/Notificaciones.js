import React, { useEffect, useState } from "react";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Footer from "../ComponentesGenerales/Footer";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";
import CardNotificaciones from "./CardNotificaicones";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { CircularProgress } from "@mui/material";

const Notificaciones = () => {
  const Colors = useDynamicColors();
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
        setNotificaciones(responseJson.notificaciones);
        console.log(responseJson);
      } catch (error) {
        console.error("Error fetching notificaciones:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotificaciones();
  }, [user.consumidorId, recargar]);

  const styles = {
    container: {
      backgroundColor: Colors.GrisAzuladoOscuro,
      width: "100%",
      height: "100vh",
      margin: "0",
      overflow: "hidden", // Ocultar cualquier scroll en el contenedor principal
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginLeft: "calc(20%)",
      marginBottom: "60px",
      overflowY: "scroll", // Habilitar scroll interno
      overflowX: "hidden",
      height: "calc(100vh - 60px)", // Altura dinámica para permitir el scroll sin afectar el footer
      scrollbarWidth: "none", // Ocultar barra de scroll en Firefox
      msOverflowStyle: "none", // Ocultar barra de scroll en IE y Edge
    },
    hr: {
      color: Colors.Naranja,
      border: "1px solid",
      width: "100%",
    },
    breadcrumbWrapper: {
      width: "100%",
      margin: "0",
      padding: "0",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
      color: Colors.Blanco,
      fontWeight: "bold",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Notificaciones", url: "/Listado-eventos" },
  ];

  return (
    <div style={styles.container}>
      <Sidebar tipoUsuario={user.tipoUsuario} />
      <div
        style={styles.content}
        className="custom-scroll" // Clase CSS opcional
      >
        <h2 style={{ color: Colors.TextoClaro, marginTop: "20px" }}>
          Notificaciones
        </h2>
        <hr style={styles.hr} />
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "Calc(100% - 40px)", marginLeft: "20px" }}
          />
        </div>
        {isLoading ? (
          <div style={styles.loadingContainer}>
            <CircularProgress style={{ color: Colors.Naranja }} size={50} />
            <div style={styles.loadingText}>Cargando notificaciones...</div>
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
          <p style={{ color: Colors.Blanco }}>No hay notificaciones.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Notificaciones;
