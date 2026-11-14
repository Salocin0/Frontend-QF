import React, { useState, useRef } from "react";
import { toast } from "react-toastify";
import productoDefecto from "../img/productoDefecto.png";
import "./ProductosListado.css";

const ProductoUser = ({ producto, user, selectedDay, evento, destacado = false }) => {
  const [adding, setAdding] = useState(false);
  const [cantidad, setCantidad] = useState(1);
  const requestInProgress = useRef(false);
  const handleAddtocart = async () => {
    if (requestInProgress.current) return;
    if (!evento?.id || !user?.consumidorId) {
      toast.error("No se pudo determinar el evento o el usuario. Volvé al listado de eventos e intentá de nuevo.");
      return;
    }
    requestInProgress.current = true;
    setAdding(true);
    try {
      const raw = process.env?.REACT_APP_BACK_URL || "";
      const response = await fetch(`${raw.endsWith("/") ? raw : `${raw}/`}carrito/addToCart/${producto.id}`, {
        method: "PUT", headers: { ConsumidorId: user.consumidorId, "Content-Type": "application/json" },
        body: JSON.stringify({ fecha: selectedDay, eventoId: evento.id, cantidad }),
      });
      if (!response.ok) throw new Error("Error al agregar");
      toast.success(`Se ${cantidad === 1 ? "agregó 1 unidad" : `agregaron ${cantidad} unidades`} al carrito: ${producto.nombre}`);
    } catch (err) {
      toast.error("No pudimos agregar el producto al carrito. Intentá nuevamente.");
    } finally {
      requestInProgress.current = false;
      setAdding(false);
    }
  };
  return (
    <article id={`producto-${producto.id}`} className={`qf-product-card${destacado ? " qf-product-card--destacado" : ""}`}>
      <div className="qf-product-image"><img src={producto.img || productoDefecto} alt="" loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = productoDefecto; }} /></div>
      <div className="qf-product-content">
      <div className="qf-product-info"><h2>{producto.nombre?.trim()}</h2><p>{producto.descripcion}</p>{producto.aderezos && <p className="qf-product-extras">Aderezos: {producto.aderezos}</p>}</div>
      <div className="qf-product-actions">
        <strong className="qf-product-price">{(Number(producto.precio || 0) * cantidad).toLocaleString("es-AR", { style: "currency", currency: "ARS" })}</strong>
        <div className="qf-product-quantity" role="group" aria-label={`Cantidad de ${producto.nombre}`}>
          <button type="button" aria-label="Reducir cantidad" disabled={adding || cantidad === 1} onClick={() => setCantidad((value) => value - 1)}>−</button>
          <output aria-label="Cantidad" aria-live="polite">{cantidad}</output>
          <button type="button" aria-label="Aumentar cantidad" disabled={adding} onClick={() => setCantidad((value) => value + 1)}>+</button>
        </div>
        <button className="qf-product-add" type="button" disabled={adding} aria-busy={adding} onClick={handleAddtocart}>{adding ? "Agregando…" : "Agregar al carrito"}</button>
      </div>
      </div>
    </article>
  );
};
export default ProductoUser;
