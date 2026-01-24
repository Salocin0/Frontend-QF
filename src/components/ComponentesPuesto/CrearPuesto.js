import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { fileToBase64 } from "../ComponentesGenerales/Utils/base64";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";

const CrearNuevoPuesto = () => {
  const [numeroCarro, setNumeroCarro] = useState("");
  const [nombreCarro, setNombreCarro] = useState("");
  const [tipoNegocio, setTipoNegocio] = useState("");
  const [telefonoCarro, setTelefonoCarro] = useState("");
  const [pdfAfip, setPdfAfip] = useState(null);
  const [pdfCuil, setPdfCuil] = useState(null);
  const [logoBase64, setLogoBase64] = useState(null);
  const [bannerBase64, setBannerBase64] = useState(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const Colors = useDynamicColors();

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
      logo: logoBase64,
      banner: bannerBase64,
      telefonoCarro,
      consumidorId: user.consumidorId,
    };

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
    container: {
      display: "flex",
      backgroundColor: Colors.GrisAzuladoOscuro,
      flexDirection: "column",
      height: "100vh",
      margin: "0",
      padding: "0",
    },
    formContainer: {
      width: "Calc(100% - 40px)",
      margin: "0rem auto 5rem auto",
      borderRadius: "8px",
      backgroundColor: Colors.GrisAzuladoClaro,
      border: `1px solid ${Colors.Naranja}`,
    },
    card: {
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      borderRadius: "8px",
      
    },
    cardBody: {
      padding: "1.5rem",
      
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      color: Colors.Naranja,
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      gap: "0.5rem",
      width: "100%",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      border: `1px solid ${Colors.BlancoEnBlanco}`,
      borderRadius: "10px",
      marginBottom: "0.5rem",
      backgroundColor: Colors.Blanco,
    },
    label: {
      margin: "0",
      display: "block",
      color: Colors.BlancoEnBlanco,
      width: "100%",
    },
    button: {
      width: "100%",
      padding: "0.5rem",
      backgroundColor: Colors.Verde,
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    backButton: {
      width: "100%",
      padding: "0.5rem",
      backgroundColor: Colors.Azul,
      color: "white",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      textAlign: "center",
      display: "block",
      marginTop: "1rem",
    },
    breadcrumbWrapper: {
      marginLeft: "20%",
      width: "80%",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    mainContent: {
      width: "80%",
      marginLeft: "20%",
    },
    titleSection: {
      display: "flex",
      justifyContent: "center",
      marginTop: "5px",
      marginBottom: "5px",
      color: Colors.Naranja,
    },
    separator: {
      border: "none",
      marginBottom: "5px",
      marginTop: "0px",
      borderTop: `1px solid ${Colors.Naranja}`,
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis puestos", url: "/listado-puestos-encargado" },
    { title: "Crear puesto", url: "/crear-puesto" },
  ];

  return (
    <div style={styles.container}>
      <Sidebar tipoUsuario={user?.tipoUsuario} />
      <div style={styles.mainContent}>
        <div style={styles.titleSection}>
          <h1>Crear un Puesto</h1>
        </div>
        <hr style={styles.separator} />
      </div>
      <div style={styles.breadcrumbWrapper}>
        <Breadcrumb
          items={breadcrumbItems}
          style={{ width: "Calc(100% - 40px)", marginLeft: "20px" }}
        />
      </div>
      <div style={styles.mainContent}>
        <section style={styles.formContainer}>
          <div style={styles.card}>
            <div style={styles.cardBody}>
              <h1 style={styles.title}>Registrar Carro de Comida</h1>
              <form onSubmit={handleSubmit}>
                <div style={styles.row}>
                  <div style={{ width: "33%" }}>
                    <label style={styles.label} htmlFor="idCarro">
                      Numero de Carro
                    </label>
                    <input
                      type="number"
                      id="idCarro"
                      style={styles.input}
                      min="1"
                      value={numeroCarro}
                      onChange={(e) => setNumeroCarro(e.target.value)}
                    />
                  </div>
                  <div style={{ width: "33%" }}>
                    <label style={styles.label} htmlFor="nombreCarro">
                      Nombre Carro
                    </label>
                    <input
                      type="text"
                      id="nombreCarro"
                      style={styles.input}
                      value={nombreCarro}
                      onChange={(e) => setNombreCarro(e.target.value)}
                    />
                  </div>
                  <div style={{ width: "33%" }}>
                    <label style={styles.label} htmlFor="telefonoCarro">
                      Teléfono
                    </label>
                    <input
                      type="number"
                      id="telefonoCarro"
                      style={styles.input}
                      value={telefonoCarro}
                      onChange={(e) => setTelefonoCarro(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div style={styles.row}>
                  <div style={{ width: "50%" }}>
                    <label style={styles.label} htmlFor="logo">
                      Logo
                    </label>
                    <input
                      type="file"
                      id="logo"
                      style={styles.input}
                      accept="image/*"
                      onChange={handleLogoChange}
                      required
                    />
                  </div>
                  <div style={{ width: "50%" }}>
                    <label style={styles.label} htmlFor="banner">
                      Banner
                    </label>
                    <input
                      type="file"
                      id="banner"
                      style={styles.input}
                      accept="image/*"
                      onChange={handleBannerChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label style={styles.label} htmlFor="tipoNegocio">
                    Tipo de Negocio
                  </label>
                  <select
                    id="tipoNegocio"
                    style={styles.input}
                    value={tipoNegocio}
                    onChange={(e) => setTipoNegocio(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Seleccione un tipo de negocio
                    </option>
                    <option value="Tipo de Negocio 1">Tipo de Negocio 1</option>
                    <option value="Tipo de Negocio 2">Tipo de Negocio 2</option>
                  </select>
                </div>
                <div style={styles.row}>
                <div style={{ width: "50%" }}>
                  <label style={styles.label} htmlFor="pdfAfip">
                    Constancia de inscripción a AFIP (PDF)
                  </label>
                  <input
                    type="file"
                    id="pdfAfip"
                    style={styles.input}
                    onChange={(e) => setPdfAfip(e.target.files[0])}
                    required
                  />
                </div>
                <div style={{ width: "50%" }}>
                  <label style={styles.label} htmlFor="pdfCuil">
                    Constancia de Inspección Bromatológica (PDF)
                  </label>
                  <input
                    type="file"
                    id="pdfCuil"
                    style={styles.input}
                    onChange={(e) => setPdfCuil(e.target.files[0])}
                    required
                  />
                </div>
                </div>
                <button type="submit" style={styles.button}>
                  Registrar Carro de Comida
                </button>
                <Link
                  to={`/listado-puestos-encargado`}
                  style={styles.backButton}
                >
                  Volver
                </Link>
              </form>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};

export default CrearNuevoPuesto;
