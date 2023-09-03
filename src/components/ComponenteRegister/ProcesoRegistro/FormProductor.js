import React, { useState } from "react";
import { Link } from "react-router-dom";

const FormProductor = ({ nextStep, backStep, handleRegistro }) => {
  const [productorData, setProductorData] = useState({
    cuit: "",
    razonSocial: "",
    ivaCondicion: "responsable_inscripto",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductorData({
      ...productorData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegistro(productorData);
    nextStep();
  };

  return (
    <div className="background">
      <div className="container vh-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h2 className="text-center">Datos Productor 3/3</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="cuit">CUIT:</label>
                    <input
                      type="text"
                      name="cuit"
                      value={productorData.cuit}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Ingrese CUIT"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="razonSocial">Razón Social:</label>
                    <input
                      type="text"
                      name="razonSocial"
                      value={productorData.razonSocial}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Ingrese Razón Social"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="ivaCondicion">
                      Condición frente al IVA:
                    </label>
                    <select
                      className="form-control"
                      name="ivaCondicion"
                      value={productorData.ivaCondicion}
                      onChange={handleChange}
                    >
                      <option value="responsable_inscripto">
                        Responsable Inscripto
                      </option>
                      <option value="monotributista">Monotributista</option>
                      {/* Agrega más opciones según sea necesario */}
                    </select>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mt-2">
                    <button
                      className="btn btn-secondary"
                      onClick={() => backStep()}
                    >
                      Atrás
                    </button>
                    <button type="submit" className="btn btn-success">
                      Finalizar
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

export default FormProductor;
