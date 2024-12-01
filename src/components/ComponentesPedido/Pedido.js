import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faBan,
  faStore,
  faCalendar,
  faUser,
  faLocationPin,
  faStar,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import useDynamicColors from "../../UseDinamicColors";
import Footer from "../ComponentesGenerales/Footer";

const Pedido = ({ pedido,recargar }) => {
  const Colors = useDynamicColors();
  const [opinion, setOpinion] = useState("");
  const [repartidorRating, setRepartidorRating] = useState(1);
  const [puestoRating, setPuestoRating] = useState(1);

  const [modalValoracionVisible, setModalValoracionVisible] = useState(false);
  const [modalCancelarVisible, setModalCancelarVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);

  const traducirEstado = (estado) => {
    return estado.replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  const coloresPorEstado = {
    Pendiente: Colors.NaranjaOscuro,
    Aceptado: Colors.Rosa,
    EnPreparacion: Colors.Purpura,
    EnCamino: Colors.Azul,
    Entregado: Colors.Verde,
    Cancelado: Colors.Rojo,
    Precomprado: Colors.Rosa,
  };

  const handleCancelarPedido = async () => {
    await submitCancelar(pedido.id)
    setModalCancelarVisible(false);
  };

  const submitCancelar = async (idPedido) => {
    const url = `${process.env?.REACT_APP_BACK_URL}pedido/cambiarEstado/${idPedido}/cancelar`;
    try {
      const response = await fetch(url, {
        method: "POST", // Método POST
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("No se pudo crear la cancelar");
      }

      const data = await response.json(); // Procesamos la respuesta JSON
      console.log("pedido cancelado:", data);
      setModalValoracionVisible(false);
      recargar();
    } catch (error) {
      console.error("Error al cancelar el pedido:", error);
    }
  };

  const handleValorarPedido = async () => {
    const valoracion = {
      valoracionPuesto: puestoRating,
      valoracionRepartidor: repartidorRating,
      opinion: opinion,
    };
    await submitValoracion(pedido.id, valoracion);
  };

  const submitValoracion = async (idPedido, valoracion) => {
    const url = `${process.env?.REACT_APP_BACK_URL}valoracion/${idPedido}`;
    const body = {
      valoracionPuesto: valoracion.valoracionPuesto,
      valoracionRepartidor: valoracion.valoracionRepartidor,
      opinion: valoracion.opinion,
    };

    console.log(body);

    try {
      const response = await fetch(url, {
        method: "POST", // Método POST
        headers: {
          "Content-Type": "application/json",
          // Si necesitas agregar un token o algún otro encabezado, puedes hacerlo aquí
        },
        body: JSON.stringify(body), // Convertimos el objeto en un string JSON
      });

      if (!response.ok) {
        throw new Error("No se pudo crear la valoración");
      }

      const data = await response.json(); // Procesamos la respuesta JSON
      console.log("Valoración creada:", data);
      setModalValoracionVisible(false);
      recargar();
      setRepartidorRating(0);
      setPuestoRating(0);
      setOpinion("");
    } catch (error) {
      console.error("Error al crear la valoración:", error);
    }
  };

  const mostrarBotonInfo = true;
  const mostrarBotonDanger =
    pedido.estado === "Pendiente" || pedido.estado === "Aceptado";
  const mostrarBotonMapa = pedido.estado === "EnCamino";
  const mostrarBotonValorar = pedido.estado === "Entregado";
  const mostrarBotonSolicitar = pedido.estado === "Precomprado";

  const styles = {
    container: {
      width: "100%",
    },
    card: {
      backgroundColor: Colors.GrisAzuladoClaro,
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "10px",
      marginBottom: "20px",
    },
    cardBody: {
      padding: "20px",
    },
    cardTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "0.75rem",
      color: Colors.Naranja,
    },
    cardSubTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "0.75rem",
      color: Colors.Negro,
    },
    cardDescripcion: {
      fontSize: "1rem",
      marginBottom: "0.5rem",
      color: Colors.Negro,
    },
    cardText: {
      fontSize: "1rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      color: Colors.Negro,
    },
    cardEstado: {
      fontSize: "16px",
      color: Colors.BlancoEnBlanco,
      fontWeight: "bold",
      backgroundColor: coloresPorEstado[pedido.estado],
      borderRadius: "10px",
      padding: "5px 10px",
      width: "150px",
      textAlign: "center",
      position: "absolute",
      top: "10px",
      right: "10px",
    },
    separator: {
      color: Colors.Naranja,
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "center",
      marginTop: "1rem",
    },
    buttonInfo: {
      backgroundColor: Colors.Info,
      color: Colors.Negro,
      border: "none",
      padding: "0.25rem 0.5rem",
      borderRadius: "0.2rem",
      marginRight: "0.5rem",
      cursor: "pointer",
      width: "150px",
      fontWeight: "bold",
    },
    buttonDanger: {
      backgroundColor: Colors.Rojo,
      color: Colors.Negro,
      border: "none",
      padding: "0.25rem 0.5rem",
      borderRadius: "0.2rem",
      cursor: "pointer",
      width: "150px",
      fontWeight: "bold",
    },
    buttonMap: {
      backgroundColor: Colors.Azul,
      color: Colors.Negro,
      border: "none",
      padding: "0.25rem 0.5rem",
      borderRadius: "0.2rem",
      cursor: "pointer",
      width: "150px",
      fontWeight: "bold",
    },
    buttonValorar: {
      backgroundColor: Colors.Verde,
      color: Colors.Negro,
      border: "none",
      padding: "0.25rem 0.5rem",
      borderRadius: "0.2rem",
      cursor: "pointer",
      width: "150px",
      fontWeight: "bold",
    },
    buttonSolicitar: {
      backgroundColor: Colors.Verde,
      color: Colors.Negro,
      border: "none",
      padding: "0.25rem 0.5rem",
      borderRadius: "0.2rem",
      cursor: "pointer",
      width: "150px",
      fontWeight: "bold",
    },
    price: {
      color: Colors.Negro,
      fontSize: "1.5rem",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      right: "10px",
      bottom: "10px",
    },
    dialogContainer: {
      display:
        modalValoracionVisible || modalCancelarVisible || modalDetalleVisible
          ? "flex"
          : "none",
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: "1000",
      justifyContent: "center",
      alignItems: "center",
    },
    dialogContent: {
      backgroundColor: Colors.GrisAzuladoClaro,
      padding: "20px",
      borderRadius: "10px",
      width: "80%",
      maxWidth: "500px",
      textAlign: "center",
    },
    dialogTitle: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: Colors.Naranja,
    },
    dialogText: {
      fontSize: "16px",
      marginBottom: "1rem",
      color: Colors.Naranja,
    },
    tableCell: {
      color: Colors.Negro,
    },
    dialogButtons: {
      display: "flex",
      justifyContent: "space-around",
      marginTop: "1rem",
    },
    dialogButton: {
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "0.2rem",
      cursor: "pointer",
      fontWeight: "bold",
    },
    cancelButton: {
      backgroundColor: Colors.Rojo,
      color: Colors.BlancoEnBlanco,
    },
    confirmButton: {
      backgroundColor: Colors.Verde,
      color: Colors.BlancoEnBlanco,
    },
    totalText: {
      fontSize: "30px",
      fontWeight: "bold",
      marginBottom: "1rem",
      marginTop: "1rem",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardBody}>
          <div className="row">
            <div className="position-relative">
              <h5 style={styles.cardTitle}>Pedido #{pedido?.id}</h5>
              <h5 style={styles.cardSubTitle}>
                <FontAwesomeIcon icon={faStore} />
                {" " + pedido.puesto.nombreCarro}
              </h5>
              <h5 style={styles.cardSubTitle}>
                <FontAwesomeIcon icon={faCalendar} />
                {" " + new Date(pedido.fecha).toLocaleDateString("es")}
              </h5>
              {pedido.estado === "EnCamino" && (
                <h5 style={styles.cardSubTitle}>
                  <FontAwesomeIcon icon={faUser} />
                  {" " +
                    pedido?.repartidore?.consumidore?.nombre +
                    ", " +
                    pedido?.repartidore?.consumidore?.apellido || "Alberto"}
                </h5>
              )}
              {pedido.estado === "EnCamino" && (
                <h5 style={styles.cardSubTitle}>
                  <FontAwesomeIcon icon={faLocationPin} />
                  {pedido?.puntoEncuentro?.nombre}
                </h5>
              )}

              <h5 style={styles.price}>${pedido.total}</h5>
              <p style={styles.cardEstado}>{traducirEstado(pedido.estado)}</p>
            </div>
          </div>
          <hr style={styles.separator} />
          <div style={styles.buttonGroup}>
            {mostrarBotonInfo && (
              <button
                style={styles.buttonInfo}
                onClick={() => setModalDetalleVisible(true)}
              >
                <FontAwesomeIcon icon={faCircleInfo} /> Detalle
              </button>
            )}
            {mostrarBotonDanger && (
              <button
                style={styles.buttonDanger}
                onClick={() => setModalCancelarVisible(true)}
              >
                <FontAwesomeIcon icon={faBan} /> Cancelar
              </button>
            )}
            {mostrarBotonMapa && (
              <button style={styles.buttonMap} disabled>
                <FontAwesomeIcon icon={faLocationPin} /> Ver Mapa
              </button>
            )}
            {mostrarBotonValorar && (
              <button
                style={styles.buttonValorar}
                onClick={() => setModalValoracionVisible(true)}
              >
                <FontAwesomeIcon icon={faStar} /> Valorar
              </button>
            )}
            {mostrarBotonSolicitar && (
              <button style={styles.buttonSolicitar} disabled>
                <FontAwesomeIcon icon={faCheck} /> Solicitar
              </button>
            )}
          </div>
        </div>
      </div>
      {modalCancelarVisible && (
        <div style={styles.dialogContainer}>
          <div style={styles.dialogContent}>
            <h2 style={styles.dialogTitle}>
              ¿Estás seguro de que quieres cancelar el pedido?
            </h2>
            <p style={styles.tableCell}>Esta acción no podrá deshacerse.</p>
            <div style={styles.dialogButtons}>
              <button
                style={{ ...styles.dialogButton, ...styles.cancelButton }}
                onClick={() => setModalCancelarVisible(false)}
              >
                Cancelar
              </button>
              <button
                style={{ ...styles.dialogButton, ...styles.confirmButton }}
                onClick={handleCancelarPedido}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      {modalValoracionVisible && (
        <div style={styles.dialogContainer}>
          <div style={styles.dialogContent}>
            <h2 style={styles.dialogTitle}>
              Valora nuestro servicio para mejorar
            </h2>

            {/* Selector para calificar el puesto */}
            <div style={styles.ratingContainer}>
              <label style={styles.ratingLabel}>Calificación del puesto:</label>
              <select
                style={styles.ratingSelect}
                onChange={(e) => setPuestoRating(e.target.value)}
                value={puestoRating}
              >
                {[...Array(5)].map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1} Estrella{index > 0 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Selector para calificar el repartidor */}
            <div style={styles.ratingContainer}>
              <label style={styles.ratingLabel}>
                Calificación del repartidor:
              </label>
              <select
                style={styles.ratingSelect}
                onChange={(e) => setRepartidorRating(e.target.value)}
                value={repartidorRating}
              >
                {[...Array(5)].map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1} Estrella{index > 0 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.textareaContainer}>
              <label style={styles.textareaLabel}>
                ¿Tienes alguna sugerencia o comentario? (opcional)
              </label>
              <textarea
                style={styles.textarea}
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
                cols={20}
                rows={3}
              />
            </div>
            <div style={styles.dialogButtons}>
              <button
                style={{ ...styles.dialogButton, ...styles.cancelButton }}
                onClick={() => setModalValoracionVisible(false)}
              >
                Cancelar
              </button>
              <button
                style={{ ...styles.dialogButton, ...styles.confirmButton }}
                onClick={() => handleValorarPedido()}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalDetalleVisible && (
        <div style={styles.dialogContainer}>
          <div style={styles.dialogContent}>
            <h2 style={styles.dialogTitle}>Detalle del Pedido</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={styles.dialogText}>Producto</th>
                  <th style={styles.dialogText}>Cantidad</th>
                  <th style={styles.dialogText}>Precio Unitario</th>
                  <th style={styles.dialogText}>Total</th>
                </tr>
              </thead>
              <tbody>
                {pedido?.detalles?.map((detalle, index) => (
                  <tr key={index}>
                    <td style={styles.tableCell}>{detalle.producto.nombre}</td>
                    <td style={styles.tableCell}>{detalle.cantidad}</td>
                    <td style={styles.tableCell}>${detalle.producto.precio}</td>
                    <td style={styles.tableCell}>
                      ${detalle.cantidad * detalle.producto.precio}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={styles.totalContainer}>
              <h3 style={styles.totalText}>Total: ${pedido?.total}</h3>
            </div>
            <div style={styles.dialogButtons}>
              <button
                style={{ ...styles.dialogButton, ...styles.confirmButton }}
                onClick={() => setModalDetalleVisible(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Pedido;
