import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../ComponentesGenerales/Sidebar";
import EventoProductor from "./EventoProductor";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useContext } from "react";
import Footer from "../ComponentesGenerales/Footer";
import useDinamicColors from "../../UseDinamicColors";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

const ListadoEventosProductor = () => {
  const [eventos, setEventos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const { user } = useContext(UserContext);
  const Colors = useDinamicColors();
  const navigate = useNavigate();

  const recargarComponente = () => {
    console.log("Recargando componente");
    setTimeout(() => {
      setRecargar(recargar + 1);
    }, 100);
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  useEffect(() => {
    if (user) {
      console.log("llega a pedir");
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      fetch(`${process.env?.REACT_APP_BACK_URL}evento/all`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          const eventosProcesados = data.data.map((evento) => ({
            ...evento,
            fechaInicio: parseDate(evento.fechaHoraInicio),
            horaInicio: parseDate(evento.fechaHoraInicio),
            fechaFin: parseDate(evento.fechaHoraFin),
          }));

          setEventos(eventosProcesados);
        })
        .catch((error) => console.log("No existen eventos.", error));
    }
  }, [user, recargar]);

  const agregarNuevo = () => {
    navigate(`/registrar-evento2`);
  };

  const styles = {
    mainFormEventos: {
      display: "flex",
      margin: "0",
      backgroundColor: Colors.GrisAzuladoOscuro,
      flexDirection: "column",
      overflow: "hidden",
      height: "100vh",
      overflowY: "scroll",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    content: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "80%",
      marginLeft: "20%",
      paddingBottom: "20px",
    },
    container: {
      paddingTop: "0px",
      paddingBottom: "40px",
      width: "100%",
      marginLeft: "20px",
      marginRight: "20px",
    },
    tituloSeccion: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
      fontSize: "24px",
      marginLeft: "20%",
      color: Colors.Blanco,
    },
    hr: {
      color: Colors.Naranja,
    },
    contenedorGrid: {
      textAlign: "center",
      padding: "40px 20px",
      margin: "40px",
    },
    descripcion: {
      marginBottom: "20px",
      fontSize: "18px",
      color: Colors.Blanco,
    },
    linkAgregarEvento: {
      textDecoration: "none",
      backgroundColor: Colors.Naranja,
      padding: "10px 20px",
      color: Colors.Blanco,
      borderRadius: "5px",
      fontWeight: "bold",
      fontSize: "18px",
      transition: "background-color 0.3s",
      display: "inline-block",
    },
    agregarEventoButton: {
      backgroundColor: Colors.Verde,
      color: "white",
      padding: "10px 20px",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      position: "fixed",
      bottom: "70px",
      right: "20px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      zIndex: 1000,
    },
    breadcrumbWrapper: {
      width: "100%",
      margin: "0",
      padding: "0",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Eventos", url: "/listado-eventos-productor" },
  ];

  return (
    <div style={styles.mainFormEventos}>
      <div style={styles.sidebar}>
        <Sidebar tipoUsuario={user?.tipoUsuario} />
      </div>
      <div style={styles.tituloSeccion}>
        <h1>Eventos</h1>
      </div>
      <hr style={styles.hr} />
      <div style={styles.breadcrumbWrapper}>
        <Breadcrumb
          items={breadcrumbItems}
          style={{ width: "Calc(80% - 40px)", marginLeft: "Calc(20% + 20px)" }}
        />
      </div>
      <div style={styles.content}>
        <div style={styles.container}>
          {Array.isArray(eventos) && eventos.length > 0 ? (
            eventos.map((evento, index) => (
              <EventoProductor
                key={index}
                evento={evento}
                recargarComponente={recargarComponente}
              />
            ))
          ) : (
            <div style={styles.contenedorGrid}>
              <div style={styles.tituloSeccion}>
                <h2>Eventos</h2>
              </div>
              <div style={styles.descripcion}>
                <p>
                  Con Quickfood, crea tu evento para hacerlo mejor. Descubre
                  nuestras increíbles características y ofrece una experiencia
                  única a tus consumidores.
                </p>
              </div>
              <Link to={`/registrar-evento`} style={styles.linkAgregarEvento}>
                Crear Evento
              </Link>
            </div>
          )}
        </div>
      </div>
      <button onClick={agregarNuevo} style={styles.agregarEventoButton}>
        Agregar Evento
      </button>
      <Footer />
    </div>
  );
};

export default ListadoEventosProductor;
