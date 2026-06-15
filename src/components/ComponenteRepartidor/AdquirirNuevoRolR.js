import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";

const AdquirirNuevoRolR = () => {
  const navigate = useNavigate();
  const [confirmacionMayorDeEdad, setConfirmacionMayorDeEdad] = useState(false);
  const [,setNuevorol] = useState(false);
  const { user,updateUser } = useContext(UserContext);

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

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Adquirir Nuevo Rol", url: "/adquirir-nuevo-rolR" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flex: 1,
        minHeight: 0,
        boxSizing: "border-box",
      }}>
        {/* Header centrado */}
        <div className="qf-page-header qf-page-header--full" style={{ textAlign: "center" }}>
          <h1 className="qf-page-title" style={{ textAlign: "center", fontSize: "1.75rem" }}>
            Adquirir Nuevo Rol
          </h1>
          <hr className="qf-separator qf-separator--spaced" />
        </div>

        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} style={{
          margin: 0,
          marginBottom: "20px",
          backgroundColor: 'var(--qf-bg-secondary)',
          width: '100%',
          padding: '8px 16px',
          borderRadius: '10px',
          border: '1px solid var(--qf-naranja)',
          boxSizing: 'border-box',
        }} />

        {/* Formulario */}
        <div style={{
          width: "100%",
          margin: "0 auto",
          backgroundColor: "var(--qf-bg-secondary)",
          borderRadius: "10px",
          padding: "20px",
          border: "1px solid var(--qf-naranja)",
          boxSizing: "border-box",
        }}>
          <h1 style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            color: "var(--qf-naranja)",
            textAlign: "center",
          }}>
            Repartidor
          </h1>
          <form
            onSubmit={handleSubmit}
            className="needs-validation"
            encType="multipart/form-data"
          >
            <div style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              marginBottom: "1rem",
            }}>
              <input
                type="checkbox"
                id="confirmacionMayorDeEdad"
                name="confirmacionMayorDeEdad"
                checked={confirmacionMayorDeEdad}
                onChange={() =>
                  setConfirmacionMayorDeEdad(!confirmacionMayorDeEdad)
                }
                style={{ marginTop: "3px", flexShrink: 0 }}
              />
              <label
                htmlFor="confirmacionMayorDeEdad"
                style={{ color: "var(--qf-text-white)" }}
              >
                Confirmo que tengo más de 18 años
              </label>
            </div>

            <div style={{ display: "grid" }}>
              <button
                type="submit"
                style={{
                  backgroundColor: "green",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: confirmacionMayorDeEdad ? "pointer" : "not-allowed",
                  opacity: confirmacionMayorDeEdad ? 1 : 0.6,
                }}
                disabled={!confirmacionMayorDeEdad}
                data-testid="submit-button"
              >
                Solicitar Nuevo Rol - Repartidor
              </button>

              <button
                type="button"
                onClick={() => navigate("/inicio")}
                style={{
                  backgroundColor: "var(--qf-blue)",
                  color: "white",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginTop: "10px",
                }}
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default AdquirirNuevoRolR;
