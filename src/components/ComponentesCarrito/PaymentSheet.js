import React, { useContext, useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import useDynamicColors from "../../UseDinamicColors";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { FaCreditCard, FaTimes, FaLock } from "react-icons/fa";

const PaymentSheet = ({handleCloseCompra,handleClose, paymentIntent, clientSecret, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const Colors = useDynamicColors();
  const { user } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isElementReady, setIsElementReady] = useState(false);
  const [cardError, setCardError] = useState(null);

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
      color: Colors.Blanco,
      backgroundColor: Colors.GrisAzuladoOscuro,
      fontSize: "16px",
      fontFamily: "Arial, sans-serif",
      "::placeholder": {
        color: Colors.Blanco + "80",
      },
    },
    invalid: {
      color: Colors.Rojo,
      iconColor: Colors.Rojo,
    },
  };

  const amountInDollars = (amount / 100).toFixed(2);

  const styles = {
    container: {
      width: "100%",
      maxWidth: "450px",
      padding: "2rem",
      border: `2px solid ${Colors.Naranja}`,
      borderRadius: "12px",
      backgroundColor: Colors.GrisAzuladoClaro,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    },
    header: {
      textAlign: "center",
      marginBottom: "2rem",
      paddingBottom: "1rem",
      borderBottom: `2px solid ${Colors.Naranja}`,
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: Colors.Naranja,
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
      color: Colors.Blanco,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "6px",
    },
    summarySection: {
      backgroundColor: Colors.GrisAzuladoOscuro,
      borderRadius: "8px",
      padding: "1.5rem",
      marginBottom: "2rem",
      border: `1px solid ${Colors.Naranja}33`,
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
      fontSize: "14px",
    },
    summaryLabel: {
      color: Colors.Blanco,
      fontWeight: "bold",
    },
    summaryValue: {
      color: Colors.Naranja,
      fontWeight: "bold",
    },
    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: `1px solid ${Colors.Naranja}`,
      fontSize: "18px",
    },
    totalLabel: {
      color: Colors.Blanco,
      fontWeight: "bold",
    },
    totalAmount: {
      color: Colors.Naranja,
      fontSize: "22px",
      fontWeight: "bold",
    },
    userInfo: {
      backgroundColor: Colors.GrisAzuladoOscuro,
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "2rem",
      border: `1px solid ${Colors.Naranja}33`,
      fontSize: "13px",
    },
    userLabel: {
      color: Colors.Blanco + "88",
      marginBottom: "4px",
    },
    userName: {
      color: Colors.Blanco,
      fontWeight: "bold",
      marginBottom: "8px",
    },
    form: {
      width: "100%",
    },
    cardElement: {
      padding: "12px",
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "8px",
      marginBottom: "1.5rem",
      backgroundColor: Colors.GrisAzuladoOscuro,
      color: Colors.Blanco,
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      flexDirection: "column",
    },
    payButton: {
      width: "100%",
      padding: "12px",
      backgroundColor: Colors.Verde,
      color: Colors.Negro,
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
      backgroundColor: Colors.Blanco + "33",
      cursor: "not-allowed",
      color: Colors.Blanco,
    },
    cancelButton: {
      width: "100%",
      padding: "12px",
      backgroundColor: Colors.Rojo,
      color: Colors.Blanco,
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
      color: Colors.Blanco + "88",
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
      color: Colors.Blanco,
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
    <div style={{ ...styles.container, position: "relative" }}>
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
            color: Colors.Rojo,
            fontSize: "13px",
            marginBottom: "12px",
            padding: "8px",
            backgroundColor: Colors.Rojo + "22",
            borderRadius: "4px",
            border: `1px solid ${Colors.Rojo}`,
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
          backgroundColor: Colors.Negro + "dd",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          zIndex: 9999,
          backdropFilter: "blur(2px)",
        }}>
          <CircularProgress style={{ color: Colors.Naranja }} size={50} />
          <div style={{
            marginTop: "16px",
            color: Colors.Blanco,
            fontSize: "16px",
            fontWeight: "500",
          }}>
            Procesando pago...
          </div>
          <div style={{
            fontSize: "13px",
            color: Colors.Blanco + "cc",
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
