import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import CheckoutAll from "./CheckoutAll";
import CartOverview from "./CartOverview";
import RenderizarTarjeta from "./Tarjeta";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Footer from "../ComponentesGenerales/Footer";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import "./Carrito.css";
import useTheme from "../../useTheme";
import logoDark from "../img/qf-new-logo-solid.png";
import logoLight from "../img/qf-new-logo-transparent.png";
import LoadingSpinner from "../ComponentesGenerales/LoadingSpinner";

export const groupCartItems = (items) => {
  if (!Array.isArray(items)) return [];
  const groups = new Map();
  for (const item of items) {
    if (!item?.producto || Number(item.cantidad) <= 0) continue;
    const key = JSON.stringify([item.eventoId ?? item.evento?.id, item.producto.puestoId, item.fecha || null]);
    if (!groups.has(key)) groups.set(key, { key, productos: [] });
    groups.get(key).productos.push(item);
  }
  return [...groups.values()];
};
const Carrito = () => {
  const { user } = useContext(UserContext);
  const consumerId = user?.consumidorId;
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [cart, setCart] = useState(null);
  const [liveItems, setLiveItems] = useState({});
  const [checkouts, setCheckouts] = useState({});
  const [checkoutLocked, setCheckoutLocked] = useState(false);
  const updateCheckout = useCallback((key, checkout) => setCheckouts((previous) => ({ ...previous, [key]: checkout })), []);
  const updateItems = useCallback((key, items) => setLiveItems((previous) => previous[key] === items ? previous : { ...previous, [key]: items }), []);
  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const refresh = useCallback(() => setReload((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true); setError(false);
      try {
        const raw = process.env?.REACT_APP_BACK_URL || "";
        const response = await fetch(`${raw.endsWith("/") ? raw : `${raw}/`}carrito/`, { headers: { ConsumidorId: consumerId }, signal: controller.signal });
        if (!response.ok) throw new Error("No se pudo cargar el carrito");
        const json = await response.json();
        if (!controller.signal.aborted) { setCart(json?.data || null); setLiveItems({}); setCheckouts({}); }
      } catch (err) {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    if (consumerId != null) load();
    else { setLoading(false); setError(true); }
    return () => controller.abort();
  }, [consumerId, reload]);
  const groups = useMemo(() => groupCartItems(cart?.ItemCarritos), [cart]);
  const summaryGroups = useMemo(() => groups.map((group) => ({ ...group, productos: liveItems[group.key] ?? group.productos, checkout: checkouts[group.key] })), [groups, liveItems, checkouts]);
  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <main className="qf-cart-page">
        <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mi carrito", url: "/carrito" }]} />
        <header className="qf-cart-heading"><div><h1><FaShoppingCart aria-hidden="true" /> Mi carrito</h1><p>Revisá tus productos y pagá todos tus pedidos juntos.</p></div><button type="button" className="qf-cart-secondary" onClick={() => navigate("/Listado-eventos")}><FaArrowLeft aria-hidden="true" /> Ver eventos</button></header>
        {loading ? <p className="qf-cart-empty" role="status"><LoadingSpinner label="Cargando carrito…" /></p> : error ? <div className="qf-cart-empty" role="alert"><h2>No pudimos cargar tu carrito</h2><button className="qf-cart-primary" onClick={refresh}>Reintentar</button></div> : groups.length ? (
          <div className="qf-cart-overview-layout"><div className="qf-cart-groups">{groups.map(({ key, productos }) => <RenderizarTarjeta key={key} groupKey={key} onItemsChange={updateItems} externalCheckout onCheckoutChange={updateCheckout} checkoutLocked={checkoutLocked} productos={productos} evento={productos[0].eventoId ?? productos[0].evento?.id} recargarComponente={refresh} />)}</div><CartOverview groups={summaryGroups} checkoutControl={<CheckoutAll consumerId={consumerId} disabled={summaryGroups.some((group) => !group.checkout || group.checkout.disabled)} onComplete={refresh} onLockChange={setCheckoutLocked} />} /></div>
        ) : <section className="qf-cart-empty qf-cart-empty--welcome" aria-labelledby="empty-cart-title">
          <img className="qf-cart-empty-logo" src={isDark ? logoDark : logoLight} alt="QuickFood" />
          <h2 id="empty-cart-title">Tu carrito está vacío</h2>
          <p>Elegí un evento, descubrí sus puestos y encontrá algo rico para tu próximo pedido.</p>
          <button type="button" className="qf-cart-primary" onClick={() => navigate("/Listado-eventos")}>Explorar eventos <span aria-hidden="true">→</span></button>
        </section>}
      </main>
      <Footer />
    </PageLayout>
  );
};
export default Carrito;
