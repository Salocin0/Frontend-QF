import React, { useState, useEffect } from "react";
import useDynamicColors from "../../UseDinamicColors";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function FormPuestoEditar({ carrito }) {
  const Colors = useDynamicColors();
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
      gap: "16px",
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "8px",
      padding: "16px",
      backgroundColor: Colors.GrisAzuladoClaro,
      position: "relative",
      width: "Calc(100% - 40px)",
    },
    title: {
      flex: 1,
      textAlign: "center",
      fontSize: "1.5em",
      fontWeight: "bold",
    },
    buttonContainer: {
      position: "absolute",
      display: "flex",
      gap: "10px",
      right: "16px",
      top: "16px",
    },
    button: {
      padding: "10px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
    editButton: { backgroundColor: Colors.Azul, color: Colors.BlancoEnBlanco },
    saveButton: { backgroundColor: Colors.Verde, color: Colors.BlancoEnBlanco },
    cancelButton: {
      backgroundColor: Colors.Rojo,
      color: Colors.BlancoEnBlanco,
    },
    row: { display: "flex", flexWrap: "wrap", gap: "16px" },
    column: { flex: "1", minWidth: "250px" },
    label: { marginBottom: "8px", fontWeight: "bold", color: Colors.Blanco },
    input: {
      width: "100%",
      padding: "8px",
      border: "none",
      borderRadius: "4px",
    },
    link: {
      display: "inline-block",
      marginTop: "10px",
      padding: "8px 12px",
      backgroundColor: "#007bff",
      color: "white",
      textDecoration: "none",
      borderRadius: "5px",
      textAlign: "center",
      cursor: "pointer",
    },
  };

  return (
    <form style={styles.form}>
      <h2 style={styles.title}>Datos Puesto</h2>
      <div style={styles.row}>
        <div style={styles.column}>
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
        <div style={styles.column}>
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
      <Link to={`/listado-puestos-encargado`} style={styles.link}>
        Volver
      </Link>
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
              onClick={(e)=>handleSave(e)}
            >
              Guardar
            </button>
            <button
              style={{ ...styles.button, ...styles.cancelButton }}
              onClick={(e)=>handleCancel(e)}
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </form>
  );
}

export default FormPuestoEditar;
