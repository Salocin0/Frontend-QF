import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { filterOrders } from "../components/ComponentesPedido/ListadoPedidos";
import Pedido from "../components/ComponentesPedido/Pedido";

const orders = [
  { id: 1, estado: "Precomprado", fecha: "2026-01-01", total: 1200, puesto: { nombreCarro: "Pizza Norte" } },
  { id: 2, estado: "Aceptado", fecha: "2026-02-01", total: 1500, puesto: { nombreCarro: "Burger Sur" } },
  { id: 3, estado: "Valorado", fecha: "2026-03-01", total: 1800, puesto: { nombreCarro: "Pizza Norte" } },
];
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); });

test("state groups include preorders and rated deliveries, with newest first", () => {
  expect(filterOrders(orders, "Aceptados", "", "newest").map((order) => order.id)).toEqual([2, 1]);
  expect(filterOrders(orders, "Entregados", "", "newest").map((order) => order.id)).toEqual([3]);
  expect(orders.map((order) => order.id)).toEqual([1, 2, 3]);
});

test("search by stand, order number or event combines with state and ordering", () => {
  expect(filterOrders(orders, "Todos", " pizza ", "oldest").map((order) => order.id)).toEqual([1, 3]);
  expect(filterOrders(orders, "Todos", "2", "newest").map((order) => order.id)).toEqual([2]);
  expect(filterOrders([{ ...orders[0], evento: { nombre: "Festival" } }], "Todos", "festival", "newest")).toHaveLength(1);
});

test("order details still open and close", () => {
  render(<Pedido pedido={orders[1]} recargar={jest.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: /Detalle/ }));
  expect(screen.getByRole("heading", { name: "Detalle del Pedido #2" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
  expect(screen.queryByRole("heading", { name: "Detalle del Pedido #2" })).not.toBeInTheDocument();
});

test("cancel action still requires confirmation and reloads after success", async () => {
  const refresh = jest.fn();
  const fetchMock = jest.spyOn(global, "fetch").mockResolvedValue({ ok: true, json: async () => ({}) });
  render(<Pedido pedido={orders[1]} recargar={refresh} />);
  fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
  expect(screen.getByRole("heading", { name: "Cancelar Pedido" })).toBeInTheDocument();
  expect(fetchMock).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Confirmar" }));
  expect(await screen.findByText("Cancelado")).toBeInTheDocument();
  expect(fetchMock.mock.calls[0][0]).toContain("pedido/cambiarEstado/2/cancelar");
});


test("clicking the card opens details and cancel stays independent", () => {
  render(<Pedido pedido={orders[1]} recargar={jest.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Ver detalle del pedido #2" }));
  expect(screen.getByRole("heading", { name: "Detalle del Pedido #2" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
  fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
  expect(screen.getByRole("heading", { name: "Cancelar Pedido" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Detalle del Pedido #2" })).not.toBeInTheDocument();
});

test("card supports keyboard activation", () => {
  render(<Pedido pedido={orders[1]} recargar={jest.fn()} />);
  fireEvent.keyDown(screen.getByRole("button", { name: "Ver detalle del pedido #2" }), { key: "Enter" });
  expect(screen.getByRole("heading", { name: "Detalle del Pedido #2" })).toBeInTheDocument();
});
