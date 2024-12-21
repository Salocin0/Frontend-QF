import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import { UserContext } from "../ComponentesGenerales/UserContext";
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
  const [mostrarBotonHabilitarDeNuevoR, setMostrarBotonHabilitarDeNuevoR] =
    useState(false);
  const [mostrarBotonHabilitarDeNuevoEPC, setMostrarBotonHabilitarDeNuevoEPC] =
    useState(false);
  const [mostrarBotonHabilitarDeNuevoPE, setMostrarBotonHabilitarDeNuevoPE] =
    useState(false);
  const isCuitValid = (cuitEPC) => {
    console.log("Entre" + cuitEPC);
    const regexCuit = /^(20|23|27|30|33)([0-9]{9}|-[0-9]{8}-[0-9]{1})$/g;
    if (!cuitEPC.trim()) {
      return false;
    }
    return regexCuit.test(cuitEPC);
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
        updateUser({ ...user, tipoUsuario: "consumidor" });
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
        updateUser({ ...user, tipoUsuario: "productor" });
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
        updateUser({ ...user, tipoUsuario: "consumidor" });
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
        updateUser({ ...user, tipoUsuario: "encargado" });
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
        updateUser({ ...user, tipoUsuario: "consumidor" });
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
        updateUser({ ...user, tipoUsuario: "repartidor" });
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
        console.log(data1);
        if (
          data1.data.productor?.habilitado === true &&
          (data1.data.productor?.cuit || data1.data.productor?.razonSocial)
        ) {
          setMostrarContenidoProductor(true);
        } else if (data1.data.productor?.habilitado === false) {
          setMostrarContenidoProductor(false);
        }

        if (
          data1.data.encargado?.habilitado === true &&
          (data1.data.encargado?.cuit !== undefined ||
            data1.data.encargado?.razonSocial !== undefined)
        ) {
          setMostrarContenidoEncargadoPuesto(true);
        } else if (data1.data.encargado?.habilitado === false) {
          setMostrarBotonHabilitarDeNuevoEPC(true);
        }

        if(data1.data.repartidore?.habilitado === true) {
          setMostrarContenidoRepartidor(true);
        }else if (data1.data.repartidore?.habilitado === false) {
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
      marginRight: "Calc(25% + 20px)",
      flexDirection: "column",
      marginLeft: "calc(20% + 20px)",
      marginBottom: "20px",
    },
    placeholderWrapper: {
      width: "25%",
      position: "fixed",
      top: "0",
      right: "0",
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
                    mostrarBotonHabilitarDeNuevoR={
                      mostrarBotonHabilitarDeNuevoR
                    }
                    handleVolverAHabilitarR={handleVolverAHabilitarR}
                    mostrarBotonHabilitarDeNuevoEPC={
                      mostrarBotonHabilitarDeNuevoEPC
                    }
                    handleVolverAHabilitarEPC={handleVolverAHabilitarEPC}
                    mostrarBotonHabilitarDeNuevoPE={
                      mostrarBotonHabilitarDeNuevoPE
                    }
                    handleVolverAHabilitarPE={handleVolverAHabilitarPE}
                  />
                  <EventProducerForm
                    mostrarContenidoProductor={mostrarContenidoProductor}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    confirmarDeshabilitarPE={confirmarDeshabilitarPE}
                    setMostrarContenidoProductor={setMostrarContenidoProductor}
                    isCuitValid={isCuitValid}
                  />
                  <EncargadoPuesto
                    mostrarContenidoEncargadoPuesto={
                      mostrarContenidoEncargadoPuesto
                    }
                    confirmarDeshabilitarEPC={confirmarDeshabilitarEPC}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    setMostrarContenidoEncargadoPuesto={
                      setMostrarContenidoEncargadoPuesto
                    }
                    isCuitValid={isCuitValid}
                    setMostrarBotonHabilitarDeNuevoEPC={
                      setMostrarBotonHabilitarDeNuevoEPC
                    }
                  />
                  <RepartidorComponent
                    mostrarContenidoRepartidor={mostrarContenidoRepartidor}
                    confirmarDeshabilitarR={confirmarDeshabilitarR}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    setMostrarContenidoRepartidor={setMostrarContenidoRepartidor}
                    setMostrarBotonHabilitarDeNuevoR={setMostrarBotonHabilitarDeNuevoR}
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
