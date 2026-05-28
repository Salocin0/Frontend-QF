import React, { useContext, useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { FaCreditCard, FaTimes, FaLock } from "react-icons/fa";
import useBreakpoint from "../../useBreakpoint";

const PaymentSheet = ({handleCloseCompra,handleClose, paymentIntent, clientSecret, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isElementReady, setIsElementReady] = useState(false);
  const [cardError, setCardError] = useState(null);
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    if (stripe && elements) {
      setIsElementReady(true);
    }
  }, [stripe, elements]);

  const handleCardChange = (event) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      toast.error("Formulario de pago no está listo. Intenta de nuevo.");
      return;
    }

    const paymentIntentSecret = clientSecret || paymentIntent;
    
    if (!paymentIntentSecret) {
      toast.error("Información de pago incompleta. Recarga la página e intenta de nuevo.");
      console.error("clientSecret o paymentIntent no disponible");
      return;
    }

    // Obtener el cardElement ANTES de cambiar a loading
    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      toast.error("Elemento de tarjeta no encontrado. Recarga la página e intenta de nuevo.");
      return;
    }

    // Ahora SÍ cambiamos a loading después de validar que el elemento existe
    setIsLoading(true);
    setCardError(null);

    try {
      console.log("Iniciando pago con clientSecret:", paymentIntentSecret);
      
      // Usar confirmCardPayment con el client secret
      const { error, paymentIntent: result } = await stripe.confirmCardPayment(paymentIntentSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.usuario || "Usuario",
            email: user?.email || "",
          },
        },
      });

      if (error) {
        console.error("Stripe error:", error);
        toast.error(`Error en el pago: ${error.message || 'Error desconocido'}`);
        setIsLoading(false);
      } else if (result && (result.status === 'succeeded' || result.status === 'processing')) {
        console.log("Pago exitoso:", result);
        toast.success("Pago realizado con éxito");
        setIsLoading(false);
        // Cerrar inmediatamente sin retraso
        handleCloseCompra();
      } else {
        console.error("Estado de pago desconocido:", result?.status);
        toast.error("Estado de pago desconocido. Contacta a soporte.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Error al procesar el pago:", err);
      toast.error(`Error: ${err.message || 'Error desconocido en el pago'}`);
      setIsLoading(false);
    }
  };

  const cardStyle = {
    base: {
      color: "var(--qf-text-primary)",
      backgroundColor: "var(--qf-bg-main)",
      fontSize: "16px",
      fontFamily: "Arial, sans-serif",
      "::placeholder": {
        color: "var(--qf-text-primary)" + "80",
      },
    },
    invalid: {
      color: "var(--qf-rojo)",
      iconColor: "var(--qf-rojo)",
    },
  };

  const amountInDollars = (amount / 100).toFixed(2);

  const styles = {
    container: {
      width: "100%",
      maxWidth: "450px",
      padding: "2rem",
      border: `2px solid var(--qf-naranja)`,
      borderRadius: "12px",
      backgroundColor: "var(--qf-bg-secondary)",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    },
    header: {
      textAlign: "center",
      marginBottom: "2rem",
      paddingBottom: "1rem",
      borderBottom: `2px solid var(--qf-naranja)`,
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "var(--qf-naranja)",
      margin: "0 0 0.5rem 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "10px",
    },
    titleIcon: {
      fontSize: "28px",
    },
    subtitle: {
      fontSize: "14px",
      color: "var(--qf-text-primary)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
    },
    summarySection: {
      backgroundColor: "var(--qf-bg-main)",
      borderRadius: "8px",
      padding: "1.5rem",
      marginBottom: "2rem",
      border: `1px solid var(--qf-naranja)33`,
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
      fontSize: "14px",
    },
    summaryLabel: {
      color: "var(--qf-text-primary)",
      fontWeight: "bold",
    },
    summaryValue: {
      color: "var(--qf-naranja)",
      fontWeight: "bold",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: `1px solid var(--qf-naranja)`,
      fontSize: "18px",
    },
    totalLabel: {
      color: "var(--qf-text-primary)",
      fontWeight: "bold",
    },
    totalAmount: {
      color: "var(--qf-naranja)",
      fontSize: "22px",
      fontWeight: "bold",
    },
    userInfo: {
      backgroundColor: "var(--qf-bg-main)",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "2rem",
      border: `1px solid var(--qf-naranja)33`,
      fontSize: "13px",
    },
    userLabel: {
      color: "var(--qf-text-primary)" + "88",
      marginBottom: "4px",
    },
    userName: {
      color: "var(--qf-text-primary)",
      fontWeight: "bold",
      marginBottom: "8px",
    },
    form: {
      width: "100%",
    },
    cardElement: {
      padding: "12px",
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "8px",
      marginBottom: "1.5rem",
      backgroundColor: "var(--qf-bg-main)",
      color: "var(--qf-text-primary)",
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      flexDirection: "column",
    },
    payButton: {
      width: "100%",
      padding: "12px",
      backgroundColor: "var(--qf-green)",
      color: "var(--qf-text-white)",
      fontSize: "16px",
      fontWeight: "bold",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "10px",
    },
    payButtonDisabled: {
      backgroundColor: "var(--qf-text-primary)" + "33",
      cursor: "not-allowed",
      color: "var(--qf-text-primary)",
    },
    cancelButton: {
      width: "100%",
      padding: "12px",
      backgroundColor: "var(--qf-rojo)",
      color: "var(--qf-text-primary)",
      fontSize: "14px",
      fontWeight: "bold",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
    },
    securityInfo: {
      textAlign: "center",
      marginTop: "1rem",
      fontSize: "12px",
      color: "var(--qf-text-primary)" + "88",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
    },
    loadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
      zIndex: 9999,
      borderRadius: "12px",
    },
    loadingText: {
      fontSize: "16px",
      color: "var(--qf-text-primary)",
      fontWeight: "bold",
      textAlign: "center",
    },
  };

  // Agregar keyframes para el spinner
  const spinnerStyle = document.createElement("style");
  if (!document.getElementById("spinner-keyframes")) {
    spinnerStyle.id = "spinner-keyframes";
    spinnerStyle.textContent = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(spinnerStyle);
  }

  return (
    <div style={{ ...styles.container, maxWidth: isMobile ? "100%" : "450px", position: "relative" }} data-testid="payment-sheet-container">
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.title}>
          <span style={styles.titleIcon}>💳</span>
          Pago Seguro
        </div>
        <div style={styles.subtitle}>
          <FaLock /> Transacción protegida por Stripe
        </div>
      </div>

      {/* Resumen del monto */}
      <div style={styles.summarySection}>
        <div style={styles.summaryRow}>
          <span style={styles.summaryLabel}>Monto a pagar:</span>
          <span style={styles.summaryValue}>${amountInDollars}</span>
        </div>
        <div style={styles.totalRow}>
          <span style={styles.totalLabel}>Total USD:</span>
          <span style={styles.totalAmount}>${amountInDollars}</span>
        </div>
      </div>

      {/* Información del usuario */}
      {user && (
        <div style={styles.userInfo}>
          <div style={styles.userLabel}>Comprador:</div>
          <div style={styles.userName}>
            {user.usuario || "Usuario"}
          </div>
          <div style={styles.userLabel}>Email:</div>
          <div style={styles.userName}>
            {user.email || "email@ejemplo.com"}
          </div>
        </div>
      )}

      {/* Formulario de pago */}
      <form style={styles.form} onSubmit={handleSubmit}>
        <div style={styles.cardElement}>
          <CardElement 
            options={{ style: cardStyle, hidePostalCode: true }} 
            onChange={handleCardChange}
          />
        </div>

        {/* Mostrar errores de tarjeta */}
        {cardError && (
          <div style={{
            color: "var(--qf-rojo)",
            fontSize: "13px",
            marginBottom: "12px",
            padding: "8px",
            backgroundColor: "var(--qf-rojo)" + "22",
            borderRadius: "4px",
            border: `1px solid var(--qf-rojo)`,
          }}>
            {cardError}
          </div>
        )}

        {/* Botones */}
        <div style={styles.buttonGroup}>
          <button
            type="submit"
            style={
              stripe && isElementReady && !cardError && !isLoading
                ? styles.payButton
                : { ...styles.payButton, ...styles.payButtonDisabled }
            }
            disabled={!stripe || !isElementReady || cardError || isLoading}
          >
            <FaCreditCard /> Pagar Ahora
          </button>
          <button
            type="button"
            style={styles.cancelButton}
            disabled={isLoading}
            onClick={handleClose}
          >
            <FaTimes /> Cancelar Compra
          </button>
        </div>

        {/* Información de seguridad */}
        <div style={styles.securityInfo}>
          <FaLock /> Tu información es 100% segura
        </div>
      </form>

      {/* Overlay de carga - aparece encima sin unmounting del formulario */}
      {isLoading && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "var(--qf-text-white)" + "dd",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          zIndex: 9999,
          backdropFilter: "blur(2px)",
        }}>
          <CircularProgress style={{ color: "var(--qf-naranja)" }} size={50} />
          <div style={{
            marginTop: "16px",
            color: "var(--qf-text-primary)",
            fontSize: "16px",
            fontWeight: "500",
          }}>
            Procesando pago...
          </div>
          <div style={{
            fontSize: "13px",
            color: "var(--qf-text-primary)" + "cc",
            marginTop: "8px",
            textAlign: "center",
            maxWidth: "80%",
          }}>
            Por favor espera mientras confirmamos tu pago
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSheet;
