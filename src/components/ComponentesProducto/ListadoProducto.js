import Sidebar from "../ComponentesGenerales/Sidebar";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

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
    stock: 0,
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

    const productToEdit = productos.find((producto) => producto.id === productId);
    if (productToEdit) {
      setEditedValues({
        nombre: productToEdit.nombre,
        descripcion: productToEdit.descripcion,
        precio: productToEdit.precio,
        stock: productToEdit.stock,
        img: productToEdit.img,
        estado: productToEdit.estado,  
      });
    }
  };

  const onSave = (productId) => {
    const producto = {
      producto:{
        nombre: editedValues.nombre,
        descripcion: editedValues.descripcion,
        stock: editedValues.stock,
        img: editedValues.img,
        estado: editedValues.estado,
        precio: editedValues.precio,
      }
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
    <div className="row">
      <div className="col-2">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className="col-10">
        <div className="d-flex justify-content-between mb-3">
          <h1 className="text-center">Productos</h1>
        </div>
        <div>
          <Link to={`/registrar-productos/${id}`} className={`btn btn-success`}>
            Nuevo Producto
          </Link>
        </div>
  
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Descripción</th>
              <th scope="col">Stock</th>
              <th scope="col">Imagen</th>
              <th scope="col">Estado</th>
              <th scope="col">Precio</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>
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
                <td>
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
                <td>
                  {editProductId === producto.id ? (
                    <input
                      type="number"
                      value={editedValues.stock}
                      onChange={(e) =>
                        setEditedValues({
                          ...editedValues,
                          stock: e.target.value,
                        })
                      }
                    />
                  ) : (
                    producto.stock
                  )}
                </td>
                <td>
                  {editProductId === producto.id ? (
                    <input
                      type="text"
                      value={editedValues.img}
                      onChange={(e) =>
                        setEditedValues({
                          ...editedValues,
                          img: e.target.value,
                        })
                      }
                    />
                  ) : (
                    producto.img
                  )}
                </td>
                <td>
                  {editProductId === producto.id ? (
                    <input
                      type="text"
                      value={editedValues.estado}
                      onChange={(e) =>
                        setEditedValues({
                          ...editedValues,
                          estado: e.target.value,
                        })
                      }
                    />
                  ) : (
                    producto.estado
                  )}
                </td>
                <td>
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
                <td>
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
  );  
};

export default ListadoProducto;
