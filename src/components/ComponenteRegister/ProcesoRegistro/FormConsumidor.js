import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Footer from "../../ComponentesGenerales/Footer";
import "../placeholder.css"

const FormConsumidor = ({ nextStep, backStep, handleRegistro, tipoUsuario, isRegistering }) => {
  const [provincias, setProvincias] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [localidades, setLocalidades] = useState([]);
  const [selectedLocalidad, setSelectedLocalidad] = useState("");
  const [consumidorData, setConsumidorData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    provincia: "",
    localidad: "",
    telefono: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConsumidorData({
      ...consumidorData,
      [name]: value,
    });
  };

  function tieneNumeros(cadena) {
    const pattern = /\d/;
    return pattern.test(cadena);
  }

  function tieneLetras(cadena) {
    const regex = /[a-zA-Z]/;
    return regex.test(cadena);
  }

  function validaDNI(cadena) {
    const regexDni = /^\d{8}$/;
    return regexDni.test(cadena);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const hoy = new Date();
    const fechaNacimientoDate = new Date(consumidorData.fechaNacimiento);
    const edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();

    if (!consumidorData.nombre.trim()) {
      toast.error("nombre no puede estar vacio");
      return;
    }

    if (tieneNumeros(consumidorData.nombre)) {
      toast.error("El nombre no puede contener números");
      return;
    }

    if (tieneNumeros(consumidorData.apellido)) {
      toast.error("El apellido no puede contener números");
      return;
    }

    if (tieneLetras(consumidorData.dni)) {
      toast.error("El DNI no puede contener letras");
      return;
    }

    if (!validaDNI(consumidorData.dni)) {
      toast.error("El DNI no es valido");
      return;
    }

    if (!consumidorData.apellido.trim()) {
      toast.error("apellido no puede estar vacio");
      return;
    }

    if (!consumidorData.dni.trim()) {
      toast.error("DNI no puede estar vacio");
      return;
    }

    if (edad < 18) {
      toast.error("Debes tener al menos 18 años para registrarte.");
      return;
    }

    if (tieneLetras(consumidorData.telefono)) {
      toast.error("El telefono no puede contener letras");
      return;
    }

    if (!consumidorData.telefono.trim()) {
      toast.error("telefono no puede estar vacio");
      return;
    }

    setConsumidorData({
      ...consumidorData,
    });
    handleRegistro(consumidorData);
    nextStep();
  };

  useEffect(() => {
    fetch("https://apis.datos.gob.ar/georef/api/provincias")
      .then((response) => response.json())
      .then((data) => {
        setProvincias(data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre)));
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleLocalidadChange = (e) => {
    setSelectedLocalidad(e.target.value);
    consumidorData.localidad = e.target.value;
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    consumidorData.provincia = e.target.value;

    if (e.target.value !== "") {
      fetch(
        `https://apis.datos.gob.ar/georef/api/municipios?provincia=${e.target.value}&campos=id,nombre&max=700`
      )
        .then((response) => response.json())
        .then((data) => {
          const sortedLocalidades = data.municipios.sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          );
          setLocalidades(sortedLocalidades);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setLocalidades([]);
    }
  };

  const styles = {
    background: {
      padding: "20px",
      height: "100vh",
      backgroundImage: "url(/../QuickFoodFondo.png)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      paddingBottom: "70px",
    },
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
    },
    row: {
      width: "100%",
      maxWidth: "600px",
    },
    col: {
      width: "100%",
    },
    card: {
      borderRadius: "8px",
      backgroundColor: "var(--qf-bg-main)",
    },
    cardHeader: {
      backgroundColor: "var(--qf-naranja)",
      padding: "1rem",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
    headerText: {
      fontSize: "1.5rem",
      textAlign: "center",
      color: "var(--qf-text-white)",
    },
    cardBody: {
      padding: "20px",
    },
    formGroup: {
      marginBottom: "0.8rem",
    },
    label: {
      display: "block",
      fontWeight: "bold",
      color:  "var(--qf-text-white)",
      margin:"0",
      fontSize: "1rem",
    },
    input: {
      width: "100%",
      padding: "4px",
      borderRadius: "4px",
      border: `1px solid var(--qf-text-muted)`,
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "space-between",
    },
    backButton: {
      padding: "8px 12px",
      backgroundColor: "var(--qf-blue)",
      color: "var(--qf-blanco-puro)",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    nextButton: {
      padding: "8px 12px",
      backgroundColor: "var(--qf-blue)",
      color: "var(--qf-blanco-puro)",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    finishButton: {
      padding: "8px 12px",
      backgroundColor: "var(--qf-green)",
      color: "var(--qf-blanco-puro)",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.background}>
      <div style={styles.container}>
        <div style={styles.row}>
          <div style={styles.col}>
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.headerText}>
                  Datos Consumidor - Paso 2
                </h2>
              </div>
              <div style={styles.cardBody}>
                <form onSubmit={handleSubmit}>
                  <div style={styles.formGroup}>
                    <label htmlFor="nombre" style={styles.label}>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      id="nombre"
                      data-testid="nombre"
                      value={consumidorData.nombre}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="Ingresa tu nombre"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="apellido" style={styles.label}>Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      id="apellido"
                      data-testid="apellido"
                      value={consumidorData.apellido}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="Ingresa tu apellido"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="dni" style={styles.label}>DNI</label>
                    <input
                      type="number"
                      name="dni"
                      id="dni"
                      data-testid="dni"
                      value={consumidorData.dni}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="Ingresa tu DNI"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="fechaNacimiento" style={styles.label}>Fecha de Nacimiento</label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      id="fechaNacimiento"
                      data-testid="fechaNacimiento"
                      value={consumidorData.fechaNacimiento}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="provincia" style={styles.label}>Provincia</label>
                    <select
                      id="provincia"
                      name="provincia"
                      data-testid="provincia"
                      style={styles.input}
                      value={selectedProvince}
                      onChange={handleProvinceChange}
                      required
                    >
                      <option value="" disabled>Selecciona tu provincia</option>
                       {provincias.map((prov) => (
                         <option key={prov.id} value={prov.nombre}>
                           {prov.nombre}
                         </option>
                       ))}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="localidad" style={styles.label}>Localidad</label>
                    <select
                      style={styles.input}
                      value={selectedLocalidad}
                      onChange={handleLocalidadChange}
                      data-testid="localidad"
                      id="localidad"
                      name="localidad"
                      required
                    >
                      <option value="" disabled>Selecciona tu localidad</option>
                       {localidades.map((loc, index) => (
                         <option key={loc.id} value={loc.nombre}>
                           {loc.nombre}
                         </option>
                       ))}
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label htmlFor="telefono" style={styles.label}>Teléfono</label>
                    <input
                      type="number"
                      name="telefono"
                      id="telefono"
                      data-testid="telefono"
                      value={consumidorData.telefono}
                      onChange={handleChange}
                      style={styles.input}
                      placeholder="Ingresa tu teléfono"
                    />
                  </div>
                  <div style={styles.buttonContainer}>
                    <button
                      type="button"
                      style={styles.backButton}
                      onClick={() => backStep()}
                    >
                      Volver
                    </button>
                    <button
                      type="submit"
                      style={tipoUsuario === "consumidor" ? styles.finishButton : styles.nextButton}
                      disabled={isRegistering}
                    >
                      {tipoUsuario === "consumidor" ? (isRegistering ? "⏳ Finalizando..." : "Finalizar") : "Siguiente"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};



export default FormConsumidor;
