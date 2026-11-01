import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaIdBadge, FaPhone, FaToggleOn, FaInfoCircle } from "react-icons/fa";
import { UserContext } from "../ComponentesGenerales/UserContext";
import imgDefault from "../img/puestoLogoDefault.jpg";
import "./MisPuestos.css";
import "./PuestosDeshabilitados.css";
const PuestoDeshabilitado = ({ carrito, recargar }) => {
  const { user } = useContext(UserContext);
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const handleHabilitar = async () => {
    if (busy.current) return;
    busy.current = true; setPending(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}puesto/${carrito.id}/habilitacion`, { method: "PUT", headers: { ConsumidorId: user?.consumidorId ?? user?.id } });
      if (!response.ok) throw new Error("No pudimos habilitar el puesto. Intentá nuevamente.");
      toast.success("Puesto habilitado nuevamente");
      recargar();
    } catch (err) { toast.error(err.message || "Error al habilitar el puesto"); }
    finally { busy.current = false; setPending(false); }
  };
  return <article className="qf-owned-stand" aria-label={carrito.nombreCarro}>
    <div className="qf-owned-stand-image"><img src={carrito.img || imgDefault} alt={`Puesto ${carrito.nombreCarro}`} onError={(event) => { if (event.currentTarget.getAttribute("src") !== imgDefault) event.currentTarget.src = imgDefault; }} /></div>
    <div className="qf-owned-stand-body"><div className="qf-owned-stand-heading"><h2>{carrito.nombreCarro}</h2><span className="qf-owned-stand-status qf-owned-stand-status--disabled">Deshabilitado</span></div>
      <dl className="qf-owned-stand-meta"><div><dt><FaIdBadge aria-hidden="true" /> Número de puesto</dt><dd>{carrito.numeroCarro || "Sin número"}</dd></div><div><dt><FaPhone aria-hidden="true" /> Teléfono</dt><dd>{carrito.telefonoCarro || "Sin teléfono"}</dd></div></dl>
      <div className="qf-disabled-stand-actions"><Link className="qf-disabled-stand-link" to={`/info-puesto/${carrito.id}`} state={carrito}><FaInfoCircle aria-hidden="true" /> Información</Link><button type="button" className="qf-owned-primary" onClick={handleHabilitar} disabled={pending}><FaToggleOn aria-hidden="true" />{pending ? "Habilitando…" : "Habilitar puesto"}</button></div>
    </div>
  </article>;
};
export default PuestoDeshabilitado;
