import React, { useContext, useRef, useState } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router-dom";
import { FaImage, FaSave, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import "./ProductosGestion.css";

const RegistrarProductos = () => {
  const [nombre, setNombre] = useState("");
  const [imagen, setImagen] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [aderezos, setAderezos] = useState("");
  const [precio, setPrecio] = useState("");
  const [estado, setEstado] = useState("false");
  const [saving, setSaving] = useState(false);
  const [reading, setReading] = useState(false);
  const busy = useRef(false);
  const imageRead = useRef(0);
  const { id } = useParams();
  const { state: puesto } = useLocation();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const handleImgChange = (event) => {
    const version = ++imageRead.current;
    const file = event.target.files?.[0];
    setImagen(""); setReading(false);
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Elegí un archivo de imagen."); event.target.value = ""; return; }
    setReading(true);
    const reader = new FileReader();
    reader.onload = () => { if (imageRead.current === version) { setImagen(reader.result); setReading(false); } };
    reader.onerror = () => { if (imageRead.current === version) { setReading(false); toast.error("No pudimos leer la imagen. Elegí otra."); } };
    reader.readAsDataURL(file);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy.current || reading) return;
    if (![nombre, descripcion, aderezos].every((value) => value.trim())) { toast.error("Completá el nombre, la descripción y los aderezos."); return; }
    if (precio === "" || !Number.isFinite(Number(precio)) || Number(precio) < 0) { toast.error("Ingresá un precio mayor o igual a 0."); return; }
    if (!imagen) { toast.error("Elegí una imagen para el producto."); return; }
    busy.current = true; setSaving(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}producto`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nombre: nombre.trim(), imagen, descripcion: descripcion.trim(), aderezos: aderezos.trim(), estado: estado === "true", puestoId: Number(id), precio: Number(precio) }) });
      const data = await response.json();
      if (!response.ok || ![200, 201].includes(Number(data.code))) throw new Error("No pudimos registrar el producto. Intentá nuevamente.");
      toast.success("Producto registrado correctamente");
      navigate(`/listado-productos/${id}`, { state: puesto });
    } catch (err) { toast.error(err.message || "Error al registrar el producto"); }
    finally { busy.current = false; setSaving(false); }
  };
  return <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
    <main className="qf-product-management">
      <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis puestos", url: "/listado-puestos-encargado" }, { title: "Mis productos", url: `/listado-productos/${id}` }, { title: "Agregar producto", url: `/registrar-productos/${id}` }]} />
      <header className="qf-management-header"><div><h1>Crear Producto Nuevo</h1><p>{puesto?.nombreCarro ? `Sumá una nueva opción a la carta de ${puesto.nombreCarro}.` : "Completá los datos que verán tus clientes en la carta."}</p></div><Link className="qf-management-button" to={`/listado-productos/${id}`} state={puesto}><FaArrowLeft aria-hidden="true" /> Volver</Link></header>
      <form className="qf-product-form" onSubmit={handleSubmit}>
        <fieldset disabled={saving}>
          <legend>Información del producto</legend>
          <div className="qf-product-entry-layout">
            <section className="qf-product-photo-section" aria-label="Foto del producto">
              <label className="qf-product-photo-label" htmlFor="imagen">Foto del producto</label>
              <div className="qf-product-photo-preview">{imagen ? <img src={imagen} alt="Vista previa del producto" /> : <div><FaImage aria-hidden="true" /><span>Mostrá lo rico que se ve</span><small>La foto aparecerá en la carta del puesto</small></div>}</div>
              <input type="file" id="imagen" aria-label="Imagen del producto" accept="image/*" onChange={handleImgChange} required aria-describedby="product-photo-help" />
              <p id="product-photo-help" className="qf-product-field-help" role="status">{reading ? "Cargando imagen…" : "Elegí una foto clara, con el producto en el centro."}</p>
            </section>
            <section className="qf-product-data-section" aria-label="Datos del producto">
              <div className="qf-product-entry-fields">
                <label htmlFor="nombre">Nombre del Producto<input id="nombre" value={nombre} onChange={(event) => setNombre(event.target.value)} placeholder="Ej.: Hamburguesa completa" required /></label>
                <label htmlFor="precio">Precio<div className="qf-product-price-input"><span aria-hidden="true">$</span><input id="precio" aria-label="Precio" type="number" inputMode="decimal" min="0" step="0.01" value={precio} onChange={(event) => setPrecio(event.target.value)} placeholder="0,00" required /></div></label>
                <label className="qf-product-entry-wide" htmlFor="descripcion">Descripción<textarea id="descripcion" value={descripcion} onChange={(event) => setDescripcion(event.target.value)} placeholder="Contá qué incluye: ingredientes, tamaño o porción." required /></label>
                <label className="qf-product-entry-wide" htmlFor="aderezos">Aderezos<textarea id="aderezos" value={aderezos} onChange={(event) => setAderezos(event.target.value)} placeholder="Ej.: Mayonesa y ketchup. Si no incluye, escribí ‘Sin aderezos’." required /></label>
                <div className="qf-product-entry-wide qf-product-availability">
                  <label htmlFor="estado">Disponibilidad<select id="estado" value={estado} onChange={(event) => setEstado(event.target.value)} aria-describedby="product-status-help"><option value="false">Standby</option><option value="true">Listo para la venta</option></select></label>
                  <p id="product-status-help" className="qf-product-field-help">{estado === "true" ? "El producto quedará listo para ofrecerlo a tus clientes." : "Guardalo en espera hasta que esté listo para la venta."}</p>
                </div>
              </div>
            </section>
          </div>
        </fieldset>
        <div className="qf-product-form-actions"><span className="qf-product-field-help">Completá todos los campos para registrar el producto.</span><div><button className="qf-management-button" type="button" disabled={saving} onClick={() => navigate(`/listado-productos/${id}`, { state: puesto })}>Cancelar</button><button className="qf-management-button qf-management-button--primary" type="submit" disabled={saving || reading}><FaSave aria-hidden="true" />{saving ? "Registrando…" : "Registrar"}</button></div></div>
      </form>
    </main><Footer />
  </PageLayout>;
};
export default RegistrarProductos;
