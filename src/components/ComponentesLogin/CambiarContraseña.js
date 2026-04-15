import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordToggle from "../ComponenteRegister/PasswordToggle";
import useDynamicColors from "../../UseDinamicColors";
import { Link } from "react-router-dom";

const CambiarContraseña = () => {
  const Colors = useDynamicColors();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { codigo } = useParams();
  const navigate = useNavigate();

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      const json_contrasenia = {
        contraseña: newPassword,
      };
      fetch(`${process.env.REACT_APP_BACK_URL}user/recuperarcontrasenia/${codigo}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json_contrasenia),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.code === 200) {
            toast.success("Contraseña guardada correctamente");
            setTimeout(() => {
              navigate(`/`);
            }, 1500);
          } else if (data.code === 400) {
            toast.error("Error al guardar la contraseña");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      toast.error("Las contraseñas no coinciden");
    }
  };

  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: 0,
      padding: 0,
      backgroundRepeat: "no-repeat",
      backgroundAttachment: "fixed",
      backgroundPosition: "center",
      backgroundImage: `url(./../QuickFoodFondo.png)`,
      backgroundSize: "cover",
    },
    card: {
      borderRadius: "10px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      maxWidth: "600px",
      width: "100%",
      backgroundColor: Colors.GrisAzuladoOscuro,
    },
    cardBody: {
      textAlign: "center",
    },
    title: {
      backgroundColor: Colors.Naranja,
      padding: "1rem",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
      color: Colors.Negro,
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      color: Colors.Negro,
      fontSize: "0.9rem",
      textAlign: "left",
      margin: "0px",
      fontWeight: "bold",
    },
    inputContainer: {
      marginBottom: "1rem",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      borderRadius: "5px",
      border: `1px solid ${Colors.Gris}`,
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
      marginTop: "1rem",
    },
    buttonBack: {
      backgroundColor: Colors.GrisOscuro,
      color: Colors.BlancoEnBlanco,
      padding: "0.5rem 1rem",
      cursor: "pointer",
      borderRadius: "5px",
    },
    buttonSubmit: {
      backgroundColor: Colors.Verde,
      color: Colors.BlancoEnBlanco,
      border: "none",
      padding: "0.5rem 1rem",
      cursor: "pointer",
      borderRadius: "5px",
    },
    form: {
      padding: "20px",
    },
  };

  return (
    <section style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardBody}>
          <h1 style={styles.title}>Cambiar Contraseña</h1>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputContainer}>
              <label htmlFor="newPassword" style={styles.label}>
                Nueva Contraseña
              </label>
              <PasswordToggle
                inputId="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                placeholder="Ingrese su nueva contraseña"
                style={styles.input}
              />
            </div>
            <div style={styles.inputContainer}>
              <label htmlFor="confirmPassword" style={styles.label}>
                Confirmar Nueva Contraseña
              </label>
              <PasswordToggle
                inputId="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirme su nueva contraseña"
                style={styles.input}
              />
            </div>
            <div style={styles.buttonContainer}>
              <Link style={styles.buttonBack} to={"/login"}>
                Volver
              </Link>
              <button type="submit" style={styles.buttonSubmit}>
                Cambiar Contraseña
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CambiarContraseña;
