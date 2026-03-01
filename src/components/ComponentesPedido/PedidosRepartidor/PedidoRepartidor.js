import { default as React, useState, useEffect } from "react";
import { toast } from "react-toastify";
import useDynamicColors from "../../../UseDinamicColors";
import Footer from "../../ComponentesGenerales/Footer";
import { FaStore, FaCalendarAlt, FaUser, FaMapMarkedAlt, FaInfoCircle, FaCheckCircle, FaHourglassStart, FaTruck, FaBox, FaBan } from "react-icons/fa";

const PedidoRepartidor = ({ pedido, recargar }) => {
  const Colors = useDynamicColors();
  console.log(pedido);
  const [modalentregarvisible, setModalEntregarVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalMapaVisible, setModalMapaVisible] = useState(false);
  const [estadoLocal, setEstadoLocal] = useState(pedido.estado);
  useEffect(() => { setEstadoLocal(pedido.estado); }, [pedido.estado]);
  const mostrarBotonInfo = true;
  const mostrarBotonEntregar = estadoLocal === "EnCamino";
  const mostrarBotonMapa = estadoLocal === "EnCamino";
  const [codigo, setCodigo] = useState("");

  const traducirEstado = (estado) => {
    return estado.replace(/([a-z])([A-Z])/g, "$1 $2");
  };

  const getIconoEstado = (estado) => {
    const iconos = {
      Pendiente: <FaHourglassStart />,
      Aceptado: <FaCheckCircle />,
      EnPreparacion: <FaBox />,
      EnCamino: <FaTruck />,
      Entregado: <FaCheckCircle />,
      Cancelado: <FaBan />,
      Precomprado: <FaCheckCircle />,
    };
    return iconos[estado] || <FaHourglassStart />;
  };

  const pedidoEntregado = () => {
    if (codigo === pedido.codigoEntrega) {
      console.log("entregado",pedido.codigoEntrega);
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
        .catch((error) => {
          console.error("Error fetching session:", error);
          setEstadoLocal(pedido.estado);
        });
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
      margin: "10px 20px",
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
      gap: "0.75rem",      
      marginTop: "1rem",
    },
    buttonInfo: {
      backgroundColor: Colors.Info,
      color: Colors.Negro,
      border: "none",
      padding: "0.25rem 0.5rem",
      borderRadius: "0.2rem",
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
    codigoInput: {
      width: "100%",
      padding: "8px",
      borderRadius: "4px",
      border: `1px solid ${Colors.Naranja}`,
      backgroundColor: Colors.GrisAzuladoClaro,
      color: Colors.Negro,
      marginBottom: "1rem",
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
      display: modalentregarvisible || modalDetalleVisible || modalMapaVisible ? "flex" : "none",
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
    tableCell: {
      color: Colors.Negro,
      padding: "12px 8px",
      borderBottom: `1px solid ${Colors.Naranja}33`,
      textAlign: "center",
      fontSize: "15px",
    },
    tableHeaderCell: {
      backgroundColor: Colors.GrisAzuladoOscuro,
      color: Colors.Negro,
      padding: "12px 8px",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: "14px",
      borderBottom: `2px solid ${Colors.Naranja}`,
    },
    detailsTable: {
      width: "100%",
      borderCollapse: "collapse",
      marginBottom: "1.5rem",
    },
    tableRow: {
      backgroundColor: Colors.modoOscuroActivo ? Colors.GrisClaro : Colors.GrisAzuladoOscuro,
      color: Colors.modoOscuroActivo ? Colors.Blanco : Colors.Negro,
    },
    tableRowAlternate: {
      backgroundColor: Colors.modoOscuroActivo ? Colors.GrisClaroPeroNoTanClaro : Colors.GrisAzuladoOscuro + "44",
      color: Colors.modoOscuroActivo ? Colors.Blanco : Colors.Negro,
    },
    totalContainer: {
      backgroundColor: Colors.Naranja,
      padding: "20px",
      borderRadius: "8px",
      marginTop: "1rem",
      color: Colors.Blanco,
    },
    infoSection: {
      backgroundColor: Colors.GrisAzuladoOscuro,
      padding: "16px",
      borderRadius: "8px",
      marginBottom: "1.5rem",
      border: `1px solid ${Colors.Naranja}33`,
    },
    infoRow: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
      gap: "10px",
    },
    infoLabel: {
      color: Colors.Naranja,
      fontWeight: "bold",
      minWidth: "100px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "14px",
    },
    infoValue: {
      color: Colors.Negro,
      fontSize: "15px",
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
                <span><FaStore /></span>
                {" " + pedido.puesto.nombreCarro}
              </h5>
              <h5 style={styles.cardSubTitle}>
                <span><FaCalendarAlt /></span>
                {" " + new Date(pedido.fecha).toLocaleDateString("es")}
              </h5>

              <h5 style={styles.cardSubTitle}>
                <span><FaUser /></span>{" "}
                {pedido?.consumidore?.nombre +
                  ", " +
                  pedido?.consumidore?.apellido || "Alberto"}
              </h5>

              <h5 style={styles.cardSubTitle}>
                <span><FaMapMarkedAlt /></span>{" "}
                {pedido?.puntoEncuentro?.nombre || "Punto de encuentro 3"}
              </h5>

              <h5 style={styles.price}>${pedido.total.toFixed(2)}</h5>
              <p style={styles.cardEstado}>{traducirEstado(estadoLocal)}</p>
            </div>
          </div>
          <hr style={styles.separator} />
          <div style={styles.buttonGroup}>
              {mostrarBotonInfo && (
              <button
                style={styles.buttonInfo}
                onClick={() => setModalDetalleVisible(true)}
              >
                <span><FaInfoCircle /></span> Detalle
              </button>
            )}
            {mostrarBotonMapa && (
              <button
                style={styles.buttonMap}
                onClick={() => setModalMapaVisible(true)}
              >
                <span><FaMapMarkedAlt /></span> Ver Mapa
              </button>
            )}
            {mostrarBotonEntregar && (
              <button
                style={styles.buttonSolicitar}
                onClick={() => setModalEntregarVisible(true)}
              >
                <span><FaCheckCircle /></span> Entregar
              </button>
            )}
          </div>
        </div>
      </div>
      {modalDetalleVisible && (
        <div style={styles.dialogContainer}>
          <div style={styles.dialogContent}>
            <h2 style={styles.dialogTitle}>Detalle del Pedido #{pedido?.id}</h2>
            
            {/* Sección de Información */}
            <div style={styles.infoSection}>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>
                  <FaStore /> Puesto:
                </div>
                <div style={styles.infoValue}>{pedido.puesto.nombreCarro}</div>
              </div>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>
                  <FaUser /> Cliente:
                </div>
                <div style={styles.infoValue}>{pedido?.consumidore?.nombre} {pedido?.consumidore?.apellido}</div>
              </div>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>
                  <FaCalendarAlt /> Fecha:
                </div>
                <div style={styles.infoValue}>
                  {new Date(pedido.fecha).toLocaleDateString("es", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>
                  {getIconoEstado(estadoLocal)} Estado:
                </div>
                <div style={{...styles.infoValue, color: Colors.Naranja, fontWeight: "bold"}}>
                  {traducirEstado(estadoLocal)}
                </div>
              </div>
            </div>

            {/* Tabla de Productos */}
            <div style={{overflowX: "auto"}}>
              <table style={styles.detailsTable}>
                <thead>
                  <tr>
                    <th style={styles.tableHeaderCell}>Producto</th>
                    <th style={styles.tableHeaderCell}>Cantidad</th>
                    <th style={styles.tableHeaderCell}>Precio Unit.</th>
                    <th style={styles.tableHeaderCell}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido?.detalles?.map((detalle, index) => (
                    <tr key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlternate}>
                      <td style={styles.tableCell}>{detalle.producto.nombre}</td>
                      <td style={styles.tableCell}>
                        <span style={{backgroundColor: Colors.Naranja, color: Colors.Blanco, padding: "4px 8px", borderRadius: "4px", fontWeight: "bold"}}>
                          {detalle.cantidad}
                        </span>
                      </td>
                      <td style={styles.tableCell}>${Number(detalle.producto.precio).toFixed(2)}</td>
                      <td style={{...styles.tableCell, fontWeight: "bold", color: Colors.Naranja}}>
                        ${(detalle.cantidad * detalle.producto.precio).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div style={styles.totalContainer}>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                <span style={{fontSize: "18px", fontWeight: "bold"}}>Total a Pagar:</span>
                <span style={{fontSize: "28px", fontWeight: "bold"}}>
                  ${pedido?.total?.toFixed(2)}
                </span>
              </div>
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
            <div style={styles.infoSection}>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>
                  <FaStore /> Puesto:
                </div>
                <div style={styles.infoValue}>{pedido.puesto.nombreCarro}</div>
              </div>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>
                  <FaCalendarAlt /> Fecha:
                </div>
                <div style={styles.infoValue}>
                  {new Date(pedido.fecha).toLocaleDateString("es")}
                </div>
              </div>
            </div>
            <div style={{width: "50%", margin: "0 auto"}}>
              <label style={styles.ratingLabel} htmlFor="codigo">Código de entrega</label>
              <input
                type="text"
                id="codigo"
                style={styles.codigoInput}
                onChange={(e) => setCodigo(e.target.value)}
              />
            </div>

            <div style={styles.dialogButtons}>
              <button
                style={{ ...styles.dialogButton, ...styles.cancelButton }}
                onClick={() => setModalEntregarVisible(false)}
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

      {modalMapaVisible && (
        <div style={styles.dialogContainer}>
          <div style={styles.dialogContent}>
            <h2 style={styles.dialogTitle}>Ubicación del Punto de Encuentro</h2>
            <div style={styles.infoSection}>
              <div style={styles.infoRow}>
                <div style={styles.infoLabel}>
                  <FaMapMarkedAlt /> Punto:
                </div>
                <div style={styles.infoValue}>{pedido?.puntoEncuentro?.nombre}</div>
              </div>
            </div>
            <div style={{width: "100%", height: "300px", marginBottom: "1rem"}}>
              <iframe
                title="mapa-punto"
                width="100%"
                height="100%"
                frameBorder="0"
                style={{border:0}}
                src={
                  pedido?.puntoEncuentro?.latitud && pedido?.puntoEncuentro?.longitud
                    ? `https://www.google.com/maps?q=${pedido.puntoEncuentro.latitud},${pedido.puntoEncuentro.longitud}&z=15&output=embed`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pedido?.puntoEncuentro?.nombre || "")}`
                }
                allowFullScreen
              ></iframe>
            </div>
            <div style={styles.dialogButtons}>
              <button
                style={{ ...styles.dialogButton, ...styles.confirmButton }}
                onClick={() => setModalMapaVisible(false)}
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

export default PedidoRepartidor;
