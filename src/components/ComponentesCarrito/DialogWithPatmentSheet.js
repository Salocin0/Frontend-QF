import React, { useEffect, useState, useContext } from "react";
import {
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import PaymentSheet from "./PaymentSheet";
import { loadStripe } from "@stripe/stripe-js";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useBreakpoint from "../../useBreakpoint";

// Cargar stripe una sola vez (fuera del componente)
const stripePromise = loadStripe(process.env?.REACT_APP_API_KEY_STRIPE);

const DialogWithPaymentSheet = ({
  isOpen,
  onClose,
  amount,
  handleCloseCompra,
  isCartCheckout = false,
  cartCheckoutId,
  onCartCheckoutReady,
}) => {
  const { user } = useContext(UserContext);
  const consumerId = user?.consumidorId;
  const [paymentBusy, setPaymentBusy] = useState(false);
  const [paymentSheetData, setPaymentSheetData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    const fetchPaymentSheetData = async (amountToPay) => {
      try {
        setIsLoading(true);
        setError(null);

        if (!paymentSheetData) {
          const raw = process.env.REACT_APP_BACK_URL || "";
          const base = raw.endsWith("/") ? raw : `${raw}/`;
          const path = isCartCheckout ? `payment-sheet/cart${cartCheckoutId ? `/${cartCheckoutId}` : ""}` : "payment-sheet";
          const response = await fetch(`${base}${path}`, {
            method: isCartCheckout && cartCheckoutId ? "GET" : "POST",
            headers: { "Content-Type": "application/json", ...(isCartCheckout ? { ConsumidorId: consumerId } : {}) },
            ...(isCartCheckout && cartCheckoutId ? {} : { body: JSON.stringify(isCartCheckout ? {} : { amount: amountToPay }) }),
          });

          if (!response.ok) {
            if (isCartCheckout && response.status === 404) {
              throw new Error("El servidor todavía no tiene habilitada la compra de todo el carrito. Falta publicar la actualización del backend.");
            }
            throw new Error(`Error HTTP: ${response.status}`);
          }

          const data = await response.json();

          if (!data.clientSecret) {
            throw new Error("clientSecret no recibido del servidor");
          }

          setPaymentSheetData(data);
          if (isCartCheckout) onCartCheckoutReady?.(data);
        }
      } catch (err) {
        console.error("Error fetching Payment Sheet data:", err);
        setError(err.message || "Error al cargar el formulario de pago");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && !paymentSheetData) {
      fetchPaymentSheetData(amount * 100);
    }
  }, [isOpen, paymentSheetData, amount, isCartCheckout, cartCheckoutId, consumerId, onCartCheckoutReady]);

  const handleClose = () => {
    if (paymentBusy) return;
    onClose();
    setPaymentSheetData(null);
    setError(null);
  };

  return (
    <Dialog
      className="qf-payment-dialog"
      open={isOpen}
      disableEscapeKeyDown={paymentBusy}
      onClose={handleClose}
      maxWidth={isMobile ? "xs" : "sm"}
      fullWidth
      slotProps={{ paper: { className: "qf-payment-modal", sx: { backgroundColor: "var(--qf-bg-secondary)", backgroundImage: "none", color: "var(--qf-text-primary)", borderRadius: "20px", border: 0, width: "calc(100% - 32px)", maxWidth: "450px", margin: "16px", maxHeight: "calc(100dvh - 32px)" } } }}
    >
      <DialogContent
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "transparent",
          borderRadius: "inherit",
          padding: isLoading || error ? "24px" : 0,
          minHeight: isLoading || error ? "300px" : 0,
        }}
      >
        {isLoading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
            <CircularProgress style={{ color: "var(--qf-naranja)" }} />
            <div style={{ color: "var(--qf-text-primary)", fontSize: "14px" }}>
              Cargando formulario de pago...
            </div>
          </div>
        ) : error ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            textAlign: "center"
          }}>
            <div style={{ color: "var(--qf-rojo)", fontSize: "16px", fontWeight: "bold" }}>
              Error al cargar el formulario
            </div>
            <div style={{ color: "var(--qf-text-primary)", fontSize: "14px" }}>
              {error}
            </div>
            <button
              onClick={handleClose}
              style={{
                padding: "10px 20px",
                backgroundColor: "var(--qf-naranja)",
                color: "var(--qf-text-white)",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Cerrar
            </button>
          </div>
        ) : paymentSheetData ? (
          <Elements stripe={stripePromise}>
            <PaymentSheet
              handleCloseCompra={handleCloseCompra}
              onProcessingChange={setPaymentBusy}
              handleClose={handleClose}
              amount={isCartCheckout ? paymentSheetData.amount : amount * 100}
              currency={(paymentSheetData.currency || "usd").toUpperCase()}
              clientSecret={paymentSheetData.clientSecret}
              paymentIntent={paymentSheetData.paymentIntent}
            />
          </Elements>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default DialogWithPaymentSheet;
