import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../../ComponentesGenerales/Footer";
import useDynamicColors from "../../../UseDinamicColors.js";
import PasswordToggle from "../PasswordToggle.jsx";
import "../placeholder.css"

const FormUsuario = ({ nextStep, backStep, tipoUsuario, handleRegistro }) => {
  const Colors = useDynamicColors();

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userData.username.trim()) {
      toast.error("El nombre de usuario no puede estar vacío.");
      return;
    }

    if (userData.email.length === 0) {
      toast.error("El email no puede estar vacío.");
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (!userData.password.trim()) {
      toast.error("La contraseña no puede estar vacía.");
      return;
    }

    if (userData.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    const userDataWithToken = {
      ...userData,
    };

    handleRegistro(userDataWithToken);
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
      maxWidth: "600px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      backgroundColor: Colors.Blanco,
    },
    cardHeader: {
      backgroundColor: Colors.Naranja,
      padding: "1.5rem",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
    title: {
      color: Colors.Negro,
      margin: 0,
    },
    formGroup: {
      marginBottom: "1rem",
    },
    label: {
      display: "block",
      fontWeight: "500",
      margin:"0",
      marginBottom: "0.5rem",
      color: Colors.Negro,
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      border: `1px solid ${Colors.Gris}`,
      borderRadius: "4px",
      backgroundColor: Colors.Blanco,
    },
    inputGroup: {
      display: "flex",
      alignItems: "center",
    },
    toggleButton: {
      marginLeft: "0.5rem",
      padding: "0.5rem 1rem",
      border: `1px solid ${Colors.Gris}`,
      backgroundColor: Colors.Blanco,
      borderRadius: "4px",
      cursor: "pointer",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "1.5rem",
    },
    backButton: {
      padding: "0.5rem 1.5rem",
      backgroundColor: Colors.Azul,
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      color: Colors.BlancoEnBlanco,
    },
    nextButton: {
      padding: "0.5rem 1.5rem",
      backgroundColor: Colors.Azul,
      color: Colors.BlancoEnBlanco,
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    form:{
      padding: "1.5rem",
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.title}>Crear Cuenta - Paso 1</h2>
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>Nombre de usuario</label>
            <input
              type="text"
              name="username"
              id="username"
              value={userData.username}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ingresa tu nombre de usuario"
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Correo electrónico</label>
            <input
              type="email"
              name="email"
              id="email"
              value={userData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="tu@email.com"
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Contraseña</label>
            <PasswordToggle
              inputId="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>Confirmar Contraseña</label>
            <PasswordToggle
              inputId="confirmPassword"
              name="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar Contraseña"
              style={styles.input}
            />
          </div>
          <div style={styles.buttonGroup}>
            <Link to={"/seleccion-perfil"} style={styles.backButton}>Volver</Link>
            <button type="submit" style={styles.nextButton}>Siguiente</button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default FormUsuario;
