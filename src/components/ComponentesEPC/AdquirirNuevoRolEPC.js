import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { useNavigate } from "react-router-dom";
import useDynamicColors from "../../UseDinamicColors";
import { UserContext } from "../ComponentesGenerales/UserContext";

const AdquirirNuevoRolEPC = () => {
  const [cuit, setCuit] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [condicionIva, setCondicionIva] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();

  const handleCuitChange = (e) => setCuit(e.target.value);
  const handleRazonSocialChange = (e) => setRazonSocial(e.target.value);
  const handleCondicionIvaChange = (e) => setCondicionIva(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const encargado = {
        cuit,
        razonSocial,
        condicionIva,
      };
      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}user/update/${user.id}/to/encargado`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(encargado),
        }
      );

      if (response.ok) {
        toast.success("Actualizado a Encargado de Puesto");
        navigate(`/login`);
      } else {
        toast.error("Error al actualizar a Encargado de Puesto");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const styles = {
    container: {
      display: "flex",
      background: Colors.GrisAzuladoOscuro,
      minHeight: "100vh",
    },
    sidebar: {
      flex: "0 0 20%",
    },
    main: {
      flex: "1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    formCard: {
      width: "100%",
      maxWidth: "400px",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      backgroundColor: Colors.GrisAzuladoClaro,
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "20px",
      color: Colors.Naranja,
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      margin: "0px",

      display: "block",
      fontSize: "0.875rem",
      color: Colors.Negro,
    },
    input: {
      width: "100%",
      padding: "10px",
      fontSize: "1rem",
      borderRadius: "5px",
    },
    select: {
      width: "100%",
      padding: "10px",
      fontSize: "1rem",
      borderRadius: "5px",
    },
    button: {
      display: "block",
      width: "100%",
      padding: "10px",
      fontSize: "1rem",
      color: Colors.Negro,
      backgroundColor: Colors.Verde,
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <Sidebar tipoUsuario={user?.tipoUsuario} />
      </div>
      <div style={styles.main}>
        <div style={styles.formCard}>
          <h1 style={styles.title}>
            Adquirir Nuevo Rol - Encargado de Puesto de Comida
          </h1>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="cuit" style={styles.label}>
                CUIT
              </label>
              <input
                type="text"
                id="cuit"
                value={cuit}
                onChange={handleCuitChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="razonSocial" style={styles.label}>
                Razón Social
              </label>
              <input
                type="text"
                id="razonSocial"
                value={razonSocial}
                onChange={handleRazonSocialChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="ivaCondicion" style={styles.label}>
                Condición frente al IVA
              </label>
              <select
                id="ivaCondicion"
                value={condicionIva}
                onChange={handleCondicionIvaChange}
                style={styles.select}
              >
                <option value="">Seleccionar</option>
                <option value="responsable_inscripto">
                  Responsable Inscripto
                </option>
                <option value="monotributista">Monotributista</option>
              </select>
            </div>

            <button type="submit" style={styles.button}>
              Solicitar Nuevo Rol - Encargado Puesto de Comida
            </button>
            <button type="submit" onClick={() => navigate("/inicio")} style={{...styles.button, backgroundColor: Colors.Azul,marginTop:"10px"}}>
              Volver
            </button>
          </form>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AdquirirNuevoRolEPC;
