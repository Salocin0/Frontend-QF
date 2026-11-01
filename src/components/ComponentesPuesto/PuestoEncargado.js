import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmDialog from "../ComponentesGenerales/ConfirmDialog";
import imgDefault from "../img/puestoLogoDefault.jpg";
import { FaIdBadge, FaPhone, FaCalendarPlus, FaBoxOpen, FaClipboardList, FaInfoCircle, FaToggleOff, FaToggleOn } from "react-icons/fa";
import "./MisPuestos.css";

const PuestoEncargado = ({ carrito, actualizarListado }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const requestInFlight = useRef(false);
  const created = carrito.estado === "Creado";
  const disabled = carrito.estado === "Deshabilitado";
  const changeStatus = async (action) => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setPending(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}puesto/cambiarEstado/${carrito.id}/${action}`, { method: "POST" });
      if (!response.ok) throw new Error("No pudimos actualizar el estado. Intentá nuevamente.");
      toast.success(action === "habilitar" ? "Puesto habilitado con éxito" : "Puesto deshabilitado con éxito");
      actualizarListado();
    } catch (err) {
      toast.error(err.message);
    } finally {
      requestInFlight.current = false;
      setPending(false);
    }
  };
  const open = (route) => navigate(`/${route}/${carrito.id}`, { state: carrito });
  return (
    <article className="qf-owned-stand" aria-label={carrito.nombreCarro}>
      <div className="qf-owned-stand-image"><img src={carrito.img || imgDefault} alt={`Puesto ${carrito.nombreCarro}`} onError={(event) => { event.currentTarget.onerror = null; if (event.currentTarget.getAttribute("src") !== imgDefault) event.currentTarget.src = imgDefault; }} /></div>
      <div className="qf-owned-stand-body">
        <div className="qf-owned-stand-heading"><h2>{carrito.nombreCarro}</h2><span className={`qf-owned-stand-status${disabled ? " qf-owned-stand-status--disabled" : ""}`}>{String(carrito.estado || "Sin estado").replace(/([a-záéíóú])([A-Z])/g, "$1 $2")}</span></div>
        <dl className="qf-owned-stand-meta">
          <div><dt><FaIdBadge aria-hidden="true" /> Número de puesto</dt><dd>{carrito.numeroCarro || "Sin número"}</dd></div>
          <div><dt><FaPhone aria-hidden="true" /> Teléfono</dt><dd>{carrito.telefonoCarro || "Sin teléfono"}</dd></div>
        </dl>
        <div className="qf-owned-stand-actions">
          <button className="qf-owned-primary" type="button" onClick={() => open("listado-productos")}><FaBoxOpen aria-hidden="true" /> Productos</button>
          <button type="button" onClick={() => open("pedidos-Encargado")}><FaClipboardList aria-hidden="true" /> Pedidos en curso</button>
          <button type="button" onClick={() => open("info-puesto")}><FaInfoCircle aria-hidden="true" /> Información</button>
          {created && <button type="button" onClick={() => navigate(`/asociarPuestoAEvento/${carrito.id}`)}><FaCalendarPlus aria-hidden="true" /> Asociar a evento</button>}
        </div>
        {(created || disabled) && <div className="qf-owned-stand-footer"><button type="button" disabled={pending} onClick={() => disabled ? changeStatus("habilitar") : setShowConfirm(true)}>{disabled ? <FaToggleOn aria-hidden="true" /> : <FaToggleOff aria-hidden="true" />}{pending ? "Actualizando…" : disabled ? "Habilitar puesto" : "Deshabilitar puesto"}</button></div>}
      </div>
      <ConfirmDialog open={showConfirm} title="Deshabilitar puesto" message={`¿Estás seguro de que querés deshabilitar el puesto "${carrito.nombreCarro}"?`} onConfirm={() => { setShowConfirm(false); changeStatus("deshabilitar"); }} onCancel={() => setShowConfirm(false)} />
    </article>
  );
};
export default PuestoEncargado;
