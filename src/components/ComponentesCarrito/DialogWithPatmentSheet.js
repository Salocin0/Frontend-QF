import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { Elements } from "@stripe/react-stripe-js";
import PaymentSheet from "./PaymentSheet";
import { loadStripe } from "@stripe/stripe-js";
import useDynamicColors from "../../UseDinamicColors";

const DialogWithPaymentSheet = ({
  isOpen,
  onClose,
  amount,
  handleCloseCompra,
}) => {
  const stripePromise = loadStripe(process.env?.REACT_APP_API_KEY_STRIPE);
  const [paymentSheetData, setPaymentSheetData] = useState(null);
  const Colors = useDynamicColors();
  useEffect(() => {
    const fetchPaymentSheetData = async (amount) => {
      try {
        if (!paymentSheetData) {
          const response = await fetch(
            `${process.env.REACT_APP_BACK_URL}payment-sheet`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ amount: amount }),
            }
          );

          const data = await response.json();
          setPaymentSheetData(data);
        }
      } catch (error) {
        console.error("Error fetching Payment Sheet data:", error);
      }
    };
    fetchPaymentSheetData(amount * 1000);
  }, [paymentSheetData]);

  const handleClose = () => {
    onClose();
    setPaymentSheetData(null);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogContent
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.GrisAzuladoOscuro,
          borderRadius: "0px",
        }}
      >
        {!paymentSheetData ? (
          // Spinner mientras se cargan los datos
          <CircularProgress />
        ) : (
          // Renderizar PaymentSheet una vez disponible
          <Elements stripe={stripePromise}>
            <PaymentSheet
              handleCloseCompra={handleCloseCompra}
              handleClose={handleClose}
              {...paymentSheetData}
            />
          </Elements>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogWithPaymentSheet;
