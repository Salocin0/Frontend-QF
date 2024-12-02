import { default as React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useDynamicColors from "../../UseDinamicColors";
import imgDefault from "../img/puestoLogoDefault.jpg";

const PuestoEncargado = ({ carrito, actualizarListado }) => {
  const navigate = useNavigate();
  const Colors = useDynamicColors();
  const [isCreado, setIsCreado] = useState(carrito.estado === "Creado");
  const [isDeshabilitado, setIsDeshabilitado] = useState(
    carrito.estado === "Deshabilitado"
  );
  const [actualizar, setActualizar] = useState(0);

  useEffect(() => {
    setIsCreado(carrito.estado === "Creado");
    setIsDeshabilitado(carrito.estado === "Deshabilitado");
  }, [carrito, actualizar]);

  const handleactualizar = () => {
    setActualizar(actualizar + 1);
    actualizarListado();
  };

  const suscribirPuesto = () => {
    navigate(`/asociarPuestoAEvento/${carrito.id}`);
  };

  const habilitarPuesto = async () => {
    try {
      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}puesto/cambiarEstado/${carrito.id}/habilitar`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Error al habilitar puesto");
      }
      toast.success("Puesto habilitado con éxito");
      handleactualizar();
    } catch (error) {
      toast.error(error.message || "Error al habilitar puesto");
    }
  };

  const deshabilitarPuesto = async () => {
    try {
      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}puesto/cambiarEstado/${carrito.id}/deshabilitar`,
        {
          method: "POST",
        }
      );
      if (!response.ok) {
        throw new Error("Error al deshabilitar puesto");
      }
      toast.success("Puesto deshabilitado con éxito");
      handleactualizar();
    } catch (error) {
      toast.error(error.message || "Error al deshabilitar puesto");
    }
  };

  const agregarProducto = () => {
    navigate(`/listado-productos/${carrito.id}`, { state: carrito });
  };

  const pedidosEnCurso = () => {
    navigate(`/pedidos-Encargado/${carrito.id}`, { state: carrito });
  };

  const styles = {
    container: {
      width: "90%",
      margin: "1rem auto",
      padding: "1rem",
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "8px",
      backgroundColor: Colors.GrisAzuladoClaro,
    },
    cardBody: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
    },
    contenedor: {
      display: "flex",
      flexDirection: "column",
    },
    imgContainer: {
      display: "flex",
      width: "20%",
    },
    img: {
      width: "100%",
      height: "auto",
      borderRadius: "10px",
    },
    detailsContainer: {
      display: "flex",
      width: "80%",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "0 1rem",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      color: Colors.Naranja,
    },
    description: {
      margin: "0.25rem 0",
      color: Colors.Negro,
    },
    buttonsContainer: {
      marginTop: "1rem",
      display: "flex",
      justifyContent: "center",
      gap: "0.5rem",
    },
    button: {
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    successButton: {
      backgroundColor: "green",
      color: "white",
    },
    secondaryButton: {
      backgroundColor: "gray",
      color: "white",
    },
    dangerButton: {
      backgroundColor: "red",
      color: "white",
    },
    estado: {
      fontSize: "20px",
      color: Colors.BlancoEnBlanco,
      backgroundColor: Colors.Verde,
      padding: "5px 10px",
      borderRadius: "5px",
      position: "absolute",
      top: "5px",
      right: "5px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.contenedor}>
        <div style={styles.cardBody}>
          <div style={styles.imgContainer}>
            <img
              src={carrito.img || imgDefault}
              alt="Logo del Evento"
              style={styles.img}
            />
          </div>

          <div style={styles.detailsContainer}>
            <h5 style={styles.title}>{carrito.nombreCarro}</h5>
            <p style={styles.description}>
              Id de Puesto: {carrito.numeroCarro}
            </p>
            <p style={styles.description}>Teléfono: {carrito.telefonoCarro}</p>
            <p style={styles.estado}>{carrito.estado}</p>
          </div>
        </div>
        <div style={styles.buttonsContainer}>
          {isCreado && (
            <button
              style={{ ...styles.button, ...styles.successButton }}
              onClick={suscribirPuesto}
            >
              Suscribir Puesto a Evento
            </button>
          )}
          {isDeshabilitado && (
            <button
              style={{ ...styles.button, ...styles.successButton }}
              onClick={habilitarPuesto}
            >
              Habilitar Puesto
            </button>
          )}
          <button
            style={{ ...styles.button, ...styles.successButton }}
            onClick={agregarProducto}
          >
            Agregar Productos
          </button>
          <button
            style={{ ...styles.button, ...styles.successButton }}
            onClick={pedidosEnCurso}
          >
            Pedidos en curso
          </button>
          <button style={{ ...styles.button, ...styles.secondaryButton }}>
            Editar Puesto
          </button>
          {isCreado && (
            <button
              style={{ ...styles.button, ...styles.dangerButton }}
              onClick={deshabilitarPuesto}
            >
              Deshabilitar Puesto
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PuestoEncargado;
