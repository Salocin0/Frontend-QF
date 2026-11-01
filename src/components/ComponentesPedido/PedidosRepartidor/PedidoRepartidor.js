import React, { useState, useRef } from "react";
import { Dialog } from "@mui/material";
import { toast } from "react-toastify";
import { FaStore, FaCalendarAlt, FaUser, FaMapMarkedAlt, FaInfoCircle, FaCheckCircle, FaTimes, FaExpand, FaCompress } from "react-icons/fa";
import "./PedidosRepartidor.css";

const money = (value) => Number(value || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });
const stateLabel = (state) => String(state || "Sin estado").replace(/([a-z])([A-Z])/g, "$1 $2");
const dateLabel = (value) => value && !Number.isNaN(new Date(value).getTime()) ? new Date(value).toLocaleDateString("es-AR") : "Sin fecha";
const PedidoRepartidor = ({ pedido, recargar }) => {
  const [modal, setModal] = useState(null);
  const [codigo, setCodigo] = useState("");
  const [mapFullscreen, setMapFullscreen] = useState(false);
  const [sending, setSending] = useState(false);
  const sendingRef = useRef(false);
  const enCamino = pedido.estado === "EnCamino";
  const client = [pedido.consumidore?.nombre, pedido.consumidore?.apellido].filter(Boolean).join(" ") || "Sin cliente informado";
  const stand = pedido.puesto?.nombreCarro || "Puesto sin informar";
  const point = pedido.puntoEncuentro;
  const coordinate = (value) => value == null || String(value).trim() === "" ? "Sin informar" : String(value);
  const coordinates = <span className="qf-delivery-coordinates"><span>Latitud: {coordinate(point?.latitud)}</span><span>Longitud: {coordinate(point?.longitud)}</span></span>;
  const close = () => { if (!sendingRef.current) { setModal(null); setCodigo(""); setMapFullscreen(false); } };
  const deliver = async (event) => {
    event.preventDefault();
    if (!enCamino || sendingRef.current) return;
    if (!codigo || codigo !== pedido.codigoEntrega) { toast.error("Código incorrecto"); return; }
    sendingRef.current = true; setSending(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}pedido/cambiarEstado/${pedido.id}/pedidoEntregado`, { method: "POST" });
      if (!response.ok) throw new Error("No se pudo confirmar la entrega");
      toast.success("Pedido entregado correctamente");
      setModal(null); setCodigo(""); recargar();
    } catch (error) { toast.error("No pudimos confirmar la entrega. Intentá nuevamente."); }
    finally { sendingRef.current = false; setSending(false); }
  };
  const title = modal === "detail" ? `Detalle del pedido #${pedido.id}` : modal === "map" ? "Punto de encuentro" : `Entregar pedido #${pedido.id}`;
  return <>
    <article className="qf-delivery-card" aria-label={`Pedido #${pedido.id}`}>
      <header className="qf-delivery-card-heading"><div><span className="qf-delivery-eyebrow">Pedido #{pedido.id}</span><h2><FaStore aria-hidden="true" />{stand}</h2></div><span className={`qf-delivery-state qf-delivery-state--${pedido.estado}`}>{stateLabel(pedido.estado)}</span></header>
      <div className="qf-delivery-card-content"><dl className="qf-delivery-data"><div><dt><FaUser aria-hidden="true" /> Cliente</dt><dd>{client}</dd></div><div><dt><FaMapMarkedAlt aria-hidden="true" /> Entrega en</dt><dd className="qf-delivery-location">{point?.nombre || "Punto de encuentro sin informar"}{coordinates}</dd></div><div><dt><FaCalendarAlt aria-hidden="true" /> Fecha</dt><dd>{dateLabel(pedido.fecha)}</dd></div></dl><div className="qf-delivery-total"><span>Total del pedido</span><strong>{money(pedido.total)}</strong></div></div>
      <footer className="qf-delivery-actions"><button type="button" className="qf-delivery-button" onClick={() => setModal("detail")}><FaInfoCircle aria-hidden="true" /> Ver detalle</button>{enCamino && <><button type="button" className="qf-delivery-button" onClick={() => setModal("map")}><FaMapMarkedAlt aria-hidden="true" /> Ver mapa</button><button type="button" className="qf-delivery-button qf-delivery-button--primary" onClick={() => setModal("deliver")}><FaCheckCircle aria-hidden="true" /> Entregar</button></>}</footer>
    </article>
    <Dialog open={Boolean(modal)} onClose={close} fullWidth fullScreen={modal === "map" && mapFullscreen} maxWidth="sm" className={`qf-delivery-dialog${modal === "map" && mapFullscreen ? " qf-delivery-dialog--fullscreen" : ""}`} aria-labelledby={`delivery-title-${pedido.id}`} slotProps={{ paper: { className: "qf-delivery-paper" } }}>
      <header className="qf-delivery-dialog-heading"><div><span className="qf-delivery-eyebrow">{stand}</span><h2 id={`delivery-title-${pedido.id}`}>{title}</h2></div><button type="button" className="qf-delivery-button qf-delivery-close" aria-label="Cerrar" onClick={close} disabled={sending}><FaTimes aria-hidden="true" /></button></header>
      <div className="qf-delivery-dialog-body">
        {modal === "detail" && <><dl className="qf-delivery-data"><div><dt>Cliente</dt><dd>{client}</dd></div><div><dt>Fecha</dt><dd>{dateLabel(pedido.fecha)}</dd></div><div><dt>Estado</dt><dd>{stateLabel(pedido.estado)}</dd></div><div><dt>Punto de encuentro</dt><dd>{point?.nombre || "Sin informar"}{coordinates}</dd></div></dl><div className="qf-delivery-table-wrap"><table className="qf-delivery-table"><caption>Productos del pedido</caption><thead><tr><th scope="col">Producto</th><th scope="col">Cantidad</th><th scope="col">Precio unit.</th><th scope="col">Subtotal</th></tr></thead><tbody>{(Array.isArray(pedido.detalles) ? pedido.detalles : []).map((detail, index) => <tr key={detail.id ?? index}><td>{detail.producto?.nombre || "Producto"}</td><td>{detail.cantidad}</td><td>{money(detail.producto?.precio)}</td><td>{money(detail.cantidad * Number(detail.producto?.precio || 0))}</td></tr>)}</tbody></table></div><div className="qf-delivery-dialog-total"><span>Total del pedido</span><strong>{money(pedido.total)}</strong></div><footer className="qf-delivery-actions"><button type="button" className="qf-delivery-button" onClick={close}>Cerrar detalle</button></footer></>}
        {modal === "deliver" && <form onSubmit={deliver}><p>Pedile el código al cliente para confirmar que recibió su pedido.</p><label className="qf-delivery-code" htmlFor={`delivery-code-${pedido.id}`}>Código de entrega<input id={`delivery-code-${pedido.id}`} value={codigo} onChange={(event) => setCodigo(event.target.value.toUpperCase().slice(0, 6))} maxLength={6} placeholder="Ingresá el código" autoCapitalize="characters" autoComplete="off" autoCorrect="off" disabled={sending} /></label><footer className="qf-delivery-actions"><button type="button" className="qf-delivery-button" onClick={close} disabled={sending}>Cancelar</button><button type="submit" className="qf-delivery-button qf-delivery-button--primary" disabled={sending}>{sending ? "Confirmando…" : "Confirmar entrega"}</button></footer></form>}
        {modal === "map" && <><p className="qf-delivery-location">{point?.nombre || "Punto de encuentro sin informar"}{coordinates}</p>{point && ((point.latitud != null && point.longitud != null && point.latitud !== "" && point.longitud !== "") || point.nombre) ? <iframe className="qf-delivery-map" title="Mapa del punto de encuentro" loading="lazy" src={`https://www.google.com/maps?q=${encodeURIComponent(point.latitud != null && point.longitud != null && point.latitud !== "" && point.longitud !== "" ? `${point.latitud},${point.longitud}` : point.nombre)}&z=15&output=embed`} allowFullScreen /> : <p>No hay una ubicación disponible para este pedido.</p>}<footer className="qf-delivery-actions"><button type="button" className="qf-delivery-button" aria-pressed={mapFullscreen} onClick={() => setMapFullscreen((value) => !value)}>{mapFullscreen ? <FaCompress aria-hidden="true" /> : <FaExpand aria-hidden="true" />}{mapFullscreen ? "Reducir mapa" : "Pantalla completa"}</button><button type="button" className="qf-delivery-button" onClick={close}>Cerrar mapa</button></footer></>}
      </div>
    </Dialog>
  </>;
};
export default PedidoRepartidor;
