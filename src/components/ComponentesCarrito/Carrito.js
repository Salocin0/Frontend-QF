import React, { useState } from 'react';
import { useEffect } from 'react';
import { toast } from "react-toastify";
import RenderizarTarjeta from './Tarjeta';

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [session, setSession] = useState(null);
  const [recargar, setRecargar] = useState(0);

  const recargarComponente = () => {
    setRecargar(+1);
  };

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.error("No session ID found.");
      return;
    }

    fetch("http://localhost:8000/user/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionID: sessionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSession(data.data);
      })
      .catch((error) => console.error("Error fetching session:", error));
  }, []);

  useEffect(() => {
    if (session) {
      const headers = new Headers();
      headers.append("ConsumidorId", session.consumidorId);

      fetch("http://localhost:8000/carrito/estructura", {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setCarrito(data.data);
          console.log(data.data);
        })
        .catch((error) => console.log("No existen carritos.", error));
    }
  }, [session, recargar]);

  

  const calcularTotal = () => {
    return 100
  };

  const agruparProductosPorPuesto = (productos) => {
    const productosAgrupados = {};
    productos.forEach((item) => {
      const puestoId = item.producto.puestoId;
      if (!productosAgrupados[puestoId]) {
        productosAgrupados[puestoId] = [];
      }
      productosAgrupados[puestoId].push(item.producto);
    });
    return productosAgrupados;
  };

  return (
    <div></div>
  );
  
};

export default Carrito;