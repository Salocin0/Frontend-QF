import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Producto from "./Producto";
import "./../sass/main.scss";

const ListadoProducto = ({ carrito }) => {
  const [session, setSession] = useState(null);
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [editProductId, setEditProductId] = useState(null);
  const [rows, setRows] = useState([]);
  const [carritos, setCarritos] = useState([]);

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

      fetch("http://localhost:8000/producto", {
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
/*
  useEffect(() => {
    if (session) {
      const headers = new Headers();
      headers.append("ConsumidorId", session.consumidorId);

      fetch("http://localhost:8000/puesto", {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setCarritos(data.data);
          const totalCarritos = Math.ceil(data.data.length / 4) * 4;
          const carritosConNulos = [
            ...data.data,
            ...Array(totalCarritos - data.data.length).fill(null),
          ];

          const generatedRows = [];
          for (let i = 0; i < carritosConNulos.length; i += 4) {
            const row = carritosConNulos.slice(i, i + 4);
            generatedRows.push(row);
          }
          setRows(generatedRows);
        })
        .catch((error) => console.log("No existen carritos."));
    }
  }, [session, recargar]);
*/
  const onDelete = (productId) => {
    fetch(`http://localhost:8000/producto/${productId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Producto eliminado con éxito");

        setRecargar(+1);
      })
      .catch((error) => toast.error("Error al eliminar el producto"));
  };

  const onEdit = (productId) => {
    setEditProductId(productId);

    const productToEdit = productos.find(
      (producto) => producto.id === productId
    );
    if (productToEdit) {
      setEditedValues({
        nombre: productToEdit.nombre,
        descripcion: productToEdit.descripcion,
        precio: productToEdit.precio,
        aderezos: productToEdit.aderezos,
        img: productToEdit.img,
        estado: productToEdit.estado,
      });
    }
  };

  const onSave = (productId) => {
    const producto = {
      producto: {
        nombre: editedValues.nombre,
        descripcion: editedValues.descripcion,
        aderezos: editedValues.aderezos,
        img: editedValues.img,
        precio: editedValues.precio,
      },
    };

    console.log(JSON.stringify(producto));
    fetch(`http://localhost:8000/producto/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(producto),
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Producto actualizado con éxito");
        setEditProductId(null);
        setRecargar((prev) => prev + 1);
      })
      .catch((error) => toast.error("Error al actualizar el producto"));
  };

  return (
    <div>
      <div className={`row m-0 mainFormEventos`}>
        <div className="col-2 p-0">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className={`col-10`}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="pt-3" style={{ color: "white" }}>
              Productos
            </h1>
            <Link
              //to={`/listado-productos-deshabilitados/${carrito.id}`}
              to={`/listado-productos-deshabilitados/${id}`}

              className="btn btn-secondary"
            >
              Productos Deshabilitados
            </Link>

          </div>
          <hr style={{ color: "white" }} className="me-4" />
          <div className="d-flex justify-content-end col-11">
            <Link
              to={`/registrar-productos/${id}`}
              className={`btn btn-success btn-lg btnfloating`}
            >
              <i className="bi bi-plus-lg"></i> Agregar Producto
            </Link>
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <div className="pt-3 pb-4 h-100 w-100">
              {Array.isArray(productos) && productos.length > 0 ? (
                rows.length > 0 &&
                rows.map((row, rowIndex) => (
                  <div key={rowIndex} className={`row `}>
                    {row.map((producto, index) => (
                      <div
                        key={index}
                        className={`colmd3 pb-4`}
                      >
                        {producto !== null ? (
                          <Producto
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
                <h2 className={"tituloSeccionNegativo"}>
                  No tenes ningun producto asociado a este carrito.
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

export default ListadoProducto;
