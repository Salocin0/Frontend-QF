import React, { useState } from "react";
import { Link } from "react-router-dom";

const FormRepartidor = ({ nextStep,backStep, handleRegistro }) => {
  const [repartidorData, setRepartidorData] = useState({
    confirmacionMayorDeEdad: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setRepartidorData({
      ...repartidorData,
      [name]: checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (repartidorData.confirmacionMayorDeEdad) {
      handleRegistro(repartidorData);
      nextStep();
    } else {
      alert("Debes confirmar que tienes más de 18 años.");
    }
  };

  return (
    <div className="background">
      <div className="container vh-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h2 className="text-center">Datos Repartidor</h2>
              </div>
              <div className="card-body d-flex flex-column align-items-center">
                <form onSubmit={handleSubmit}>
                  <div className="form-check mb-4">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="confirmacionMayorDeEdad"
                      name="confirmacionMayorDeEdad"
                      checked={repartidorData.confirmacionMayorDeEdad}
                      onChange={handleCheckboxChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="confirmacionMayorDeEdad"
                    >
                      Confirmo que tengo más de 18 años
                    </label>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mt-2">
                    <button
                      className="btn btn-secondary"
                      onClick={() => backStep()}
                    >
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!repartidorData.confirmacionMayorDeEdad}
                    >
                      Finalizado
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormRepartidor;
