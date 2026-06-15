import React, { useState } from "react";
import { toast } from "react-toastify";
import "./../../sass/main.scss";
import Footer from "../../ComponentesGenerales/Footer";
import useBreakpoint from "../../../useBreakpoint";

const FormEncargado = ({ nextStep, backStep, handleRegistro }) => {
  const { isMobile } = useBreakpoint();
  const [encargadoData, setEncargadoData] = useState({
    cuit: "",
    razonSocial: "",
    ivaCondicion: "responsable_inscripto",
  });

  const isCuitValid = (cuit) => {
    const regexCuit = /^(20|23|27|30|33)([0-9]{9}|-[0-9]{8}-[0-9]{1})$/g;
    if (!cuit.trim()) {
      return false;
    }
    return regexCuit.test(cuit);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEncargadoData({
      ...encargadoData,
      [name]: value,
    });
  };

  function tieneLetras(cadena) {
    const regex = /[a-zA-Z]/;
    return regex.test(cadena);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isCuitValid(encargadoData.cuit)) {
      toast.error("El CUIT no es válido o está vacío.");
      return;
    }

    if (!encargadoData.razonSocial.trim()) {
      toast.error("Razón Social no puede estar vacía.");
      return;
    }

    if (tieneLetras(encargadoData.cuit)) {
      toast.error("CUIT no puede tener letras.");
      return;
    }
    handleRegistro(encargadoData);
    nextStep();
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundImage: "url(/../QuickFoodFondo.png)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    card: {
      width: "100%",
      maxWidth: isMobile ? "100%" : "500px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      backgroundColor: "var(--qf-bg-main)",
    },
    title: {
      backgroundColor: "var(--qf-naranja)",
      padding: "1.5rem",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
    formGroup: {
      marginBottom: "1rem",
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "500",
      color: "var(--qf-text-white)",
      margin:"0px"
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      borderRadius: "4px",
      border:`1px solid var(--qf-text-muted)`,
      fontSize: "0.9rem",
    },
    select: {
      width: "100%",
      padding: "0.5rem",
      borderRadius: "4px",
      border: `1px solid var(--qf-text-muted)`,
      fontSize: "0.9rem",
      appearance: "none",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "1.5rem",
    },
    backButton: {
      padding: "0.5rem 1rem",
      backgroundColor: "var(--qf-blue)",
      border: `1px solid #var(--qf-text-muted)`,
      borderRadius: "4px",
      cursor: "pointer",
      color: "var(--qf-blanco-puro)",
    },
    nextButton: {
      padding: "0.5rem 1rem",
      backgroundColor: "var(--qf-green)",
      color: "var(--qf-blanco-puro)",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    form:{
      padding: "1rem",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} data-testid="form-card-encargado">
        <h2 style={styles.title}>Datos Encargado - Paso 3</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="razonSocial" style={styles.label}>Razón Social</label>
            <input
              type="text"
              name="razonSocial"
              id="razonSocial"
              value={encargadoData.razonSocial}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ingresa la razón social"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="cuit" style={styles.label}>CUIT</label>
            <input
              type="text"
              name="cuit"
              id="cuit"
              value={encargadoData.cuit}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ingresa el CUIT"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="ivaCondicion" style={styles.label}>Condición frente al IVA</label>
            <select
              name="ivaCondicion"
              id="ivaCondicion"
              value={encargadoData.ivaCondicion}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="responsable_inscripto">Responsable Inscripto</option>
              <option value="monotributista">Monotributista</option>
            </select>
          </div>
          <div style={styles.buttonContainer}>
            <button type="button" style={styles.backButton} onClick={backStep}>
              Volver
            </button>
            <button type="submit" style={styles.nextButton}>
              Finalizar
            </button>
          </div>
        </form>
      </div>
      <Footer/>
    </div>
  );
};

export default FormEncargado;
