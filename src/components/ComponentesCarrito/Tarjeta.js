import React, { useState, useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../ComponentesGenerales/UserContext";
import DialogWithPaymentSheet from "./DialogWithPatmentSheet";
import ConfirmDialog from "../ComponentesGenerales/ConfirmDialog";
import { FaTrash, FaMinus, FaPlus, FaArrowRight, FaCheckCircle, FaCalendarAlt } from "react-icons/fa";
import { cartAmounts } from "./cartAmounts";
import productoDefecto from "../img/productoDefecto.png";
import "./Carrito.css";
import { formatDateAR } from "../ComponentesGenerales/Utils/formatDate";

const RenderizarTarjeta = ({ productos, recargarComponente, evento, groupKey, onItemsChange, externalCheckout = false, onCheckoutChange, checkoutLocked = false }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [productosLocal, setProductosLocal] = useState(productos);
  const [pending, setPending] = useState(false);
  const busyRef = useRef(false);
  const cardRef = useRef(null);
  const [cardWidth, setCardWidth] = useState(0);
  const isNarrow = cardWidth < 850;
  const isProductNarrow = cardWidth < 550;

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setCardWidth(entry.contentRect.width));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { setProductosLocal(productos); }, [productos]);
  useEffect(() => { onItemsChange?.(groupKey, productosLocal); }, [groupKey, onItemsChange, productosLocal]);

  const updateProduct = async (item, action) => {
    if (busyRef.current || checkoutLocked) return;
    const previous = productosLocal;
    const id = item.producto.id;
    if (action === "remove" && Number(item.cantidad) <= 1) return;
    const next = action === "delete" ? previous.filter((product) => product.producto.id !== id)
      : previous.map((product) => product.producto.id === id ? { ...product, cantidad: Number(product.cantidad) + (action === "add" ? 1 : -1) } : product);
    busyRef.current = true;
    setPending(true);
    setProductosLocal(next);
    try {
      const endpoint = { add: "addToCart", remove: "removeToCart", delete: "deleteProductToCart" }[action];
      const response = await fetch(`${process.env?.REACT_APP_BACK_URL}carrito/${endpoint}/${id}`, {
        method: "PUT", headers: { ConsumidorId: user.consumidorId, "Content-Type": "application/json" },
        body: JSON.stringify({ fecha: item.fecha, eventoId: item.eventoId ?? item.evento?.id, cantidad: 1 }),
      });
      if (!response.ok) throw new Error("No se pudo actualizar");
      if (!next.length) recargarComponente();
    } catch (error) {
      setProductosLocal(previous);
      toast.error("No pudimos actualizar el carrito. Intentá nuevamente.");
    } finally {
      busyRef.current = false;
      setPending(false);
    }
  };
  const quitarDelCarrito = (item) => updateProduct(item, "remove");
  const agregarAlCarrito = (item) => updateProduct(item, "add");
  const eliminarDelCarrito = (item) => updateProduct(item, "delete");

  const handleCloseCompra = () => {
    setIsOpen(false);
    // Limpiar carrito inmediatamente para mejor UX
    eliminarPedido();
    recargarComponente();
    
    // Registrar pedido en background SIN bloquear la UI
    // Spreading a Headers instance yields {}: use a plain object so the consumer header is really sent.
    const headers = { consumidorid: String(user.consumidorId) };

    const detalles = {
        detalles: productosLocal.map((producto) => ({
            cantidad: producto.cantidad,
            productoId: producto.producto.id,
            aderezos: producto.producto.aderezos,
        })),
        puestoId: productosLocal[0].producto.puestoId,
        eventoId: productosLocal[0].evento.id,
        precompra: productosLocal[0]?.fecha,
    };

    // Enviar en background sin await
    fetch(`${process.env?.REACT_APP_BACK_URL}pedido`, {
        method: "POST",
        headers: {
            ...headers,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(detalles),
    })
        .then((response) => response.json())
        .then((data) => {
            toast.success("Pedido registrado");
        })
        .catch((error) => console.error("Error al registrar pedido en servidor:", error));
};

  const registrarPedido = () => {
    setIsOpen(true);
  };

  const eliminarPedido = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", user.consumidorId);
    headers.append("Content-Type", "application/json")
    const datos = {fecha:productosLocal[0]?.fecha}
    fetch(
      `${process.env?.REACT_APP_BACK_URL}carrito/deleteProductsToCart/${productosLocal[0]?.producto?.puestoId}`,
      {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(datos),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        recargarComponente();
      })
      .catch((error) => console.log("error.", error));
  };

  const llevarPuesto = () => {
    const item = productosLocal[0];
    const eventoId = item?.eventoId ?? item?.evento?.id;
    if (!eventoId) {
      toast.error("No se pudo determinar el evento de este pedido. Elegí un evento desde el listado.");
      navigate("/Listado-eventos");
      return;
    }
    navigate(`/productos-puesto/${item.producto.puestoId}`, {
      state: { eventoid: eventoId, evento: item.evento, selectedDay: item?.fecha },
    });
  };

  const calcularTotal = (productos) => {
    const total = productos?.reduce((acc, item) => {
      return acc + item.producto.precio * item.cantidad;
    }, 0);
    return total;
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
  };

  const obtenerTextoPreventa = () => {
    const fechaPreventa = productosLocal[0]?.fecha;
    return fechaPreventa
      ? `Preventa para ${formatDateAR(fechaPreventa)}`
      : "Compra inmediata";
  };

  const first = productosLocal[0] || productos[0];
  const orderAmount = cartAmounts(productosLocal);
  const subtotal = calcularTotal(productosLocal) || 0;
  const money = (value) => Number(value || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });
  const quantity = productosLocal.reduce((sum, item) => sum + Number(item.cantidad), 0);
  useEffect(() => {
    onCheckoutChange?.(groupKey, { disabled: pending || !quantity });
  }, [groupKey, onCheckoutChange, pending, quantity]);
  return (
    <section ref={cardRef} className="qf-cart-group" aria-busy={pending}>
      <header className="qf-cart-group-heading">
        <div><p className="qf-cart-event"><Link className="qf-cart-event-link" to={`/tipo-compra/${first?.eventoId ?? first?.evento?.id ?? evento?.id ?? evento}`}>{first?.evento?.nombre || `Evento #${first?.eventoId ?? evento?.id ?? evento}`}</Link></p><h2><Link className="qf-cart-stand-link" to={`/productos-puesto/${first?.producto?.puestoId}`} state={{ eventoid: first?.eventoId ?? first?.evento?.id, evento: first?.evento, selectedDay: first?.fecha }}>{first?.producto?.puesto?.nombreCarro || "Tu puesto"}</Link></h2></div>
        <span className="qf-cart-date"><FaCalendarAlt aria-hidden="true" /> {obtenerTextoPreventa()}</span>
      </header>
      <div className="qf-cart-content" style={{ flexDirection: isNarrow ? "column" : "row" }} data-testid="cart-content-wrapper">
        <div className="qf-cart-items">
          {productosLocal.map((item) => <article key={item.producto.id} className="qf-cart-product" style={{ flexDirection: isProductNarrow ? "column" : "row" }} data-testid="cart-product-card">
            <img className="qf-cart-product-image" src={item.producto.img || productoDefecto} alt="" loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = productoDefecto; }} />
            <div className="qf-cart-product-info"><h3>{item.producto.nombre}</h3><p>{money(item.producto.precio)} c/u</p><strong>{money(Number(item.producto.precio) * Number(item.cantidad))}</strong></div>
            <div className="qf-cart-product-controls">
              <div className="qf-cart-quantity" role="group" aria-label={`Cantidad de ${item.producto.nombre}`}>
                <button type="button" disabled={checkoutLocked || pending || Number(item.cantidad) <= 1} onClick={() => quitarDelCarrito(item)} aria-label={`Disminuir ${item.producto.nombre}`}><FaMinus /></button>
                <output aria-live="polite">{item.cantidad}</output>
                <button type="button" disabled={checkoutLocked || pending} onClick={() => agregarAlCarrito(item)} aria-label={`Aumentar ${item.producto.nombre}`}><FaPlus /></button>
              </div>
              <button type="button" className="qf-cart-remove" disabled={checkoutLocked || pending} onClick={() => eliminarDelCarrito(item)} aria-label={`Eliminar ${item.producto.nombre}`}><FaTrash /></button>
            </div>
          </article>)}
        </div>
        <aside className="qf-cart-summary" style={{ width: isNarrow ? "100%" : "320px" }} data-testid="cart-right-section">
          <h3>Resumen del pedido</h3>
          <p className="qf-cart-summary-count">{quantity} {quantity === 1 ? "unidad" : "unidades"}</p>
          <dl><div><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div><div><dt>Comisión de servicio (15%)</dt><dd>{money(orderAmount.commission)}</dd></div><div className="qf-cart-total"><dt>Total</dt><dd>{money(orderAmount.total)}</dd></div></dl>
          <div className="qf-cart-summary-actions">
          {!externalCheckout && <button type="button" className="qf-cart-primary" disabled={pending || !quantity} onClick={registrarPedido}><FaCheckCircle aria-hidden="true" /> Comprar</button>}
          <button type="button" className="qf-cart-secondary" disabled={checkoutLocked || pending} onClick={llevarPuesto}><FaArrowRight aria-hidden="true" /> Ver puesto</button>
          <button type="button" className="qf-cart-empty-group" disabled={checkoutLocked || pending} onClick={() => setConfirmDeleteOpen(true)}><FaTrash aria-hidden="true" /> Vaciar este pedido</button>
          </div>
        </aside>
      </div>
      <ConfirmDialog open={confirmDeleteOpen} title="Eliminar pedido" message="¿Querés vaciar este carrito? Se van a quitar todos sus productos." onConfirm={() => { setConfirmDeleteOpen(false); eliminarPedido(); }} onCancel={() => setConfirmDeleteOpen(false)} />
      <DialogWithPaymentSheet isOpen={isOpen} onClose={handleCloseDialog} amount={orderAmount.total} handleCloseCompra={handleCloseCompra} />
    </section>
  );
};
export default RenderizarTarjeta;
