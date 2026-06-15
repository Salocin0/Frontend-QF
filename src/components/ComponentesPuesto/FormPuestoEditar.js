import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useBreakpoint from "../../useBreakpoint";

function FormPuestoEditar({ carrito }) {
  const { isMobile } = useBreakpoint();
  const [editMode, setEditMode] = useState(false);
  const [numeroCarro, setNumeroCarro] = useState("");
  const [nombreCarro, setNombreCarro] = useState("");
  const [tipoNegocio, setTipoNegocio] = useState("");
  const [telefonoCarro, setTelefonoCarro] = useState("");
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (carrito) {
      setNumeroCarro(carrito.numeroCarro);
      setNombreCarro(carrito.nombreCarro);
      setTipoNegocio(carrito.tipoNegocio);
      setTelefonoCarro(carrito.telefonoCarro);
    }
  }, [carrito]);

  const handleEditar = (e) => {
    e.preventDefault();
    setEditMode(true);
    setOriginalData(carrito);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setEditMode(false);
    const puesto={numeroCarro, nombreCarro, tipoNegocio, telefonoCarro}
    const response = await fetch(
      `${process.env?.REACT_APP_BACK_URL}puesto/${carrito.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({puesto}),
            }
    )
    if(response.ok){
      carrito.numeroCarro=numeroCarro;
      carrito.nombreCarro=nombreCarro;
      carrito.tipoNegocio=tipoNegocio;
      carrito.telefonoCarro=telefonoCarro;
      setOriginalData(carrito);
      toast.success("Puesto actualizado correctamente");
    }else{
      toast.error("Error al actualizar puesto");
    }
  }

  const handleCancel = (e) => {
    e.preventDefault();
    setNumeroCarro(originalData.numeroCarro);
    setNombreCarro(originalData.nombreCarro);
    setTipoNegocio(originalData.tipoNegocio);
    setTelefonoCarro(originalData.telefonoCarro);
    setEditMode(false);
  };

  const styles = {
    form: {
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? "12px" : "16px",
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "8px",
      padding: isMobile ? "16px 12px" : "24px",
      backgroundColor: "var(--qf-bg-secondary)",
      position: "relative",
      width: "100%",
    },
    titleRow: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: isMobile ? "stretch" : "center",
      gap: "10px",
    },
    title: {
      flex: 1,
      textAlign: "center",
      fontSize: isMobile ? "1.3em" : "1.5em",
      fontWeight: "bold",
      color: "var(--qf-text-primary)",
      margin: 0,
    },
    buttonContainer: {
      display: "flex",
      gap: "10px",
      justifyContent: isMobile ? "center" : "flex-end",
    },
    button: {
      padding: isMobile ? "8px 16px" : "10px 20px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontWeight: "bold",
      fontSize: isMobile ? "0.9rem" : "1rem",
    },
    editButton: { backgroundColor: "var(--qf-blue)", color: "var(--qf-blanco-puro)" },
    saveButton: { backgroundColor: "var(--qf-green)", color: "var(--qf-blanco-puro)" },
    cancelButton: {
      backgroundColor: "var(--qf-rojo)",
      color: "var(--qf-blanco-puro)",
    },
    fieldGroup: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      flexWrap: "wrap",
      gap: "16px",
    },
    field: {
      flex: "1",
      minWidth: isMobile ? "100%" : "250px",
    },
    label: {
      display: "block",
      marginBottom: "6px",
      fontWeight: "bold",
      color: "var(--qf-text-primary)",
      fontSize: isMobile ? "0.9rem" : "1rem",
    },
    input: {
      width: "100%",
      padding: "10px 12px",
      border: "none",
      borderRadius: "4px",
      color: "var(--qf-blanco-puro)",
      backgroundColor: "var(--qf-bg-card)",
      fontSize: "1rem",
      boxSizing: "border-box",
    },
    link: {
      display: "inline-block",
      padding: "10px 20px",
      backgroundColor: "var(--qf-blue)",
      color: "var(--qf-blanco-puro)",
      textDecoration: "none",
      borderRadius: "5px",
      textAlign: "center",
      cursor: "pointer",
      fontWeight: "bold",
      alignSelf: isMobile ? "stretch" : "flex-start",
    },
  };

  return (
    <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
      {/* Título + botones en la misma línea en desktop, apilados en mobile */}
      <div style={styles.titleRow}>
        <h2 style={styles.title}>Datos Puesto</h2>
        <div style={styles.buttonContainer}>
          {!editMode ? (
            <button
              style={{ ...styles.button, ...styles.editButton }}
              onClick={(e) => handleEditar(e)}
            >
              Editar
            </button>
          ) : (
            <>
              <button
                style={{ ...styles.button, ...styles.saveButton }}
                onClick={(e) => handleSave(e)}
              >
                Guardar
              </button>
              <button
                style={{ ...styles.button, ...styles.cancelButton }}
                onClick={(e) => handleCancel(e)}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Fila: ID Carro + Nombre Carro */}
      <div style={styles.fieldGroup}>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="idCarro">
            N° ID Carro
          </label>
          <input
            type="number"
            id="idCarro"
            style={styles.input}
            onChange={(e) => setNumeroCarro(e.target.value)}
            value={numeroCarro}
            disabled={!editMode}
            required
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label} htmlFor="nombreCarro">
            Nombre Carro
          </label>
          <input
            type="text"
            id="nombreCarro"
            style={styles.input}
            value={nombreCarro}
            onChange={(e) => setNombreCarro(e.target.value)}
            disabled={!editMode}
            required
          />
        </div>
      </div>

      {/* Tipo de Negocio */}
      <div>
        <label style={styles.label} htmlFor="tipoNegocio">
          Tipo de Negocio
        </label>
        <input
          type="text"
          id="tipoNegocio"
          style={styles.input}
          value={tipoNegocio}
          onChange={(e) => setTipoNegocio(e.target.value)}
          disabled={!editMode}
          required
        />
      </div>

      {/* Teléfono */}
      <div>
        <label style={styles.label} htmlFor="telefonoCarro">
          Teléfono del Carro de Comida
        </label>
        <input
          type="tel"
          id="telefonoCarro"
          style={styles.input}
          value={telefonoCarro}
          onChange={(e) => setTelefonoCarro(e.target.value)}
          disabled={!editMode}
          required
        />
      </div>

      {/* Volver */}
      <Link to={`/listado-puestos-encargado`} style={styles.link}>
        Volver
      </Link>
    </form>
  );
}

export default FormPuestoEditar;
