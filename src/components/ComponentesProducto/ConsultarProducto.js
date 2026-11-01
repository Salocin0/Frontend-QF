import React, { useEffect, useState, useContext, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaPen, FaSave, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { UserContext } from "../ComponentesGenerales/UserContext";
import imgDefault from "../img/productoDefecto.png";
import "./ProductosGestion.css";

const toFields = (product) => ({ nombre: product.nombre ?? "", descripcion: product.descripcion ?? "", aderezos: product.aderezos ?? "", precio: product.precio ?? "", estado: product.estado === true || product.estado === "true" ? "true" : "false" });
const ConsultarProducto = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [fields, setFields] = useState(toFields({}));
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(false); setEditMode(false);
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}producto/${id}`, { signal: controller.signal });
        if (!response.ok) throw new Error("No se pudo cargar el producto");
        const data = await response.json();
        if (!data.data?.id) throw new Error("Producto no encontrado");
        if (!controller.signal.aborted) { setProducto(data.data); setFields(toFields(data.data)); }
      } catch (err) { if (!controller.signal.aborted) setError(true); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [id, attempt]);
  const change = (event) => setFields((current) => ({ ...current, [event.target.name]: event.target.value }));
  const cancel = () => { setFields(toFields(producto)); setEditMode(false); };
  const handleSaveChanges = async (event) => {
    event.preventDefault();
    if (!editMode || busy.current) return;
    if (!fields.nombre.trim() || !fields.descripcion.trim() || String(fields.precio).trim() === "") { toast.error("Nombre, descripción y precio son obligatorios"); return; }
    if (!Number.isFinite(Number(fields.precio)) || Number(fields.precio) < 0) { toast.error("El precio debe ser un número mayor o igual a 0"); return; }
    busy.current = true; setSaving(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}producto/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ producto: { ...producto, ...fields, nombre: fields.nombre.trim(), descripcion: fields.descripcion.trim(), precio: Number(fields.precio), estado: fields.estado === "true" } }) });
      if (!response.ok) throw new Error("No pudimos guardar los cambios. Intentá nuevamente.");
      toast.success("Cambios guardados correctamente");
      navigate(`/listado-productos/${producto.puestoId}`);
    } catch (err) { toast.error(err.message); }
    finally { busy.current = false; setSaving(false); }
  };
  const back = producto ? `/listado-productos/${producto.puestoId}` : "/listado-puestos-encargado";
  return <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
    <main className="qf-product-management">
      <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis puestos", url: "/listado-puestos-encargado" }, { title: "Mis productos", url: back }, { title: "Detalle del producto", url: `/producto/${id}` }]} />
      <header className="qf-management-header"><div><h1>{editMode ? "Editar producto" : "Detalle del producto"}</h1><p>{editMode ? "Actualizá los datos y guardá los cambios cuando termines." : "Consultá la información de tu producto o activá la edición para modificarla."}</p></div>{!saving && <Link className="qf-management-button" to={back}><FaArrowLeft aria-hidden="true" /> Volver</Link>}</header>
      {loading ? <p className="qf-management-empty" role="status">Cargando producto…</p> : error ? <div className="qf-management-empty" role="alert"><h2>No pudimos cargar el producto</h2><button type="button" className="qf-management-button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div> : <form className={`qf-product-form qf-product-edit-form${editMode ? " qf-product-edit-form--editing" : ""}`} onSubmit={handleSaveChanges}>
        <div className="qf-product-edit-heading"><h2>{producto.nombre}</h2><span>{editMode ? "Modo edición" : "Información del producto"}</span></div>
        <div className="qf-product-entry-layout">
          <div className="qf-product-photo-section"><div className="qf-product-photo-preview"><img src={producto.img || imgDefault} alt={producto.nombre} /></div><p className="qf-product-field-help">Imagen del producto en la carta del puesto.</p></div>
          <fieldset disabled={!editMode || saving} className="qf-product-edit-fields"><legend className="qf-visually-hidden">Datos del producto</legend><div className="qf-product-entry-fields">
            <label htmlFor="edit-name">Nombre<input id="edit-name" name="nombre" value={fields.nombre} onChange={change} required /></label>
            <label htmlFor="edit-price">Precio<div className="qf-product-price-input"><span aria-hidden="true">$</span><input id="edit-price" aria-label="Precio" name="precio" type="number" inputMode="decimal" min="0" step="0.01" value={fields.precio} onChange={change} required /></div></label>
            <label htmlFor="edit-description" className="qf-product-entry-wide">Descripción<textarea id="edit-description" name="descripcion" value={fields.descripcion} onChange={change} required /></label>
            <label htmlFor="edit-extras" className="qf-product-entry-wide">Aderezos<textarea id="edit-extras" name="aderezos" value={fields.aderezos} onChange={change} placeholder="Sin aderezos" /></label>
            <div className="qf-product-entry-wide qf-product-availability"><label htmlFor="edit-status">Estado<select id="edit-status" name="estado" value={fields.estado} onChange={change} aria-describedby="edit-status-help"><option value="false">Standby</option><option value="true">Listo para la venta</option></select></label><p id="edit-status-help" className="qf-product-field-help">{fields.estado === "true" ? "El producto está listo para la venta." : "El producto está en espera."}</p></div>
          </div></fieldset>
        </div>
        <div className="qf-product-form-actions"><span className="qf-product-field-help">{editMode ? "Los cambios se aplican al guardar." : "Seleccioná Editar para modificar los datos."}</span><div>{editMode ? <><button type="button" className="qf-management-button" disabled={saving} onClick={cancel}>Cancelar</button><button type="submit" className="qf-management-button qf-management-button--primary" disabled={saving}><FaSave aria-hidden="true" />{saving ? "Guardando…" : "Guardar Cambios"}</button></> : <button type="button" className="qf-management-button qf-management-button--primary" onClick={() => setEditMode(true)}><FaPen aria-hidden="true" /> Editar</button>}</div></div>
      </form>}
    </main><Footer />
  </PageLayout>;
};
export default ConsultarProducto;
