import React, { useState, useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../ComponentesGenerales/UserContext";
import DialogWithPaymentSheet from "./DialogWithPatmentSheet";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaArrowRight, FaCheckCircle } from "react-icons/fa";

const RenderizarTarjeta = ({ productos, recargarComponente, evento }) => {
  console.log(productos);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [productosLocal, setProductosLocal] = useState(productos);
  const cardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const isNarrow = cardWidth < 850;
  const isProductNarrow = cardWidth < 550;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setCardWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setProductosLocal(productos);
  }, [productos]);
 
  const quitarDelCarrito = (producto) => {
    // Guardar estado anterior para revertir si hay error
    const estadoAnterior = productosLocal;
    
    // Actualizar estado local inmediatamente
    const productoIndex = productosLocal.findIndex(p => p.producto.id === producto.producto.id);
    if (productoIndex === -1 || productosLocal[productoIndex].cantidad <= 0) return;
    
    const productoOriginal = productosLocal[productoIndex];
    const nuevosCantidad = productoOriginal.cantidad - 1;
    
    const productosActualizados = [...productosLocal];
    productosActualizados[productoIndex] = {
      ...productoOriginal,
      cantidad: nuevosCantidad,
    };
    setProductosLocal(productosActualizados);
    toast.success(`-1 ${producto.producto.nombre}`);

    // Sincronizar con el servidor en background
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);
    headers.append("Content-Type", "application/json")

    const body = {
      fecha: productosLocal[0].fecha,
      eventoId: productosLocal[0].eventoId,
      cantidad: 1
    }

    fetch(
      `${process.env?.REACT_APP_BACK_URL}carrito/removeToCart/${productosLocal[0].productoId}`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body)
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Éxito silencioso
      })
      .catch((error) => {
        console.log("Error al quitar del carrito:", error);
        // Revertir cambio local en caso de error
        setProductosLocal(estadoAnterior);
        toast.error(`Error al quitar ${producto.producto.nombre}`);
      });
  };

  const eliminarDelCarrito = (producto) => {
    // Actualizar estado local inmediatamente
    const productoIndex = productosLocal.findIndex(p => p.producto.id === producto.producto.id);
    if (productoIndex === -1) return;
    
    const productosActualizados = productosLocal.filter((_, idx) => idx !== productoIndex);
    setProductosLocal(productosActualizados);
    toast.success(`${producto.producto.nombre} eliminado`);

    // Sincronizar con el servidor en background
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);
    headers.append("Content-Type", "application/json")
    const body = {
      fecha: producto.fecha || productosLocal[0]?.fecha,
      eventoId: producto.eventoId || productosLocal[0]?.eventoId,
    }

    fetch(
      `${process.env?.REACT_APP_BACK_URL}carrito/deleteProductToCart/${producto.producto.id}`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Éxito silencioso pero recargamos para sincronizar totalmente
        recargarComponente();
      })
      .catch((error) => {
        console.log("Error al eliminar del carrito:", error);
        // Revertir cambio local en caso de error
        setProductosLocal(productos);
        toast.error(`Error al eliminar ${producto.producto.nombre}`);
      });
  };

  const agregarAlCarrito = (producto) => {
    // Guardar estado anterior para revertir si hay error
    const estadoAnterior = productosLocal;
    
    // Actualizar estado local inmediatamente
    const productoIndex = productosLocal.findIndex(p => p.producto.id === producto.producto.id);
    if (productoIndex === -1) return;
    
    const productoOriginal = productosLocal[productoIndex];
    const nuevosCantidad = productoOriginal.cantidad + 1;
    
    const productosActualizados = [...productosLocal];
    productosActualizados[productoIndex] = {
      ...productoOriginal,
      cantidad: nuevosCantidad,
    };
    setProductosLocal(productosActualizados);
    toast.success(`+1 ${producto.producto.nombre}`);

    // Sincronizar con el servidor en background
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);
    headers.append("Content-Type", "application/json")
    const body = {
      fecha: productosLocal[0].fecha,
      eventoId: productosLocal[0].eventoId,
      cantidad: 1
    }

    fetch(
      `${process.env?.REACT_APP_BACK_URL}carrito/addToCart/${productosLocal[0].productoId}`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        // Éxito silencioso
      })
      .catch((error) => {
        console.log("Error al agregar al carrito:", error);
        // Revertir cambio local en caso de error
        setProductosLocal(estadoAnterior);
        toast.error(`Error al agregar ${producto.producto.nombre}`);
      });
  };

  const handleCloseCompra = () => {
    setIsOpen(false);
    // Limpiar carrito inmediatamente para mejor UX
    eliminarPedido();
    recargarComponente();
    
    // Registrar pedido en background SIN bloquear la UI
    const headers = new Headers();
    headers.append("consumidorid", user.consumidorId);

    const detalles = {
        detalles: productosLocal.map((producto) => ({
            cantidad: producto.cantidad,
            productoId: producto.producto.id,
            precio: producto.producto.precio,
            aderezos: producto.producto.aderezos,
        })),
        consumidorId: user.consumidorId,
        total: calcularTotal(productosLocal)*1.15,
        puestoId: productosLocal[0].producto.puestoId,
        eventoId: productosLocal[0].evento.id,
        precompra: productosLocal[0]?.fecha,
    };

    // Enviar en background sin await
    fetch(`${process.env?.REACT_APP_BACK_URL}pedido`, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(detalles),
    })
        .then((response) => response.json())
        .then((data) => {
            toast.success("Pedido registrado");
            console.log("Pedido guardado en servidor:", data);
        })
        .catch((error) => console.error("Error al registrar pedido en servidor:", error));
};

  const registrarPedido = () => {
    setIsOpen(true);
  };

  const eliminarPedido = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);
    headers.append("Content-Type", "application/json")
    const datos = {fecha:productosLocal[0]?.fecha}
    fetch(
      `${process.env?.REACT_APP_BACK_URL}carrito/deleteProductsToCart/${productosLocal[0]?.producto?.puestoId}`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(datos),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        recargarComponente();
      })
      .catch((error) => console.log("error.", error));
  };

  const llevarPuesto = () => {
    console.log(productosLocal[0].eventoId);
    navigate(`/productos-puesto/${productosLocal[0].producto.puestoId}`, { state: { eventoid:productosLocal[0].eventoId||1,selectedDay:productosLocal[0]?.fecha } });
  };

  const calcularTotal = (productos) => {
    const total = productos?.reduce((acc, item) => {
      return acc + item.producto.precio * item.cantidad;
    }, 0);
    return total;
  };

  const styles = {
    card: {
      border: `2px solid var(--qf-naranja)`,
      borderRadius: "12px",
      backgroundColor: "var(--qf-bg-secondary)",
      margin: "15px 0",
      padding: "16px",
      width: "100%",
      position: "relative",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
      display: "flex",
      flexDirection: "column",
    },
    cardHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      paddingBottom: "15px",
      borderBottom: `2px solid var(--qf-naranja)`,
    },
    cardTitle: {
      fontSize: "22px",
      fontWeight: "bold",
      color: "var(--qf-text-white)",
      WebkitTextFillColor: "var(--qf-text-white)",
      margin: 0,
    },
    preventaText: {
      fontSize: "13px",
      color: "var(--qf-text-white)",
      display: "inline-flex",
      alignItems: "center",
      padding: "6px 12px",
      borderRadius: "25px",
      backgroundColor: "var(--qf-naranja)",
      fontWeight: "bold",
      whiteSpace: "nowrap",
    },
    contentWrapper: {
      display: "flex",
      gap: "20px",
    },
    leftSection: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      maxHeight: "500px",
      overflowY: "auto",
      paddingRight: "10px",
    },
    productsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    productCard: {
      display: "flex",
      gap: "15px",
      padding: "15px",
      backgroundColor: "var(--qf-bg-main)",
      borderRadius: "10px",
      alignItems: "center",
      transition: "all 0.3s ease",
      border: `1px solid var(--qf-naranja)33`,
    },
    productImage: {
      width: "100px",
      height: "100px",
      borderRadius: "8px",
      objectFit: "cover",
      border: `2px solid var(--qf-naranja)`,
      backgroundColor: "var(--qf-text-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "40px",
      color: "var(--qf-naranja)",
      flexShrink: 0,
    },
    productInfo: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    productName: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "var(--qf-text-primary)",
    },
    productPrice: {
      fontSize: "18px",
      fontWeight: "bold",
      color: "var(--qf-naranja)",
    },
    productControls: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      justifyContent: "flex-end",
      flexShrink: 0,
    },
    quantityControl: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      backgroundColor: "var(--qf-naranja)",
      borderRadius: "8px",
      padding: "5px 10px",
    },
    quantityButton: {
      backgroundColor: "transparent",
      border: "none",
      color: "var(--qf-text-white)",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      padding: "2px 6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
    },
    quantity: {
      color: "var(--qf-text-white)",
      fontWeight: "bold",
      minWidth: "30px",
      textAlign: "center",
    },
    deleteButton: {
      backgroundColor: "var(--qf-rojo)",
      color: "var(--qf-text-primary)",
      border: "none",
      borderRadius: "6px",
      padding: "8px 10px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "bold",
      display: "flex",
      alignItems: "center",
      gap: "6px",
      transition: "all 0.2s ease",
    },
    rightSection: {
      width: "320px",
      backgroundColor: "var(--qf-bg-main)",
      borderRadius: "10px",
      padding: "20px",
      borderLeft: `4px solid var(--qf-naranja)`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
      fontSize: "14px",
    },
    summaryLabel: {
      color: "var(--qf-text-primary)",
      fontWeight: "bold",
    },
    summaryValue: {
      color: "var(--qf-naranja)",
      fontWeight: "bold",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "15px",
      paddingTop: "15px",
      borderTop: `2px solid var(--qf-naranja)`,
      fontSize: "22px",
    },
    totalLabel: {
      color: "var(--qf-text-primary)",
      fontWeight: "bold",
    },
    totalAmount: {
      color: "var(--qf-naranja)",
      fontWeight: "bold",
    },
    actionButtons: {
      display: "flex",
      gap: "8px",
      flexDirection: "column",
      marginTop: "15px",
    },
    button: {
      padding: "10px 16px",
      fontSize: "13px",
      borderRadius: "8px",
      border: "none",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      transition: "all 0.2s ease",
      width: "100%",
    },
    continueBtn: {
      backgroundColor: "var(--qf-info)",
      color: "var(--qf-text-white)",
    },
    deleteBtn: {
      backgroundColor: "var(--qf-rojo)",
      color: "var(--qf-text-primary)",
      fontSize: "12px",
      padding: "8px 12px",
    },
    buyBtn: {
      backgroundColor: "var(--qf-green)",
      color: "var(--qf-text-white)",
      fontSize: "15px",
      padding: "12px 16px",
      order: -1,
    },
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const obtenerTextoPreventa = () => {
    const fechaPreventa = productosLocal[0]?.fecha;
    return fechaPreventa
      ? `Preventa para ${new Date(fechaPreventa).toLocaleDateString("es")}`
      : "Compra inmediata";
  };

  return (
      <div ref={cardRef} key={productosLocal?.puestoId} style={styles.card}>
      <div style={styles.cardHeader}>
        <p style={styles.cardTitle}>
          {productosLocal[0]?.producto?.puesto?.nombreCarro} - {productosLocal[0]?.evento?.nombre}
        </p>
        <span style={styles.preventaText}>
          {obtenerTextoPreventa()}
        </span>
      </div>

      <div style={{ ...styles.contentWrapper, flexDirection: isNarrow ? "column" : "row" }} data-testid="cart-content-wrapper">
        {/* Sección izquierda: Productos */}
        <div style={styles.leftSection}>
          <div style={styles.productsContainer}>
            {productosLocal?.map((item, index) => (
              <div key={index} style={{ ...styles.productCard, flexDirection: isProductNarrow ? "column" : "row" }} data-testid="cart-product-card">
                {/* Imagen del producto */}
                <div style={{ ...styles.productImage, width: isProductNarrow ? "100%" : "100px", height: isProductNarrow ? "140px" : "100px" }}>
                  {item.producto.img ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "6px",
                        backgroundImage: `url(${item.producto.img})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : (
                    <div style={{ fontSize: "30px", color: "var(--qf-naranja)" }}>—</div>
                  )}
                </div>

                {/* Información del producto */}
                <div style={styles.productInfo}>
                  <div style={styles.productName}>
                    {item.producto.nombre}
                  </div>
                  <div style={styles.productPrice}>
                    ${item.producto.precio} c/u
                  </div>
                </div>

                {/* Controles */}
                <div style={{ ...styles.productControls, justifyContent: isProductNarrow ? "center" : "flex-end", width: isProductNarrow ? "100%" : "auto" }}>
                  <div style={styles.quantityControl}>
                    <button
                      style={styles.quantityButton}
                      onClick={() => quitarDelCarrito(item)}
                      title="Disminuir cantidad"
                    >
                      <FaMinus />
                    </button>
                    <span style={styles.quantity}>{item.cantidad}</span>
                    <button
                      style={styles.quantityButton}
                      onClick={() => agregarAlCarrito(item)}
                      title="Aumentar cantidad"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    style={styles.deleteButton}
                    onClick={() => eliminarDelCarrito(item)}
                    title="Eliminar del carrito"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección derecha: Resumen y botones */}
        <div style={{ ...styles.rightSection, width: isNarrow ? "100%" : "320px" }} data-testid="cart-right-section">
          <div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Subtotal:</span>
              <span style={styles.summaryValue}>${calcularTotal(productosLocal)?.toFixed(2)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Comisión (15%):</span>
              <span style={styles.summaryValue}>${(calcularTotal(productosLocal) * 0.15)?.toFixed(2)}</span>
            </div>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total:</span>
              <span style={styles.totalAmount}>${(calcularTotal(productosLocal) * 1.15)?.toFixed(2)}</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div style={styles.actionButtons}>
            <button
              style={{ ...styles.button, ...styles.buyBtn }}
              onClick={() => registrarPedido()}
            >
              <FaCheckCircle /> Comprar
            </button>
            <button
              style={{ ...styles.button, ...styles.continueBtn }}
              onClick={() => llevarPuesto()}
            >
              <FaArrowRight /> Seguir agregando
            </button>
            <button
              style={{ ...styles.button, ...styles.deleteBtn }}
              onClick={() => eliminarPedido()}
            >
              <FaTrash /> Eliminar
            </button>
          </div>
        </div>
      </div>

      <DialogWithPaymentSheet
        isOpen={isOpen}
        onClose={handleCloseDialog}
        amount={calcularTotal(productosLocal) * 1.15}
        handleCloseCompra={handleCloseCompra}
      />
    </div>
  );
};

export default RenderizarTarjeta;
