import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../ComponentesGenerales/UserContext";
import PageLayout from "../ComponentesGenerales/PageLayout";
import FormPuestoEditar from "./FormPuestoEditar";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import Footer from "../ComponentesGenerales/Footer";
import useBreakpoint from "../../useBreakpoint";

const ConsultarPuestoSolicitud = () => {
  const { isMobile } = useBreakpoint();
  const location = useLocation();
  const carrito = location.state;
  const { user } = useContext(UserContext);

  const styles = {
    pagina: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
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
      margin: 0,
      width: "100vw",
      marginLeft: "calc(-50vw + 50%)",
    },
    breadcrumbWrapper: {
      width: "100%",
    },
    content: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "var(--qf-bg-main)",
      padding: isMobile ? "0" : "0",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Puestos", url: "/listado-puestos-encargado" },
    { title: "Informacion de mi puesto", url: `info-puesto/${carrito.id}` },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user.tipoUsuario }}>
      <div style={styles.pagina}>
        {/* Título centrado */}
        <h1 style={styles.tituloSeccion}>
          Informacion Puesto {carrito?.nombreCarro}
        </h1>

        {/* HR que ocupa el 100% del viewport */}
        <hr style={styles.hrFull} />

        {/* Breadcrumb a ancho completo */}
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb items={breadcrumbItems} style={{ width: "100%", margin: "8px 0" }} />
        </div>

        {/* Formulario centrado */}
        <div style={styles.content}>
          <FormPuestoEditar carrito={carrito} />
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default ConsultarPuestoSolicitud;
