import React, { useState } from "react";
const FormRepartidor = ({ nextStep, backStep, handleRegistro }) => {
  const [repartidorData, setRepartidorData] = useState({
    confirmacionMayorDeEdad: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setRepartidorData({
      ...repartidorData,
      [name]: checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (repartidorData.confirmacionMayorDeEdad) {
      handleRegistro(repartidorData);
      nextStep();
    } else {
      alert("Debes confirmar que tienes más de 18 años.");
    }
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
      maxWidth: "600px",
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
    checkboxContainer: {
      display: "flex",
      alignItems: "center",
      marginBottom: "1.5rem",
    },
    label: {
      marginLeft: "0.5rem",
      fontSize: "0.9rem",
      color: "var(--qf-text-white)",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "1rem",
    },
    backButton: {
      padding: "0.5rem 1rem",
      backgroundColor:"var(--qf-blue)",
      border: `1px solid var(--qf-text-muted)`,
      borderRadius: "4px",
      cursor: "pointer",
      color: "var(--qf-blanco-puro)"
    },
    nextButton: {
      padding: "0.5rem 1rem",
      backgroundColor:"var(--qf-green)",
      color: "var(--qf-blanco-puro)",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    form: {
      padding: "20px",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Datos Repartidor</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="confirmacionMayorDeEdad"
              name="confirmacionMayorDeEdad"
              checked={repartidorData.confirmacionMayorDeEdad}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="confirmacionMayorDeEdad" style={styles.label}>
              Tengo 18 años o más
            </label>
          </div>
          <div style={styles.buttonContainer}>
            <button
              type="button"
              style={styles.backButton}
              onClick={backStep}
            >
              Volver
            </button>
            <button
              type="submit"
              style={styles.nextButton}
              disabled={!repartidorData.confirmacionMayorDeEdad}
            >
              Finalizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormRepartidor;
