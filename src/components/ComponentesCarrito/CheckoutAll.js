import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import DialogWithPaymentSheet from "./DialogWithPatmentSheet";

const CheckoutAll = ({ consumerId, disabled, onComplete, onLockChange }) => {
  const storageKey = `qf-cart-checkout-${consumerId}`;
  const [checkoutId, setCheckoutId] = useState(() => sessionStorage.getItem(storageKey));
  const checkoutRef = useRef(checkoutId);
  const [open, setOpen] = useState(false);
  const [paid, setPaid] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [error, setError] = useState("");
  const busy = useRef(false);
  useEffect(() => { onLockChange(open || finalizing || paid || Boolean(checkoutId)); }, [open, finalizing, paid, checkoutId, onLockChange]);
  const complete = useCallback(async (id) => {
    if (!id || busy.current) return false;
    busy.current = true;
    setOpen(false); setPaid(true); setFinalizing(true); setError("");
    try {
      const raw = process.env.REACT_APP_BACK_URL || "";
      const base = raw.endsWith("/") ? raw : `${raw}/`;
      const response = await fetch(`${base}payment-sheet/cart/${id}/complete`, { method: "POST", headers: { ConsumidorId: consumerId } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "No pudimos registrar los pedidos todavía.");
      sessionStorage.removeItem(storageKey);
      checkoutRef.current = null; setCheckoutId(null); setPaid(false);
      toast.success("Todos tus pedidos quedaron registrados");
      onComplete();
      return true;
    } catch (err) {
      setError(`${err.message} Reintentá completar la compra; no se hará otro cobro.`);
      return false;
    } finally {
      busy.current = false;
      setFinalizing(false);
    }
  }, [consumerId, storageKey, onComplete]);
  const ready = useCallback((data) => {
    checkoutRef.current = data.checkoutId;
    setCheckoutId(data.checkoutId);
    sessionStorage.setItem(storageKey, data.checkoutId);
    if (data.paid || data.completed) complete(data.checkoutId);
  }, [storageKey, complete]);
  const close = () => {
    setOpen(false);
    if (!paid) { sessionStorage.removeItem(storageKey); checkoutRef.current = null; setCheckoutId(null); }
  };
  return <>
    {error && <p className="qf-cart-checkout-error" role="alert">{error}</p>}
    <button type="button" className="qf-cart-primary qf-cart-overview-buy" disabled={finalizing || (!paid && !checkoutId && disabled)} onClick={() => paid ? complete(checkoutRef.current) : setOpen(true)}>
      {finalizing ? "Registrando pedidos…" : paid ? "Completar compra" : checkoutId ? "Retomar compra" : "Comprar todo"}
    </button>
    {open && <DialogWithPaymentSheet isOpen onClose={close} amount={0} isCartCheckout cartCheckoutId={checkoutId} onCartCheckoutReady={ready} handleCloseCompra={() => complete(checkoutRef.current)} />}
  </>;
};
export default CheckoutAll;
