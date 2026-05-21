import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";


const AdquirirNuevoRolR = () => {
  const navigate = useNavigate();
  const [confirmacionMayorDeEdad, setConfirmacionMayorDeEdad] = useState(false);
  const [,setNuevorol] = useState(false);
  const { user,updateUser } = useContext(UserContext);

  const styles = {
    mainContent: {
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    form: {
      background: "var(--qf-bg-secondary)",
      borderRadius: "8px",
      padding: "20px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: "var(--qf-naranja)",
    },
    divider: {
      marginBottom: "1rem",
      color: "var(--qf-naranja)",
    },
    formCheck: {
      marginBottom: "1rem",
      marginLeft: "1rem",
    },
    formCheckLabel: {
      color: "var(--qf-text-white)",
    },
    buttonContainer: {
      display: "grid",
    },
    submitButton: {
      backgroundColor: "green",
      color: "white",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      cursor: "pointer",
    },
    submitButtonDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  };
  const handleLogout = () => {
      if (user.id) {
        fetch(`${process.env?.REACT_APP_BACK_URL}user/cerrarWeb`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: user.id }),
        })
          .then((response) => response.json())
          .then((data) => {
            updateUser({});
            navigate("/login");
            toast.success("Sesión cerrada");
          })
          .catch((error) => {
            console.log(error);
            toast.error("Error al cerrar sesion");
          });
      }
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}user/update/${user?.id}/to/repartidor`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          toast.success("Actualizado a repartidor");
          setNuevorol(true);
          handleLogout()
        } else {
          toast.error("Error al actualizar a repartidor");
        }
      }
    } catch (error) {
      toast.error("Error");
    }
  };

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.mainContent}>
        <div style={styles.form}>
          <div>
            <h1 style={styles.title}>
              Adquirir Nuevo Rol - Repartidor
            </h1>
            <hr style={styles.divider} />
            <form
              onSubmit={handleSubmit}
              className="needs-validation"
              encType="multipart/form-data"
            >
              <div style={styles.formCheck}>
                <input
                  type="checkbox"
                  id="confirmacionMayorDeEdad"
                  name="confirmacionMayorDeEdad"
                  checked={confirmacionMayorDeEdad}
                  onChange={() =>
                    setConfirmacionMayorDeEdad(!confirmacionMayorDeEdad)
                  }
                />
                <label
                  htmlFor="confirmacionMayorDeEdad"
                  style={styles.formCheckLabel}
                >
                  Confirmo que tengo más de 18 años
                </label>
              </div>

              <div style={styles.buttonContainer}>
                <button
                  type="submit"
                  style={{
                    ...styles.submitButton,
                    ...(confirmacionMayorDeEdad ? {} : styles.submitButtonDisabled),
                  }}
                  disabled={!confirmacionMayorDeEdad}
                  data-testid="submit-button"
                >
                  Solicitar Nuevo Rol - Repartidor
                </button>

                <button
                  onClick={() => navigate("/inicio")}
                  style={{
                    ...styles.submitButton, backgroundColor: "var(--qf-blue)", marginTop: "10px"
                  }}
                >
                  Volver
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </PageLayout>
  );
};

export default AdquirirNuevoRolR;
