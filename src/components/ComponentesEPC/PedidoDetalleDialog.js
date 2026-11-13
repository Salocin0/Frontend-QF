import React from "react";
import { Dialog } from "@mui/material";
import { FaTimes, FaReceipt, FaUser, FaMotorcycle, FaPhone, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import "./PedidoDetalleDialog.css";
import LoadingSpinner from "../ComponentesGenerales/LoadingSpinner";

const formatStatus = (value) => String(value || "").replace(/([a-z])([A-Z])/g, "$1 $2");
const money = (value) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(Number(value) || 0);
const dateLabel = (value) => { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Fecha no disponible" : date.toLocaleString("es-AR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }); };

function Contact({ title, icon, name, phone, email }) {
  return <section className="qf-order-detail-contact"><h3>{icon}{title}</h3>{name && <strong>{name}</strong>}{phone && <p><FaPhone aria-hidden="true" /><span>{phone}</span></p>}{email && <p><FaEnvelope aria-hidden="true" /><span>{email}</span></p>}</section>;
}

const PedidoDetalleDialog = ({ infoDialog, detailData, onClose }) => {
  if (!infoDialog.open || !infoDialog.task) return null;
  const task = infoDialog.task;
  const order = detailData || task;
  const consumer = detailData?.Consumidor;
  const courier = detailData?.repartidor?.Consumidor;
  const producer = detailData?.Evento?.Productor;
  const details = Array.isArray(order.detalles) ? order.detalles : [];
  const orderId = String(task.id).replace("task-", "");
  return <Dialog open onClose={onClose} maxWidth="sm" fullWidth className="qf-order-detail-dialog" aria-labelledby="qf-order-detail-title" slotProps={{ paper: { className: "qf-order-detail-paper" } }}>
    <header className="qf-order-detail-header"><div className="qf-order-detail-title-icon"><FaReceipt aria-hidden="true" /></div><div><span className="qf-order-detail-eyebrow">Detalle del pedido</span><h2 id="qf-order-detail-title">Pedido #{orderId}</h2></div><button type="button" className="qf-order-detail-close" aria-label="Cerrar detalle" onClick={onClose}><FaTimes aria-hidden="true" /></button></header>
    <div className="qf-order-detail-body">
      <div className="qf-order-detail-summary"><div><span className="qf-order-detail-status">{formatStatus(order.estado)}</span><p><FaCalendarAlt aria-hidden="true" />{dateLabel(order.fecha)}</p></div><div className="qf-order-detail-total"><span>Total del pedido</span><strong>{money(order.total)}</strong></div></div>
      {(order.codigoEntrega || order.fechaPreCompra || order.fechaEntrega) && <dl className="qf-order-detail-logistics">{order.codigoEntrega && <div><dt>Código de entrega</dt><dd className="qf-order-detail-code">{order.codigoEntrega}</dd></div>}{order.fechaPreCompra && <div><dt>Fecha precompra</dt><dd>{dateLabel(order.fechaPreCompra)}</dd></div>}{order.fechaEntrega && <div><dt>Fecha de entrega</dt><dd>{dateLabel(order.fechaEntrega)}</dd></div>}</dl>}
      <section className="qf-order-detail-products" aria-labelledby="qf-order-products-title"><div className="qf-order-detail-section-heading"><h3 id="qf-order-products-title">Productos</h3><span>{details.length} {details.length === 1 ? "producto" : "productos"}</span></div>
        {details.length > 0 ? <ul>{details.map((detail, index) => <li key={detail.id || index}><span className="qf-order-detail-quantity">{detail.cantidad}×</span><div><strong>{detail.producto?.nombre || `Producto #${detail.productoId}`}</strong><span>Precio unitario</span></div><strong className="qf-order-detail-unit-price">{money(detail.precio)}</strong></li>)}</ul> : <p className="qf-order-detail-empty">{detailData ? "No hay productos detallados en este pedido." : <LoadingSpinner label="Cargando los productos del pedido…" />}</p>}
      </section>
      {!detailData && <p className="qf-order-detail-loading" role="status"><LoadingSpinner label=<LoadingSpinner label="Cargando información adicional…" /> /></p>}
      {(consumer || courier || producer) && <div className="qf-order-detail-contacts">
        {consumer && <Contact title="Consumidor" icon={<FaUser aria-hidden="true" />} name={[consumer.nombre, consumer.apellido].filter(Boolean).join(" ")} phone={consumer.telefono} email={consumer.usuario?.email} />}
        {detailData?.repartidor && <Contact title="Repartidor" icon={<FaMotorcycle aria-hidden="true" />} name={[courier?.nombre, courier?.apellido].filter(Boolean).join(" ")} phone={courier?.telefono} email={courier?.usuario?.email} />}
        {producer && <Contact title="Productor" icon={<FaUser aria-hidden="true" />} name={producer.nombre} phone={producer.telefono} email={producer.email} />}
      </div>}
    </div>
    <footer className="qf-order-detail-footer"><button type="button" onClick={onClose}>Cerrar detalle</button></footer>
  </Dialog>;
};
export default PedidoDetalleDialog;
