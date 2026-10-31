import React from "react";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Carrito, { groupCartItems } from "../components/ComponentesCarrito/Carrito";
import Tarjeta from "../components/ComponentesCarrito/Tarjeta";
import { UserContext } from "../components/ComponentesGenerales/UserContext";
jest.mock("../components/ComponentesCarrito/DialogWithPatmentSheet", () => ({ isOpen }) => isOpen ? <div role="dialog" aria-label="Pago" /> : null);
jest.mock("../components/ComponentesGenerales/PageLayout", () => ({ children }) => <div>{children}</div>);
jest.mock("../components/ComponentesGenerales/Footer", () => () => null);
const items = [
  { productoId: 1, cantidad: 2, eventoId: 7, fecha: null, evento: { id: 7, nombre: "Festival" }, producto: { id: 1, nombre: "Pizza", precio: 1000, puestoId: 3, puesto: { nombreCarro: "Mi puesto" } } },
  { productoId: 2, cantidad: 1, eventoId: 7, fecha: null, evento: { id: 7, nombre: "Festival" }, producto: { id: 2, nombre: "Agua", precio: 500, puestoId: 3 } },
];
const renderCart = () => render(<MemoryRouter><UserContext.Provider value={{ user: { consumidorId: 4 } }}><Tarjeta productos={items} recargarComponente={jest.fn()} evento={7} /></UserContext.Provider></MemoryRouter>);
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); });

test("cart keeps event, stand and preorder dates in separate groups", () => {
  expect(groupCartItems([...items, { ...items[0], fecha: "2099-01-01" }, { ...items[0], eventoId: 8 }])).toHaveLength(3);
  expect(groupCartItems(null)).toEqual([]);
});

test("quantity button updates the selected product rather than the first product", async () => {
  const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true });
  renderCart();
  fireEvent.click(screen.getByRole("button", { name: "Aumentar Agua" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Aumentar Agua" })).toBeEnabled());
  expect(fetchMock.mock.calls[0][0]).toContain("carrito/addToCart/2");
  expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ cantidad: 1, eventoId: 7, fecha: null });
  expect(within(screen.getByRole("group", { name: "Cantidad de Agua" })).getByRole("status")).toHaveTextContent("2");
});

test("failed quantity update restores displayed quantity", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({ ok: false });
  renderCart();
  fireEvent.click(screen.getByRole("button", { name: "Aumentar Agua" }));
  await waitFor(() => expect(screen.getByRole("button", { name: "Aumentar Agua" })).toBeEnabled());
  expect(within(screen.getByRole("group", { name: "Cantidad de Agua" })).getByRole("status")).toHaveTextContent("1");
  expect(screen.getByRole("button", { name: "Disminuir Agua" })).toBeDisabled();
});



test("general summary lists each cart's products and updates with quantity changes", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => ({ data: { ItemCarritos: items } }) });
  const { container } = render(<MemoryRouter><UserContext.Provider value={{ user: { consumidorId: 4 } }}><Carrito /></UserContext.Provider></MemoryRouter>);
  const overview = await screen.findByRole("complementary", { name: "Resumen general" });
  expect(within(overview).getByText("Pizza")).toBeInTheDocument();
  expect(within(overview).getByText("Agua")).toBeInTheDocument();
  expect(container.querySelector(".qf-cart-group").contains(overview)).toBe(false);
  expect(overview.querySelector(".qf-cart-overview-total dd")).toHaveTextContent("2.875,00");
  fireEvent.click(screen.getByRole("button", { name: "Aumentar Agua" }));
  await waitFor(() => expect(overview.querySelector(".qf-cart-overview-total dd")).toHaveTextContent("3.450,00"));
  const buy = within(overview).getByRole("button", { name: /Comprar/ });
  await waitFor(() => expect(buy).toBeEnabled());
  expect(within(container.querySelector(".qf-cart-group")).queryByRole("button", { name: /Comprar/ })).not.toBeInTheDocument();
  fireEvent.click(buy);
  expect(screen.getByRole("dialog", { name: "Pago" })).toBeInTheDocument();
});
