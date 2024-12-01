import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import { useParams } from "react-router-dom";
import useDynamicColors from "../../UseDinamicColors";
import { Link } from "react-router-dom";
const HabilitarUsuario = () => {
  const { id } = useParams();
  const [emailback, setEmailBack] = useState("");
  const [emailcompleto, setEmailCompleto] = useState("");
  const Colors = useDynamicColors();
  const navigate = useNavigate();

  const handleEmailcompletoChange = (e) => {
    setEmailCompleto(e.target.value);
  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/user/habilitar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Number(data.code) === 200) {
          setEmailBack(data.data);
        } else {
          toast.error("Error");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleEnviarCodigo = () => {
    fetch(`http://127.0.0.1:8000/user/habilitar/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, email: emailcompleto }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Number(data.code) === 200) {
          toast.success("Usuario habilitado correctamente");
          navigate(`/login`);
        } else {
          toast.error("Error");
          navigate(`/login`);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundImage: "url(/../QuickFoodFondo.png)",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    },
    card: {
      borderRadius: "10px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
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
    input: {
      width: "100%",
      padding: "0.5rem",
    },
    button: {
      backgroundColor: Colors.Verde,
      color: Colors.BlancoEnBlanco,
      border: "none",
      padding: "0.5rem",
      cursor: "pointer",
      borderRadius: "5px",
    },
    buttonBack: {
      backgroundColor: Colors.GrisOscuro,
      color: Colors.BlancoEnBlanco,
      border: "none",
      padding: "0.5rem",
      cursor: "pointer",
      borderRadius: "5px",
    },
    form: {
      padding: "20px",
    },
    inputGroupText: {
      color: Colors.Negro,
      display: "flex",
      alignItems: "center",
      justifyContent: "start",
      margin: "0px",
      fontWeight: "bold",
    },
  };

  return (
    <section style={styles.container}>
      <div style={{ maxWidth: "400px", width: "100%" }}>
        <div style={styles.card}>
          <div style={styles.cardBody}>
            <h1 style={styles.title}>Habilitar Usuario</h1>
            <div style={styles.form}>
              <label htmlFor="email" style={styles.inputGroupText}>
                {`Complete el email: ${emailback}***@*****`}
              </label>
              <input
                type="text"
                style={styles.input}
                placeholder="Ingrese su email"
                value={emailcompleto}
                onChange={handleEmailcompletoChange}
              />
              <div className="d-flex justify-content-between mt-3">
                <Link style={styles.buttonBack} to={"/login"}>
                  Volver
                </Link>
                <button style={styles.button} onClick={handleEnviarCodigo}>
                  Enviar email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default HabilitarUsuario;
