import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Link } from "react-router-dom";
import imgDefault from "../QuickFoodLogo.png";
import './puestos.css'

const Puesto = ({ carrito }) => {
  return (
    <Link to={`/card/${carrito.id}`} className="card-link">
    <div className="card shadow-sm">
      <img
        src={carrito.thumbnail || imgDefault}
        className="card-img-top"
        alt="Thumbnail"
      />
      <div className="card-body">
        <h3 className="card-text text-center">{carrito.nombre}</h3>
      </div>
    </div>
    </Link>
  );
};

export default Puesto;
