import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckoutAll from "../components/ComponentesCarrito/CheckoutAll";
import { cartAmounts } from "../components/ComponentesCarrito/cartAmounts";

jest.mock("../components/ComponentesCarrito/DialogWithPatmentSheet", () => (props) => <div role="dialog" aria-label="Pago general">
  <button onClick={() => props.onCartCheckoutReady({ checkoutId: "checkout-1", amount: 287500 })}>Preparar pago</button>
  <button onClick={() => props.handleCloseCompra({ status: "succeeded" })}>Pago confirmado</button>
</div>);
jest.mock("react-toastify", () => ({ toast: { success: jest.fn() } }));

beforeEach(() => sessionStorage.clear());
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); });

test("one checkout finalizes the server snapshot, then refreshes the cart", async () => {
  const refresh = jest.fn();
  const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => ({ orderIds: [1, 2] }) });
  render(<CheckoutAll consumerId={7} disabled={false} onComplete={refresh} onLockChange={jest.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Comprar todo" }));
  fireEvent.click(screen.getByRole("button", { name: "Preparar pago" }));
  expect(sessionStorage.getItem("qf-cart-checkout-7")).toBe("checkout-1");
  fireEvent.click(screen.getByRole("button", { name: "Pago confirmado" }));
  await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock.mock.calls[0][0]).toContain("payment-sheet/cart/checkout-1/complete");
  expect(sessionStorage.getItem("qf-cart-checkout-7")).toBeNull();
});

test("after payment, failed registration can retry without opening another payment", async () => {
  const fetchMock = jest.spyOn(global, "fetch")
    .mockResolvedValueOnce({ ok: false, json: async () => ({ error: "Servidor temporalmente no disponible" }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ orderIds: [1, 2] }) });
  const refresh = jest.fn();
  render(<CheckoutAll consumerId={7} disabled={false} onComplete={refresh} onLockChange={jest.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Comprar todo" }));
  fireEvent.click(screen.getByRole("button", { name: "Preparar pago" }));
  fireEvent.click(screen.getByRole("button", { name: "Pago confirmado" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("no se hará otro cobro");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Completar compra" }));
  await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("service fee rounds per order in cents", () => {
  expect(cartAmounts([{ cantidad: 1, producto: { precio: 0.9 } }])).toEqual({ subtotal: 0.9, commission: 0.14, total: 1.04 });
});
