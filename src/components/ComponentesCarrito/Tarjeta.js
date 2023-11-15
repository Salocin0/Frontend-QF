import React, { useState } from 'react';
import { useEffect } from 'react';
import { toast } from "react-toastify";

const RenderizarTarjeta = (productos) => {

    const quitarDelCarrito = (producto) => {
        toast.success("producto descontado del carrito")
      };
    
      const eliminarDelCarrito = (producto) => {
        toast.success("producto eliminado del carrito")
      };

    const agregarAlCarrito = (producto) => {
        toast.success("producto descontado del carrito")
      };

    return (
      <div key={productos[0].producto.puestoId}>
        <h3>Puesto {productos[0].producto.puestoId}</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((item, index) => (
              <tr key={index}>
                <td>{item.producto.nombre}</td>
                <td>${item.producto.precio}</td>
                <td>{item.cantidad}</td>
                <td>
                  <button onClick={() => quitarDelCarrito(item.producto)}>Quitar 1</button>
                  <button onClick={() => agregarAlCarrito(item.producto)}>Agregar 1</button>
                  <button onClick={() => eliminarDelCarrito(item.producto)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  export default RenderizarTarjeta;