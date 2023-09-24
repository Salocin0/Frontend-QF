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
import styles from "./seleccionRegister.module.css";

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
    <div className={`${styles.background} row`}>
      <div className="d-flex align-items-center justify-content-center vh-100">
        <div className="col-4">
          <div className={`card ${styles.card} text-center`}>
            <div className={`mt-2 ${styles.cardheader}`}>
              <h2 style={{ color: "white" }}>Seleccione Perfil</h2>
            </div>
            <div className="card-body">
              <label
                className={`btn btn-outline-primary btn-block btn-lg d-flex align-items-center justify-content-between ${styles.checkcolor} custom-control custom-checkbox`}
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
                <span className={styles.placeholder}>Consumidor</span>
                <FontAwesomeIcon icon={faUser} />
              </label>
              <hr style={{ color: "white" }} />
              <div className="btn-group-vertical w-100" role="group">
                <label
                  className={classnames(
                    "btn btn-outline-primary btn-block btn-lg d-flex align-items-center justify-content-between",
                    styles.radiocheckcolor,
                    "custom-control custom-radio",
                    {
                      active: selectedType === "productor",
                      [styles.selected]: selectedType === "productor",
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
                  />
                  <span className={styles.placeholder}>Productor</span>
                  <FontAwesomeIcon icon={faBriefcase} />
                </label>
                <label
                  className={classnames(
                    "btn btn-outline-primary btn-block btn-lg d-flex align-items-center justify-content-between",
                    styles.radiocheckcolor,
                    "custom-control custom-radio",
                    {
                      active: selectedType === "repartidor",
                      [styles.selected]: selectedType === "repartidor",
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
                  />
                  <span className={styles.placeholder}>Repartidor</span>
                  <FontAwesomeIcon icon={faDolly} />
                </label>
                <label
                  className={classnames(
                    "btn btn-outline-primary btn-block btn-lg d-flex align-items-center justify-content-between",
                    styles.radiocheckcolor,
                    "custom-control custom-radio",
                    {
                      active: selectedType === "encargado",
                      [styles.selected]: selectedType === "encargado",
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
                  />
                  <span className={styles.placeholder}>Encargado</span>
                  <FontAwesomeIcon icon={faShop} />
                </label>
              </div>
            </div>
            <div className={`d-flex justify-content-between mb-3 mx-3`}>
              <button
                className={`btn btn-secondary ${styles.btnOutlineSecondary}`}
                onClick={handleClearSelectionClick}
              >
                Quitar selección
              </button>
              <Link
                to={handleNextClick()}
                className={classnames(
                  "btn btn-primary",
                  !selectedType && styles.disabled
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
