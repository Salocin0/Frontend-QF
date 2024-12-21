import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Modal from "react-modal";
import useDynamicColors from "../../UseDinamicColors";
import { UserContext } from "../ComponentesGenerales/UserContext";

const EncargadoPuesto = ({
  setMostrarContenidoEncargadoPuesto,
  isCuitValid,
  setMostrarBotonHabilitarDeNuevoEPC,

  mostrarContenidoEncargadoPuesto,
  handleDeshabilitarEPC,
  showModal,
  setShowModal,
  confirmarDeshabilitarEPC,
}) => {
  const Colors = useDynamicColors();
  const { user, updateUser } = useContext(UserContext);
  const [cuitEPC, setCuitEPC] = useState("");
  const [razonSocialEPC, setRazonSocialEPC] = useState("");
  const [condicionEPC, setCondicionEPC] = useState("");
  const [, setDocumentos] = useState("");
  const [isDisabledEPC, setIsDisabledEPC] = useState(true);
  const [editModeEPC, setEditModeEPC] = useState(false);
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      marginTop: "20px",
      backgroundColor: Colors.GrisAzuladoClaro,
      borderRadius: "10px",
      border: `1px solid ${Colors.Blanco}`,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    },
    form: {
      padding: "1rem",
      width: "100%",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
    },
    h1: {
      fontWeight: "bold",
      color: Colors.Blanco,
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
    },
    button: {
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "0.5rem",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      marginBottom: "1rem",
      border: "none",
      borderRadius: "5px",
      backgroundColor: Colors.GrisAzuladoOscuro,
      color: Colors.Blanco,
    },
    fileInput: {
      width: "100%",
      padding: "0.5rem",
      borderRadius: "5px",
      border: `none`,
      backgroundColor: Colors.GrisAzuladoOscuro,
      color: Colors.Blanco,
      marginBottom: "1rem",
    },
    modal: {
      overlay: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "20%",
        marginBottom: "50px",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      },
      content: {
        position: "relative",
        top: "auto",
        left: "auto",
        right: "auto",
        bottom: "auto",
        borderRadius: "8px",
        maxWidth: "400px",
        padding: "20px",
        textAlign: "center",
        backgroundColor: Colors.GrisAzuladoClaro,
        color: Colors.Blanco,
      },
    },
    label: {
      margin: "0",
      marginBottom: "5px",
      fontWeight: "bold",
    },
    dangerButton: { backgroundColor: Colors.Rojo, color: "white" },
    successButton: { backgroundColor: Colors.Verde, color: "white" },
    primaryButton: { backgroundColor: Colors.Azul, color: "white" },
  };

  const handleCuitChangeEPC = (e) => {
    setCuitEPC(e.target.value);
  };

  const handleRazonSocialChangeEPC = (e) => {
    setRazonSocialEPC(e.target.value);
  };

  const handleCondicionEPC = (e) => {
    setCondicionEPC(e.target.value);
  };

  const handleDocumentosChangeEPC = (e) => {
    setDocumentos(e.target.files);
  };
  const handleEditModeToggleEPC = () => {
    setEditModeEPC(!editModeEPC);
    setIsDisabledEPC(!isDisabledEPC);
  };

  const handleCancelChangesEPC = () => {
    setEditModeEPC(false);
    setIsDisabledEPC(true);
    cargarDatos(user);
  };

  const handleSaveChangesEPC = async (e) => {
    e.preventDefault();

    if (!isCuitValid(cuitEPC)) {
      toast.error("El CUIT no es válido o está vacío.");
      return;
    }

    if (!razonSocialEPC.trim()) {
      toast.error("razon social no puede estar vacía.");
      return;
    }

    if (!condicionEPC.trim()) {
      toast.error("Condicion IVA no puede estar vacía.");
      return;
    }

    const datosActualizados = {
      razonSocialEPC,
      cuitEPC,
      condicionEPC,
    };
    console.log(datosActualizados);
    try {
      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}encargado/${user.consumidorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosActualizados),
        }
      );

      if (response.ok) {
        toast.success("Datos actualizados correctamente");
        cargarDatos(user);
        setEditModeEPC(false);
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al actualizar los datos del repartidor:", error);
      toast.error("Error al actualizar los datos");
    }
  };



  const cargarDatos = async (user) => {
    try {
      const response1 = await fetch(
        `${process.env?.REACT_APP_BACK_URL}consumidor/${user.consumidorId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response1.ok) {
        const data1 = await response1.json();

        if (
          data1.data.encargado?.habilitado === true &&
          (data1.data.encargado?.cuit !== undefined ||
            data1.data.encargado?.razonSocial !== undefined)
        ) {
          setMostrarContenidoEncargadoPuesto(true);

          setCuitEPC(data1.data.encargado.cuit);
          setRazonSocialEPC(data1.data.encargado.razonSocial);
          setCondicionEPC(data1.data.encargado.condicionIva);
        } else if (data1.data.encargado?.habilitado === false) {
          setMostrarBotonHabilitarDeNuevoEPC(true);
        }

        if (data1.codigo === 200) {
          toast.success("Datos cargados correctamente");
        } else if (data1.codigo === 400) {
          toast.error("Error al cargar los datos");
        }
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  useEffect(() => {
    if (user) {
      cargarDatos(user);
    }
  }, [user]);

  return mostrarContenidoEncargadoPuesto ? (
    <section style={styles.container}>
      <div style={styles.form}>
        <div style={styles.header}>
          <h1 style={styles.h1}>Encargado Puesto</h1>
          <div style={styles.buttonContainer}>
            {editModeEPC ? (
              <>
                <button
                  type="button"
                  style={{ ...styles.button, ...styles.successButton }}
                  onClick={handleSaveChangesEPC}
                >
                  Guardar
                </button>
                <button
                  type="button"
                  style={{ ...styles.button, ...styles.dangerButton }}
                  onClick={handleCancelChangesEPC}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="button"
                style={{ ...styles.button, ...styles.primaryButton }}
                onClick={handleEditModeToggleEPC}
              >
                Editar
              </button>
            )}
          </div>
        </div>
        <form onSubmit={handleSaveChangesEPC}>
          <div>
            <label style={styles.label} htmlFor="cuit">
              CUIT
            </label>
            <input
              type="number"
              id="cuit"
              style={styles.input}
              value={cuitEPC}
              onChange={handleCuitChangeEPC}
              readOnly={!editModeEPC}
              disabled={!editModeEPC}
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
              value={razonSocialEPC}
              onChange={handleRazonSocialChangeEPC}
              readOnly={!editModeEPC}
              disabled={!editModeEPC}
              required
            />
          </div>
          <div>
            <label style={styles.label} htmlFor="Condicon">
              Condicion IVA
            </label>
            <input
              type="text"
              id="IVA"
              style={styles.input}
              value={condicionEPC}
              onChange={handleCondicionEPC}
              readOnly={!editModeEPC}
              disabled={!editModeEPC}
            />
          </div>
          {/*<div>
            <label style={styles.label} htmlFor="documentos">
              Documentos
            </label>
            <input
              type="file"
              id="documentos"
              style={styles.fileInput}
              onChange={handleDocumentosChangeEPC}
              readOnly={!editModeEPC}
              disabled={!editModeEPC}
            />
          </div>*/}
        </form>
        <button
          type="button"
          style={{ ...styles.button, ...styles.dangerButton, width: "100%" }}
          onClick={handleDeshabilitarEPC}
        >
          Deshabilitar Usuario
        </button>
        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          contentLabel="Confirmación de deshabilitación"
          style={styles.modal}
        >
          <h2 style={{marginBottom:"20px",fontSize:"24px"}}>¿Está seguro de deshabilitar el Rol de su cuenta?</h2>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={() => setShowModal(false)} style={{...styles.button, ...styles.successButton}}>
              Cancelar
            </button>
            <button onClick={confirmarDeshabilitarEPC} style={{...styles.button, ...styles.dangerButton}}>
              Deshabilitar
            </button>
          </div>
        </Modal>
      </div>
    </section>
  ) : null;
};

export default EncargadoPuesto;
