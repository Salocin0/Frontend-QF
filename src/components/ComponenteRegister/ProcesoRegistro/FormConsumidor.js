import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "../seleccionRegister.module.css";

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

  function tieneNumeros(cadena) {
    return !isNaN(Number(cadena));
  }

  function tieneLetras(cadena) {
    const regex = /[a-zA-Z]/;
    return regex.test(cadena);
  }

  function validaDNI(cadena) {
    const regexDni = /^\d{8}$/;
    return regexDni.test(cadena);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const hoy = new Date();
    const fechaNacimientoDate = new Date(consumidorData.fechaNacimiento);
    const edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();

    if (!consumidorData.nombre.trim()) {
      toast.error("nombre no puede estar vacio");
      return;
    }

    if (tieneNumeros(consumidorData.nombre)) {
      toast.error("El nombre no puede contener números");
      return;
    }

    if (tieneNumeros(consumidorData.apellido)) {
      toast.error("El apellido no puede contener números");
      return;
    }

    if (tieneLetras(consumidorData.dni)) {
      toast.error("El DNI no puede contener letras");
      return;
    }

    if (!validaDNI(consumidorData.dni)) {
      toast.error("El DNI no es valido");
      return;
    }

    if (!consumidorData.apellido.trim()) {
      toast.error("apellido no puede estar vacio");
      return;
    }

    if (!consumidorData.dni.trim()) {
      toast.error("DNI no puede estar vacio");
      return;
    }

    if (edad < 18) {
      toast.error("Debes tener al menos 18 años para registrarte.");
      return;
    }

    if (tieneLetras(consumidorData.telefono)) {
      toast.error("El telefono no puede contener letras");
      return;
    }

    if (!consumidorData.telefono.trim()) {
      toast.error("telefono no puede estar vacio");
      return;
    }

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
    consumidorData.localidad = e.target.value;
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    consumidorData.provincia = e.target.value;

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
    <div className={`${styles.background} ${styles.container} vh-100`}>
      <div className="row h-100 justify-content-center align-items-center">
        <div className="col-md-4">
          <div className={`${styles.card} card`}>
            <div className={`${styles.cardheader} card-header`}>
              <h2
                className={`${styles.h2} text-center`}
                style={{ color: "white" }}
              >
                Datos Consumidor 2/{tipoUsuario === "consumidor" ? "2" : "3"}
              </h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className={`${styles["form-group"]} form-group`}>
                  <label htmlFor="nombre" className={styles.label}>
                    Nombre
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    id="nombre"
                    data-testid="nombre"
                    value={consumidorData.nombre}
                    onChange={handleChange}
                    className={`${styles.blackwhite}  form-control`}
                    placeholder="Nombre"
                  />
                </div>
                <div className={`${styles["form-group"]} form-group`}>
                  <label htmlFor="apellido" className={styles.label}>
                    Apellido
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    id="apellido"
                    data-testid="apellido"
                    value={consumidorData.apellido}
                    onChange={handleChange}
                    className={`${styles.blackwhite}  form-control`}
                    placeholder="Apellido"
                  />
                </div>
                <div className={`${styles["form-group"]} form-group`}>
                  <label htmlFor="dni" className={styles.label}>
                    DNI
                  </label>
                  <input
                    type="text"
                    name="dni"
                    id="dni"
                    data-testid="dni"
                    value={consumidorData.dni}
                    onChange={handleChange}
                    className={`${styles.blackwhite}  form-control`}
                    placeholder="DNI"
                  />
                </div>
                <div className={`${styles["form-group"]} form-group`}>
                  <label htmlFor="fechaNacimiento" className={styles.label}>
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    name="fechaNacimiento"
                    id="fechaNacimiento"
                    data-testid="fechaNacimiento"
                    value={consumidorData.fechaNacimiento}
                    onChange={handleChange}
                    className={`${styles.blackwhite}  form-control`}
                  />
                </div>
                <div className={`${styles["form-group"]} form-group`}>
                  <label htmlFor="provincia" className={styles.label}>
                    Provincia
                  </label>
                  <select
                    id="provincia"
                    name="provincia"
                    data-testid="provincia"
                    className={`${styles.blackwhite}  form-control`}
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    required
                  >
                    <option value="" disabled>
                      Seleccione una provincia
                    </option>
                    {provincias.map((prov) => (
                      <option
                        key={prov.nombre}
                        value={prov.nombre}
                        className={`${styles["option"]}`}
                      >
                        {prov.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={`${styles["form-group"]} form-group`}>
                  <label htmlFor="localidad" className={styles.label}>
                    Localidad
                  </label>
                  <select
                    className={`${styles.blackwhite} form-control mt-2`}
                    value={selectedLocalidad}
                    onChange={handleLocalidadChange}
                    data-testid="localidad"
                    id="localidad"
                    name="localidad"
                    required
                  >
                    <option value="" disabled>
                      Seleccione una localidad
                    </option>
                    {localidades.map((loc) => (
                      <option
                        key={loc.nombre}
                        value={loc.nombre}
                        className={`${styles["option"]}`}
                      >
                        {loc.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={`${styles["form-group"]} form-group`}>
                  <label htmlFor="telefono" className={styles.label}>
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="telefono"
                    id="telefono"
                    data-testid="telefono"
                    value={consumidorData.telefono}
                    onChange={handleChange}
                    className={`${styles.blackwhite}  form-control`}
                    placeholder="Teléfono"
                  />
                </div>
                <hr style={{ color: "white" }} />
                <div
                  className={`d-flex justify-content-between mt-2 ${styles["d-flex"]}`}
                >
                  <button
                    className={`${styles["btn"]} btn btn-secondary`}
                    onClick={() => backStep()}
                  >
                    Atrás
                  </button>
                  {tipoUsuario === "consumidor" ? (
                    <button
                      type="submit"
                      className={`${styles["btn"]} btn btn-success`}
                    >
                      Finalizar
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className={`${styles["btn"]} btn btn-primary`}
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
  );
};

export default FormConsumidor;
