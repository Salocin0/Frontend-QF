import React, { useState } from "react";
import { toast } from "react-toastify";
import styles from "../seleccionRegister.module.css";

const FormEncargado = ({ nextStep,backStep, handleRegistro }) => {
  const [encargadoData, setEncargadoData] = useState({
    cuit: "",
    razonSocial: "",
    ivaCondicion: "responsable_inscripto",
  });

  const isCuitValid = (cuit) => {
    const regexCuit = /^(20|23|27|30|33)([0-9]{9}|-[0-9]{8}-[0-9]{1})$/g;
    if (!cuit.trim()) {
      return false;
    }
    return regexCuit.test(cuit);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEncargadoData({
      ...encargadoData,
      [name]: value,
    });
  };

  function tieneLetras(cadena) {
    const regex = /[a-zA-Z]/;
    return regex.test(cadena);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isCuitValid(encargadoData.cuit)) {
      toast.error("El CUIT no es válido o está vacío.");
      return;
    }

    if (!encargadoData.razonSocial.trim()) {
      toast.error("razon social no puede estar vacía.");
      return;
    }

    if (tieneLetras(encargadoData.cuit)) {
      toast.error("cuit no puede tener letras.");
      return;
    }
    handleRegistro(encargadoData);
    nextStep();
  };

  return (
    <div className={`${styles.background} ${styles.container} vh-100`}>
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-md-4">
          <div className={`${styles.card} card`}>
            <div className={`${styles.cardheader} card-header`}>
              <h2 className={`${styles.h2} text-center`} style={{color:"white"}}>Datos Encargado</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className={`${styles['form-group']} form-group`}>
                  <label htmlFor="cuit" className={styles.label}>CUIT:</label>
                  <input
                    type="text"
                    name="cuit"
                    value={encargadoData.cuit}
                    onChange={handleChange}
                    className={`${styles.blackwhite}  form-control`}
                    placeholder="Ingrese CUIT"
                    required
                  />
                </div>
                <div className={`${styles['form-group']} form-group`}>
                  <label htmlFor="razonSocial" className={styles.label}>Razón Social:</label>
                  <input
                    type="text"
                    name="razonSocial"
                    value={encargadoData.razonSocial}
                    onChange={handleChange}
                    className={`${styles.blackwhite}  form-control`}
                    placeholder="Ingrese Razón Social"
                    required
                  />
                </div>
                <div className={`${styles['form-group']} form-group`}>
                  <label htmlFor="ivaCondicion" className={styles.label}>
                    Condición frente al IVA:
                  </label>
                  <select
                    className={`${styles.blackwhite}  form-control`}
                    name="ivaCondicion"
                    value={encargadoData.ivaCondicion}
                    onChange={handleChange}
                  >
                    <option value="responsable_inscripto">
                      Responsable Inscripto
                    </option>
                    <option value="monotributista">Monotributista</option>
                  </select>
                </div>
                <hr style={{color:"white"}} />
                <div className={`d-flex justify-content-between mt-2 ${styles['d-flex']}`}>
                  <button
                    className={`${styles['btn']} btn btn-secondary`}
                    onClick={() => backStep()}
                  >
                    Atrás
                  </button>
                  <button type="submit" className={`${styles['btn']} btn btn-success`}>
                    Finalizar
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

export default FormEncargado;
