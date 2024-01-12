import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const RenderizarTarjeta = ({ productos, recargarComponente }) => {
  console.log(productos[0])
  const navigate = useNavigate();
  const [session, setSession] = useState(null);


  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.error("No session ID found.");
      return;
    }

    fetch(`${process.env?.REACT_APP_BACK_URL}user/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionID: sessionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSession(data.data);
        console.log(data.data);
      })
      .catch((error) => console.error("Error fetching session:", error));
  }, []);

  const quitarDelCarrito = (producto) => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`${process.env?.REACT_APP_BACK_URL}carrito/removeToCart/${producto.id}`, {
      method: "PUT",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(`-1 ${producto.nombre}`);
        recargarComponente();
      })
      .catch((error) => console.log("error.", error));
  };

  const eliminarDelCarrito = (producto) => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`${process.env?.REACT_APP_BACK_URL}carrito/deleteProductToCart/${producto.id}`, {
      method: "PUT",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(`${producto.nombre} eliminado`);
        recargarComponente();
      })
      .catch((error) => console.log("error.", error));
  };

  const agregarAlCarrito = (producto) => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);
    

    fetch(`${process.env?.REACT_APP_BACK_URL}carrito/addToCart/${producto.id}`, {
      method: "PUT",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success(`+1 ${producto.nombre}`);
        recargarComponente();
      })
      .catch((error) => console.log("error.", error));
  };

  const registrarPedido = () => {
    
    const headers = new Headers();
    headers.append("consumidorid", session.consumidorId);
    const detalles = {
      detalles: productos.map(producto => ({
        cantidad: producto.cantidad, 
        productoId: producto.id,
        precio: producto.precio,
      })),
      consumidorId: session.consumidorId,
      total: calcularTotal(productos),
      puestoId: productos[0].puestoId,
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
        eliminarPedido()
        recargarComponente();
      })
      .catch((error) => console.log("error.", error));
  };

  const eliminarPedido = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`${process.env?.REACT_APP_BACK_URL}carrito/deleteProductsToCart/${productos[0].puestoId}`, {
      method: "PUT",
      headers: headers,
    })
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

  return (
    <div key={productos?.puestoId} className="card p-3">
      <h3 className="card-title">Puesto {productos?.puestoId}</h3>
      <table className="card-text">
        <thead className="w-100">
          <tr>
            <th className="col text-center">Nombre</th>
            <th className="col text-center">Precio</th>
            <th className="col text-center">Cantidad</th>
            <th className="col-5 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody  className="w-100">
          {productos?.map((item, index) => (
            <tr key={index}>
              <td className="col text-center">{item.nombre}</td>
              <td className="col text-center">${item.precio}</td>
              <td className="col text-center">{item.cantidad}</td>
              <td className="col text-center">
                <button className="btn btn-sm btn-success m-1" onClick={() => quitarDelCarrito(item)}>Quitar 1</button>
                <button className="btn btn-sm btn-success m-1" onClick={() => agregarAlCarrito(item)}>
                  Agregar 1
                </button>
                <button className="btn btn-sm btn-danger m-1" onClick={() => eliminarDelCarrito(item)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h4 className="text-end card-title">Total: {calcularTotal(productos)}</h4>
      <hr style={{color:"white"}}/>
      <div className="text-end">
        <button className="btn btn-info me-2" onClick={() => llevarPuesto()}>Seguir agregando</button>
        <button className="btn btn-success me-2" onClick={() => registrarPedido()}>Comprar</button>
        <button className="btn btn-danger me-2" onClick={() => eliminarPedido()}>Eliminar</button>
      </div>
    </div>
  );
};

export default RenderizarTarjeta;
