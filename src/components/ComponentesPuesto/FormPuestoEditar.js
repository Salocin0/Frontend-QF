import React, { useState, useEffect, useRef } from "react";
import { FaPen, FaSave, FaStore, FaPhone, FaIdBadge } from "react-icons/fa";
import { toast } from "react-toastify";
import imgDefault from "../img/puestoLogoDefault.jpg";
import "./PuestoInformacion.css";
const fieldsFrom = (stand) => ({ numeroCarro: stand.numeroCarro ?? "", nombreCarro: stand.nombreCarro ?? "", tipoNegocio: stand.tipoNegocio ?? "", telefonoCarro: stand.telefonoCarro ?? "" });
function FormPuestoEditar({ carrito, onSaved }) {
  const [editMode, setEditMode] = useState(false);
  const [fields, setFields] = useState(() => fieldsFrom(carrito));
  const [saved, setSaved] = useState(() => fieldsFrom(carrito));
  const [saving, setSaving] = useState(false);
  const busy = useRef(false);
  useEffect(() => { const data = fieldsFrom(carrito); setFields(data); setSaved(data); setEditMode(false); }, [carrito]);
  const change = (event) => setFields((current) => ({ ...current, [event.target.name]: event.target.value }));
  const cancel = () => { setFields({ ...saved }); setEditMode(false); };
  const handleSave = async (event) => {
    event.preventDefault();
    if (!editMode || busy.current) return;
    const puesto = Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, String(value).trim()]));
    if (Object.values(puesto).some((value) => !value)) { toast.error("Completá todos los datos del puesto."); return; }
    busy.current = true; setSaving(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}puesto/${carrito.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ puesto }) });
      if (!response.ok) throw new Error("No pudimos actualizar el puesto. Intentá nuevamente.");
      setFields(puesto); setSaved(puesto); setEditMode(false);
      onSaved?.({ ...carrito, ...puesto });
      toast.success("Puesto actualizado correctamente");
    } catch (err) { toast.error(err.message || "Error al actualizar puesto"); }
    finally { busy.current = false; setSaving(false); }
  };
  return <form className={`qf-stand-info-form${editMode ? " qf-stand-info-form--editing" : ""}`} onSubmit={handleSave}>
    <div className="qf-stand-info-form-heading"><h2>Datos del puesto</h2><span>{editMode ? "Modo edición" : "Información general"}</span></div>
    <div className="qf-stand-info-layout">
      <aside className="qf-stand-info-identity"><img src={carrito.img || imgDefault} alt={`Puesto ${saved.nombreCarro}`} /><h3>{saved.nombreCarro}</h3>{carrito.estado && <span className="qf-stand-info-status">{String(carrito.estado).replace(/([a-z])([A-Z])/g, "$1 $2")}</span>}<p>{saved.tipoNegocio || "Puesto de comida"}</p></aside>
      <fieldset disabled={!editMode || saving}><legend className="qf-stand-info-sr">Datos del puesto</legend><div className="qf-stand-info-fields">
        <label htmlFor="idCarro"><span><FaIdBadge aria-hidden="true" /> N° ID Carro</span><input type="number" id="idCarro" name="numeroCarro" value={fields.numeroCarro} onChange={change} required /></label>
        <label htmlFor="nombreCarro"><span><FaStore aria-hidden="true" /> Nombre Carro</span><input id="nombreCarro" name="nombreCarro" value={fields.nombreCarro} onChange={change} required /></label>
        <label htmlFor="tipoNegocio"><span>Tipo de Negocio</span><input id="tipoNegocio" name="tipoNegocio" value={fields.tipoNegocio} onChange={change} placeholder="Ej.: Hamburguesería" required /></label>
        <label htmlFor="telefonoCarro"><span><FaPhone aria-hidden="true" /> Teléfono del Carro de Comida</span><input type="tel" id="telefonoCarro" name="telefonoCarro" value={fields.telefonoCarro} onChange={change} required /></label>
      </div></fieldset>
    </div>
    <footer className="qf-stand-info-form-footer"><p>{editMode ? "Guardá los cambios cuando termines de editar." : "Seleccioná Editar para modificar la información."}</p><div>{editMode ? <><button className="qf-stand-info-button" type="button" disabled={saving} onClick={cancel}>Cancelar</button><button className="qf-stand-info-button qf-stand-info-button--primary" type="submit" disabled={saving}><FaSave aria-hidden="true" />{saving ? "Guardando…" : "Guardar"}</button></> : <button className="qf-stand-info-button qf-stand-info-button--primary" type="button" onClick={() => setEditMode(true)}><FaPen aria-hidden="true" /> Editar</button>}</div></footer>
  </form>;
}
export default FormPuestoEditar;
