import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PaymentSheet from "../components/ComponentesCarrito/PaymentSheet";
import { UserContext } from "../components/ComponentesGenerales/UserContext";
const mockConfirm = jest.fn();
let mockCardOptions;
jest.mock("@stripe/react-stripe-js", () => {
  const React = require("react");
  return {
    useStripe: () => ({ confirmCardPayment: mockConfirm }),
    useElements: () => ({ getElement: () => ({}) }),
    CardElement: ({ onReady, options }) => {
      mockCardOptions = options;
      React.useEffect(() => { onReady(); }, []);
      return <div data-testid="secure-card-element" />;
    },
  };
});
jest.mock("react-toastify", () => ({ toast: { success: jest.fn() } }));
const renderPayment = (props = {}) => render(<UserContext.Provider value={{ user: { usuario: "Consumidor", email: "consumidor@demo.com" } }}><PaymentSheet amount={1380000} currency="ARS" clientSecret="test_secret" handleClose={jest.fn()} handleCloseCompra={jest.fn()} {...props} /></UserContext.Provider>);
afterEach(() => { mockConfirm.mockReset(); localStorage.removeItem("modoOscuroActivo"); });

test("shows one total in ARS without the duplicate USD row", () => {
  renderPayment();
  expect(screen.getAllByText(/13.800,00/)).toHaveLength(1);
  expect(screen.getByText(/13.800,00/)).toHaveTextContent("ARS");
  expect(screen.queryByText(/Total USD/)).not.toBeInTheDocument();
  expect(screen.getByText("Consumidor")).toBeInTheDocument();
  expect(screen.getByText("consumidor@demo.com")).toBeInTheDocument();
});

test("Stripe card text adapts to the light theme", () => {
  localStorage.setItem("modoOscuroActivo", "false");
  renderPayment();
  expect(mockCardOptions.style.base.color).toBe("#26221c");
});

test("pay prevents duplicate submissions and awaits order registration", async () => {
  let resolvePayment;
  mockConfirm.mockImplementation(() => new Promise((resolve) => { resolvePayment = resolve; }));
  const complete = jest.fn().mockResolvedValue(true);
  renderPayment({ handleCloseCompra: complete });
  const pay = screen.getByRole("button", { name: "Pagar ahora" });
  await waitFor(() => expect(pay).toBeEnabled());
  fireEvent.click(pay); fireEvent.click(pay);
  expect(mockConfirm).toHaveBeenCalledTimes(1);
  expect(screen.getByRole("button", { name: "Cancelar compra" })).toBeDisabled();
  resolvePayment({ paymentIntent: { id: "pi_test", status: "succeeded" } });
  await waitFor(() => expect(complete).toHaveBeenCalledWith({ id: "pi_test", status: "succeeded" }));
});

test("Stripe errors are shown inline and do not register an order", async () => {
  mockConfirm.mockResolvedValue({ error: { message: "La tarjeta fue rechazada" } });
  const complete = jest.fn();
  renderPayment({ handleCloseCompra: complete });
  fireEvent.click(screen.getByRole("button", { name: "Pagar ahora" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("La tarjeta fue rechazada");
  expect(complete).not.toHaveBeenCalled();
});
