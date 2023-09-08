import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../seleccionRegister.module.css";

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

  function tieneNumeros(cadena) {
    return !isNaN(Number(cadena));
  }

  function tieneLetras(cadena) {
    const regex = /[a-zA-Z]/;
    return regex.test(cadena);
  }

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
    <div className={`${styles.background} ${styles.container} vh-100`}>
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-md-4">
          <div className={`${styles.card} card`}>
            <div className={`${styles.cardheader} card-header`}>
              <h2 className={`${styles.h2} text-center`} style={{color:"white"}}>Datos Repartidor</h2>
            </div>
            <div className={`${styles['card-body']} card-body d-flex flex-column align-items-center`}>
              <form onSubmit={handleSubmit}>
                <div className={`${styles['form-check']} form-check mb-4`}>
                  <input
                    type="checkbox"
                    className={`${styles['form-check-input']} form-check-input`}
                    id="confirmacionMayorDeEdad"
                    name="confirmacionMayorDeEdad"
                    checked={repartidorData.confirmacionMayorDeEdad}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    className={`${styles['form-check-label']} form-check-label`}
                    htmlFor="confirmacionMayorDeEdad"
                  >
                    Confirmo que tengo más de 18 años
                  </label>
                </div>
                <hr style={{color:"white"}} />
                <div className={`d-flex justify-content-between mt-2 ${styles['d-flex']}`}>
                  <button
                    className={`${styles['btn']} btn btn-secondary`}
                    onClick={() => backStep()}
                  >
                    Atrás
                  </button>
                  <button
                    type="submit"
                    className={`${styles['btn']} btn btn-success`}
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
  );
};

export default FormRepartidor;
