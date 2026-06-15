import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../ComponentesGenerales/UserContext";

const AdquirirNuevoRolEPC = () => {
  const [cuit, setCuit] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [condicionIva, setCondicionIva] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleCuitChange = (e) => setCuit(e.target.value);
  const handleRazonSocialChange = (e) => setRazonSocial(e.target.value);
  const handleCondicionIvaChange = (e) => setCondicionIva(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const encargado = {
        cuit,
        razonSocial,
        condicionIva,
      };
      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}user/update/${user.id}/to/encargado`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(encargado),
        }
      );

      if (response.ok) {
        toast.success("Actualizado a Encargado de Puesto");
        navigate(`/login`);
      } else {
        toast.error("Error al actualizar a Encargado de Puesto");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Adquirir Nuevo Rol", url: "/adquirir-nuevo-rolEPC" },
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
            Encargado de Puesto de Comida
          </h1>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="cuit" style={{
                display: "block",
                fontSize: "0.875rem",
                color: "var(--qf-text-white)",
                marginBottom: "4px",
              }}>
                CUIT
              </label>
              <input
                type="text"
                id="cuit"
                value={cuit}
                onChange={handleCuitChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "1rem",
                  borderRadius: "5px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="razonSocial" style={{
                display: "block",
                fontSize: "0.875rem",
                color: "var(--qf-text-white)",
                marginBottom: "4px",
              }}>
                Razón Social
              </label>
              <input
                type="text"
                id="razonSocial"
                value={razonSocial}
                onChange={handleRazonSocialChange}
                required
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "1rem",
                  borderRadius: "5px",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label htmlFor="ivaCondicion" style={{
                display: "block",
                fontSize: "0.875rem",
                color: "var(--qf-text-white)",
                marginBottom: "4px",
              }}>
                Condición frente al IVA
              </label>
              <select
                id="ivaCondicion"
                value={condicionIva}
                onChange={handleCondicionIvaChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "1rem",
                  borderRadius: "5px",
                  boxSizing: "border-box",
                }}
              >
                <option value="">Seleccionar</option>
                <option value="responsable_inscripto">
                  Responsable Inscripto
                </option>
                <option value="monotributista">Monotributista</option>
              </select>
            </div>

            <button type="submit" style={{
              display: "block",
              width: "100%",
              padding: "10px",
              fontSize: "1rem",
              color: "var(--qf-text-white)",
              backgroundColor: "var(--qf-green)",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}>
              Solicitar Nuevo Rol - Encargado Puesto de Comida
            </button>
            <button type="button" onClick={() => navigate("/inicio")} style={{
              display: "block",
              width: "100%",
              padding: "10px",
              fontSize: "1rem",
              color: "var(--qf-text-white)",
              backgroundColor: "var(--qf-blue)",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}>
              Volver
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default AdquirirNuevoRolEPC;
