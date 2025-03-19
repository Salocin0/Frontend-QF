import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Sidebar from "../ComponentesGenerales/Sidebar";
import FormPuestoEditar from "./FormPuestoEditar";
import useDynamicColors from "../../UseDinamicColors";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import Footer from "../ComponentesGenerales/Footer";

const ConsultarPuestoSolicitud = () => {
  const location = useLocation();
  const carrito = location.state;
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();

  const styles = {
    container: {
      margin: 0,
      backgroundColor: Colors.GrisAzuladoOscuro,
      height: "100vh",
    },
    hrStyle: {
      border: `1px solid ${Colors.Naranja}`,
      padding: 0,
      margin: 0,
    },
    content: {
      marginTop: "10px",
      marginLeft: "20%",
      width: "80%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Colors.GrisAzuladoOscuro,
    },
    tituloSeccion: {
      display: "flex",
      justifyContent: "center",
      paddingTop: "1rem",
      paddingBottom: "1rem",
      fontSize: "2rem",
      color: Colors.Naranja,
      marginLeft: "20%",
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
    { title: "Informacion de mi puesto", url: `info-puesto/${carrito.id}` },
  ];

  return (
    <div style={styles.container}>
      <div>
        <h1 style={styles.tituloSeccion}>
          Informacion Puesto {carrito?.nombreCarro}
        </h1>
        <hr style={styles.hrStyle} />
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{
              width: "Calc(80% - 40px)",
              marginLeft: "Calc(20% + 20px)",
            }}
          />
        </div>
      </div>
      <Sidebar tipoUsuario={user.tipoUsuario} />
      <div style={styles.content}>
        <FormPuestoEditar carrito={carrito} />
      </div>
      <Footer />
    </div>
  );
};

export default ConsultarPuestoSolicitud;
