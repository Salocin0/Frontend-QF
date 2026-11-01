import React, { useContext, useEffect } from "react";
import { Dialog } from "@mui/material";
import { Link } from "react-router-dom";
import { FaMotorcycle, FaBoxOpen, FaCalendarAlt, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { UserContext } from "../ComponentesGenerales/UserContext";
import "./estadisticasPerfil/Perfil.css";
const RepartidorComponent = ({ mostrarContenidoRepartidor, confirmarDeshabilitarR, showModal, setShowModal, setMostrarContenidoRepartidor, setMostrarBotonHabilitarDeNuevoR }) => {
  const { user } = useContext(UserContext);
    const cargarDatos = React.useCallback(async (user) => {
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
    }, [setMostrarContenidoRepartidor, setMostrarBotonHabilitarDeNuevoR]);

    useEffect(() => {
      if (user) {
        cargarDatos(user);
      }
    }, [user, cargarDatos]);

  if (!mostrarContenidoRepartidor) return null;
  return <section className="qf-delivery-profile-role" aria-labelledby="delivery-role-title">
    <header><div className="qf-delivery-profile-icon"><FaMotorcycle aria-hidden="true" /></div><div><h2 id="delivery-role-title">Mi perfil de repartidor</h2><p>Administrá tu participación en eventos y consultá tus entregas.</p></div><span className="qf-delivery-profile-status">Rol habilitado</span></header>
    <nav className="qf-delivery-profile-links" aria-label="Actividad del repartidor"><Link className="qf-delivery-profile-button" to="/pedidos-asignados"><FaBoxOpen aria-hidden="true" /> Pedidos asignados</Link><Link className="qf-delivery-profile-button" to="/misAsociacionesR"><FaCalendarAlt aria-hidden="true" /> Mis asociaciones</Link></nav>
    <footer><div><h3>Estado de mi rol</h3><p>Podés deshabilitar tu rol de repartidor desde acá.</p></div><button type="button" className="qf-delivery-profile-button" onClick={() => setShowModal(true)}>Deshabilitar rol</button></footer>
    <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="sm" aria-labelledby="disable-courier-title" className="qf-delivery-profile-dialog" slotProps={{ paper: { className: "qf-delivery-profile-paper" } }}><header><h2 id="disable-courier-title">Deshabilitar rol de repartidor</h2><button type="button" className="qf-delivery-profile-button" aria-label="Cerrar" onClick={() => setShowModal(false)}><FaTimes aria-hidden="true" /></button></header><div><p>¿Querés deshabilitar el rol de repartidor de tu cuenta?</p><footer><button type="button" className="qf-delivery-profile-button" onClick={() => setShowModal(false)}>Cancelar</button><button type="button" className="qf-delivery-profile-button" onClick={confirmarDeshabilitarR}>Deshabilitar</button></footer></div></Dialog>
  </section>;
};
export default RepartidorComponent;
