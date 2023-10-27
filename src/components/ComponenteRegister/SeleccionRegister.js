import React, { useState } from "react";
import classnames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDolly,
  faShop,
  faUser,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";
import "./../sass/main.scss";

const SeleccionRegister = () => {
  const [selectedType, setSelectedType] = useState("consumidor");

  const handleTypeChange = (type) => {
    setSelectedType(type);
  };

  const handleNextClick = () => {
    if (selectedType) {
      return `/registrarse/${selectedType}`;
    }
  };

  const handleClearSelectionClick = () => {
    setSelectedType("consumidor");
  };

  return (
    <div className="background-prelogin">
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="col-lg-4">
          <div className="card text-center">
            <div className="mt-2 cardheader">
              <h2 style={{ color: "white" }}>Seleccione Perfil</h2>
            </div>
            <div className="card-body">
              <label className="btn btn-outline-primary btn-block btn-lg d-flex align-items-center justify-content-between checkcolor custom-control custom-checkbox">
                <input
                  type="checkbox"
                  name="userType"
                  id="consumidor"
                  autoComplete="off"
                  checked={true}
                  className="custom-control-input"
                  onChange={() => {}}
                />
                <span>Consumidor</span>
                <FontAwesomeIcon icon={faUser} />
              </label>
              <hr style={{ color: "white" }} />
              <div className="btn-group-vertical w-100" role="group">
                <label
                  className={classnames(
                    "btn btn-outline-primary btn-block btn-lg d-flex align-items-center justify-content-between",
                    "radiocheckcolor",
                    "custom-control custom-radio",
                    {
                      active: selectedType === "productor",
                      selected: selectedType === "productor",
                    }
                  )}
                >
                  <input
                    type="radio"
                    name="userType"
                    id="productor"
                    autoComplete="off"
                    onClick={() => handleTypeChange("productor")}
                    checked={selectedType === "productor"}
                    className="custom-control-input"
                    readOnly
                  />
                  <span>Productor</span>
                  <FontAwesomeIcon icon={faBriefcase} />
                </label>
                <label
                  className={classnames(
                    "btn btn-outline-primary btn-block btn-lg d-flex align-items-center justify-content-between",
                    "radiocheckcolor",
                    "custom-control custom-radio",
                    {
                      active: selectedType === "repartidor",
                      selected: selectedType === "repartidor",
                    }
                  )}
                >
                  <input
                    type="radio"
                    name="userType"
                    id="repartidor"
                    autoComplete="off"
                    onClick={() => handleTypeChange("repartidor")}
                    checked={selectedType === "repartidor"}
                    className="custom-control-input"
                    readOnly
                  />
                  <span>Repartidor</span>
                  <FontAwesomeIcon icon={faDolly} />
                </label>
                <label
                  className={classnames(
                    "btn btn-outline-primary btn-block btn-lg d-flex align-items-center justify-content-between",
                    "radiocheckcolor",
                    "custom-control custom-radio",
                    {
                      active: selectedType === "encargado",
                      selected: selectedType === "encargado",
                    }
                  )}
                >
                  <input
                    type="radio"
                    name="userType"
                    id="encargado"
                    autoComplete="off"
                    onClick={() => handleTypeChange("encargado")}
                    checked={selectedType === "encargado"}
                    className="custom-control-input"
                    readOnly
                  />
                  <span>Encargado</span>
                  <FontAwesomeIcon icon={faShop} />
                </label>
              </div>
            </div>
            <div className="d-flex justify-content-between mb-3 mx-3">
              <button
                className="btn btn-secondary btnOutlineSecondary me-2"
                onClick={handleClearSelectionClick}
              >
                Quitar selección
              </button>
              <Link
                to={handleNextClick()}
                style={{ color: "white" }}
                className={classnames(
                  "btn btn-primary",
                  !selectedType && "disabled"
                )}
                disabled={!selectedType}
              >
                Siguiente
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default SeleccionRegister;
