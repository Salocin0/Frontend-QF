import React, { useContext,useEffect } from "react";
import { fetchToken } from '../../firebase.js';
import PasswordToggle from "../ComponenteRegister/PasswordToggle.jsx";
import Footer from "../ComponentesGenerales/Footer";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useLogin from "../Hooks/UseLogin";
import { FaUser } from "react-icons/fa";

const Login = () => {
  const { updateUser } = useContext(UserContext);
  const { email, password, setTokenWeb, handleEmailChange, handlePasswordChange, handleLogin } = useLogin();

  // Debug: verificar que las importaciones existen
  console.log('Debug imports - PasswordToggle:', PasswordToggle);
  console.log('Debug imports - Footer:', Footer);
  console.log('Debug imports - fetchToken:', fetchToken);

  const activarMensajes = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await fetchToken();
        if (token) {
          setTokenWeb(token);
        } else {
          console.log('No se pudo obtener el token.');
        }
      } else {
        console.log('Permiso de notificación denegado.');
      }
    } catch (error) {
      console.log("Error al activar mensajes:", error);
    }
  };

  useEffect(() => {
    activarMensajes();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginResult = await handleLogin();

    if (loginResult.success) {
      updateUser(loginResult.data);
    }

  };

  const styles = {
    sectionStyle: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: "url(/../QuickFoodFondo.png)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
    containerStyle: {
      maxWidth: "400px",
      width: "100%",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      backgroundColor: "var(--qf-bg-main)",
      textAlign: "center",
      border: `1px solid var(--qf-naranja)`,
    },
    titleStyle: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: "var(--qf-text-primary)",
    },
    subtitleStyle: {
      fontSize: "0.875rem",
      color: "var(--qf-text-muted)",
      marginBottom: "1.5rem",
    },
    formStyle: {
      display: "flex",
      flexDirection: "column",
    },
    inputWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      marginBottom: "1rem",
      position: "relative",
    },
    inputStyle: {
      width: "100%",
      padding: "0.75rem",
      fontSize: "1rem",
      borderRadius: "4px",
    },
    buttonStyle: {
      width: "100%",
      padding: "0.75rem",
      fontSize: "1rem",
      fontWeight: "bold",
      backgroundColor: "var(--qf-naranja)",
      color: "var(--qf-text-primary)",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
    },
    linkStyle: {
      color: "var(--qf-blue)",
      textDecoration: "none",
      fontSize: "0.875rem",
      cursor: "pointer",
    },
    footerLinks: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "1rem",
    },
    label: {
      fontSize: "1rem",
      color: "var(--qf-text-white)",
      fontWeight: "bold",
      margin: 0,
      cursor: "default",
    },
    iconStyle: {
      position: "absolute",
      right: "15px",
      top: "68%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "var(--qf-text-muted)",
    }
  };

  return (
    <section style={styles.sectionStyle}>
      <div style={styles.containerStyle}>
        <h1 style={styles.titleStyle}>QuickFood</h1>
        <p style={styles.subtitleStyle}>Ingresa tus credenciales para acceder</p>
        <form onSubmit={handleSubmit} style={styles.formStyle}>
          <div style={styles.inputWrapper}>
            <label htmlFor="usuario" style={styles.label}>Usuario</label>
            <input
              id="usuario"
              type="text"
              placeholder="Ingresa tu usuario"
              style={styles.inputStyle}
              value={email}
              onChange={handleEmailChange}
              required
            />
            <FaUser style={styles.iconStyle} />
          </div>

          <div style={styles.inputWrapper}>
            <label htmlFor="contraseña" style={styles.label}>Contraseña</label>
            <PasswordToggle
              inputId="contraseña"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Ingresa tu contraseña"
              style={styles.inputStyle}
            />
          </div>

          <button type="submit" style={styles.buttonStyle}>Iniciar sesión</button>

          <div style={styles.footerLinks}>
            <a href="/seleccion-perfil" style={styles.linkStyle}>Registrarse</a>
            <a href="/recuperar" style={styles.linkStyle}>¿Olvidaste tu contraseña?</a>
          </div>
        </form>
      </div>
      <Footer />
    </section>
  );
};

export default Login;
