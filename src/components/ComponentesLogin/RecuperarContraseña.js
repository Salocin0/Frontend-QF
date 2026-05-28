import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import { Link } from "react-router-dom";
import useBreakpoint from "../../useBreakpoint";
import "../ComponenteRegister/placeholder.css";

const RecuperarContraseña = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const json_recuperarEmail = {
      correoElectronico: email,
    };

    fetch(`${process.env.REACT_APP_BACK_URL}user/recuperarcontrasenia`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json_recuperarEmail),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("Email sent");
          navigate(`/`);
        } else if (data.code === 400) {
          toast.error("Error recovering password");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "url(QuickFoodFondo.png)",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    card: {
      borderRadius: "10px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      backgroundColor: "var(--qf-bg-main)",
    },
    cardBody: {
      textAlign: "center",
    },
    title: {
      backgroundColor: "var(--qf-naranja)",
      padding: "1rem",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
      color: "var(--qf-text-white)",
      fontSize: "1.2rem",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
    },
    button: {
      backgroundColor: "var(--qf-green)",
      color: "var(--qf-blanco-puro)",
      border: "none",
      padding: "0.5rem",
      cursor: "pointer",
      borderRadius: "5px",
    },
    buttonBack: {
      backgroundColor: "var(--qf-text-secondary)",
      color: "var(--qf-blanco-puro)",
      border: "none",
      padding: "0.5rem",
      cursor: "pointer",
      borderRadius: "5px",
    },
    form: {
      padding: "20px",
    },
    inputGroupText: {
      color: "var(--qf-text-white)",
      display:"flex",
      alignItems:"center",
      justifyContent:"start",
      margin:"0px",
      fontWeight:"bold",
    }
  };

  return (
    <>
      <section style={styles.container}>
        <div style={{ maxWidth: isMobile ? "100%" : "400px", width: "100%" }} data-testid="form-card-recuperar">
          <div style={styles.card}>
            <div style={styles.cardBody}>
              <h1 style={styles.title}>Recuperar Contraseña</h1>
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={{ marginBottom: "1rem" }}>
                  <div>
                    <label htmlFor="email" style={styles.inputGroupText}>Email</label>
                    <input
                      type="email"
                      style={styles.input}
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Ingrese su Correo"
                      id="email"
                      required
                    />
                  </div>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Link to="/login" style={styles.buttonBack}>
                    Volver
                  </Link>
                  <button type="submit" style={styles.button}>
                    Enviar Mail de Recuperación
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default RecuperarContraseña;
