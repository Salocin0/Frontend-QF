import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { UserContext } from "../ComponentesGenerales/UserContext";
import style from "./ConsultarUsuario.module.css";

const ConsultarUsuario = () => {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const id = location.state && location.state.value;
  const [mostrarContenidoProductor, setMostrarContenidoProductor] =
    useState(false);
  const [mostrarContenidoEncargadoPuesto, setMostrarContenidoEncargadoPuesto] =
    useState(false);
  const [mostrarContenidoRepartidor, setMostrarContenidoRepartidor] =
    useState(false);

  const [productor, setProductor] = useState("");
  const [nombreC, setNombreC] = useState("");
  const [apellidoC, setApellidoC] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [fechaNacimientoC, setFechaNacimientoC] = useState("");
  const [dniC, setDniC] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [localidadC, setLocalidadC] = useState("");
  const [provinciaC, setProvinciaC] = useState("");

  const [selectedProvince, setSelectedProvince] = useState("");
  const [localidadPrueba, setLocalidadPrueba] = useState("");
  const [filteredLocalidades, setFilteredLocalidades] = useState([]);
  const [provincias, setProvincias] = useState([]);

  const [telefono, setTelefono] = useState("");
  const [telefonoC, setTelefonoC] = useState("");

  const [cuitR, setCuitR] = useState("");
  const [cuitPE, setCuitPE] = useState("");
  const [cuitEPC, setCuitEPC] = useState("");

  const [razonSocialR, setRazonSocialR] = useState("");
  const [razonSocialEPC, setRazonSocialEPC] = useState("");
  const [razonSocialPE, setRazonSocialPE] = useState("");
  const [documentos, setDocumentos] = useState("");

  const [username, setUsername] = useState("");
  const [usernameC, setUsernameC] = useState("");

  const [isDisabled, setIsDisabled] = useState(true);
  const [isDisabledC, setIsDisabledC] = useState(true);
  const [isDisabledPE, setIsDisabledPE] = useState(true);
  const [isDisabledEPC, setIsDisabledEPC] = useState(true);
  const [isDisabledR, setIsDisabledR] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editModeC, setEditModeC] = useState(false);
  const [editModePE, setEditModePE] = useState(false);
  const [editModeEPC, setEditModeEPC] = useState(false);
  const [editModeR, setEditModeR] = useState(false);

  const [rolSeleccionado, setRolSeleccionado] = useState("Usuario");

  const [session, setSession] = useState(null);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
      fetch("http://localhost:8000/user/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionID: sessionId }),
      })
        .then((response) => response.json())
        .then((data) => {
          setSession(data.data);
          console.log(data.data);
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  }, []);

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

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setLocalidadPrueba([]);

    if (e.target.value !== "") {
      fetch(
        `https://apis.datos.gob.ar/georef/api/municipios?provincia=${e.target.value}&campos=id,nombre&max=700`
      )
        .then((response) => response.json())
        .then((data) => {
          const sortedLocalidades = data.municipios.sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          );
          setLocalidadPrueba(sortedLocalidades);
          setFilteredLocalidades(data.municipios);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setLocalidadPrueba([]);
      setFilteredLocalidades([]);
    }
  };

  const handleNombreChangeC = (e) => {
    setNombreC(e.target.value);
  };

  const handleApellidoChangeC = (e) => {
    setApellidoC(e.target.value);
  };

  const handleFechaNacimientoChange = (e) => {
    setFechaNacimiento(e.target.value);
  };

  const handleFechaNacimientoChangeC = (e) => {
    setFechaNacimiento(e.target.value);
  };

  const handleDniChangeC = (e) => {
    setDniC(e.target.value);
  };

  const handleLocalidadChange = (e) => {
    setLocalidad(e.target.value);
  };

  const handleLocalidadChangeC = (e) => {
    setLocalidadC(e.target.value);
  };

  const handleProvinciaChangeC = (e) => {
    setProvinciaC(e.target.value);
  };

  const handleTelefonoChange = (e) => {
    setTelefono(e.target.value);
  };

  const handleTelefonoChangeC = (e) => {
    setTelefonoC(e.target.value);
  };

  const handleCuitChangePE = (e) => {
    setCuitPE(e.target.value);
  };

  const handleCuitChangeEPC = (e) => {
    setCuitEPC(e.target.value);
  };

  const handleCuitChangeR = (e) => {
    setCuitR(e.target.value);
  };

  const handleRazonSocialChangePE = (e) => {
    setRazonSocialPE(e.target.value);
  };

  const handleRazonSocialChangeEPC = (e) => {
    setRazonSocialEPC(e.target.value);
  };

  const handleRazonSocialChangeR = (e) => {
    setRazonSocialR(e.target.value);
  };

  const handleDocumentosChangePE = (e) => {
    setDocumentos(e.target.files);
  };

  const handleDocumentosChangeEPC = (e) => {
    setDocumentos(e.target.files);
  };

  const handleDocumentosChangeR = (e) => {
    setDocumentos(e.target.files);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleUsernameChangeC = (e) => {
    setUsernameC(e.target.value);
  };

  const handleEditModeToggleC = () => {
    setEditModeC(!editModeC);
    setIsDisabledC(!isDisabledC);
  };

  const handleCancelChangesC = () => {
    setEditModeC(false);
    setIsDisabledC(true);
    cargarDatos(user); // Volver a cargar los datos originales
  };

  const handleSaveChangesC = (e) => {
    e.preventDefault();
    setEditModeC(false);
  };

  const handleSaveChangesCPrueba = async (e) => {
    e.preventDefault();

    const datosActualizados = {
      nombreC,
      apellidoC,
      dniC,
      fechaNacimiento,
      provinciaC,
      localidad,
      telefono,
    };

    console.log(datosActualizados);

    try {
      const response = await fetch(
        `http://localhost:8000/consumidor/${user.consumidorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosActualizados),
        }
      );

      if (response.ok) {
        toast.success("Datos actualizados correctamente");
        cargarDatos(user);
        setEditModeC(false);
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al actualizar los datos del repartidor:", error);
      toast.error("Error al actualizar los datos");
    }
  };

  const handleEditModeTogglePE = () => {
    setEditModePE(!editMode);
    setIsDisabledPE(!isDisabled);
  };

  const handleCancelChangesPE = () => {
    setEditModePE(false);
    setIsDisabledPE(true);
    cargarDatos(user); // Volver a cargar los datos originales
  };

  const handleSaveChangesPE = (e) => {
    e.preventDefault();
    setEditModePE(false);
  };

  const handleSaveChangesPEPrueba = async (e) => {
    e.preventDefault();

    const datosActualizados = {
      razonSocialPE,
      cuitPE,
    };

    try {
      const response = await fetch(
        `http://localhost:8000/productor/${user.consumidorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosActualizados),
        }
      );

      if (response.ok) {
        toast.success("Datos actualizados correctamente");
        cargarDatos(user);
        setEditModePE(false);
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al actualizar los datos del repartidor:", error);
      toast.error("Error al actualizar los datos");
    }
  };

  const handleEditModeToggleEPC = () => {
    setEditModeEPC(!editMode);
    setIsDisabledEPC(!isDisabled);
  };

  const handleCancelChangesEPC = () => {
    setEditModeEPC(false);
    setIsDisabledEPC(true);
    cargarDatos(user); // Volver a cargar los datos originales
  };

  const handleSaveChangesEPC = async (e) => {
    e.preventDefault();

    const datosActualizados = {
      razonSocialEPC,
      cuitEPC,
    };

    try {
      const response = await fetch(
        `http://localhost:8000/encargado/${user.consumidorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosActualizados),
        }
      );

      if (response.ok) {
        toast.success("Datos actualizados correctamente");
        cargarDatos(user);
        setEditModeEPC(false);
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al actualizar los datos del repartidor:", error);
      toast.error("Error al actualizar los datos");
    }
  };

  const handleEditModeToggleR = () => {
    setEditMode(!editModeR);
    setIsDisabled(!isDisabledR);
  };

  const handleCancelChangesR = () => {
    setEditModeR(false);
    setIsDisabledR(true);
    cargarDatos(user); // Volver a cargar los datos originales
  };

  const handleSaveChangesR = (e) => {
    e.preventDefault();
    setEditModeR(false);
  };

  useEffect(() => {
    if (user) {
      cargarDatos(user);
    }
  }, [user]);

  const cargarDatos = async (user) => {
    setUsername(user.usuario);
    console.log(user.consumidorId);

    try {
      const response1 = await fetch(
        `http://localhost:8000/consumidor/${user.consumidorId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response1.ok) {
        const data1 = await response1.json();
        //console.log(data1.data.encargado.cuit != undefined);

        setApellidoC(data1.data.apellido);
        setNombreC(data1.data.nombre);
        setDniC(data1.data.dni);

        const fechaNacimientoEspañol = new Date(
          data1.data.fechaNacimiento
        ).toLocaleDateString("es-ES");
        setFechaNacimiento(fechaNacimientoEspañol);

        setLocalidad(data1.data.localidad);
        setProvinciaC(data1.data.provincia);

        setTelefono(data1.data.telefono);

        if (data1.data.Productor?.cuit || data1.data.Productor?.razonSocial) {
          setMostrarContenidoProductor(true);
          console.log(data1.data.Productor.razonSocial);
          setCuitPE(data1.data.Productor.cuit);
          setRazonSocialPE(data1.data.Productor.razonSocial);
        }

        if (
          data1.data.encargado?.cuit !== undefined ||
          data1.data.encargado?.razonSocial !== undefined
        ) {
          setMostrarContenidoEncargadoPuesto(true);
          console.log(data1.data.encargado.razonSocial);

          setCuitEPC(data1.data.encargado.cuit);
          setRazonSocialEPC(data1.data.encargado.razonSocial);
        }

        if (
          data1.data.repartidore?.cuit ||
          data1.data.repartidore?.razonSocial
        ) {
          setMostrarContenidoRepartidor(true);

          setCuitR(data1.data.repartidore.cuit);
          setRazonSocialR(data1.data.repartidore.razonSocial);
        }

        if (data1.codigo === 200) {
          toast.success("Datos cargados correctamente");
        } else if (data1.codigo === 400) {
          toast.error("Error al cargar los datos");
        }
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  return (
    <div className={`${style.background} row`}>
      <div className="col-2">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className={`col-10`}>
        <section
          className={`${style.form} align-items-center justify-content-center col-6 offset-3 mt-0`}
        >
          <div className={`shadow-lg ${style.card}`}>
            <div className={`${style.formulario} card-body mt-3 mb-5`}>
              <h1 className="fs-5 card-title fw-bold mb-2 text-dark">
                Tu Perfil
              </h1>
              <form className="needs-validation">
                <div>
                  <hr />
                  <h1 className="fs-5 card-title fw-bold mb-2 text-dark">
                    Usuario
                  </h1>
                  <section
                    className={`${style.form} align-items-center justify-content-center col`}
                  >
                    <div className={`card ${style.card} shadow-lg`}>
                      <div className={`${style.formulario} card-body p-3`}>
                        <div className="d-flex justify-content-end">
                          {editModeC ? (
                            <>
                              <button
                                type="button"
                                className=" btn btn-success mr-2"
                                onClick={handleSaveChangesCPrueba}
                              >
                                Guardar
                              </button>
                              <br />
                              <button
                                type="button"
                                className="btn btn-danger"
                                onClick={handleCancelChangesC}
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleEditModeToggleC}
                            >
                              Editar
                            </button>
                          )}
                        </div>
                        <form
                          onSubmit={handleSaveChangesC}
                          className="needs-validation"
                        >
                          <div className="mb-2">
                            <label
                              className="mb-2 text-dark"
                              htmlFor="username"
                            >
                              Nombre de Usuario
                            </label>
                            <input
                              type="text"
                              id="username"
                              className="form-control"
                              value={username}
                              onChange={handleUsernameChangeC}
                              readOnly={editModeC}
                              disabled={isDisabledC}
                            />
                          </div>
                          <div className=" mb-2">
                            <label className="mb-2 text-dark" htmlFor="nombre">
                              Nombre
                            </label>
                            <input
                              type="text"
                              id="nombre"
                              className="form-control"
                              value={nombreC}
                              onChange={handleNombreChangeC}
                              readOnly={!editModeC}
                              disabled={isDisabledC}
                            />
                          </div>
                          <div className=" mb-2">
                            <label
                              className="mb-2 text-dark"
                              htmlFor="apellido"
                            >
                              Apellido
                            </label>
                            <input
                              type="text"
                              id="apellido"
                              className="form-control"
                              value={apellidoC}
                              onChange={handleApellidoChangeC}
                              readOnly={!editModeC}
                              disabled={isDisabledC}
                            />
                          </div>
                          <div className="mb-2">
                            <label
                              className="mb-2 text-dark"
                              htmlFor="fechaNacimiento"
                            >
                              Fecha de Nacimiento
                            </label>
                            <input
                              type="text"
                              id="fechaNacimiento"
                              className="form-control"
                              value={fechaNacimiento}
                              onChange={handleFechaNacimientoChangeC}
                              readOnly={!editModeC}
                              disabled={isDisabledC}
                            />
                          </div>
                          <div className="mb-2">
                            <label className="mb-2 text-dark" htmlFor="dni">
                              DNI
                            </label>
                            <input
                              type="text"
                              id="dni"
                              className="form-control"
                              value={dniC}
                              onChange={handleDniChangeC}
                              readOnly={!editModeC}
                              disabled={isDisabledC}
                            />
                          </div>
                          <div className="mb-3">
                            <label
                              className="mb-2 text-black"
                              htmlFor="provincia"
                            >
                              Provincia
                            </label>
                            <select
                              id="provincia"
                              className="form-control"
                              value={selectedProvince}
                              onChange={handleProvinceChange}
                              readOnly={!editModeC}
                              disabled={isDisabledC}
                              required
                            >
                              <option value="" disabled>
                                {provinciaC}
                              </option>
                              {provincias.map((prov) => (
                                <option key={prov.id} value={prov.id}>
                                  {prov.nombre}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mb-3">
                            <label
                              className="mb-2 text-black"
                              htmlFor="localidad"
                            >
                              Localidad
                            </label>

                            <select
                              className="form-control mt-2"
                              value={localidad}
                              onChange={handleLocalidadChange}
                              readOnly={!editModeC}
                              disabled={isDisabledC}
                              required
                            >
                              <option value="" disabled>
                                {localidad}
                              </option>
                              {filteredLocalidades.map((loc) => (
                                <option key={loc.nombre} value={loc.nombre}>
                                  {loc.nombre}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mb-2">
                            <label
                              className="mb-2 text-dark"
                              htmlFor="telefono"
                            >
                              Teléfono
                            </label>
                            <input
                              type="text"
                              id="telefono"
                              className="form-control"
                              value={telefono}
                              onChange={handleTelefonoChangeC}
                              readOnly={!editModeC}
                              disabled={isDisabledC}
                            />
                          </div>
                        </form>
                      </div>
                    </div>
                    {mostrarContenidoProductor && (
                      <>
                        <hr />
                        <h1 className="fs-5 card-title fw-bold mb-2 text-dark">
                          Productor de Eventos
                        </h1>
                        <section
                          className={`${style.form} align-items-center justify-content-center col `}
                        >
                          <div className={`card ${style.card} shadow-lg`}>
                            <div
                              className={`${style.formulario} card-body p-3`}
                            >
                              <div className="d-flex justify-content-end">
                                {editModePE ? (
                                  <>
                                    <button
                                      type="button"
                                      className=" btn btn-success mr-2"
                                      onClick={handleSaveChangesPEPrueba}
                                    >
                                      Guardar
                                    </button>
                                    <br />
                                    <button
                                      type="button"
                                      className="btn btn-danger"
                                      onClick={handleCancelChangesPE}
                                    >
                                      Cancelar
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleEditModeTogglePE}
                                  >
                                    Editar
                                  </button>
                                )}
                              </div>
                              <form
                                onSubmit={handleSaveChangesPE}
                                className="needs-validation"
                              >
                                {/* CUIT */}
                                <div className="mb-2">
                                  <label
                                    className="mb-2 text-dark"
                                    htmlFor="cuit"
                                  >
                                    CUIT
                                  </label>
                                  <input
                                    type="number"
                                    id="cuit"
                                    className="form-control"
                                    value={cuitPE}
                                    onChange={handleCuitChangePE}
                                    readOnly={!editModePE}
                                    disabled={!editModePE}
                                  />
                                </div>
                                {/* Razon Social */}
                                <div className="mb-2">
                                  <label
                                    className="mb-2 text-dark"
                                    htmlFor="razonSocial"
                                  >
                                    Razon Social
                                  </label>
                                  <input
                                    type="text"
                                    id="razonSocial"
                                    className="form-control"
                                    value={razonSocialPE}
                                    onChange={handleRazonSocialChangePE}
                                    readOnly={!editModePE}
                                    disabled={!editModePE}
                                  />
                                </div>
                                {/* Documentos */}
                                <div className="mb-2">
                                  <label
                                    className="mb-2 text-dark"
                                    htmlFor="documentos"
                                  >
                                    Documentos
                                  </label>
                                  <input
                                    type="file"
                                    id="documentos"
                                    className="form-control"
                                    onChange={handleDocumentosChangePE}
                                    readOnly={!editModePE}
                                    disabled={!editModePE}
                                  />
                                </div>
                              </form>
                            </div>
                          </div>
                        </section>
                      </>
                    )}
                    {mostrarContenidoEncargadoPuesto && (
                      <>
                        <hr />
                        <h1 className="fs-5 card-title fw-bold mb-2 text-dark">
                          Encargado Puesto de Comida
                        </h1>
                        <section
                          className={`${style.form} align-items-center justify-content-center col`}
                        >
                          <div className={`card ${style.card} shadow-lg`}>
                            <div
                              className={`${style.formulario} card-body p-3`}
                            >
                              <div className="d-flex justify-content-end">
                                {editModeEPC ? (
                                  <>
                                    <button
                                      type="button"
                                      className=" btn btn-success mr-2"
                                      onClick={handleSaveChangesEPC}
                                    >
                                      Guardar
                                    </button>
                                    <br />
                                    <button
                                      type="button"
                                      className="btn btn-danger"
                                      onClick={handleCancelChangesEPC}
                                    >
                                      Cancelar
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleEditModeToggleEPC}
                                  >
                                    Editar
                                  </button>
                                )}
                              </div>
                              <form
                                onSubmit={handleSaveChangesEPC}
                                className="needs-validation"
                              >
                                {/* CUIT */}
                                <div className="mb-2">
                                  <label
                                    className="mb-2 text-dark"
                                    htmlFor="cuit"
                                  >
                                    CUIT
                                  </label>
                                  <input
                                    type="number"
                                    id="cuit"
                                    className="form-control"
                                    value={cuitEPC}
                                    onChange={handleCuitChangeEPC}
                                    readOnly={!editModeEPC}
                                    disabled={!editModeEPC}
                                  />
                                </div>
                                {/* Razon Social */}
                                <div className="mb-2">
                                  <label
                                    className="mb-2 text-dark"
                                    htmlFor="razonSocial"
                                  >
                                    Razon Social
                                  </label>
                                  <input
                                    type="text"
                                    id="razonSocial"
                                    className="form-control"
                                    value={razonSocialEPC}
                                    onChange={handleRazonSocialChangeEPC}
                                    readOnly={!editModeEPC}
                                    disabled={!editModeEPC}
                                  />
                                </div>
                                {/* Documentos */}
                                <div className="mb-2">
                                  <label
                                    className="mb-2 text-dark"
                                    htmlFor="documentos"
                                  >
                                    Documentos
                                  </label>
                                  <input
                                    type="file"
                                    id="documentos"
                                    className="form-control"
                                    onChange={handleDocumentosChangeEPC}
                                    readOnly={!editModeEPC}
                                    disabled={!editModeEPC}
                                  />
                                </div>
                              </form>
                            </div>
                          </div>
                        </section>
                      </>
                    )}

                    {mostrarContenidoRepartidor && (
                      <>
                        <hr />
                        <h1 className="fs-5 card-title fw-bold mb-2 text-dark">
                          Repartidor
                        </h1>
                        <section
                          className={`${style.form} align-items-center justify-content-center col`}
                        >
                          <div className={`card ${style.card} shadow-lg`}>
                            <div
                              className={`${style.formulario} card-body p-3`}
                            >
                              <div className="d-flex justify-content-end">
                                {editModeR ? (
                                  <>
                                    <button
                                      type="button"
                                      className=" btn btn-success mr-2"
                                      onClick={handleSaveChangesR}
                                    >
                                      Guardar
                                    </button>
                                    <br />
                                    <button
                                      type="button"
                                      className="btn btn-danger"
                                      onClick={handleCancelChangesR}
                                    >
                                      Cancelar
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleEditModeToggleR}
                                  >
                                    Editar
                                  </button>
                                )}
                              </div>
                              <form
                                onSubmit={handleSaveChangesR}
                                className="needs-validation"
                              >
                                {/* CUIT */}
                                <div className="mb-2 mt-0">
                                  <label
                                    className="mb-1 text-dark"
                                    htmlFor="cuit"
                                  >
                                    {" "}
                                    CUIT
                                  </label>
                                  <input
                                    type="number"
                                    id="cuit"
                                    className="form-control"
                                    value={cuitR}
                                    onChange={handleCuitChangeR}
                                    readOnly={!editModeR}
                                    disabled={!editModeR}
                                  />
                                </div>

                                {/* Documentos */}
                                <div className="mb-2">
                                  <label
                                    className="mb-2 text-dark"
                                    htmlFor="documentos"
                                  >
                                    Documentos
                                  </label>
                                  <input
                                    type="file"
                                    id="documentos"
                                    className="form-control"
                                    onChange={handleDocumentosChangeR}
                                    readOnly={!editModeR}
                                    disabled={!editModeR}
                                  />
                                </div>
                              </form>
                            </div>
                          </div>
                        </section>
                      </>
                    )}
                  </section>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
      <div style={{ position: "fixed", left: "0", bottom: "0" }}>
        <Footer />
      </div>
    </div>
  );
};

export default ConsultarUsuario;
