import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { UserContext } from "../ComponentesGenerales/UserContext";
import style from "./ConsultarUsuario.module.css";

const ConsultarUsuario = () => {
  const [showModal, setShowModal] = useState(false);

  const { user } = useContext(UserContext);

  const [mostrarContenidoProductor, setMostrarContenidoProductor] =
    useState(false);
  const [mostrarContenidoEncargadoPuesto, setMostrarContenidoEncargadoPuesto] =
    useState(false);
  const [mostrarContenidoRepartidor, setMostrarContenidoRepartidor] =
    useState(false);

  const [nombreC, setNombreC] = useState("");
  const [apellidoC, setApellidoC] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
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
  const [condicionEPC, setCondicionEPC] = useState("");
  const [condicionIvaPE, setCondicionPE] = useState("");

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

  const [mostrarBotonHabilitarDeNuevoR, setMostrarBotonHabilitarDeNuevoR] = useState(false);
  const [mostrarBotonHabilitarDeNuevoEPC, setMostrarBotonHabilitarDeNuevoEPC] = useState(false);
  const [mostrarBotonHabilitarDeNuevoPE, setMostrarBotonHabilitarDeNuevoPE] = useState(false);

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

          console.log(data.data.tipoUsuario);

          if (data.data.tipoUsuario === "repartidor")  {
            setMostrarContenidoRepartidor(true);
          } else if (data.data.tipoUsuario === "encargado")  {
            setMostrarContenidoEncargadoPuesto(true);
          } else if (data.data.tipoUsuario === "productor")  {
            setMostrarContenidoProductor(true);
          } else{
            console.log("Eror");
          }

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

  const isCuitValid = (cuitEPC) => {
    console.log("Entre" + cuitEPC);
    const regexCuit = /^(20|23|27|30|33)([0-9]{9}|-[0-9]{8}-[0-9]{1})$/g;
    if (!cuitEPC.trim()) {
      return false;
    }
    return regexCuit.test(cuitEPC);
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

  const handleCondicionPE = (e) => {
    setCondicionPE(e.target.value);
  };

  const handleRazonSocialChangeEPC = (e) => {
    setRazonSocialEPC(e.target.value);
  };

  const handleCondicionEPC = (e) => {
    setCondicionEPC(e.target.value);
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
    setEditModeC(true);
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

    if (
      !nombreC ||
      !apellidoC ||
      !dniC ||
      !fechaNacimiento ||
      !provinciaC ||
      !localidad ||
      !telefono
    ) {
      toast.error("Rellene todos los campos");
      return;
    }

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
        setEditModeC(false);

        setIsDisabledC(!isDisabledC);
        cargarDatos(user);
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al actualizar los datos del repartidor:", error);
      toast.error("Error al actualizar los datos");
    }
  };

  const handleEliminarCuenta = () => {};

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

    if (!isCuitValid(cuitPE)) {
      toast.error("El CUIT no es válido o está vacío.");
      return;
    }

    if (!razonSocialPE.trim()) {
      toast.error("razon social no puede estar vacía.");
      return;
    }

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

  const handleDeshabilitarPE = () => {
    setShowModal(true);
  };

  const confirmarDeshabilitarPE = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/productor/${user.consumidorId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setShowModal(false);
        setMostrarContenidoProductor(false);
        setMostrarBotonHabilitarDeNuevoPE(true);
        setSession((prevSession) => ({ ...prevSession, tipoUsuario: "consumidor" }));
        toast.success("Rol deshabilitado correctamente");
        cargarDatos(user);
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al eliminar los datos del productor:", error);
      toast.error("Error al actualizar los datos");
    }
  };

  const handleVolverAHabilitarPE = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/productor/${user.consumidorId}/habilitacion`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setShowModal(false);
        setMostrarContenidoProductor(true);
        setMostrarBotonHabilitarDeNuevoPE(false);
        setSession((prevSession) => ({ ...prevSession, tipoUsuario: "productor" }));

        toast.success("Rol Productor habilitado nuevamente");

        cargarDatos(user);

      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al habilitar el productor nuevamente:", error);
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

    if (!isCuitValid(cuitEPC)) {
      toast.error("El CUIT no es válido o está vacío.");
      return;
    }

    if (!razonSocialEPC.trim()) {
      toast.error("razon social no puede estar vacía.");
      return;
    }

    if (!condicionEPC.trim()) {
      toast.error("Condicion IVA no puede estar vacía.");
      return;
    }

    const datosActualizados = {
      razonSocialEPC,
      cuitEPC,
      condicionEPC,
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

  const handleDeshabilitarEPC = async (e) => {
    // Mostrar el modal de confirmación
    setShowModal(true);
  };

  const confirmarDeshabilitarEPC = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/encargado/${user.consumidorId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setShowModal(false);
        setMostrarContenidoEncargadoPuesto(false);
        setMostrarBotonHabilitarDeNuevoEPC(true);
        setSession((prevSession) => ({ ...prevSession, tipoUsuario: "consumidor" }));
        toast.success("Usuario deshabilitado correctamente");
        cargarDatos(user);

      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al eliminar los datos del encargado:", error);
      toast.error("Error al actualizar los datos");
    }
  };

 const handleVolverAHabilitarEPC = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/encargado/${user.consumidorId}/habilitacion`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setShowModal(false);
        setMostrarContenidoEncargadoPuesto(true);
        setMostrarBotonHabilitarDeNuevoEPC(false);
        setSession((prevSession) => ({ ...prevSession, tipoUsuario: "encargado" }));

        toast.success("Rol Encargado Puesto habilitado nuevamente");

        cargarDatos(user);

      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al habilitar el repartidor nuevamente:", error);
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

  const handleDeshabilitarR = () => {
    setShowModal(true);
  };

  const confirmarDeshabilitarR = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/repartidor/${user.consumidorId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setShowModal(false);
        setMostrarContenidoRepartidor(false);
        setMostrarBotonHabilitarDeNuevoR(true);

        // Cambiar session.tipoUsuario a "consumidor"
        setSession((prevSession) => ({ ...prevSession, tipoUsuario: "consumidor" }));

        toast.success("Usuario deshabilitado correctamente");

        cargarDatos(user);

      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al eliminar los datos del repartidor:", error);
      toast.error("Error al actualizar los datos");
    }
  };


  const handleVolverAHabilitarR = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/repartidor/${user.consumidorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setShowModal(false);
        setMostrarBotonHabilitarDeNuevoR(false);
        setSession((prevSession) => ({ ...prevSession, tipoUsuario: "repartidor" }));

        toast.success("Rol Repartidor habilitado nuevamente");
        setMostrarContenidoRepartidor(true);

        cargarDatos(user);

      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al habilitar el repartidor nuevamente:", error);
      toast.error("Error al actualizar los datos");
    }
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

        if (
          data1.data.Productor?.habilitado === true &&
          (data1.data.Productor?.cuit || data1.data.Productor?.razonSocial)
        ) {
          setMostrarContenidoProductor(true);
          console.log(data1.data.Productor.razonSocial);
          setCuitPE(data1.data.Productor.cuit);
          setRazonSocialPE(data1.data.Productor.razonSocial);
          setCondicionPE(data1.data.Productor.condicionIva);
        } else if (data1.data.Productor?.habilitado === false) {
          setMostrarContenidoProductor(false);
        }

        if (
          data1.data.encargado?.habilitado === true &&
          (data1.data.encargado?.cuit !== undefined ||
            data1.data.encargado?.razonSocial !== undefined)
        ) {
          setMostrarContenidoEncargadoPuesto(true);
          console.log(data1.data.encargado.razonSocial);

          setCuitEPC(data1.data.encargado.cuit);
          setRazonSocialEPC(data1.data.encargado.razonSocial);
          setCondicionEPC(data1.data.encargado.condicionIva);
        } else if (data1.data.encargado?.habilitado === false){
          setMostrarBotonHabilitarDeNuevoEPC(true);

        }

        console.log(data1.data.repartidore?.habilitado);
        if (data1.data.repartidore?.habilitado === false) {
          setMostrarContenidoRepartidor(false);
          setMostrarBotonHabilitarDeNuevoR(true)
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
              <form className="needs-validation">
                <div>
                  <section
                    className={`${style.form} align-items-center justify-content-center col`}
                  >
                    <div className={`card ${style.card} shadow-lg`}>
                      <div className={`${style.formulario} card-body p-3`}>
                        <div className="row">
                          <div className="justify-content-start col-6">
                            <h1 className="fs-5 card-title fw-bold mb-2 text-dark">
                              Usuario <p>{session?.tipoUsuario}</p>
                            </h1>
                          </div>
                          <div className="d-flex justify-content-end col-6">
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
                              readOnly={!editModeC}
                              disabled={isDisabledC}
                              required
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
                              required
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
                              required
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
                              required
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
                              required
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
                              required
                            />
                          </div>
                        </form>
                        <div className="d-flex">
                          <button
                            type="button"
                            className="btn btn-danger mr-2 w-100"
                            onClick={handleEliminarCuenta}
                            disabled
                          >
                            Eliminar mi cuenta
                          </button>
                        </div>
                        <br />
                        {mostrarBotonHabilitarDeNuevoR && (
                          <div className="d-flex">
                            <button
                              type="button"
                              className="btn btn-success mr-2 w-100"
                              onClick={handleVolverAHabilitarR}
                            >
                              Volver a habilitarme como 'Repartidor'
                            </button>
                          </div>
                        )}
                        {mostrarBotonHabilitarDeNuevoEPC && (
                          <div className="d-flex">
                            <button
                              type="button"
                              className="btn btn-success mr-2 w-100"
                              onClick={handleVolverAHabilitarEPC}
                            >
                              Volver a habilitarme como 'Encargado de Puesto'
                            </button>
                          </div>
                        )}
                        {mostrarBotonHabilitarDeNuevoPE && (
                          <div className="d-flex">
                            <button
                              type="button"
                              className="btn btn-success mr-2 w-100"
                              onClick={handleVolverAHabilitarPE}
                            >
                              Volver a habilitarme como 'Productor de Evento'
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    {mostrarContenidoProductor && (
                      <>
                        <hr />

                        <section
                          className={`${style.form} align-items-center justify-content-center col `}
                        >
                          <div className={`card ${style.card} shadow-lg`}>
                            <div
                              className={`${style.formulario} card-body p-3`}
                            >
                              <div className="row">
                                <div className="justify-content-start col-8">
                                  <h1 className="fs-5 card-title fw-bold mb-2 text-dark">
                                    Productor de Eventos
                                  </h1>
                                </div>
                                <div className="d-flex justify-content-end col-4">
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
                                    required
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
                                    required
                                  />
                                </div>
                                <div className="mb-2">
                                  <label
                                    className="mb-2 text-dark"
                                    htmlFor="razonSocial"
                                  >
                                    Condicion IVA
                                  </label>
                                  <input
                                    type="text"
                                    id="condicion"
                                    className="form-control"
                                    value={condicionIvaPE}
                                    onChange={handleCondicionPE}
                                    readOnly={!editModePE}
                                    disabled={!editModePE}
                                    required
                                  />
                                </div>
                              </form>
                              <div className="d-flex">
                                <button
                                  type="button"
                                  className="btn btn-danger mr-2 w-100"
                                  onClick={handleDeshabilitarPE}
                                >
                                  Deshabilitar Usuario
                                </button>
                                <Modal
                                  isOpen={showModal}
                                  onRequestClose={() => setShowModal(false)}
                                  contentLabel="Confirmación de deshabilitación"
                                  style={{
                                    overlay: {
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    },
                                    content: {
                                      position: "relative",
                                      top: "auto",
                                      left: "auto",
                                      right: "auto",
                                      bottom: "auto",
                                      borderRadius: "8px",
                                      maxWidth: "400px", // Ajusta el ancho máximo aquí
                                      padding: "20px",
                                      textAlign: "center", // Centra el contenido del modal
                                    },
                                  }}
                                >
                                  <h2>
                                    ¿Está seguro de deshabilitar su cuenta?
                                  </h2>
                                  <div className="d-flex justify-content-center">
                                    <button
                                      onClick={() => setShowModal(false)}
                                      className="btn btn-secondary mr-2"
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      onClick={confirmarDeshabilitarPE}
                                      className="btn btn-danger ml-2"
                                    >
                                      Sí, deshabilitar
                                    </button>
                                  </div>
                                </Modal>
                              </div>
                            </div>
                          </div>
                        </section>
                      </>
                    )}
                    {mostrarContenidoEncargadoPuesto && (
                      <>
                        <hr />
                        <section
                          className={`${style.form} align-items-center justify-content-center col`}
                        >
                          <div className={`card ${style.card} shadow-lg`}>
                            <div
                              className={`${style.formulario} card-body p-3`}
                            >
                              <div className="row">
                                <div className="justify-content-start col-8">
                                  <h1 className="fs-5 card-title fw-bold mb-2 text-dark">
                                    Encargado Puesto de Comida
                                  </h1>
                                </div>
                                <div className="d-flex justify-content-end col-4">
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
                                    required
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
                                    required
                                  />
                                </div>
                                <div className="mb-2">
                                  <label
                                    className="mb-2 text-dark"
                                    htmlFor="Condicon"
                                  >
                                    Condicion IVA
                                  </label>
                                  <input
                                    type="text"
                                    id="IVA"
                                    className="form-control"
                                    value={condicionEPC}
                                    onChange={handleCondicionEPC}
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
                              <div>
                                <button
                                  type="button"
                                  className="btn btn-danger mr-2 w-100"
                                  onClick={handleDeshabilitarEPC}
                                >
                                  Deshabilitar Usuario
                                </button>
                                <Modal
                                  isOpen={showModal}
                                  onRequestClose={() => setShowModal(false)}
                                  contentLabel="Confirmación de deshabilitación"
                                  style={{
                                    overlay: {
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    },
                                    content: {
                                      position: "relative",
                                      top: "auto",
                                      left: "auto",
                                      right: "auto",
                                      bottom: "auto",
                                      borderRadius: "8px",
                                      maxWidth: "400px", // Ajusta el ancho máximo aquí
                                      padding: "20px",
                                      textAlign: "center", // Centra el contenido del modal
                                    },
                                  }}
                                >
                                  <h2>
                                    ¿Está seguro de deshabilitar su cuenta?
                                  </h2>
                                  <div className="d-flex justify-content-center">
                                    <button
                                      onClick={() => setShowModal(false)}
                                      className="btn btn-secondary mr-2"
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      onClick={confirmarDeshabilitarEPC}
                                      className="btn btn-danger ml-2"
                                    >
                                      Sí, deshabilitar
                                    </button>
                                  </div>
                                </Modal>
                              </div>
                            </div>
                          </div>
                        </section>
                      </>
                    )}

                    {mostrarContenidoRepartidor && (
                      <>
                        <hr />
                        <section
                          className={`${style.form} align-items-center justify-content-center col`}
                        >
                          <div className={`card ${style.card} shadow-lg`}>
                            <div
                              className={`${style.formulario} card-body p-3`}
                            >
                              <div className="row">
                                <div className="justify-content-start col-8">
                                  <h1 className="fs-5 card-title fw-bold mb-2 text-dark">
                                    Repartidor
                                  </h1>
                                </div>
                                <div className="d-flex justify-content-end col-4"></div>
                              </div>

                              <form
                                onSubmit={handleSaveChangesR}
                                className="needs-validation"
                              >
                                <div
                                  className="mb-2 mt-0 text-center"
                                  style={{
                                    fontFamily: "Open Sans, sans-serif",
                                  }}
                                >
                                  <label
                                    className="mb-1 text-dark"
                                    htmlFor="cuit"
                                    style={{
                                      fontSize: "18px", // Tamaño de fuente personalizado
                                      fontWeight: "bold", // Peso de fuente en negrita
                                      color: "#333", // Color de texto personalizado
                                    }}
                                  >
                                    Usted actualmente es Repartidor
                                  </label>
                                </div>

                                <div className="d-flex">
                                  <button
                                    type="button"
                                    className="btn btn-danger mr-2 w-100"
                                    onClick={handleDeshabilitarR}
                                  >
                                    Deshabilitar Usuario
                                  </button>
                                  <Modal
                                    isOpen={showModal}
                                    onRequestClose={() => setShowModal(false)}
                                    contentLabel="Confirmación de deshabilitación"
                                    style={{
                                      overlay: {
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                      },
                                      content: {
                                        position: "relative",
                                        top: "auto",
                                        left: "auto",
                                        right: "auto",
                                        bottom: "auto",
                                        borderRadius: "8px",
                                        maxWidth: "400px", // Ajusta el ancho máximo aquí
                                        padding: "20px",
                                        textAlign: "center", // Centra el contenido del modal
                                      },
                                    }}
                                  >
                                    <h2>
                                      ¿Está seguro de deshabilitar su cuenta?
                                    </h2>
                                    <div className="d-flex justify-content-center">
                                      <button
                                        onClick={() => setShowModal(false)}
                                        className="btn btn-secondary mr-2"
                                      >
                                        Cancelar
                                      </button>
                                      <button
                                        onClick={confirmarDeshabilitarR}
                                        className="btn btn-danger ml-2"
                                      >
                                        Sí, deshabilitar
                                      </button>
                                    </div>
                                  </Modal>
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
