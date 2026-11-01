import React, { useContext, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaPen, FaToggleOff, FaToggleOn } from "react-icons/fa";
import { toast } from "react-toastify";
import { UserContext } from "../ComponentesGenerales/UserContext";
import ConfirmDialog from "../ComponentesGenerales/ConfirmDialog";
import imgDefault from "../img/productoDefecto.png";
import "./ProductosGestion.css";

const Producto = ({ producto, recargar, isDisabled = false, onEnable }) => {
  const { user } = useContext(UserContext);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const changeStatus = async () => {
    if (busy.current) return;
    busy.current = true; setPending(true);
    try {
      if (isDisabled && onEnable) { await onEnable(); return; }
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}producto/${producto.id}${isDisabled ? "/habilitar" : ""}`, { method: isDisabled ? "PUT" : "DELETE", headers: { ConsumidorId: user?.consumidorId } });
      if (!response.ok) throw new Error("No pudimos actualizar el producto. Intentá nuevamente.");
      toast.success(isDisabled ? "Producto habilitado nuevamente con éxito" : "Producto deshabilitado correctamente");
      recargar();
    } catch (err) { toast.error(err.message); }
    finally { busy.current = false; setPending(false); }
  };
  return <article className="qf-managed-product">
    <div className="qf-managed-product-image"><img src={producto.img || imgDefault} alt={producto.nombre} /></div>
    <div className="qf-managed-product-info">{isDisabled && <span className="qf-managed-product-disabled-label">Deshabilitado</span>}<h2>{producto.nombre}</h2><p>{producto.descripcion}</p>{producto.aderezos && <p className="qf-managed-product-extras">Aderezos: {producto.aderezos}</p>}</div>
    <div className="qf-managed-product-controls"><strong className="qf-managed-product-price">{new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 2 }).format(Number(producto.precio) || 0)}</strong><Link className={`qf-management-button${isDisabled ? "" : " qf-management-button--primary"}`} to={`/producto/${producto.id}`}><FaPen aria-hidden="true" /> Editar</Link><button className={`qf-management-button qf-managed-product-toggle${isDisabled ? " qf-management-button--primary" : ""}`} type="button" disabled={pending} onClick={() => isDisabled ? changeStatus() : setShowConfirm(true)}>{isDisabled ? <FaToggleOn aria-hidden="true" /> : <FaToggleOff aria-hidden="true" />}{pending ? "Actualizando…" : isDisabled ? "Habilitar" : "Deshabilitar"}</button></div>
    <ConfirmDialog open={showConfirm} title="Deshabilitar producto" message={`¿Estás seguro de que querés deshabilitar el producto "${producto.nombre}"?`} onConfirm={() => { setShowConfirm(false); changeStatus(); }} onCancel={() => setShowConfirm(false)} />
  </article>;
};
export default Producto;
