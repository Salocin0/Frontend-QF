import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";
import { Dialog } from "@mui/material";
// Reuses the delivery dialog styles so the offer looks like the rest of the courier screens.
import "../ComponentesPedido/PedidosRepartidor/PedidosRepartidor.css";

const POLL_INTERVAL_MS = 5000;
// Must match ASIGNACION_WINDOW_SECONDS on the backend (default 300 s).
const WINDOW_SECONDS = Number(process.env.REACT_APP_ASIGNACION_WINDOW_SECONDS) || 300;

const formatRemaining = (seconds) => {
  const safe = Math.max(0, seconds);
  return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`;
};

const formatMoney = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("es-AR", { style: "currency", currency: "ARS" }) : "-";
};

/**
 * Offer popup for couriers on the web: polls the pending delivery offer and lets them accept or reject it
 * (the mobile app already does this with CardAsignacionPedido).
 */
const AsignacionRepartidorAlert = () => {
  const { user } = useContext(UserContext);
  const consumerId = user?.consumidorId;
  const isCourier = user?.tipoUsuario === "repartidor";
  const [offer, setOffer] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const dismissed = useRef(new Set());
  const backUrl = process.env.REACT_APP_BACK_URL;

  const loadOffer = useCallback(async (signal) => {
    try {
      const response = await fetch(`${backUrl}asignaciones`, { method: "GET", headers: { ConsumidorId: consumerId }, signal });
      if (!response.ok) return;
      const body = await response.json();
      const data = body?.data;
      if (data?.id && data.estado === "Pendiente" && !dismissed.current.has(data.id)) {
        setOffer((current) => (current?.id === data.id ? current : data));
      } else if (!data?.id) {
        setOffer(null);
      }
    } catch (error) {
      // Polling is best effort: a failed attempt is simply retried on the next tick.
    }
  }, [backUrl, consumerId]);

  useEffect(() => {
    if (!isCourier || !consumerId) return undefined;
    const controller = new AbortController();
    loadOffer(controller.signal);
    const timer = setInterval(() => {
      if (!document.hidden) loadOffer(controller.signal);
    }, POLL_INTERVAL_MS);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, [isCourier, consumerId, loadOffer]);

  useEffect(() => {
    if (!offer) return undefined;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, [offer]);

  const remaining = offer ? Math.ceil((new Date(offer.createdAt).getTime() + WINDOW_SECONDS * 1000 - now) / 1000) : null;
  const expired = offer && Number.isFinite(remaining) && remaining <= 0;

  useEffect(() => {
    if (!expired) return;
    dismissed.current.add(offer.id);
    setOffer(null);
  }, [expired, offer]);

  if (!isCourier || !offer || expired) return null;

  const pedido = offer.Pedido || {};
  const consumer = pedido.consumidore || {};

  const respond = async (action) => {
    setBusy(true);
    try {
      const response = await fetch(`${backUrl}asignaciones/${offer.id}/${action}`, { method: "POST", headers: { ConsumidorId: consumerId } });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body?.msg || "No se pudo responder la asignación");
      toast.success(action === "aceptar" ? "Pedido aceptado. Ya podés entregarlo desde Pedidos asignados." : "Pedido rechazado");
    } catch (error) {
      toast.error(error.message);
    } finally {
      dismissed.current.add(offer.id);
      setOffer(null);
      setBusy(false);
    }
  };

  return (
    <Dialog open fullWidth maxWidth="sm" className="qf-delivery-dialog" aria-labelledby="qf-offer-title" slotProps={{ paper: { className: "qf-delivery-paper" } }}>
      <header className="qf-delivery-dialog-heading">
        <div>
          <span className="qf-delivery-eyebrow">Nueva entrega disponible</span>
          <h2 id="qf-offer-title">Pedido #{pedido.id}</h2>
        </div>
      </header>
      <div className="qf-delivery-dialog-body">
        <dl className="qf-delivery-data">
          <div><dt>Puesto</dt><dd>{(pedido.puesto || pedido.Puesto)?.nombreCarro || "-"}</dd></div>
          <div><dt>Cliente</dt><dd>{[consumer.nombre, consumer.apellido].filter(Boolean).join(" ") || "-"}</dd></div>
        </dl>
        <div className="qf-delivery-dialog-total"><span>Total del pedido</span><strong>{formatMoney(pedido.total)}</strong></div>
        <p role="timer" aria-live="off">Tiempo para responder: <strong>{formatRemaining(remaining)}</strong></p>
        <footer className="qf-delivery-actions">
          <button type="button" className="qf-delivery-button" disabled={busy} onClick={() => respond("rechazar")}>Rechazar</button>
          <button type="button" className="qf-delivery-button qf-delivery-button--primary" disabled={busy} onClick={() => respond("aceptar")}>Aceptar pedido</button>
        </footer>
      </div>
    </Dialog>
  );
};

export default AsignacionRepartidorAlert;
