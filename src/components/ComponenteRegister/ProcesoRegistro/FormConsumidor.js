import React, { useEffect, useState } from "react";

const FormConsumidor = ({
  nextStep,
  backStep,
  handleRegistro,
  tipoUsuario,
}) => {
  const [provincias, setProvincias] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [localidades, setLocalidades] = useState([]);
  const [selectedLocalidad, setSelectedLocalidad] = useState("");
  const [consumidorData, setConsumidorData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    fechaNacimiento: "",
    provincia: "",
    localidad: "",
    telefono: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConsumidorData({
      ...consumidorData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Actualizar el objeto consumidorData con la localidad seleccionada
    setConsumidorData({
      ...consumidorData,
    });
    handleRegistro(consumidorData);
    nextStep();
  };

  useEffect(() => {
    fetch("https://apis.datos.gob.ar/georef/api/provincias")
      .then((response) => response.json())
      .then((data) => {
        setProvincias(data.provincias);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleLocalidadChange = (e) => {
    setSelectedLocalidad(e.target.value);
    consumidorData.localidad=e.target.value
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    consumidorData.provincia=e.target.value

    if (e.target.value !== "") {
      fetch(
        `https://apis.datos.gob.ar/georef/api/municipios?provincia=${e.target.value}&campos=id,nombre&max=700`
      )
        .then((response) => response.json())
        .then((data) => {
          const sortedLocalidades = data.municipios.sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          );
          setLocalidades(sortedLocalidades);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setLocalidades([]);
    }
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
                      id="provincia"
                      className="form-control"
                      value={selectedProvince}
                      onChange={handleProvinceChange}
                      required
                    >
                      <option value="" disabled>
                        Seleccione una provincia
                      </option>
                      {provincias.map((prov) => (
                        <option key={prov.nombre} value={prov.nombre}>
                          {prov.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="localidad">Localidad</label>
                    <select
                      className="form-control mt-2"
                      value={selectedLocalidad}
                      onChange={handleLocalidadChange}
                      required
                    >
                      <option value="" disabled>
                        Seleccione una localidad
                      </option>
                      {localidades.map((loc) => (
                        <option key={loc.nombre} value={loc.nombre}>
                          {loc.nombre}
                        </option>
                      ))}
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
                      <button type="submit" className="btn btn-primary">
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
