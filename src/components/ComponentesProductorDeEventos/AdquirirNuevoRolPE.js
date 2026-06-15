import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
const AdquirirNuevoRolPE = () => {
  const [cuit, setCuit] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [condicionIva, setCondicionIva] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

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

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Adquirir Nuevo Rol", url: "/adquirir-nuevo-rolPE" },
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

        {/* Formulario centrado */}
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
            Productor de Eventos
          </h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label style={{
                display: "block",
                color: "var(--qf-text-white)",
                marginBottom: "4px",
              }} htmlFor="cuit">
                CUIT
              </label>
              <input
                type="number"
                id="cuit"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginBottom: "1rem",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
                value={cuit}
                onChange={handleCuitChange}
                required
              />
            </div>

            <div>
              <label style={{
                display: "block",
                color: "var(--qf-text-white)",
                marginBottom: "4px",
              }} htmlFor="razonSocial">
                Razón Social
              </label>
              <input
                type="text"
                id="razonSocial"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginBottom: "1rem",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
                value={razonSocial}
                onChange={handleRazonSocialChange}
                required
              />
            </div>

            <div>
              <label style={{
                display: "block",
                color: "var(--qf-text-white)",
                marginBottom: "4px",
              }} htmlFor="ivaCondicion">
                Condición frente al IVA
              </label>
              <select
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginBottom: "1rem",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
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
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "var(--qf-green)",
                color: "var(--qf-text-white)",
                fontWeight: "bold",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Solicitar Nuevo Rol - Productor de Eventos
            </button>

            <button
              type="button"
              style={{
                width: "100%",
                padding: "0.75rem",
                backgroundColor: "var(--qf-blue)",
                color: "var(--qf-text-white)",
                fontWeight: "bold",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginTop: "10px",
              }}
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
