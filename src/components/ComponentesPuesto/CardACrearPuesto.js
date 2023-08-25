import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Link } from "react-router-dom";
import imgDefault from "../QuickFoodLogo.png";
import './puestos.css'

const CardACrearPuesto = () => {
  return (
    <div className="card shadow-sm">
      <img
        src={imgDefault} 
        className="card-img-top"
        alt="Thumbnail"
      />
      <div className="card-body">
      <h3 className="card-text text-center">Crear Puesto</h3>
        <div className="d-flex justify-content-end">
          <Link to={`/crear-puesto`} className="btn btn-sm btn-primary">
            Nuevo Puesto
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardACrearPuesto;
