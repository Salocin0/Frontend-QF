import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import styleback from "./../ComponentesConsumidor/ConsultarUsuario.module.css";
import ProductoDeshabilitado from "./ProductoDeshabilitado";
import styleProducto from "./producto.module.css";

const ListadoProductoDeshabilitado = ({carrito}) => {
  const [session, setSession] = useState(null);
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [editProductId, setEditProductId] = useState(null);
  const [rows, setRows] = useState([]);
  const [editedValues, setEditedValues] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    aderezos: "",
    img: 0,
    estado: 1,
  });

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
        console.log(data.data.tipoUsuario);
      })
      .catch((error) => console.error("Error fetching session:", error));
  }, []);

  useEffect(() => {
    if (session) {
      const headers = new Headers();
      headers.append("ConsumidorId", session.consumidorId);
      headers.append("puestoId", id);

      fetch(`http://localhost:8000/producto/${carrito.id}/deshabilitados`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setProductos(data.data);
          const totalProductos = Math.ceil(data.data.length / 4) * 4;
          const productosConNulos = [
            ...data.data,
            ...Array(totalProductos - data.data.length).fill(null),
          ];

          const generatedRows = [];
          for (let i = 0; i < productosConNulos.length; i += 4) {
            const row = productosConNulos.slice(i, i + 4);
            generatedRows.push(row);
          }
          setRows(generatedRows);
        })
        .catch((error) => console.log("No existen carritos.", error));
    }
  }, [session, recargar]);






  return (
    <div>
      <div className={`row m-0 ${styleback.background}`}>
        <div className="col-2 p-0">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className={`col-10`}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="pt-3" style={{ color: "white" }}>
              Productos Deshabilitados
            </h1>
            <Link
              to={`/listado-productos/${id}`}
              className="btn btn-secondary"
            >
              Productos Habilitados
            </Link>
          </div>
          <hr style={{ color: "white" }} className="me-4" />

          <div className="d-flex align-items-center justify-content-center">
            <div className="pt-3 pb-4 h-100 w-100">
              {Array.isArray(productos) && productos.length > 0 ? (
                rows.length > 0 &&
                rows.map((row, rowIndex) => (
                  <div key={rowIndex} className={`row ${styleProducto.row}`}>
                    {row.map((producto, index) => (
                      <div
                        key={index}
                        className={`${styleProducto.colmd3} pb-4`}
                      >
                        {producto !== null ? (
                          <ProductoDeshabilitado
                            producto={producto}
                            session={session}
                            idpuesto={id}
                            recargar={recargarComponente}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <h2 className={styleProducto.centeredtext}>
                  No tenes ningun producto deshabilitado en este carrito.
                </h2>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListadoProductoDeshabilitado;
