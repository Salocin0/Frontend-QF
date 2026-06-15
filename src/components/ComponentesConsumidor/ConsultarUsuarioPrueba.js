import React, { useContext, useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { UserContext } from "../ComponentesGenerales/UserContext";
import UserProfileForm from "./FormUserPerfil";
import EventProducerForm from "./FormEventPerfil";
import EncargadoPuesto from "./FormEncargadoPerfil";
import RepartidorComponent from "./FormRepartidorPerfil";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import EstadisticasPerfil from "./estadisticasPerfil/EstadisticasPerfil";
const ConsultarUsuario = () => {
  const contentRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(999);
  const isNarrowLayout = contentWidth <= 780;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContentWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  const [showModal, setShowModal] = useState(false);
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


  
  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mi Perfil", url: "/Listado-eventos" },
  ];
  
  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flex: 1,
        minHeight: 0,
        boxSizing: "border-box",
      }}>
        {/* Header full-width centrado */}
        <div className="qf-page-header qf-page-header--full" style={{ textAlign: "center" }}>
          <h1 className="qf-page-title" style={{ textAlign: "center", fontSize: "1.75rem" }}>
            Mi Perfil
          </h1>
          <hr className="qf-separator qf-separator--spaced" />
        </div>

        {/* Breadcrumb full-width (siempre arriba) */}
        <Breadcrumb items={breadcrumbItems} style={{
          margin: 0,
          marginBottom: "20px",
          backgroundColor: 'var(--qf-bg-secondary)',
          width: '100%',
          padding: '8px 16px',
          borderRadius: '10px',
          border: '1px solid var(--qf-naranja)',
          boxSizing: 'border-box',
        }} />

        {/* Contenido: dos columnas responsive */}
        <div
          ref={contentRef}
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: isNarrowLayout ? "column" : "row",
            gap: "20px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Columna izquierda: forms */}
          <div style={{ flex: 1, minWidth: 0, order: isNarrowLayout ? 1 : 0 }}>
            <section style={{ width: "100%" }}>
              <UserProfileForm
                mostrarBotonHabilitarDeNuevoR={mostrarBotonHabilitarDeNuevoR}
                handleVolverAHabilitarR={handleVolverAHabilitarR}
                mostrarBotonHabilitarDeNuevoEPC={mostrarBotonHabilitarDeNuevoEPC}
                handleVolverAHabilitarEPC={handleVolverAHabilitarEPC}
                mostrarBotonHabilitarDeNuevoPE={mostrarBotonHabilitarDeNuevoPE}
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
          </div>

          {/* Columna derecha: estadísticas (no se estira) */}
          <aside style={{
            order: isNarrowLayout ? -1 : 0,
            width: isNarrowLayout ? "100%" : "320px",
            minWidth: isNarrowLayout ? "100%" : "320px",
            flexShrink: 0,
            alignSelf: "flex-start",
            position: isNarrowLayout ? "static" : "sticky",
            top: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}>
            <div style={{
              border: "1px solid var(--qf-naranja)",
              borderRadius: "10px",
              backgroundColor: "var(--qf-bg-secondary)",
              padding: "20px",
            }}>
              <EstadisticasPerfil />
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default ConsultarUsuario;
