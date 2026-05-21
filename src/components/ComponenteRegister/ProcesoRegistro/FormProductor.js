import React, { useState } from "react";
import { toast } from "react-toastify";
import "../placeholder.css"

const FormProductor = ({ nextStep, backStep, handleRegistro }) => {
  const [productorData, setProductorData] = useState({
    cuit: "",
    razonSocial: "",
    ivaCondicion: "responsable_inscripto",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductorData({
      ...productorData,
      [name]: value,
    });
  };

  const isCuitValid = (cuit) => {
    const regexCuit = /^(20|23|27|30|33)([0-9]{9}|-[0-9]{8}-[0-9]{1})$/g;
    return cuit.trim() && regexCuit.test(cuit);
  };

  const tieneLetras = (cadena) => {
    const regex = /[a-zA-Z]/;
    return regex.test(cadena);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isCuitValid(productorData.cuit)) {
      toast.error("El CUIT no es válido o está vacío.");
      return;
    }

    if (!productorData.razonSocial.trim()) {
      toast.error("La razón social no puede estar vacía.");
      return;
    }

    if (tieneLetras(productorData.cuit)) {
      toast.error("El CUIT no puede tener letras.");
      return;
    }

    handleRegistro(productorData);
    nextStep();
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
    },
    card: {
      width: "100%",
      maxWidth: "600px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      backgroundColor: "var(--qf-bg-main)",
    },
    cardHeader: {
      backgroundColor: "var(--qf-naranja)",
      padding: "1.5rem",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
    title: {
      textAlign: "center",
      fontSize: "1.5rem",
      fontWeight: "bold",
      margin: 0,
    },
    formGroup: {
      marginBottom: "1rem",
    },
    label: {
      display: "block",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      margin:"0px",
      color: "var(--qf-text-white)"
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      fontSize: "1rem",
      borderRadius: "4px",
      border: `1px solid var(--qf-text-muted)`,
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "1rem",
    },
    backButton: {
      padding: "0.5rem 1rem",
      backgroundColor: "var(--qf-blue)",
      border: `1px solid var(--qf-text-muted)`,
      borderRadius: "4px",
      cursor: "pointer",
      color: "var(--qf-blanco-puro)"
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
      padding: "20px"
    }
  };

  return (
    <div className="background-prelogin" style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.title}>Datos Productor - Paso 3</h2>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="razonSocial" style={styles.label}>Razón Social</label>
            <input
              type="text"
              name="razonSocial"
              id="razonSocial"
              value={productorData.razonSocial}
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
              value={productorData.cuit}
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
              value={productorData.ivaCondicion}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="responsable_inscripto">Responsable Inscripto</option>
              <option value="monotributista">Monotributista</option>
            </select>
          </div>
          <div style={styles.buttonContainer}>
            <button type="button" style={styles.backButton} onClick={backStep}>Volver</button>
            <button type="submit" style={styles.nextButton}>Finalizar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormProductor;
