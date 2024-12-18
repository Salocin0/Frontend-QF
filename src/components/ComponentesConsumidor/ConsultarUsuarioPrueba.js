import React, { useContext, useEffect, useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useNavigate } from "react-router-dom";
import UserProfileForm from "./FormUserPerfil";
import EventProducerForm from "./FormEventPerfil";
import EncargadoPuesto from "./FormEncargadoPerfil";
import RepartidorComponent from "./FormRepartidorPerfil";
import useDynamicColors from "../../UseDinamicColors";

const ConsultarUsuario = () => {
  const [showModal, setShowModal] = useState(false);
  const Colors = useDynamicColors();
  const { user, updateUser } = useContext(UserContext);
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
  const [provinciaC, setProvinciaC] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [, setLocalidadPrueba] = useState("");
  const [filteredLocalidades, setFilteredLocalidades] = useState([]);
  const [provincias, setProvincias] = useState([]);

  const [telefono, setTelefono] = useState("");
  const [, setTelefonoC] = useState("");

  const [cuitPE, setCuitPE] = useState("");
  const [cuitEPC, setCuitEPC] = useState("");

  const [razonSocialEPC, setRazonSocialEPC] = useState("");
  const [condicionEPC, setCondicionEPC] = useState("");
  const [condicionIvaPE, setCondicionPE] = useState("");

  const [razonSocialPE, setRazonSocialPE] = useState("");
  const [, setDocumentos] = useState("");

  const [username, setUsername] = useState("");
  const [, setUsernameC] = useState("");

  const [isDisabled, setIsDisabled] = useState(true);
  const [isDisabledC, setIsDisabledC] = useState(true);
  const [, setIsDisabledPE] = useState(true);
  const [, setIsDisabledEPC] = useState(true);
  const [isDisabledR, setIsDisabledR] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [editModeC, setEditModeC] = useState(false);
  const [editModePE, setEditModePE] = useState(false);
  const [editModeEPC, setEditModeEPC] = useState(false);
  const [editModeR, setEditModeR] = useState(false);

  const [mostrarBotonHabilitarDeNuevoR, setMostrarBotonHabilitarDeNuevoR] =
    useState(false);
  const [mostrarBotonHabilitarDeNuevoEPC, setMostrarBotonHabilitarDeNuevoEPC] =
    useState(false);
  const [mostrarBotonHabilitarDeNuevoPE, setMostrarBotonHabilitarDeNuevoPE] =
    useState(false);

  const navigate = useNavigate();

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

  const handleFechaNacimientoChangeC = (e) => {
    setFechaNacimiento(e.target.value);
  };

  const handleDniChangeC = (e) => {
    setDniC(e.target.value);
  };

  const handleLocalidadChange = (e) => {
    setLocalidad(e.target.value);
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

  const handleDocumentosChangeEPC = (e) => {
    setDocumentos(e.target.files);
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
    cargarDatos(user);
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
        `${process.env?.REACT_APP_BACK_URL}consumidor/${user.consumidorId}`,
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

  const handleEliminarCuenta = async () => {
    try {
      console.log(user);
      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}user/${user.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Cuenta deshabilitada correctamente");
        navigate(`/login`);
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al eliminar los datos del productor:", error);
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
    cargarDatos(user);
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
        `${process.env?.REACT_APP_BACK_URL}productor/${user.consumidorId}`,
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
        `${process.env?.REACT_APP_BACK_URL}productor/${user.consumidorId}`,
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
        updateUser({ user: { ...user, tipoUsuario: "consumidor" } });
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
        `${process.env?.REACT_APP_BACK_URL}productor/${user.consumidorId}/habilitacion`,
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
        updateUser({ user: { ...user, tipoUsuario: "productor" } });
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
    cargarDatos(user);
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
        `${process.env?.REACT_APP_BACK_URL}encargado/${user.consumidorId}`,
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
    setShowModal(true);
  };

  const confirmarDeshabilitarEPC = async () => {
    try {
      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}encargado/${user.consumidorId}`,
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
        updateUser({ user: { ...user, tipoUsuario: "consumidor" } });
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
        `${process.env?.REACT_APP_BACK_URL}encargado/${user.consumidorId}/habilitacion`,
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
        updateUser({ user: { ...user, tipoUsuario: "encargado" } });
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
        `${process.env?.REACT_APP_BACK_URL}repartidor/${user.consumidorId}`,
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
        updateUser({ user: { ...user, tipoUsuario: "consumidor" } });
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
        `${process.env?.REACT_APP_BACK_URL}repartidor/${user.consumidorId}`,
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
        updateUser({ user: { ...user, tipoUsuario: "repartidor" } });
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
        `${process.env?.REACT_APP_BACK_URL}consumidor/${user.consumidorId}`,
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
        console.log(data1.data.provincia);
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
        } else if (data1.data.encargado?.habilitado === false) {
          setMostrarBotonHabilitarDeNuevoEPC(true);
        }

        console.log(data1.data.repartidore?.habilitado);
        if (data1.data.repartidore?.habilitado === false) {
          setMostrarContenidoRepartidor(false);
          setMostrarBotonHabilitarDeNuevoR(true);
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

  const styles = {
    background: {
      display: "flex",
      backgroundColor: Colors.GrisAzuladoOscuro,
    },
    contentWrapper: { display: "flex", flexDirection: "row", height: "100%" },
    mainContent: {
      display: "flex",
      marginRight:"Calc(25% + 20px)",
      flexDirection: "column",
      marginLeft: "calc(20% + 20px)",
      marginBottom: "20px",
    },
    placeholderWrapper: {
      width: "25%",
      position: "fixed",
      top:"0",
      right:"0",
      height: "Calc(100vh - 100px)",
      backgroundColor: Colors.GrisAzuladoClaro,
      borderRadius: "10px",
      border: `1px solid ${Colors.Blanco}`,
      color: Colors.Blanco,
      margin: "20px",
      marginLeft: "0px",
      padding: "20px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    card: {
      marginBottom: "2rem",
      marginTop: "20px",
      display: "flex",
      flexDirection: "column",
      backgroundColor: Colors.GrisAzuladoOscuro,
    },
    cardBody: { paddingRight: "20px", marginBottom: "1.5rem" },
    formWrapper: { width: "100%" },
  };

  return (
    <div style={styles.background}>
      <Sidebar tipoUsuario={user?.tipoUsuario} />
      <div style={styles.contentWrapper}>
        <div style={styles.mainContent}>
          <div style={styles.card}>
            <div style={styles.cardBody}>
              <form className="needs-validation">
                <section style={styles.formWrapper}>
                  <UserProfileForm
                    username={username}
                    setUsername={setUsername}
                    nombreC={nombreC}
                    setNombreC={setNombreC}
                    apellidoC={apellidoC}
                    setApellidoC={setApellidoC}
                    fechaNacimiento={fechaNacimiento}
                    setFechaNacimiento={setFechaNacimiento}
                    dniC={dniC}
                    setDniC={setDniC}
                    telefono={telefono}
                    setTelefono={setTelefono}
                    selectedProvince={selectedProvince}
                    setSelectedProvince={setSelectedProvince}
                    localidad={localidad}
                    setLocalidad={setLocalidad}
                    provincias={provincias}
                    provinciaC={provinciaC}
                    filteredLocalidades={filteredLocalidades}
                    editModeC={editModeC}
                    isDisabledC={isDisabledC}
                    handleProvinceChange={handleProvinceChange}
                    handleEditModeToggleC={handleEditModeToggleC}
                    handleSaveChangesC={handleSaveChangesC}
                    handleCancelChangesC={handleCancelChangesC}
                    handleEliminarCuenta={handleEliminarCuenta}
                    handleVolverAHabilitarR={handleVolverAHabilitarR}
                    handleVolverAHabilitarEPC={handleVolverAHabilitarEPC}
                    handleVolverAHabilitarPE={handleVolverAHabilitarPE}
                  />
                  <EventProducerForm
                    mostrarContenidoProductor={mostrarContenidoProductor}
                    editModePE={editModePE}
                    handleEditModeTogglePE={handleEditModeTogglePE}
                    handleSaveChangesPE={handleSaveChangesPE}
                    handleCancelChangesPE={handleCancelChangesPE}
                    cuitPE={cuitPE}
                    handleCuitChangePE={handleCuitChangePE}
                    razonSocialPE={razonSocialPE}
                    handleRazonSocialChangePE={handleRazonSocialChangePE}
                    condicionIvaPE={condicionIvaPE}
                    handleCondicionPE={handleCondicionPE}
                    handleDeshabilitarPE={handleDeshabilitarPE}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    confirmarDeshabilitarPE={confirmarDeshabilitarPE}
                  />
                  <EncargadoPuesto
                    mostrarContenidoEncargadoPuesto={
                      mostrarContenidoEncargadoPuesto
                    }
                    editModeEPC={editModeEPC}
                    cuitEPC={cuitEPC}
                    razonSocialEPC={razonSocialEPC}
                    condicionEPC={condicionEPC}
                    handleSaveChangesEPC={handleSaveChangesEPC}
                    handleCancelChangesEPC={handleCancelChangesEPC}
                    handleEditModeToggleEPC={handleEditModeToggleEPC}
                    handleCuitChangeEPC={handleCuitChangeEPC}
                    handleRazonSocialChangeEPC={handleRazonSocialChangeEPC}
                    handleCondicionEPC={handleCondicionEPC}
                    handleDeshabilitarEPC={handleDeshabilitarEPC}
                    confirmarDeshabilitarEPC={confirmarDeshabilitarEPC}
                    showModal={showModal}
                    setShowModal={setShowModal}
                  />
                  <RepartidorComponent
                    mostrarContenidoRepartidor={mostrarContenidoRepartidor}
                    handleSaveChangesR={handleSaveChangesR}
                    handleDeshabilitarR={handleDeshabilitarR}
                    confirmarDeshabilitarR={confirmarDeshabilitarR}
                    showModal={showModal}
                    setShowModal={setShowModal}
                  />
                </section>
              </form>
            </div>
          </div>
        </div>
        <div style={styles.placeholderWrapper}>
          <div>Placeholder</div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ConsultarUsuario;
