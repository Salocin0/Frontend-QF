import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import DialogWithPaymentSheet from "./DialogWithPatmentSheet";

const RenderizarTarjeta = ({ productos, recargarComponente,evento }) => {
  console.log(productos[0]);
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();
  const [isOpen, setIsOpen] = useState(false);
  console.log(productos);
  const quitarDelCarrito = (producto) => {
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);

    fetch(
      `${process.env?.REACT_APP_BACK_URL}carrito/removeToCart/${producto.id}`,
      {
        method: "PUT",
        headers: headers,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        toast.success(`-1 ${producto.nombre}`);
        recargarComponente();
      })
      .catch((error) => console.log("error.", error));
  };

  const eliminarDelCarrito = (producto) => {
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);

    fetch(
      `${process.env?.REACT_APP_BACK_URL}carrito/deleteProductToCart/${producto.id}`,
      {
        method: "PUT",
        headers: headers,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        toast.success(`${producto.nombre} eliminado`);
        recargarComponente();
      })
      .catch((error) => console.log("error.", error));
  };

  const agregarAlCarrito = (producto) => {
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);

    fetch(
      `${process.env?.REACT_APP_BACK_URL}carrito/addToCart/${producto.id}`,
      {
        method: "PUT",
        headers: headers,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        toast.success(`+1 ${producto.nombre}`);
        recargarComponente();
      })
      .catch((error) => console.log("error.", error));
  };

  const handleCloseCompra = () =>{
    setIsOpen(false)
    const headers = new Headers();
    headers.append("consumidorid", user.consumidorId);
    const detalles = {
      detalles: productos.map((producto) => ({
        cantidad: producto.cantidad,
        productoId: producto.id,
        precio: producto.precio,
      })),
      consumidorId: user.consumidorId,
      total: calcularTotal(productos),
      puestoId: productos[0].puestoId,
      precompra: productos[0]?.fecha,
      eventoId:evento.id
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
        toast.success("pedido registrado");
        eliminarPedido();
        recargarComponente();
      })
      .catch((error) => console.log("error.", error));
  }

  const registrarPedido = () => {
    setIsOpen(true)
  };

  const eliminarPedido = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);

    fetch(
      `${process.env?.REACT_APP_BACK_URL}carrito/deleteProductsToCart/${productos[0].puestoId}`,
      {
        method: "PUT",
        headers: headers,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        recargarComponente();
      })
      .catch((error) => console.log("error.", error));
  };

  const llevarPuesto = () => {
    navigate(`/productos-puesto/${productos[0].puestoId}`);
  };

  const calcularTotal = (productos) => {
    const total = productos?.reduce((acc, item) => {
      return acc + item.precio * item.cantidad;
    }, 0);
    return total;
  };

  const styles = {
    card: {
      padding: "16px",
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "8px",
      backgroundColor: Colors.GrisAzuladoClaro,
      margin: "20px",
      marginBottom: "0",
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
      padding: "10px 15px",
    },
    dangerButton: {
      backgroundColor: Colors.Rojo,
      color: Colors.Negro,
      fontWeight: "bold",
      padding: "10px 15px",
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
    },
    purchaseButton: {
      marginLeft: "20px",
      alignItems: "center",
      justifyContent: "left",
      flexDirection: "row",
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
    return fechaPreventa ? `Preventa para ${new Date(fechaPreventa).toLocaleDateString("es")}` : "Compra inmediata";
  };

  return (
    <div key={productos?.puestoId} style={styles.card}>
      <h3 style={styles.cardTitle}>Puesto {productos[0]?.puestoId} - {evento?.nombre}</h3>
      <span style={styles.preventaText}>{obtenerTextoPreventa()}</span>
      <table style={styles.table}>
        <thead>
          <tr style={styles.tableHeader}>
            <th style={styles.tableData}>Nombre</th>
            <th style={styles.tableData}>Precio</th>
            <th style={styles.tableData}>Cantidad</th>
            <th style={styles.tableData}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos?.map((item, index) => (
            <tr key={index}>
              <td style={styles.tableData}>{item.nombre}</td>
              <td style={styles.tableData}>${item.precio}</td>
              <td style={styles.tableData}>{item.cantidad}</td>
              <td style={styles.tableActions}>
                <button
                  style={{ ...styles.button, ...styles.successButton }}
                  onClick={() => quitarDelCarrito(item)}
                >
                  Quitar
                </button>
                <button
                  style={{ ...styles.button, ...styles.successButton }}
                  onClick={() => agregarAlCarrito(item)}
                >
                  Agregar
                </button>
                <button
                  style={{ ...styles.button, ...styles.dangerButton }}
                  onClick={() => eliminarDelCarrito(item)}
                >
                  <FontAwesomeIcon icon={faTrash}></FontAwesomeIcon>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4 style={styles.total}>Total: ${calcularTotal(productos)}</h4>
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
      <DialogWithPaymentSheet isOpen={isOpen} onClose={handleCloseDialog} amount={calcularTotal(productos)} handleCloseCompra={handleCloseCompra} />
    </div>
  );
};

export default RenderizarTarjeta;
