import banner from "../ComponentesProducto/banner.jpg";
import imagenProducto from "../ComponentesProducto/f1.png";
//import './ListadoProducto.css';
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import styleback from "./../ComponentesConsumidor/ConsultarUsuario.module.css";
import Producto from "./Producto";
import styleProducto from "./producto.module.css";
import Footer from "../ComponentesGenerales/Footer";
import ProductoUser from "./ProductoUser";

const ListadoProductoUser = () => {
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

  function tieneNumeros(cadena) {
    return /\d/.test(cadena);
  }

  function tieneLetras(cadena) {
    const regex = /[a-zA-Z]/;
    return regex.test(cadena);
  }

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
    console.log(tieneNumeros(producto.producto.nombre));
    if (!producto.producto.nombre.trim()) {
      toast.error("Nombre no puede estar vacio");
      return;
    }

    if (tieneNumeros(producto.producto.nombre)) {
      toast.error("El nombre no puede contener números");
      return;
    }

    if (!producto.producto.descripcion.trim()) {
      toast.error("La descripcion no puede estar vacio");
      return;
    }

    if (tieneNumeros(producto.producto.descripcion)) {
      toast.error("La descripcion no puede contener números");
      return;
    }

    if (!producto.producto.aderezos.trim()) {
      toast.error("Los aderezos no puede estar vacio");
      return;
    }

    if (tieneNumeros(producto.producto.aderezos)) {
      toast.error("Los aderezos no puede contener números");
      return;
    }

    if (!producto.producto.precio.toString().trim()) {
      toast.error("El precio no puede estar vacio");
      return;
    }

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
      <div className={`row m-0 ${styleback.background}`}>
        <div className="col-2 p-0">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className={`col-10`}>
          <div
            className="d-flex justify-content-center"
            style={{
              backgroundImage: `url(${banner})`,
              height: "150px",
              backgroundSize: "100%",
              backgroundRepeat: "no-repeat",
            }}
          >
            <h1 className="d-flex align-items-center justify-content-center">
              Borcelle´s Productos
            </h1>
          </div>
          <hr style={{ color: "white" }} className="" />
          <div className="d-flex align-items-center justify-content-center">
            <div className="pt-3 pb-4 h-100">
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
                          <ProductoUser
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

export default ListadoProductoUser;
