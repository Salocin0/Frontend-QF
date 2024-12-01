import { default as React, useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo,
  faCalendar,
  faUser,
  faLocationPin,
  faStore,
} from "@fortawesome/free-solid-svg-icons";
import useDynamicColors from "../../../UseDinamicColors";
import Footer from "../../ComponentesGenerales/Footer";

const PedidoRepartidor = ({ pedido, recargar }) => {
  const Colors = useDynamicColors();
  console.log(pedido);
  const [modalentregarvisible, setModalEntregarVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const mostrarBotonInfo = true;
  const mostrarBotonEntregar = pedido.estado === "EnCamino";
  const [codigo, setCodigo] = useState("");

  const traducirEstado = (estado) => {
    return estado.replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  const pedidoEntregado = () => {
    if (codigo === pedido.codigoEntrega) {
      console.log("entregado");
      fetch(
        `${process.env?.REACT_APP_BACK_URL}pedido/cambiarEstado/${pedido.id}/pedidoEntregado`,
        {
          method: "POST",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          toast.success("pedido Entregado");
          recargar();
          setModalEntregarVisible(false);
        })
        .catch((error) => console.error("Error fetching session:", error));
    } else {
      toast.error("codigo incorrecto");
    }
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

  const styles = {
    container: {
      marginBottom: "1rem",
    },
    card: {
      borderRadius: "10px",
      backgroundColor: Colors.GrisAzuladoClaro,
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      border: `1px solid ${Colors.Naranja}`,
      margin: "0 30px",
    },
    cardBody: {
      padding: "1rem",
    },
    title: {
      fontWeight: "bold",
      fontSize: "1.25rem",
    },
    description: {
      fontSize: "1rem",
      marginBottom: "0.5rem",
    },
    estado: {
      position: "absolute",
      bottom: "0px",
      right: "0px",
      fontSize: "0.9rem",
      fontWeight: "bold",
    },
    separator: {
      color: Colors.Naranja,
      margin: "0.5rem 0",
    },
    textEnd: {
      textAlign: "end",
    },
    button: {
      margin: "0.5rem 0.25rem",
      padding: "0.3rem 0.75rem",
      fontSize: "0.85rem",
    },
    dialog: {
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "400px",
      borderRadius: "10px",
      transform: "translate(-50%, -50%)",
      backgroundColor: Colors.GrisAzuladoClaro,
      padding: "1rem",
    },
    dialogTitle: {
      textAlign: "center",
      color: Colors.Naranja,
      marginBottom: "0.5rem",
    },
    table: {
      width: "100%",
      marginTop: "1rem",
    },
    tableCell: {
      padding: "0.5rem",
      textAlign: "center",
      color: Colors.Negro,
    },
    closeButton: {
      backgroundColor: Colors.Rojo,
      border: "none",
      color: Colors.Blanco,
      fontSize: "0.9rem",
      width: "50%",
      padding: "0.5rem",
      borderRadius: "5px",
      cursor: "pointer",
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
      display: modalentregarvisible || modalDetalleVisible ? "flex" : "none",
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
    dialogText: {
      fontSize: "16px",
      marginBottom: "1rem",
      color: Colors.Naranja,
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

              <h5 style={styles.cardSubTitle}>
                <FontAwesomeIcon icon={faUser} />{" "}
                {pedido?.consumidore?.nombre +
                  ", " +
                  pedido?.consumidore?.apellido || "Alberto"}
              </h5>

              <h5 style={styles.cardSubTitle}>
                <FontAwesomeIcon icon={faLocationPin} />{" "}
                {pedido?.puntoEncuentro?.nombre || "Punto de encuentro 3"}
              </h5>

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
            {mostrarBotonEntregar && (
              <button
                style={styles.buttonSolicitar}
                onClick={() => setModalEntregarVisible(true)}
              >
                <FontAwesomeIcon icon={faCircleInfo} /> Entregar
              </button>
            )}
          </div>
        </div>
      </div>
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
      {modalentregarvisible && (
        <div style={styles.dialogContainer}>
          <div style={styles.dialogContent}>
            <h2 style={styles.dialogTitle}>Entregar Pedido</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "50%",
                margin: "0 auto",
              }}
            >
              <label htmlFor="codigo">Codigo Entrega</label>
              <input
                type="text"
                id="codigo"
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>

            <div style={styles.dialogButtons}>
              <button
                style={{ ...styles.dialogButton, ...styles.cancelButton }}
                onClick={() => setModalDetalleVisible(false)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.dialogButton, ...styles.confirmButton }}
                onClick={() => pedidoEntregado()}
              >
                Enviar Codigo
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PedidoRepartidor;
