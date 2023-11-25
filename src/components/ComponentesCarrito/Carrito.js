import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import RenderizarTarjeta from "./Tarjeta";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Footer from "../ComponentesGenerales/Footer";

const Carrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [session, setSession] = useState(null);
  const [recargar, setRecargar] = useState(0);
  const [productos, setProductos] = useState([]);

  const recargarComponente = () => {
    setRecargar((prevRecargar) => prevRecargar + 1);
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
          if (data.data) {
            setCarrito(data.data);
            setProductos(data.data.productos);
          } else {
            setCarrito([]);
            setProductos([]);
          }
        })
        .catch((error) => console.log("No existen carritos.", error));
    }
  }, [session, recargar]);

  const agruparProductosPorPuesto = (productos) => {
    const productosAgrupados = {};
    productos?.forEach((item) => {
      const puestoId = item.puestoId;
      if (!productosAgrupados[puestoId]) {
        productosAgrupados[puestoId] = [];
      }
      productosAgrupados[puestoId].push(item);
    });
    return productosAgrupados;
  };

  const productosAgrupados = agruparProductosPorPuesto(productos);

  return (
    <div>
      <div className={`row m-0 mainFormEventos`}>
        <div className="col-2 p-0">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className={`col-10`}>
          <div className="d-flex justify-content-center mb-3 tituloSeccion">
            <h1 className="pt-2">Carrito</h1>
          </div>
          <hr style={{ color: "#F7B813" }} />
          <div className="d-flex align-items-center justify-content-center">
            <div className="pt-2 pb-4 h-100 w-100">
              {Object.values(productosAgrupados).length > 0 ? (
                Object.values(productosAgrupados).map((productos, index) => (
                  <RenderizarTarjeta
                    key={index}
                    productos={productos}
                    recargarComponente={recargarComponente}
                  />
                ))
              ) : (
                <h2 className={"tituloSeccionNegativo"}>
                  No hay productos en el carrito
                </h2>
              )}
            </div>
            <div>
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
