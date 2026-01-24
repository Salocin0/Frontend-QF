import React, { useState } from "react";
import classnames from "classnames";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";
import "./../sass/main.scss";
import useDynamicColors from "../../UseDinamicColors";

const SeleccionRegister = () => {
  const Colors = useDynamicColors();
  const [selectedType, setSelectedType] = useState("consumidor");
  const ICON = "ICON";

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const handleNextClick = () => {
    if (selectedType) {
      return `/registrarse/${selectedType}`;
    }
  };

  const handleClearSelectionClick = () => {
    setSelectedType("consumidor");
  };

  const styles = {
    background: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: "url(/../QuickFoodFondo.png)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    card: {
      maxWidth: "400px",
      width: "100%",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      backgroundColor: Colors.GrisAzuladoOscuro,
    },
    cardHeader: {
      backgroundColor: Colors.Naranja,
      padding: "1rem",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
    cardHeaderText: {
      color: Colors.Negro,
      margin: 0,
    },
    cardBody: {
      padding: "2rem",
    },
    buttonGroup: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "1rem",
      fontSize: "1rem",
      color: Colors.Negro,
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      margin: "0.2rem 0",
    },
    activeLabel: {
      backgroundColor: Colors.Naranja,
      color: Colors.Blanco,
    },
    span: {
      flex: 1,
      textAlign: "left",
    },
    icon: {
      fontSize: "1.25rem",
      color: Colors.Negro,
    },
    footerButtons: {
      display: "flex",
      justifyContent: "space-between",
      padding: "1rem",
    },
    clearButton: {
      border: `1px solid ${Colors.GrisOscuro}`,
      color: Colors.Blanco,
      borderRadius: "5px",
      marginTop: "0.5rem",
      padding: "0.2rem 0.2rem",
      backgroundColor: Colors.GrisOscuro,
    },
    nextButton: {
      backgroundColor: Colors.Azul,
      color: Colors.Blanco,
      borderRadius: "5px",
      padding: "0.5rem 1rem",
      textDecoration: "none",
      cursor: "pointer",
    },
    hr: {
      color: Colors.Negro,
      width: "100%",
    },
  };

  return (
    <div style={styles.background}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardHeaderText}>Seleccione Perfil</h2>
        </div>
        <div style={styles.cardBody}>
          <label style={{ ...styles.label, ...styles.activeLabel }}>
            <input
              type="checkbox"
              name="userType"
              id="consumidor"
              autoComplete="off"
              checked={true}
              onChange={() => {}}
              style={{ display: "none" }}
            />
            <span style={styles.span}>Consumidor</span>
              <span style={styles.icon}>{ICON}</span>
          </label>
          <hr style={styles.hr} />
          <div style={styles.buttonGroup}>
            <label
              className={classnames(
                styles.label,
                selectedType === "productor" && styles.activeLabel
              )}
              onClick={() => handleTypeChange("productor")}
              style={{
                ...styles.label,
                ...(selectedType === "productor" ? styles.activeLabel : {}),
              }}
            >
              <input
                type="radio"
                name="userType"
                id="productor"
                autoComplete="off"
                checked={selectedType === "productor"}
                readOnly
                style={{ display: "none" }}
              />
              <span style={styles.span}>Productor</span>
              <span style={styles.icon}>{ICON}</span>
            </label>
            <label
              className={classnames(
                styles.label,
                selectedType === "repartidor" && styles.activeLabel
              )}
              onClick={() => handleTypeChange("repartidor")}
              style={{
                ...styles.label,
                ...(selectedType === "repartidor" ? styles.activeLabel : {}),
              }}
            >
              <input
                type="radio"
                name="userType"
                id="repartidor"
                autoComplete="off"
                checked={selectedType === "repartidor"}
                readOnly
                style={{ display: "none" }}
              />
              <span style={styles.span}>Repartidor</span>
              <span style={styles.icon}>{ICON}</span>
            </label>
            <label
              className={classnames(
                styles.label,
                selectedType === "encargado" && styles.activeLabel
              )}
              onClick={() => handleTypeChange("encargado")}
              style={{
                ...styles.label,
                ...(selectedType === "encargado" ? styles.activeLabel : {}),
              }}
            >
              <input
                type="radio"
                name="userType"
                id="encargado"
                autoComplete="off"
                checked={selectedType === "encargado"}
                readOnly
                style={{ display: "none" }}
              />
              <span style={styles.span}>Encargado</span>
              <span style={styles.icon}>{ICON}</span>
            </label>
            <button
              style={styles.clearButton}
              onClick={handleClearSelectionClick}
            >
              Quitar selección
            </button>
          </div>
        </div>

        <div style={styles.footerButtons}>
          <Link to={"/Login"} style={styles.nextButton}>
            Volver
          </Link>

          <Link
            to={handleNextClick()}
            style={styles.nextButton}
            className={!selectedType ? "disabled" : ""}
          >
            Siguiente
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SeleccionRegister;
