import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { filterProducts } from "../components/ComponentesProducto/ListadoProductoUser";
import ProductoUser from "../components/ComponentesProducto/ProductoUser";
import { toast } from "react-toastify";

jest.mock("react-toastify", () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));
const products = [{ id: 1, nombre: "Pizza", descripcion: null, precio: 2000 }, { id: 2, nombre: "Burger", descripcion: "Con queso", precio: 1500 }];
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); jest.clearAllMocks(); });

test("search tolerates missing descriptions and price sort preserves source order", () => {
  expect(filterProducts(products, " PIZZA ", "default").map((p) => p.id)).toEqual([1]);
  expect(filterProducts(products, "", "price-up").map((p) => p.id)).toEqual([2, 1]);
  expect(products.map((p) => p.id)).toEqual([1, 2]);
});

test("add to cart retains event and selected date and prevents duplicate submissions", async () => {
  let resolve;
  const fetchMock = jest.spyOn(global, "fetch").mockImplementation(() => new Promise((done) => { resolve = done; }));
  render(<ProductoUser producto={products[0]} user={{ consumidorId: 7 }} evento={{ id: 9 }} selectedDay="2099-01-01" />);
  const button = screen.getByRole("button", { name: "Agregar al carrito" });
  fireEvent.click(button);
  fireEvent.click(button);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(button).toBeDisabled();
  const [url, request] = fetchMock.mock.calls[0];
  expect(url).toContain("carrito/addToCart/1");
  expect(request.method).toBe("PUT");
  expect(JSON.parse(request.body)).toEqual({ fecha: "2099-01-01", eventoId: 9, cantidad: 1 });
  resolve({ ok: true });
  await waitFor(() => expect(button).toBeEnabled());
  expect(toast.success).toHaveBeenCalled();
});

test("failed cart request restores the action and reports the error", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({ ok: false });
  render(<ProductoUser producto={products[0]} user={{ consumidorId: 7 }} evento={{ id: 9 }} />);
  fireEvent.click(screen.getByRole("button", { name: "Agregar al carrito" }));
  await waitFor(() => expect(toast.error).toHaveBeenCalled());
  expect(screen.getByRole("button", { name: "Agregar al carrito" })).toBeEnabled();
});


test("quantity selector stops at one and sends selected quantity in one request", async () => {
  const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true });
  render(<ProductoUser producto={products[0]} user={{ consumidorId: 7 }} evento={{ id: 9 }} />);
  expect(screen.getByRole("button", { name: "Reducir cantidad" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: "Aumentar cantidad" }));
  fireEvent.click(screen.getByRole("button", { name: "Aumentar cantidad" }));
  expect(screen.getByLabelText("Cantidad")).toHaveTextContent("3");
  fireEvent.click(screen.getByRole("button", { name: "Agregar al carrito" }));
  await waitFor(() => expect(toast.success).toHaveBeenCalled());
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(JSON.parse(fetchMock.mock.calls[0][1].body).cantidad).toBe(3);
});
