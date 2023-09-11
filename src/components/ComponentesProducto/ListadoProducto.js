import Sidebar from "../ComponentesGenerales/Sidebar";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import style from "./ListadoProducto.module.css";
import styleback from "./../ComponentesConsumidor/ConsultarUsuario.module.css"

const ListadoProducto = ({}) => {
  const [session, setSession] = useState(null);
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [editProductId, setEditProductId] = useState(null);
  const [editedValues, setEditedValues] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    aderezos:"",
    img: 0,
    estado: 1,
  });

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
          console.log(data.data);
          setProductos(data.data);
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
    console.log(tieneNumeros(producto.producto.nombre))
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
    <div className={`row ${styleback.background}`}>
      <div className="col-2">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className="col-10">
        <div className="d-flex justify-content-center mb-3">
          <h1 className="pt-3" style={{ color: "white" }}>Productos</h1>
        </div>
        <hr style={{ color: "white" }} className="me-4"/>
        <div className="d-flex justify-content-end col-11">
          <Link to={`/registrar-productos/${id}`} className={`btn btn-success`}>
            Nuevo Producto
          </Link>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <div className="col-10 pt-3 h-100">
            <table className={`table ${style.tablerounded} text-center`}>
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Descripción</th>
                  <th scope="col">Aderezos</th>
                  <th scope="col">Precio</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id}>
                    <td className={style.editcell}>
                      {editProductId === producto.id ? (
                        <input
                          type="text"
                          value={editedValues.nombre}
                          onChange={(e) =>
                            setEditedValues({
                              ...editedValues,
                              nombre: e.target.value,
                            })
                          }
                        />
                      ) : (
                        producto.nombre
                      )}
                    </td>
                    <td className={style.editcell}>
                      {editProductId === producto.id ? (
                        <input
                          type="text"
                          value={editedValues.descripcion}
                          onChange={(e) =>
                            setEditedValues({
                              ...editedValues,
                              descripcion: e.target.value,
                            })
                          }
                        />
                      ) : (
                        producto.descripcion
                      )}
                    </td>
                    <td className={style.editcell}>
                      {editProductId === producto.id ? (
                        <input
                          type="text"
                          value={editedValues.aderezos}
                          onChange={(e) =>
                            setEditedValues({
                              ...editedValues,
                              aderezos: e.target.value,
                            })
                          }
                        />
                      ) : (
                        producto.aderezos
                      )}
                    </td>
                    <td className={style.editcell}>
                      {editProductId === producto.id ? (
                        <input
                          type="number"
                          value={editedValues.precio}
                          onChange={(e) =>
                            setEditedValues({
                              ...editedValues,
                              precio: e.target.value,
                            })
                          }
                        />
                      ) : (
                        `$${producto.precio}`
                      )}
                    </td>
                    <td className={style.editcell}>
                      {editProductId === producto.id ? (
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => onSave(producto.id)}
                        >
                          Guardar
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onEdit(producto.id)}
                        >
                          Modificar
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => onDelete(producto.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListadoProducto;
