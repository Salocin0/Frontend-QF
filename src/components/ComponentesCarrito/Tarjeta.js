import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";
import DialogWithPaymentSheet from "./DialogWithPatmentSheet";
import { FaTrash } from "react-icons/fa";

const RenderizarTarjeta = ({ productos, recargarComponente, evento }) => {
  console.log(productos);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();
  const [isOpen, setIsOpen] = useState(false);
 
  const quitarDelCarrito = (producto) => {
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);
    headers.append("Content-Type", "application/json")

    const body ={
      fecha:productos[0].fecha,
      eventoId:productos[0].eventoId,
      cantidad:1
    }

    fetch(
      `${process.env?.REACT_APP_BACK_URL}carrito/removeToCart/${productos[0].productoId}`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body)
      }
    )
      .then((response) => response.json())
      .then((data) => {
        toast.success(`-1 ${productos[0].producto.nombre}`);
        recargarComponente();
      })
      .catch((error) => console.log("error.", error));
  };

  const eliminarDelCarrito = (producto) => {
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);
    headers.append("Content-Type", "application/json")
    const body ={
      fecha:productos[0].fecha,
      eventoId:productos[0].eventoId,
      cantidad:1
    }

    fetch(
      `${process.env?.REACT_APP_BACK_URL}carrito/deleteProductToCart/${productos[0].productoId}`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body)
      }
    )
      .then((response) => response.json())
      .then((data) => {
        toast.success(`${productos[0].producto.nombre} eliminado`);
        recargarComponente();
      })
      .catch((error) => console.log("error.", error));
  };

  const agregarAlCarrito = (producto) => {
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);
    headers.append("Content-Type", "application/json")
    const body ={
      fecha:productos[0].fecha,
      eventoId:productos[0].eventoId,
      cantidad:1
    }

    fetch(
      `${process.env?.REACT_APP_BACK_URL}carrito/addToCart/${productos[0].productoId}`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(body),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        toast.success(`+1 ${productos[0].producto.nombre}`);
        recargarComponente();
      })
      .catch((error) => console.log("error.", error));
  };

  const handleCloseCompra = () => {
    setIsOpen(false);
    
    const headers = new Headers();
    headers.append("consumidorid", user.consumidorId);

    const detalles = {
        detalles: productos.map((producto) => ({
            cantidad: producto.cantidad,
            productoId: producto.producto.id,
            precio: producto.producto.precio,
            aderezos: producto.producto.aderezos,
        })),
        consumidorId: user.consumidorId,
        total: calcularTotal(productos)*1.15,
        puestoId: productos[0].producto.puestoId,
        eventoId: productos[0].evento.id,
        precompra: productos[0]?.fecha,
    };

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
            eliminarPedido();
            recargarComponente();
        })
        .catch((error) => console.log("Error al registrar pedido:", error));
};

  const registrarPedido = () => {
    setIsOpen(true);
  };

  const eliminarPedido = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);
    headers.append("Content-Type", "application/json")
    const datos = {fecha:productos[0]?.fecha}
    fetch(
      `${process.env?.REACT_APP_BACK_URL}carrito/deleteProductsToCart/${productos[0]?.producto?.puestoId}`,
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
    console.log(productos[0].eventoId);
    navigate(`/productos-puesto/${productos[0].producto.puestoId}`, { state: { eventoid:productos[0].eventoId||1,selectedDay:productos[0]?.fecha } });
  };

  const calcularTotal = (productos) => {
    const total = productos?.reduce((acc, item) => {
      return acc + item.producto.precio * item.cantidad;
    }, 0);
    return total;
  };

  const styles = {
    card: {
      padding: "12px",
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "8px",
      backgroundColor: Colors.GrisAzuladoClaro,
      margin: "10px auto",
      width: "98%",
      position: "relative",
    },
    cardTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      color: Colors.Naranja,
      paddingBottom: "8px",
    },
    table: {
      width: "100%",
      marginBottom: "16px",
      borderCollapse: "collapse",
    },
    tableHeader: {
      backgroundColor: Colors.GrisAzuladoOscuro,
      textAlign: "center",
      color: Colors.Naranja,
    },
    tableData: {
      textAlign: "center",
      color: Colors.Negro,
    },
    tableActions: {
      textAlign: "center",
    },
    tableExit: {
      textAlign: "end",
      width:"25px"
    },
    button: {
      padding: "6px 12px",
      fontSize: "14px",
      borderRadius: "10px",
      margin: "2px",
      cursor: "pointer",
      border: "none",
    },
    successButton: {
      backgroundColor: Colors.Verde,
      color: Colors.Negro,
      fontWeight: "bold",
      padding: "5px 10px",
    },
    dangerButton: {
      backgroundColor: Colors.Rojo,
      color: Colors.Negro,
      fontWeight: "bold",
      padding: "5px 10px",
    },
    deleteButton: {
      color: Colors.Negro,
      backgroundColor: Colors.GrisAzuladoClaro,
      fontWeight: "bold",
      fontSize: "20px",
      margin: "0px 10px",
    },
    infoButton: {
      backgroundColor: Colors.Info,
      color: Colors.Negro,
      fontWeight: "bold",
      padding: "10px 15px",
      alignItems: "center",
      justifyContent: "left",
      flexDirection: "row",
    },
    cancelButton: {
      marginLeft: "20px",
      alignItems: "center",
      justifyContent: "left",
      flexDirection: "row",
      padding: "10px 15px"
    },
    purchaseButton: {
      marginLeft: "20px",
      alignItems: "center",
      justifyContent: "left",
      flexDirection: "row",
      padding: "10px 15px"
    },
    totalProducto: {
      textAlign: "right",
      fontWeight: "bold",
      color: Colors.Blanco,
      fontSize: "20px",
    },
    comisiones: {
      textAlign: "right",
      fontWeight: "bold",
      color: Colors.Blanco,
      fontSize: "20px",
    },
    total: {
      textAlign: "right",
      fontWeight: "bold",
      color: Colors.Naranja,
      fontSize: "28px",
    },
    divider: {
      color: Colors.Naranja,
      margin: "16px 0",
    },
    actionButtons: {
      textAlign: "right",
    },
    preventaText: {
      fontSize: "16px",
      color: Colors.Blanco,
      display: "flex",
      position: "absolute",
      top: "10px",
      right: "15px",
      padding: "5px 10px",
      borderRadius: "5px",
      backgroundColor: Colors.Naranja,
    },
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const obtenerTextoPreventa = () => {
    const fechaPreventa = productos[0]?.fecha;
    return fechaPreventa
      ? `Preventa para ${new Date(fechaPreventa).toLocaleDateString("es")}`
      : "Compra inmediata";
  };

  return (
    <div key={productos?.puestoId} style={styles.card}>
      <h3 style={styles.cardTitle}>
        Puesto {productos[0]?.producto?.puesto?.nombreCarro} -{" "}
        {productos[0]?.evento?.nombre}
      </h3>
      <span style={styles.preventaText}>{obtenerTextoPreventa()}</span>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.tableData}>Nombre</th>
            <th style={styles.tableData}>Precio</th>
            <th style={styles.tableData}>Cantidad</th>
            <th style={styles.tableData}>Acciones</th>
            <th style={styles.tableData}></th>
          </tr>
        </thead>
        <tbody>
          {productos?.map((item, index) => (
            <tr key={index}>
              <td style={styles.tableData}>{item.producto.nombre}</td>
              <td style={styles.tableData}>${item.producto.precio}</td>
              <td style={styles.tableData}>{item.cantidad}</td>
              <td style={styles.tableActions}>
                <button
                  style={{ ...styles.button, ...styles.dangerButton }}
                  onClick={() => quitarDelCarrito(item)}
                >
                  -1
                </button>
                <button
                  style={{ ...styles.button, ...styles.successButton }}
                  onClick={() => agregarAlCarrito(item)}
                >
                  +1
                </button>
              </td>
              <td style={styles.tableExit}>
                <button
                  style={{ ...styles.button, ...styles.deleteButton }}
                  onClick={() => eliminarDelCarrito(item)}
                >
                  <span><FaTrash /></span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2 style={styles.totalProducto}>Total Productos: ${calcularTotal(productos)}</h2>
      <h2 style={styles.comisiones}>Comision Servicio: ${(calcularTotal(productos)*0.15).toFixed(2)}</h2>
      <h2 style={styles.total}>Total: ${(calcularTotal(productos)*1.15).toFixed(2)}</h2>
      <hr style={styles.divider} />
      <div style={styles.actionButtons}>
        <button
          style={{ ...styles.button, ...styles.infoButton }}
          onClick={() => llevarPuesto()}
        >
          Seguir agregando
        </button>
        <button
          style={{
            ...styles.button,
            ...styles.dangerButton,
            ...styles.cancelButton,
          }}
          onClick={() => eliminarPedido()}
        >
          Eliminar
        </button>
        <button
          style={{
            ...styles.button,
            ...styles.successButton,
            ...styles.purchaseButton,
          }}
          onClick={() => registrarPedido()}
        >
          Comprar
        </button>
      </div>
      <DialogWithPaymentSheet
        isOpen={isOpen}
        onClose={handleCloseDialog}
        amount={calcularTotal(productos)*1.15}
        handleCloseCompra={handleCloseCompra}
      />
    </div>
  );
};

export default RenderizarTarjeta;
