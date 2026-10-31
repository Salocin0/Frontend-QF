import React from "react";
import { Link } from "react-router-dom";
import { FaStar, FaRegClock } from "react-icons/fa";
import imgDefault from "../img/puestoLogoDefault.jpg";
import "./PuestosListado.css";

const PuestoUser = ({ carrito, selectedDay, evento }) => {
  const rating = Number(carrito.estrellas ?? carrito.estrella);
  const time = Number(carrito.tiempo);
  return (
    <article className="qf-stand-card">
      <Link className="qf-stand-link" to={`/productos-puesto/${carrito.id}`} state={{ selectedDay, evento }}>
        <div className="qf-stand-image"><img src={carrito.img || imgDefault} alt="" loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = imgDefault; }} /></div>
        <div className="qf-stand-content">
          <h2>{carrito.nombreCarro}</h2>
          <p className="qf-stand-description">{carrito.tipoNegocio || "Conocé los productos de este puesto."}</p>
          <div className="qf-stand-metrics">
            <span><FaStar aria-hidden="true" /> {Number.isFinite(rating) && rating > 0 ? `${rating.toLocaleString("es-AR", { maximumFractionDigits: 1 })} / 5` : "Sin valoraciones"}</span>
            <span><FaRegClock aria-hidden="true" /> {Number.isFinite(time) && time > 0 ? `${Math.round(time)} min` : "Tiempo a confirmar"}</span>
          </div>
          <div className="qf-stand-footer"><span>Ver productos</span><span aria-hidden="true">→</span></div>
        </div>
      </Link>
    </article>
  );
};
export default PuestoUser;
