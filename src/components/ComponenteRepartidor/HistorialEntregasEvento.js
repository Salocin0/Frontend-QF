import React, { useEffect, useState } from "react";
import { Dialog } from "@mui/material";
import { FaTimes, FaStar } from "react-icons/fa";
import LoadingSpinner from "../ComponentesGenerales/LoadingSpinner";
const money = (value) => Number(value || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });
const date = (value) => value && !Number.isNaN(new Date(value).getTime()) ? new Date(value).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" }) : "Sin fecha informada";
export const deliveredForEvent = (orders, eventId) => orders.filter((order) => String(order.eventoId) === String(eventId) && ["Entregado", "Valorado"].includes(order.estado));
const HistorialEntregasEvento = ({ evento, consumidorId, onClose }) => {
  const [orders, setOrders] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);
  const [ratingsError, setRatingsError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setRatingsLoading(true); setRatingsError(false);
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}valoracion/user/${consumidorId}`, { headers: { ConsumidorId: consumidorId }, signal: controller.signal });
        if (!response.ok) throw new Error("No se pudieron cargar las valoraciones");
        const result = await response.json();
        if (!controller.signal.aborted) setRatings(Array.isArray(result.data) ? result.data : []);
      } catch (err) { if (!controller.signal.aborted) setRatingsError(true); }
      finally { if (!controller.signal.aborted) setRatingsLoading(false); }
    })();
    return () => controller.abort();
  }, [consumidorId]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(false);
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}pedido/repartidor?historial=true`, { method: "GET", headers: { ConsumidorId: consumidorId }, signal: controller.signal });
        if (!response.ok) throw new Error("No se pudo cargar el historial");
        const result = await response.json();
        const filtered = deliveredForEvent(Array.isArray(result.data) ? result.data : [], evento.id);
        filtered.sort((a, b) => (Date.parse(b.fechaEntrega || b.fecha) || 0) - (Date.parse(a.fechaEntrega || a.fecha) || 0));
        if (!controller.signal.aborted) setOrders(filtered);
      } catch (err) { if (!controller.signal.aborted) setError(true); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [evento.id, consumidorId, attempt]);
  const validRatings = ratings.filter((rating) => Number(rating.puntuacion) >= 1 && Number(rating.puntuacion) <= 5);
  const eventRatings = validRatings.filter((rating) => orders.some((order) => String(order.id) === String(rating.pedidoId)));
  const average = eventRatings.length ? (eventRatings.reduce((sum, rating) => sum + Number(rating.puntuacion), 0) / eventRatings.length).toLocaleString("es-AR", { maximumFractionDigits: 1 }) : null;
  const ratingForOrder = (order) => validRatings.find((rating) => String(rating.pedidoId) === String(order.id));
  const ratingDetails = (order) => {
    const rating = ratingForOrder(order);
    return <section className="qf-courier-order-rating" aria-label={`Tu valoración en el pedido #${order.id}`}><span>Tu valoración</span>{rating ? <><strong><FaStar aria-hidden="true" /> {Number(rating.puntuacion)} / 5</strong><p className="qf-courier-rating-opinion">{rating.opinion || "Sin comentario."}</p></> : <p>{ratingsLoading ? <LoadingSpinner label="Cargando valoración…" /> : ratingsError ? "No pudimos cargar la valoración." : "Todavía no recibiste una valoración en este pedido."}</p>}</section>;
  };
  return <Dialog open onClose={onClose} fullWidth maxWidth="md" className="qf-courier-association-dialog" aria-labelledby="courier-history-title" slotProps={{ paper: { className: "qf-courier-association-paper" } }}>
    <header><div><span>{evento.nombre}</span><h2 id="courier-history-title">Mis pedidos entregados</h2></div><button type="button" className="qf-courier-dialog-close" aria-label="Cerrar historial" onClick={onClose}><FaTimes aria-hidden="true" /></button></header>
    <div className="qf-courier-dialog-body">
      {loading ? <p role="status"><LoadingSpinner label=<LoadingSpinner label="Cargando entregas…" /> /></p> : error ? <div role="alert"><p>No pudimos cargar tus entregas.</p><button type="button" className="qf-producer-event-button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div> : orders.length ? <><section className="qf-courier-event-rating" aria-label="Mi valoración en este evento"><div><h3>Mi valoración en este evento</h3><p>{ratingsLoading ? <LoadingSpinner label="Cargando valoraciones…" /> : ratingsError ? "No pudimos cargar tus valoraciones." : eventRatings.length ? `${eventRatings.length} ${eventRatings.length === 1 ? "calificación recibida" : "calificaciones recibidas"}` : "Todavía no recibiste valoraciones en este evento."}</p></div>{!ratingsLoading && !ratingsError && average && <strong><FaStar aria-hidden="true" /> {average} <small>/ 5</small></strong>}</section><p className="qf-courier-history-summary"><strong>{orders.length}</strong> {orders.length === 1 ? "pedido entregado" : "pedidos entregados"} en este evento. Incluye pedidos valorados.</p><div className="qf-courier-history-list">{orders.map((order) => <article key={order.id} className="qf-courier-history-order" aria-label={`Pedido #${order.id}`}><header><h3>Pedido #{order.id}</h3><span>{order.estado === "Valorado" ? "Entregado · Valorado" : "Entregado"}</span></header><dl className="qf-courier-event-data"><div><dt>Puesto</dt><dd>{order.puesto?.nombreCarro || "Sin informar"}</dd></div><div><dt>Cliente</dt><dd>{[order.consumidore?.nombre, order.consumidore?.apellido].filter(Boolean).join(" ") || "Sin informar"}</dd></div><div><dt>Fecha de entrega</dt><dd>{order.fechaEntrega ? date(order.fechaEntrega) : "Sin fecha de entrega registrada"}</dd></div><div><dt>Punto de encuentro</dt><dd>{order.puntoEncuentro?.nombre || "Sin informar"}</dd></div></dl><ul className="qf-courier-history-products">{(Array.isArray(order.detalles) ? order.detalles : []).map((detail, index) => <li key={detail.id ?? index}><span>{detail.cantidad} × {detail.producto?.nombre || "Producto"}</span></li>)}</ul>{ratingDetails(order)}<div className="qf-courier-history-total"><span>Total del pedido</span><strong>{money(order.total)}</strong></div></article>)}</div></> : <p>No hay pedidos entregados por vos registrados en este evento.</p>}
      <footer className="qf-courier-event-actions"><button type="button" className="qf-producer-event-button" onClick={onClose}>Cerrar</button></footer>
    </div>
  </Dialog>;
};
export default HistorialEntregasEvento;
