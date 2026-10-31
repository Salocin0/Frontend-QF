import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { FaCreditCard, FaTimes, FaLock } from "react-icons/fa";
import useBreakpoint from "../../useBreakpoint";
import useTheme from "../../useTheme";
import "./PaymentSheet.css";

const PaymentSheet = ({ handleCloseCompra, handleClose, paymentIntent, clientSecret, amount, currency = "USD", onProcessingChange }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(UserContext);
  const { isMobile } = useBreakpoint();
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isElementReady, setIsElementReady] = useState(false);
  const [cardError, setCardError] = useState(null);
  const submitting = useRef(false);
  const validAmount = Number.isFinite(Number(amount)) && Number(amount) > 0;
  const formattedAmount = new Intl.NumberFormat("es-AR", { style: "currency", currency, currencyDisplay: "code" }).format((Number(amount) || 0) / 100);
  useEffect(() => { onProcessingChange?.(isLoading); }, [isLoading, onProcessingChange]);
  const cardOptions = useMemo(() => ({
    hidePostalCode: true,
    disabled: isLoading,
    style: {
      base: { color: isDark ? "#ffffff" : "#26221c", fontSize: "16px", fontFamily: '"Avenir Next", Avenir, sans-serif', "::placeholder": { color: isDark ? "#a7a39c" : "#777168" } },
      invalid: { color: "#d94438", iconColor: "#d94438" },
    },
  }), [isDark, isLoading]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (submitting.current) return;
    if (!stripe || !elements || !isElementReady || !validAmount) {
      setCardError("Esperá a que el formulario esté listo para pagar.");
      return;
    }
    const secret = clientSecret || paymentIntent;
    const card = elements.getElement(CardElement);
    if (!secret || !card) { setCardError("No pudimos preparar el pago. Cerrá el formulario y volvé a intentarlo."); return; }
    submitting.current = true;
    setIsLoading(true); setCardError(null);
    try {
      const { error, paymentIntent: result } = await stripe.confirmCardPayment(secret, {
        payment_method: { card, billing_details: { name: user?.usuario || "Usuario", email: user?.email || "" } },
      });
      if (error) { setCardError(error.message || "No pudimos procesar la tarjeta. Revisá los datos e intentá nuevamente."); return; }
      if (!result || !["succeeded", "processing"].includes(result.status)) { setCardError("No pudimos confirmar el estado del pago. Revisá tus pedidos antes de volver a intentar."); return; }
      const completed = await handleCloseCompra(result);
      if (completed !== false && result.status === "succeeded") toast.success("Pago realizado con éxito");
    } catch (error) {
      setCardError(error.message || "No pudimos procesar el pago. Intentá nuevamente.");
    } finally {
      submitting.current = false;
      setIsLoading(false);
    }
  };
  return (
    <section className="qf-payment-sheet" style={{ maxWidth: isMobile ? "100%" : "450px" }} data-testid="payment-sheet-container" aria-labelledby="payment-title" aria-busy={isLoading}>
      <header className="qf-payment-header">
        <span className="qf-payment-icon" aria-hidden="true"><FaCreditCard /></span>
        <div><h2 id="payment-title">Pago Seguro</h2><p><FaLock aria-hidden="true" /> Procesado por Stripe</p></div>
        <button type="button" className="qf-payment-close" aria-label="Cerrar formulario de pago" disabled={isLoading} onClick={handleClose}><FaTimes aria-hidden="true" /></button>
      </header>
      <div className="qf-payment-amount"><span>Total a pagar</span><strong>{formattedAmount}</strong><small>Comisión de servicio incluida</small></div>
      {user && <dl className="qf-payment-buyer"><div><dt>Comprador</dt><dd>{user.usuario || "Usuario"}</dd></div>{user.email && <div><dt>Email</dt><dd>{user.email}</dd></div>}</dl>}
      <form className="qf-payment-form" onSubmit={handleSubmit}>
        <span className="qf-payment-field-label" id="payment-card-label">Datos de la tarjeta</span>
        <div className="qf-payment-card-field" role="group" aria-labelledby="payment-card-label" aria-describedby={cardError ? "payment-error" : undefined}>
          <CardElement options={cardOptions} onReady={() => setIsElementReady(true)} onChange={(event) => setCardError(event.error?.message || null)} />
        </div>
        {cardError && <p id="payment-error" className="qf-payment-error" role="alert">{cardError}</p>}
        <div className="qf-payment-actions">
          <button type="submit" className="qf-payment-submit" disabled={!stripe || !isElementReady || Boolean(cardError) || isLoading || !validAmount}>{isLoading ? <><CircularProgress size={16} color="inherit" /> Procesando pago…</> : <><FaLock aria-hidden="true" /> Pagar ahora</>}</button>
          <button type="button" className="qf-payment-cancel" disabled={isLoading} onClick={handleClose}>Cancelar compra</button>
        </div>
        <p className="qf-payment-note">Los datos de tu tarjeta se procesan en Stripe.</p>
        {isLoading && <p className="qf-payment-processing" role="status">Estamos confirmando tu pago. Esperá un momento.</p>}
      </form>
    </section>
  );
};
export default PaymentSheet;
