import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  CircularProgress,
} from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import PaymentSheet from "./PaymentSheet";
import { loadStripe } from "@stripe/stripe-js";

// Cargar stripe una sola vez (fuera del componente)
const stripePromise = loadStripe(process.env?.REACT_APP_API_KEY_STRIPE);

const DialogWithPaymentSheet = ({
  isOpen,
  onClose,
  amount,
  handleCloseCompra,
}) => {
  const [paymentSheetData, setPaymentSheetData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentSheetData = async (amountToPay) => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!paymentSheetData) {
          console.log("Fetching payment sheet data for amount:", amountToPay);
          const response = await fetch(
            `${process.env.REACT_APP_BACK_URL}payment-sheet`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ amount: amountToPay }),
            }
          );

          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }

          const data = await response.json();
          console.log("Payment sheet data received:", data);
          
          if (!data.clientSecret) {
            throw new Error("clientSecret no recibido del servidor");
          }
          
          setPaymentSheetData(data);
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
  }, [isOpen, paymentSheetData, amount]);

  const handleClose = () => {
    onClose();
    setPaymentSheetData(null);
    setError(null);
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogContent
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "var(--qf-bg-main)",
          borderRadius: "0px",
          padding: "20px",
          minHeight: "300px",
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
              handleClose={handleClose}
              amount={amount * 100}
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
