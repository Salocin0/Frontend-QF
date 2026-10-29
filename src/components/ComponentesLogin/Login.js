import React, { useContext,useEffect } from "react";
import { fetchToken } from '../../firebase.js';
import PasswordToggle from "../ComponenteRegister/PasswordToggle.jsx";
import Footer from "../ComponentesGenerales/Footer";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useLogin from "../Hooks/UseLogin";
import { FaUser } from "react-icons/fa";
import useBreakpoint from "../../useBreakpoint";
import Logo from "../img/qf-new-logo-transparent.png";
import "./login-form.scss";

const Login = () => {
  const { updateUser } = useContext(UserContext);
  const { email, password, setTokenWeb, handleEmailChange, handlePasswordChange, handleLogin } = useLogin();
  const { isMobile } = useBreakpoint();

  // Debug: verificar que las importaciones existen

  const activarMensajes = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        const token = await fetchToken();
        if (token) {
          setTokenWeb(token);
        } else {
        }
      } else {
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
      maxWidth: "440px",
      width: isMobile ? "calc(100% - 32px)" : "100%",
      padding: isMobile ? "1.75rem" : "2.5rem",
      borderRadius: "24px",
      boxShadow: "0 20px 60px rgba(0, 0, 0, 0.25)",
      backgroundColor: "var(--login-bg)",
      textAlign: "center",
      border: "1px solid #ffbd59",
    },
    titleStyle: {
      fontSize: "1.8rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: "var(--login-text)",
    },
    subtitleStyle: {
      fontSize: "0.95rem",
      color: "var(--login-muted)",
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
      marginBottom: "1.25rem",
      gap: "8px",
      position: "relative",
    },
    inputStyle: {
      width: "100%",
      padding: "0.85rem 2.75rem 0.85rem 0.85rem",
      fontSize: "1rem",
      borderRadius: "12px",
      border: "1px solid var(--login-border)",
      backgroundColor: "var(--login-input)",
      color: "var(--login-text)",
    },
    buttonStyle: {
      width: "100%",
      padding: "0.75rem",
      fontSize: "1rem",
      fontWeight: "bold",
      backgroundColor: "#ffbd59",
      color: "#261c10",
      borderRadius: "12px",
      border: "none",
      cursor: "pointer",
    },
    linkStyle: {
      color: "var(--login-link)",
      textDecoration: "none",
      fontSize: "0.95rem",
      cursor: "pointer",
    },
    footerLinks: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "1.25rem",
      flexWrap: "wrap",
      gap: "12px",
    },
    label: {
      fontSize: "1rem",
      color: "var(--login-text)",
      fontWeight: "bold",
      margin: 0,
      cursor: "default",
    },
    iconStyle: {
      position: "absolute",
      right: "15px",
      bottom: "16px",

      cursor: "pointer",
      color: "var(--login-muted)",
    }
  };

  return (
    <section style={styles.sectionStyle}>
      <div className="qf-login-card" style={styles.containerStyle}>
        <img className="qf-login-card__logo" src={Logo} alt="QuickFood" />
        <h1 style={styles.titleStyle}>¡Qué bueno verte!</h1>
        <p style={styles.subtitleStyle}>Iniciá sesión y disfrutá sin filas.</p>
        <form onSubmit={handleSubmit} style={styles.formStyle}>
          <div style={styles.inputWrapper}>
            <label htmlFor="usuario" style={styles.label}>Usuario</label>
            <input
              id="usuario"
              type="text"
              placeholder="Ingresá tu usuario"
              autoComplete="username"
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
              placeholder="Ingresá tu contraseña"
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
