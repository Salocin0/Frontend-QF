import React, { useEffect, useState, useContext } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Producto from "./Producto";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import "../ComponentesGenerales/ListFilters.css";
import "./ProductosGestion.css";

const ListadoProductoDeshabilitado = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const { state: puesto } = useLocation();
  const [productos, setProductos] = useState([]);
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const consumerId = user?.consumidorId;
  useEffect(() => {
    if (!consumerId) return;
    const controller = new AbortController();
    setLoading(true); setError(false);
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}producto/${id}/deshabilitados`, { headers: { ConsumidorId: consumerId, puestoId: id }, signal: controller.signal });
        if (response.status === 404) { setProductos([]); return; }
        if (!response.ok) throw new Error("Error al cargar productos");
        const data = await response.json();
        setProductos(Array.isArray(data.data) ? data.data : []);
      } catch (err) { if (!controller.signal.aborted) setError(true); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [consumerId, id, attempt]);
  const filtered = productos.filter((product) => [product.nombre, product.descripcion].some((value) => String(value || "").toLocaleLowerCase("es").includes(search.trim().toLocaleLowerCase("es"))));
  if (sort === "name") filtered.sort((a, b) => String(a.nombre).localeCompare(String(b.nombre), "es"));
  if (sort === "price") filtered.sort((a, b) => Number(a.precio) - Number(b.precio));
  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <main className="qf-product-management">
        <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis puestos", url: "/listado-puestos-encargado" }, { title: "Mis productos", url: `/listado-productos/${id}` }, { title: "Deshabilitados", url: `/listado-productos-deshabilitados/${id}` }]} />
        <header className="qf-management-header"><div><h1>Productos deshabilitados</h1><p>{puesto?.nombreCarro ? `Productos de ${puesto.nombreCarro} que podés editar o volver a habilitar.` : "Revisá los productos de tu puesto y volvé a habilitarlos cuando estén disponibles."}</p></div><div className="qf-management-header-actions"><Link className="qf-management-button" to={`/listado-productos/${id}`} state={puesto}><FaArrowLeft aria-hidden="true" /> Productos habilitados</Link><Link className="qf-management-button qf-management-button--primary" to={`/registrar-productos/${id}`} state={puesto}><FaPlus aria-hidden="true" /> Agregar producto</Link></div></header>
        <section className="qf-list-filters qf-management-filters" aria-label="Filtros de productos deshabilitados"><label htmlFor="manage-search">Buscar producto<input id="manage-search" type="search" placeholder="Nombre o descripción" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label htmlFor="manage-sort">Ordenar por<select id="manage-sort" value={sort} onChange={(event) => setSort(event.target.value)}><option value="default">Orden original</option><option value="name">Nombre</option><option value="price">Menor precio</option></select></label></section>
        {loading || !consumerId ? <p className="qf-management-empty" role="status">Cargando productos deshabilitados…</p> : error ? <div className="qf-management-empty" role="alert"><h2>No pudimos cargar los productos deshabilitados</h2><button className="qf-management-button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div> : <><p className="qf-management-count">{filtered.length} {filtered.length === 1 ? "producto" : "productos"}</p>{filtered.length ? <div className="qf-management-products">{filtered.map((product) => <Producto key={product.id} isDisabled producto={product} idpuesto={id} recargar={() => setAttempt((value) => value + 1)} />)}</div> : <div className="qf-management-empty"><h2>{search ? "No encontramos ese producto" : "No tenés productos deshabilitados"}</h2><p>{search ? "Probá buscar con otro nombre." : "Los productos que deshabilites aparecerán acá. Podés volver a tu carta para administrarlos."}</p>{search ? <button className="qf-management-button" onClick={() => setSearch("")}>Limpiar búsqueda</button> : <Link className="qf-management-button qf-management-button--primary" to={`/listado-productos/${id}`} state={puesto}>Ver productos habilitados</Link>}</div>}</>}
      </main><Footer />
    </PageLayout>
  );
};
export default ListadoProductoDeshabilitado;
