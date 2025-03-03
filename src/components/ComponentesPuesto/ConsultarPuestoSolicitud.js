import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Sidebar from "../ComponentesGenerales/Sidebar";
import FormPuestoEditar from "./FormPuestoEditar";
import useDynamicColors from "../../UseDinamicColors";

const ConsultarPuestoSolicitud = () => {
  const location = useLocation();
  const carrito = location.state;
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();

  const styles = {
    container: {
      margin: 0,
      backgroundColor: Colors.GrisAzuladoOscuro,
      height: "Calc(100vh - 90px)",
    },
    header: {
      color: Colors.Blanco,
      fontSize: "24px",
      fontWeight: "bold",
      textAlign: "center",
      padding: "20px",
      marginLeft: "20%",
    },
    hrStyle: {
      border: `2px solid ${Colors.Naranja}`,
      padding: 0,
      margin: 0,
    },
    content: {
      marginTop: "10px",
      marginLeft: "20%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      backgroundColor: Colors.GrisAzuladoOscuro,
    },

  };

  return (
    <div style={styles.container}>
      <div>
        <h1 style={styles.header}>Informacion Puesto {carrito?.nombreCarro}</h1>
        <hr style={styles.hrStyle} />
      </div>
      <Sidebar tipoUsuario={user.tipoUsuario} />
      <div style={styles.content}>
        <FormPuestoEditar carrito={carrito} />
      </div>
    </div>
  );
};

export default ConsultarPuestoSolicitud;