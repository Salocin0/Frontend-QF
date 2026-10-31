import "../ComponentesGenerales/ListFilters.css";
import React, { useEffect, useState, useContext, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Footer from "../ComponentesGenerales/Footer";
import ProductoUser from "./ProductoUser";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { toast } from "react-toastify";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { formatDateAR } from "../ComponentesGenerales/Utils/formatDate";
import "./ProductosListado.css";
import { FaShoppingCart, FaCalendarAlt, FaArrowLeft } from "react-icons/fa";
import standPlaceholder from "../img/puestoLogoDefault.jpg";

export const filterProducts = (products, search, sort) => {
  const query = search.trim().toLocaleLowerCase();
  const filtered = products.filter((product) => [product.nombre, product.descripcion].some((value) => String(value || "").toLocaleLowerCase().includes(query)));
  if (sort === "price-up") filtered.sort((a, b) => Number(a.precio || 0) - Number(b.precio || 0));
  if (sort === "price-down") filtered.sort((a, b) => Number(b.precio || 0) - Number(a.precio || 0));
  if (sort === "name") filtered.sort((a, b) => String(a.nombre || "").localeCompare(String(b.nombre || ""), "es"));
  return filtered;
};
const ListadoProductoUser = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const selectedDay = location.state?.selectedDay || null;
  const evento = location.state?.evento || { id: location.state?.eventoid };
  const eventId = evento?.id;
  const eventName = evento?.nombre;
  const [eventInfo, setEventInfo] = useState(null);
  const displayedEvent = eventInfo || evento;
  const consumerId = user?.consumidorId;
  const [products, setProducts] = useState([]);
  const [puesto, setPuesto] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  useEffect(() => {
    if (!eventId) {
      toast.info("Elegí un evento y un puesto para ver sus productos.");
      navigate("/Listado-eventos", { replace: true });
    }
  }, [eventId, navigate]);
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setError(false);
      try {
        const raw = process.env?.REACT_APP_BACK_URL || "";
        const base = raw.endsWith("/") ? raw : `${raw}/`;
        const get = async (path, headers) => {
          const response = await fetch(`${base}${path}`, { headers, signal: controller.signal });
          if (!response.ok) throw new Error("Error al cargar productos");
          return response.json();
        };
        const [productData, standData, eventData] = await Promise.all([
          get("producto", { ConsumidorId: consumerId, puestoId: id }), get(`puesto/consultar/${id}`),
          eventName ? Promise.resolve(null) : get(`evento/${eventId}`),
        ]);
        if (!controller.signal.aborted) {
          setProducts(Array.isArray(productData?.data) ? productData.data : []);
          setPuesto(standData?.data || {});
          setEventInfo(eventData?.data || null);
        }
      } catch (err) {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    if (eventId && consumerId != null) load();
    return () => controller.abort();
  }, [id, eventId, eventName, consumerId, attempt]);
  const filtered = useMemo(() => filterProducts(products, search, sort), [products, search, sort]);
  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <main className="qf-products-page">
        <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Eventos", url: "/Listado-eventos" }, { title: "Puestos", url: `/listado-puestos/${eventId}` }, { title: "Productos", url: `/productos-puesto/${id}` }]} style={{ width: "100%", margin: "0 0 20px" }} />
        <section className="qf-products-context" aria-label="Evento y puesto seleccionados">
          <div className="qf-products-identity">
            <img src={puesto.img || standPlaceholder} alt="" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = standPlaceholder; }} />
            <div>
              <h1>{puesto.nombreCarro || "Productos del puesto"}</h1>
              <p className="qf-products-event-name">{displayedEvent.nombre || `Evento #${eventId}`}</p>
              {selectedDay && <p className="qf-products-pickup"><FaCalendarAlt aria-hidden="true" /> Retiro el {formatDateAR(selectedDay)}</p>}
            </div>
          </div>
          <div className="qf-products-header-actions">
            <button type="button" className="qf-products-back" onClick={() => navigate(`/listado-puestos/${eventId}`, { state: { selectedDay } })}><FaArrowLeft aria-hidden="true" /> Volver</button>
            <button type="button" className="qf-products-cart" onClick={() => navigate("/carrito")}><FaShoppingCart aria-hidden="true" /> Mi carrito</button>
          </div>
        </section>
        <section className="qf-products-toolbar qf-list-filters" aria-label="Buscar y ordenar productos">
          <label>Buscar producto<input type="search" placeholder="Nombre o descripción…" value={search} onChange={(e) => setSearch(e.target.value)} /></label>
          <label>Ordenar por<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="default">Orden del puesto</option><option value="price-up">Menor precio</option><option value="price-down">Mayor precio</option><option value="name">Nombre</option></select></label>
        </section>
        <p className="qf-products-results" role="status">{!loading && !error && `${filtered.length} ${filtered.length === 1 ? "producto disponible" : "productos disponibles"}`}</p>
        {loading ? <p className="qf-products-empty" role="status">Cargando productos…</p> : error ? <div className="qf-products-empty" role="alert"><h2>No pudimos cargar los productos</h2><button type="button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div> : filtered.length ? (
          <div className="qf-products-grid">{filtered.map((product) => <ProductoUser key={product.id} producto={product} user={user} selectedDay={selectedDay} evento={evento} />)}</div>
        ) : <div className="qf-products-empty"><h2>{search ? "No encontramos productos con ese nombre" : "Todavía no hay productos en este puesto"}</h2>{search && <button type="button" onClick={() => setSearch("")}>Limpiar búsqueda</button>}</div>}
      </main>
      <Footer />
    </PageLayout>
  );
};
export default ListadoProductoUser;
