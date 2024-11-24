import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import useDynamicColors from "../../UseDinamicColors";

const PaymentSheet = ({handleCloseCompra,handleClose, paymentIntent }) => {
  const stripe = useStripe();
  const elements = useElements();
  const Colors = useDynamicColors();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmCardPayment(paymentIntent, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      toast.error("Error al realizar el pago");

    } else {
      toast.success("Pago realizado con éxito");
      handleCloseCompra();
    }
  };

  const cardStyle = {
    base: {
      color: Colors.Blanco,
    },
    invalid: {
      color: Colors.Rojo,
      iconColor: Colors.Rojo,
    },
  };

  const styles = {
    form: {
      width:"100%",
      padding: "2rem",
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "8px",
      backgroundColor: Colors.GrisAzuladoClaro,
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    },
    cardElement: {
      padding: "10px",
      border: "1px solid #cbd5e0",
      borderRadius: "4px",
      marginBottom: "1.5rem",
      backgroundColor: Colors.GrisAzuladoOscuro,
      color: Colors.Blanco,
    },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#2d3748",
      color: "#fff",
      fontSize: "16px",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "background-color 0.2s",
      
    },
    buttonDisabled: {
      backgroundColor: "#a0aec0",
      cursor: "not-allowed",
    },
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <div style={styles.cardElement}>
        <CardElement options={{ style: cardStyle, hidePostalCode: true }} />
      </div>
      <button
        type="submit"
        style={
          stripe
            ? { ...styles.button, marginBottom: "1rem" }
            : { ...styles.button, ...styles.buttonDisabled, }
        }
        disabled={!stripe}
      >
        Pagar
      </button>
      <button
        style={
          stripe
            ? styles.button
            : { ...styles.button, ...styles.buttonDisabled }
        }
        disabled={!stripe}
        onClick={handleClose}
      >
        Cancelar
      </button>
    </form>
  );
};

export default PaymentSheet;
