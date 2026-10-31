import React from "react";
import { render, screen } from "@testing-library/react";
import DialogWithPaymentSheet from "../components/ComponentesCarrito/DialogWithPatmentSheet";

jest.mock("@stripe/stripe-js", () => ({ loadStripe: () => Promise.resolve({}) }));
jest.mock("@stripe/react-stripe-js", () => ({ Elements: ({ children }) => children }));
jest.mock("../components/ComponentesCarrito/PaymentSheet", () => ({ currency }) => <div data-testid="payment-form" data-currency={currency}>Formulario de tarjeta</div>);

afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); });

test("applies the payment surface and width to the real MUI paper slot", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => ({ clientSecret: "test_secret" }) });
  render(<DialogWithPaymentSheet isOpen amount={100} onClose={jest.fn()} handleCloseCompra={jest.fn()} />);
  await screen.findByText("Formulario de tarjeta");
  const paper = screen.getByRole("dialog");
  expect(paper).toHaveClass("qf-payment-modal");
  expect(getComputedStyle(paper).maxWidth).toBe("450px");
  expect(getComputedStyle(paper).borderRadius).toBe("20px");
});


test("checkout displays the currency returned by the backend", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => ({ clientSecret: "test_secret", checkoutId: "checkout-test", amount: 1380000, currency: "usd" }) });
  render(<DialogWithPaymentSheet isOpen isCartCheckout amount={0} onCartCheckoutReady={jest.fn()} onClose={jest.fn()} handleCloseCompra={jest.fn()} />);
  expect(await screen.findByTestId("payment-form")).toHaveAttribute("data-currency", "USD");
});
