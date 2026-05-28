import React, { useState } from "react";
import classnames from "classnames";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";
import "./../sass/main.scss";
import { FaUser, FaSeedling, FaTruck, FaStore } from "react-icons/fa";
import useBreakpoint from "../../useBreakpoint";

const SeleccionRegister = () => {
  const [selectedType, setSelectedType] = useState("consumidor");
  const { isMobile } = useBreakpoint();
  

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
      maxWidth: isMobile ? "100%" : "500px",
      width: "100%",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      backgroundColor: "var(--qf-bg-main)",
    },
    cardHeader: {
      backgroundColor: "var(--qf-naranja)",
      padding: "1rem",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
    cardHeaderText: {
      color: "var(--qf-text-white)",
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
      color: "var(--qf-text-white)",
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s",
      margin: "0.2rem 0",
    },
    activeLabel: {
      backgroundColor: "var(--qf-naranja)",
      color: "var(--qf-text-primary)",
    },
    span: {
      flex: 1,
      textAlign: "left",
    },
    icon: {
      fontSize: "1.25rem",
      color: "var(--qf-text-white)",
    },
    footerButtons: {
      display: "flex",
      justifyContent: "space-between",
      padding: "1rem",
    },
    clearButton: {
      border: `1px solid var(--qf-text-secondary)`,
      color: "var(--qf-text-primary)",
      borderRadius: "5px",
      marginTop: "0.5rem",
      padding: "0.2rem 0.2rem",
      backgroundColor: "var(--qf-text-secondary)",
    },
    nextButton: {
      backgroundColor: "var(--qf-blue)",
      color: "var(--qf-text-primary)",
      borderRadius: "5px",
      padding: "0.5rem 1rem",
      textDecoration: "none",
      cursor: "pointer",
    },
    hr: {
      color: "var(--qf-text-white)",
      width: "100%",
    },
  };

  return (
    <div style={styles.background}>
      <div style={styles.card} data-testid="form-card-seleccion">
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
              <span style={styles.icon}><FaUser /></span>
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
              <span style={styles.icon}><FaSeedling /></span>
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
              <span style={styles.icon}><FaTruck /></span>
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
              <span style={styles.icon}><FaStore /></span>
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
