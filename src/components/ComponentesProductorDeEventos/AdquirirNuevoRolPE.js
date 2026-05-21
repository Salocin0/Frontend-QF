import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
const AdquirirNuevoRolPE = () => {
  const [cuit, setCuit] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [condicionIva, setCondicionIva] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const styles = {
    container:{
      width: "50%",
      margin: "0 auto",
      backgroundColor: "var(--qf-bg-secondary)",
      borderRadius: "10px",
      padding: "20px",
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: "var(--qf-naranja)",
      textAlign: "center",
    },
    label: {
      display: "block",
      color: "var(--qf-text-white)",
      padding: "0px",
      margin: "0px",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      marginBottom: "1rem",
      borderRadius: "4px",
    },
    select: {
      width: "100%",
      padding: "0.5rem",
      marginBottom: "1rem",
      borderRadius: "4px",
    },
    button: {
      width: "100%",
      padding: "0.75rem",
      backgroundColor: "var(--qf-green)",
      color: "var(--qf-text-white)",
      fontWeight: "bold",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    buttonHover: {
      backgroundColor: "var(--qf-green)",
    },
  };

  const handleCondicionIvaChange = (e) => {
    setCondicionIva(e.target.value);
  };

  const handleCuitChange = (e) => {
    setCuit(e.target.value);
  };

  const handleRazonSocialChange = (e) => {
    setRazonSocial(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productor = {
        cuit: cuit,
        razonSocial: razonSocial,
        condicionIva: condicionIva,
      };

      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}user/update/${user.id}/to/productor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productor),
        }
      );

      if (response.ok) {
        toast.success("Actualizado a productor de eventos");
        const data = await response.json();
        console.log(data);
        navigate(`/login`);
      } else {
        toast.error("Error al actualizar a productor de eventos");
        console.log(response.json());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.formContainer}>
        <div style={styles.container}>
          <h1 style={styles.title}>
            Adquirir Nuevo Rol - Productor de Eventos
          </h1>
          <hr />
          <form onSubmit={handleSubmit}>
            <div>
              <label style={styles.label} htmlFor="cuit">
                CUIT
              </label>
              <input
                type="number"
                id="cuit"
                style={styles.input}
                value={cuit}
                onChange={handleCuitChange}
                required
              />
            </div>

            <div>
              <label style={styles.label} htmlFor="razonSocial">
                Razon Social
              </label>
              <input
                type="text"
                id="razonSocial"
                style={styles.input}
                value={razonSocial}
                onChange={handleRazonSocialChange}
                required
              />
            </div>

            <div>
              <label style={styles.label} htmlFor="ivaCondicion">
                Condición frente al IVA
              </label>
              <select
                style={styles.select}
                name="ivaCondicion"
                onChange={handleCondicionIvaChange}
                value={condicionIva}
                required
              >
                <option value="">Seleccionar</option>
                <option value="responsable_inscripto">
                  Responsable Inscripto
                </option>
                <option value="monotributista">Monotributista</option>
              </select>
            </div>

            <button
              type="submit"
              style={styles.button}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor =
                  styles.buttonHover.backgroundColor)
              }
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = styles.button.backgroundColor)
              }
            >
              Solicitar Nuevo Rol - Productor de Eventos
            </button>

            <button
              type="submit"
              style={{...styles.button,backgroundColor:"var(--qf-blue)",marginTop:"10px"}}
              onClick={() => navigate("/inicio")}
            >
              Volver
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default AdquirirNuevoRolPE;
