import React from "react";
import Sidebar from "../ComponentesGenerales/Sidebar";

const ListadoProducto = ({ onDelete, onEdit, onAddProduct }) => {
  // Producto de prueba hardcodeado
  const productoPrueba = {
    id: 1,
    nombre: "Producto de Prueba",
    descripcion: "Descripción del producto de prueba",
    precio: 19.99,
  };

  return (
    <div className="row">
      <div className="col-2">
        <Sidebar />
      </div>
      <div className="col-10">
        <div className="d-flex justify-content-between mb-3">
          <h1></h1>
          <button
            className="btn btn-success"
            onClick={() => onAddProduct(productoPrueba)}
          >
            Nuevo Producto
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Descripción</th>
              <th scope="col">Precio</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Mostramos el producto de prueba */}
            <tr key={productoPrueba.id}>
              <td>{productoPrueba.nombre}</td>
              <td>{productoPrueba.descripcion}</td>
              <td>${productoPrueba.precio}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onEdit(productoPrueba.id)}
                >
                  Modificar
                </button>
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={() => onDelete(productoPrueba.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListadoProducto;
