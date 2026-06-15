import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { fileToBase64 } from "../ComponentesGenerales/Utils/base64";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import useBreakpoint from "../../useBreakpoint";

const CrearNuevoPuesto = () => {
  const { isMobile } = useBreakpoint();
  const [numeroCarro, setNumeroCarro] = useState("");
  const [nombreCarro, setNombreCarro] = useState("");
  const [tipoNegocio, setTipoNegocio] = useState("");
  const [telefonoCarro, setTelefonoCarro] = useState("");
  const [pdfAfip, setPdfAfip] = useState(null);
  const [pdfCuil, _setPdfCuil] = useState(null);
  const [logoBase64, setLogoBase64] = useState(null);
  const [bannerBase64, setBannerBase64] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    fileToBase64(file, (base64) => {
      setLogoBase64(base64);
    });
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    fileToBase64(file, (base64) => {
      setBannerBase64(base64);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      numeroCarro,
      nombreCarro,
      tipoNegocio,
      pdfAfip,
      pdfCuil,
      logo: logoBase64,
      banner: bannerBase64,
      telefonoCarro,
      consumidorId: user.consumidorId,
    };

    if (!pdfAfip) {
      toast.error("Debe adjuntar la constancia de AFIP");
      return;
    }

    if (!numeroCarro || !nombreCarro || !tipoNegocio || !telefonoCarro) {
      toast.error("Por favor rellene todos los datos");
      return;
    }

    fetch(`${process.env?.REACT_APP_BACK_URL}puesto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("Carro de comida registrado correctamente");
          navigate("/listado-puestos-encargado");
        } else {
          toast.error("Ya existe un carro con el ID ingresado.");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al registrar el carro de comida");
      });
  };

  const styles = {
    pagina: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    tituloSeccion: {
      textAlign: "center",
      paddingTop: "1rem",
      fontSize: "2rem",
      color: "var(--qf-naranja)",
      margin: 0,
    },
    hrFull: {
      border: "none",
      borderTop: "1px solid var(--qf-naranja)",
      margin: 0,
      width: "100vw",
      marginLeft: "calc(-50vw + 50%)",
    },
    breadcrumbWrapper: {
      width: "100%",
    },
    content: {
      display: "flex",
      justifyContent: "center",
      backgroundColor: "var(--qf-bg-main)",
    },
    cardBody: {
      padding: "20px",
      borderRadius: "10px",
      flexDirection: "column",
      backgroundColor: "var(--qf-bg-secondary)",
      width: "100%",
      border: `1px solid var(--qf-naranja)`,
      boxSizing: "border-box",
    },
    formTitle: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      color: "var(--qf-naranja)",
      textAlign: "center",
    },
    formLabel: {
      margin: "0rem",
      color: "var(--qf-blanco-puro)",
    },
    formInput: {
      width: "100%",
      padding: "0.375rem 0.75rem",
      fontSize: "1rem",
      lineHeight: "1",
      borderRadius: "0.375rem",
      border: "1px solid #ccc",
      marginBottom: "0.25rem",
      color: "var(--qf-blanco-puro)",
      backgroundColor: "var(--qf-bg-secondary)",
      boxSizing: "border-box",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    submitButton: {
      backgroundColor: "var(--qf-naranja)",
      color: "var(--qf-blanco-puro)",
      padding: "0.5rem 1rem",
      fontSize: "1rem",
      fontWeight: "bold",
      borderRadius: "0.375rem",
      border: "none",
      cursor: "pointer",
      width: "100%",
    },
    backButton: {
      backgroundColor: "var(--qf-blue)",
      color: "var(--qf-blanco-puro)",
      padding: "0.5rem 1rem",
      fontSize: "1rem",
      fontWeight: "bold",
      borderRadius: "0.375rem",
      border: "none",
      cursor: "pointer",
      textAlign: "center",
      display: "block",
      marginTop: "10px",
      textDecoration: "none",
    },
    row: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "stretch" : "center",
      justifyContent: "space-between",
      gap: isMobile ? "0" : "0",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis puestos", url: "/listado-puestos-encargado" },
    { title: "Crear puesto", url: "/crear-puesto" },
  ];

  const col3 = isMobile ? "100%" : "33%";
  const col2 = isMobile ? "100%" : "50%";
  const col2mr = isMobile ? "0" : "20px";

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.pagina}>
        {/* Título centrado */}
        <h1 style={styles.tituloSeccion}>Crear un Puesto</h1>

        {/* HR que ocupa el 100% del viewport */}
        <hr style={styles.hrFull} />

        {/* Breadcrumb a ancho completo */}
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "100%", margin: "8px 0" }}
          />
        </div>

        {/* Formulario centrado */}
        <div style={styles.content}>
          <div style={styles.cardBody}>
            <h1 style={styles.formTitle}>Registrar Carro de Comida</h1>
            <form onSubmit={handleSubmit}>
              {/* Fila 1: N° Carro, Nombre, Teléfono */}
              <div style={styles.row}>
                <div className="mb-3" style={{ width: col3, marginRight: isMobile ? "0" : "10px" }}>
                  <label style={styles.formLabel} htmlFor="idCarro">
                    Número de Carro
                  </label>
                  <input
                    type="number"
                    id="idCarro"
                    style={styles.formInput}
                    min="1"
                    value={numeroCarro}
                    onChange={(e) => setNumeroCarro(e.target.value)}
                  />
                </div>
                <div className="mb-3" style={{ width: col3, marginRight: isMobile ? "0" : "10px" }}>
                  <label style={styles.formLabel} htmlFor="nombreCarro">
                    Nombre Carro
                  </label>
                  <input
                    type="text"
                    id="nombreCarro"
                    style={styles.formInput}
                    value={nombreCarro}
                    onChange={(e) => setNombreCarro(e.target.value)}
                  />
                </div>
                <div className="mb-3" style={{ width: col3 }}>
                  <label style={styles.formLabel} htmlFor="telefonoCarro">
                    Teléfono
                  </label>
                  <input
                    type="number"
                    id="telefonoCarro"
                    style={styles.formInput}
                    value={telefonoCarro}
                    onChange={(e) => setTelefonoCarro(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Fila 2: Logo, Banner */}
              <div style={styles.row}>
                <div className="mb-3" style={{ width: col2, marginRight: isMobile ? "0" : col2mr }}>
                  <label style={styles.formLabel} htmlFor="logo">
                    Logo
                  </label>
                  <input
                    type="file"
                    id="logo"
                    style={styles.formInput}
                    accept="image/*"
                    onChange={handleLogoChange}
                    required
                  />
                </div>
                <div className="mb-3" style={{ width: col2 }}>
                  <label style={styles.formLabel} htmlFor="banner">
                    Banner
                  </label>
                  <input
                    type="file"
                    id="banner"
                    style={styles.formInput}
                    accept="image/*"
                    onChange={handleBannerChange}
                    required
                  />
                </div>
              </div>

              {/* Tipo de Negocio */}
              <div className="mb-3">
                <label style={styles.formLabel} htmlFor="tipoNegocio">
                  Tipo de Negocio
                </label>
                <select
                  id="tipoNegocio"
                  style={styles.formInput}
                  value={tipoNegocio}
                  onChange={(e) => setTipoNegocio(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Seleccione un tipo de negocio
                  </option>
                  <option value="Heladería">Heladería</option>
                  <option value="Pizzería">Pizzería</option>
                  <option value="Restaurante">Restaurante</option>
                  <option value="Hamburguesería">Hamburguesería</option>
                  <option value="Rotisería">Rotisería</option>
                  <option value="Panadería">Panadería</option>
                  <option value="Comida rápida">Comida rápida</option>
                  <option value="Parrilla">Parrilla</option>
                  <option value="Comida vegana/vegetariana">Comida vegana/vegetariana</option>
                  <option value="Café / Deli">Café / Deli</option>
                  <option value="Empanadas / Tartas">Empanadas / Tartas</option>
                  <option value="Comida mexicana">Comida mexicana</option>
                  <option value="Comida árabe">Comida árabe</option>
                  <option value="Sushi / Comida japonesa">Sushi / Comida japonesa</option>
                  <option value="Otros">Otros</option>
                </select>
              </div>

              {/* Fila 3: PDFs */}
              <div style={styles.row}>
                <div className="mb-3" style={{ width: col2, marginRight: isMobile ? "0" : col2mr }}>
                  <label style={styles.formLabel} htmlFor="pdfAfip">
                    Constancia de inscripción a AFIP
                  </label>
                  <input
                    type="file"
                    id="pdfAfip"
                    style={styles.formInput}
                    onChange={(e) => setPdfAfip(e.target.files[0])}
                    required
                  />
                </div>
                <div className="mb-3" style={{ width: col2 }}>
                  <label style={styles.formLabel} htmlFor="pdfCuil">
                    Constancia de Inspección Bromatológica
                  </label>
                  <input
                    type="file"
                    id="pdfCuil"
                    style={styles.formInput}
                    onChange={(e) => _setPdfCuil(e.target.files[0])}
                    required
                  />
                </div>
              </div>

              <div className="d-grid">
                <button type="submit" style={styles.submitButton}>
                  Registrar Carro de Comida
                </button>
              </div>
              <Link
                to={`/listado-puestos-encargado`}
                style={styles.backButton}
              >
                Volver
              </Link>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default CrearNuevoPuesto;
