import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDolly, faShop, faUser, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import "./seleccionRegister.css";

const SeleccionRegister = () => {
  const [selectedType, setSelectedType] = useState("consumidor");

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const handleNextClick = () => {
    // Manejar la acción cuando se hace clic en "siguiente"
  };

  const handleClearSelectionClick = () => {
    setSelectedType("consumidor");
  };

  return (
    <div className="background">
      <div className="container d-flex align-items-center justify-content-center vh-100 col-4 offset-4">
        <div className="card cardPerfil text-center">
          <div className="card-header mt-2">
            <h2>Seleccione Perfil</h2>
          </div>
          <div className="card-body">
            <label
              className={`btn btn-outline-primary btn-block btn-lg d-flex align-items-center justify-content-between checkcolor custom-control custom-checkbox`}
            >
              <input
                type="checkbox"
                name="userType"
                id="consumidor"
                autoComplete="off"
                checked={true}
                readOnly
                className="custom-control-input"
              />
              <span>Consumidor</span>
              <FontAwesomeIcon icon={faUser} />
            </label>
            <hr />
            <div className="btn-group-vertical w-100" role="group">
              <label
                className={`btn btn-outline-primary btn-block btn-lg d-flex align-items-center justify-content-between radiocheckcolor custom-control custom-radio ${
                  selectedType === "productor" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="userType"
                  id="productor"
                  autoComplete="off"
                  onClick={() => handleTypeChange("productor")}
                  checked={selectedType === "productor"}
                  className="custom-control-input"
                />
                <span>Productor</span>
                <FontAwesomeIcon icon={faBriefcase} />
              </label>
              <label
                className={`btn btn-outline-primary btn-block btn-lg d-flex align-items-center justify-content-between radiocheckcolor custom-control custom-radio ${
                  selectedType === "repartidor" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="userType"
                  id="repartidor"
                  autoComplete="off"
                  onClick={() => handleTypeChange("repartidor")}
                  checked={selectedType === "repartidor"}
                  className="custom-control-input"
                />
                <span>Repartidor</span>
                <FontAwesomeIcon icon={faDolly} />
              </label>
              <label
                className={`btn btn-outline-primary btn-block btn-lg d-flex align-items-center justify-content-between radiocheckcolor custom-control custom-radio ${
                  selectedType === "encargado" ? "active" : ""
                }`}
              >
                <input
                  type="radio"
                  name="userType"
                  id="encargado"
                  autoComplete="off"
                  onClick={() => handleTypeChange("encargado")}
                  checked={selectedType === "encargado"}
                  className="custom-control-input"
                />
                <span>Encargado</span>
                <FontAwesomeIcon icon={faShop} />
              </label>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-between mb-2">
            <button
              className="btn btn-secondary"
              onClick={handleClearSelectionClick}
            >
              Quitar selección
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNextClick}
              disabled={!selectedType}
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeleccionRegister;
