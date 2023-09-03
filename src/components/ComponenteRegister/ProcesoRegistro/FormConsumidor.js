import React, { useEffect, useState } from "react";

const FormConsumidor = ({
  nextStep,
  backStep,
  handleRegistro,
  tipoUsuario,
}) => {
  const [consumidorData, setConsumidorData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    provincia: "",
    localidad: "",
    telefono: "",
  });

  // Función para manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setConsumidorData({
      ...consumidorData,
      [name]: value,
    });
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validación de datos aquí

    // Llama a la función de registro en el componente principal
    handleRegistro(consumidorData);

    // Avanza al siguiente paso
    nextStep();
  };

  return (
    <div className="background">
      <div className="container vh-100">
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h2 className="text-center">
                  Datos Consumidor 2/{tipoUsuario === "consumidor" ? "2" : "3"}
                </h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="nombre">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={consumidorData.nombre}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Nombre"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="apellido">Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      value={consumidorData.apellido}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Apellido"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dni">DNI</label>
                    <input
                      type="text"
                      name="dni"
                      value={consumidorData.dni}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="DNI"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                    <input
                      type="date"
                      name="fechaNacimiento"
                      value={consumidorData.fechaNacimiento}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="provincia">Provincia</label>
                    <select
                      name="provincia"
                      value={consumidorData.provincia}
                      onChange={handleChange}
                      className="form-control"
                    >
                      {/* Opciones de provincia */}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="localidad">Localidad</label>
                    <select
                      name="localidad"
                      value={consumidorData.localidad}
                      onChange={handleChange}
                      className="form-control"
                    >
                      {/* Opciones de localidad */}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      value={consumidorData.telefono}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Teléfono"
                    />
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mt-2">
                    <button
                      className="btn btn-secondary"
                      onClick={() => backStep()}
                    >
                      Atrás
                    </button>
                    {tipoUsuario === "consumidor" ? (
                      <button type="submit" className="btn btn-success">
                        Finalizar
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => nextStep()}
                      >
                        Siguiente
                      </button>
                    )}
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

export default FormConsumidor;
