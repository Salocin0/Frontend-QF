import { useState, useEffect } from "react";
import useDynamicColors from "../../UseDinamicColors";
import Footer from "../ComponentesGenerales/Footer";
import { toast } from "react-toastify";
import { FaStore, FaCalendarAlt, FaMotorcycle, FaMapMarkedAlt, FaInfoCircle, FaTimesCircle, FaStar, FaPlay, FaHourglassStart, FaCheckCircle, FaTruck, FaBox, FaBan } from "react-icons/fa";

const Pedido = ({ pedido,recargar }) => {
  const Colors = useDynamicColors();
  const [opinion, setOpinion] = useState("");
  const [repartidorRating, setRepartidorRating] = useState(1);
  const [puestoRating, setPuestoRating] = useState(1);
  const [estadoLocal, setEstadoLocal] = useState(pedido.estado);

  // sync when parent reloads
  useEffect(() => {
    setEstadoLocal(pedido.estado);
  }, [pedido.estado]);

  const [modalValoracionVisible, setModalValoracionVisible] = useState(false);
  const [modalCancelarVisible, setModalCancelarVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalMapaVisible, setModalMapaVisible] = useState(false);

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
    // optimistic update
    setEstadoLocal("Cancelado");
    await submitCancelar(pedido.id);
    setModalCancelarVisible(false);
  };

  const handleSolicitar = () => {
    console.log(pedido)
    if(new Date(pedido.fechaPreCompra)>Date.now()){
      toast.error(`Pedido Programado para ${new Date(pedido.fechaPreCompra).toLocaleDateString("es")}. no se puede solicitar`)
    }else{
      toast.success("Pedido Solicitado")
      // optimistic transition to aceptado
      setEstadoLocal("Aceptado");
      submitAceptar(pedido.id)
    }
  //if pedido.fecha
  }

  const submitAceptar = async (idPedido) => {
    // optimistic already applied before call
    const url = `${process.env?.REACT_APP_BACK_URL}pedido/cambiarEstado/${idPedido}/aceptar`;
    try {
      const response = await fetch(url, {
        method: "POST", // Método POST
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log(response);
        setEstadoLocal(pedido.estado); // revert if server fail
      }
      setModalValoracionVisible(false);
      recargar();
    } catch (error) {
      console.error("Error al cancelar el pedido:", error);
      setEstadoLocal(pedido.estado);
    }
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
      setEstadoLocal(pedido.estado);
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
    estadoLocal === "Pendiente" || estadoLocal === "Aceptado";
  const mostrarBotonMapa = estadoLocal === "EnCamino";
  const mostrarBotonValorar = estadoLocal === "Entregado";
  const mostrarBotonSolicitar = estadoLocal === "Precomprado";

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
      backgroundColor: coloresPorEstado[estadoLocal],
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
        modalValoracionVisible ||
        modalCancelarVisible ||
        modalDetalleVisible ||
        modalMapaVisible
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
    // valoración dialog styles
    ratingContainer: {
      marginBottom: "1rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      textAlign: "left",
    },
    ratingLabel: {
      color: Colors.Naranja,
      fontWeight: "bold",
      marginBottom: "4px",
    },
    ratingSelect: {
      width: "100%",
      padding: "8px",
      borderRadius: "4px",
      border: `1px solid ${Colors.Naranja}`,
      backgroundColor: Colors.GrisAzuladoClaro,
      color: Colors.Negro,
      marginBottom: "12px",
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
    textareaContainer: {
      marginBottom: "1rem",
      width: "100%",
    },
    textareaLabel: {
      color: Colors.Naranja,
      fontWeight: "bold",
      marginBottom: "4px",
      display: "block",
    },
    textarea: {
      width: "100%",
      padding: "8px",
      borderRadius: "4px",
      border: `1px solid ${Colors.Naranja}`,
      backgroundColor: Colors.GrisAzuladoClaro,
      color: Colors.Negro,
      resize: "vertical",
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
    tableBody: {
      backgroundColor: Colors.Blanco,
      borderRadius: "0 0 6px 6px",
      overflow: "hidden",
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
              {pedido.estado === "EnCamino" && (
                <h5 style={styles.cardSubTitle}>
                  <span><FaMotorcycle /></span>
                  {" " +
                    pedido?.repartidore?.consumidore?.nombre +
                    ", " +
                    pedido?.repartidore?.consumidore?.apellido || "Alberto"}
                </h5>
              )}
              {pedido.estado === "EnCamino" && (
                <h5 style={styles.cardSubTitle}>
                  <span><FaMapMarkedAlt /></span>
                  {pedido?.puntoEncuentro?.nombre}
                </h5>
              )}

              <h5 style={styles.price}>${pedido.total.toFixed(2)}</h5>
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
                <span><FaInfoCircle /></span> Detalle
              </button>
            )}
            {mostrarBotonDanger && (
              <button
                style={styles.buttonDanger}
                onClick={() => setModalCancelarVisible(true)}
              >
                <span><FaTimesCircle /></span> Cancelar
              </button>
            )}
            {mostrarBotonMapa && (
              <button style={styles.buttonMap} onClick={() => setModalMapaVisible(true)}>
                <span><FaMapMarkedAlt /></span> Ver Mapa
              </button>
            )}
            {mostrarBotonValorar && (
              <button
                style={styles.buttonValorar}
                onClick={() => setModalValoracionVisible(true)}
              >
                <span><FaStar /></span> Valorar
              </button>
            )}
            {mostrarBotonSolicitar && (
              <button style={styles.buttonSolicitar} onClick={() => handleSolicitar()}>
                <span><FaPlay /></span> Solicitar
              </button>
            )}
          </div>
        </div>
      </div>
      {modalCancelarVisible && (
        <div style={styles.dialogContainer}>
          <div style={styles.dialogContent}>
            <h2 style={styles.dialogTitle}>
              Cancelar Pedido
            </h2>
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

      {modalMapaVisible && (
        <div style={styles.dialogContainer}>
          <div style={styles.dialogContent}>
            <h2 style={styles.dialogTitle}>
              Ubicación del Punto de Encuentro
            </h2>
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
      {modalValoracionVisible && (
        <div style={styles.dialogContainer}>
          <div style={styles.dialogContent}>
            <h2 style={styles.dialogTitle}>
              Valoración del Pedido
            </h2>
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
                  {new Date(pedido.fecha).toLocaleDateString("es", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </div>
              </div>
            </div>

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
      <Footer />
    </div>
  );
};

export default Pedido;
