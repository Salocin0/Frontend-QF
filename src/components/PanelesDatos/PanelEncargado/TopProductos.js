import React from "react";
import GraficaTortaProductos from "../GraficaTortaProductos";
import useManagerStatistic from "./useManagerStatistic";
import LoadingSpinner from "../../ComponentesGenerales/LoadingSpinner";
const money = (value) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(Number(value) || 0);
const TopProductos = (props) => {
  const { data, loading, error } = useManagerStatistic("top-productos-puesto-evento", props.puestoId, props.eventoId);
  const products = Array.isArray(data) ? data : [];
  return <section className="qf-manager-chart-card qf-manager-top-products"><h2>Productos destacados</h2><p>Ventas y recaudación de tus productos.</p>{loading ? <div className="qf-manager-chart-message" role="status"><LoadingSpinner label=<LoadingSpinner label="Cargando productos…" /> /></div> : error ? <div className="qf-manager-chart-message" role="status">No pudimos cargar los productos.</div> : !products.length ? <div className="qf-manager-chart-message">Todavía no hay ventas para esta selección.</div> : <><div className="qf-manager-products-table"><table><thead><tr><th>Producto</th><th>Pedidos</th><th>Recaudación</th></tr></thead><tbody>{products.map((product, index) => <tr key={product.id || index}><td>{product.nombre}</td><td>{product.pedidos}</td><td>{money(product.dinero)}</td></tr>)}</tbody></table></div><GraficaTortaProductos height={320} productos={products} /></>}</section>;
};
export default TopProductos;
