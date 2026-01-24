import Modal from "react-modal";
import useDynamicColors from "../../UseDinamicColors";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "../ComponentesGenerales/UserContext";

const EventProducerForm = ({
  mostrarContenidoProductor,
  showModal,
  setShowModal,
  confirmarDeshabilitarPE,
  setMostrarContenidoProductor,
  isCuitValid,
}) => {
  const Colors = useDynamicColors();
  const [condicionIvaPE, setCondicionPE] = useState("");
  const [razonSocialPE, setRazonSocialPE] = useState("");
  const [isDisabledPE, setIsDisabledPE] = useState(true);
  const [editModePE, setEditModePE] = useState(false);
  const [cuitPE, setCuitPE] = useState("");
  const { user } = useContext(UserContext);

  const styles = {
    card: {
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
      width: "100%",
      backgroundColor: Colors.GrisAzuladoClaro,
      marginTop: "20px",
      border: `1px solid ${Colors.Naranja}`,
    },
    cardBody: {
      padding: "20px",
    },
    headerRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "flex-end",
    },
    headerText: {
      fontWeight: "bold",
      color: Colors.Blanco,
    },
    label: {
      marginBottom: "5px",
      fontWeight: "bold",
      margin: "0",
    },
    input: {
      width: "100%",
      padding: "8px",
      borderRadius: "5px",
      marginBottom: "16px",
      border: "none",
      backgroundColor: Colors.GrisAzuladoOscuro,
      color: Colors.Blanco,
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
    },
    button: {
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "0.5rem",
    },
    modalOverlay: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "20%",
      marginBottom: "50px",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
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
    dangerButton: { backgroundColor: Colors.Rojo, color: "white" },
    successButton: { backgroundColor: Colors.Verde, color: "white" },
    primaryButton: { backgroundColor: Colors.Azul, color: "white" },
  };

  const handleRazonSocialChangePE = (e) => {
    setRazonSocialPE(e.target.value);
  };

  const handleCondicionPE = (e) => {
    setCondicionPE(e.target.value);
  };

  const handleEditModeTogglePE = () => {
    setEditModePE(!editModePE);
    setIsDisabledPE(!isDisabledPE);
  };

  const handleCancelChangesPE = () => {
    setEditModePE(false);
    setIsDisabledPE(true);
    cargarDatos(user);
  };

  const handleCuitChangePE = (e) => {
    setCuitPE(e.target.value);
  };

  const handleSaveChangesPE = async (e) => {
    e.preventDefault();

    if (!isCuitValid(cuitPE)) {
      toast.error("El CUIT no es válido o está vacío.");
      return;
    }

    if (!razonSocialPE.trim()) {
      toast.error("razon social no puede estar vacía.");
      return;
    }

    const datosActualizados = {
      razonSocialPE,
      cuitPE,
      condicionIva: condicionIvaPE,
    };

    try {
      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}productor/${user.consumidorId}`,
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
        setEditModePE(false);
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al actualizar los datos del repartidor:", error);
      toast.error("Error al actualizar los datos");
    }
  };

  const handleDeshabilitarPE = () => {
    setShowModal(true);
  };

  const cargarDatos = React.useCallback(async (user) => {
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
        console.log(data1);
        if (
          data1.data.productor?.habilitado === true &&
          (data1.data.productor?.cuit || data1.data.productor?.razonSocial)
        ) {
          setMostrarContenidoProductor(true);
          console.log(data1.data.productor.razonSocial);
          setCuitPE(data1.data.productor.cuit);
          setRazonSocialPE(data1.data.productor.razonSocial);
          setCondicionPE(data1.data.productor.condicionIva);
        } else if (data1.data.productor?.habilitado === false) {
          setMostrarContenidoProductor(false);
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
  }, [setMostrarContenidoProductor]);

  useEffect(() => {
    if (user) {
      cargarDatos(user);
    }
  }, [user, cargarDatos]);
  if (!mostrarContenidoProductor) return null;
  return (
    <div style={styles.card}>
      <div style={styles.cardBody}>
        <div style={styles.headerRow}>
          <h1 style={styles.headerText}>Productor de Eventos</h1>
          {editModePE ? (
            <div style={styles.buttonContainer}>
              <button
                type="button"
                style={{ ...styles.button, ...styles.successButton }}
                onClick={handleSaveChangesPE}
              >
                Guardar
              </button>
              <button
                type="button"
                style={{
                  ...styles.button,
                  ...styles.dangerButton,
                }}
                onClick={handleCancelChangesPE}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <button
              type="button"
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={handleEditModeTogglePE}
            >
              Editar
            </button>
          )}
        </div>

        <form onSubmit={handleSaveChangesPE}>
          <label style={styles.label} htmlFor="cuit">
            CUIT
          </label>
          <input
            type="number"
            id="cuit"
            style={styles.input}
            value={cuitPE}
            onChange={handleCuitChangePE}
            readOnly={!editModePE}
            disabled={!editModePE}
            required
          />
          <label style={styles.label} htmlFor="razonSocial">
            Razón Social
          </label>
          <input
            type="text"
            id="razonSocial"
            style={styles.input}
            value={razonSocialPE}
            onChange={handleRazonSocialChangePE}
            readOnly={!editModePE}
            disabled={!editModePE}
            required
          />
          <label style={styles.label} htmlFor="condicion">
            Condición IVA
          </label>
          <input
            type="text"
            id="condicion"
            style={styles.input}
            value={condicionIvaPE}
            onChange={handleCondicionPE}
            readOnly={!editModePE}
            disabled={!editModePE}
            required
          />
        </form>

        <div style={styles.buttonGroup}>
          <button
            type="button"
            style={{ ...styles.button, ...styles.dangerButton, width: "100%" }}
            onClick={handleDeshabilitarPE}
          >
            Deshabilitar Usuario
          </button>
        </div>

        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          contentLabel="Confirmación de deshabilitación"
          style={{ overlay: styles.modalOverlay, content: styles.modalContent }}
        >
          <h2 style={{ marginBottom: "20px", fontSize: "24px" }}>
            ¿Está seguro de deshabilitar el Rol de su cuenta?
          </h2>
          <div style={styles.buttonGroup}>
            <button
              onClick={() => setShowModal(false)}
              style={{ ...styles.button, ...styles.successButton }}
            >
              Cancelar
            </button>
            <button
              onClick={confirmarDeshabilitarPE}
              style={{ ...styles.button, ...styles.dangerButton }}
            >
              Deshabilitar
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default EventProducerForm;
