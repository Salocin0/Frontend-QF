import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EstadisticasPerfil, { ActivityChart, buildActivity } from "../components/ComponentesConsumidor/estadisticasPerfil/EstadisticasPerfil";
import { UserContext } from "../components/ComponentesGenerales/UserContext";

const renderStats = (role = "consumidor") => render(
  <UserContext.Provider value={{ user: { tipoUsuario: role, consumidorId: 7 } }}>
    <EstadisticasPerfil />
  </UserContext.Provider>
);
const answer = (data) => ({ ok: true, json: async () => ({ data }) });

afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); });

test("activity chart excludes currency from count comparisons", () => {
  const rows = buildActivity("consumidor", { total_pedidos: "12", total_eventos: "3", total_gastado: 90000 });
  expect(rows.map((row) => row.value)).toEqual([12, 3]);
  render(<ActivityChart rows={rows} />);
  expect(screen.getByRole("list", { name: "Actividad acumulada" })).toBeInTheDocument();
  expect(screen.getByText("12")).toBeInTheDocument();
});

test("empty activity explains absence of bars", () => {
  render(<ActivityChart rows={buildActivity("repartidor", null)} />);
  expect(screen.getByText(/Todavía no hay actividad/)).toBeInTheDocument();
  expect(screen.queryByRole("list")).not.toBeInTheDocument();
});

test("failed request shows retry instead of zero totals and retry recovers", async () => {
  jest.spyOn(global, "fetch").mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce(answer({ total_gastado: 1500, total_pedidos: 2, total_eventos: 1 }));
  renderStats();
  expect(await screen.findByRole("alert")).toHaveTextContent("No pudimos cargar");
  expect(screen.queryByText("Total Gastado")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Reintentar" }));
  expect(await screen.findByText("Total Gastado")).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("encargado graph requests revenue for each of their own puestos", async () => {
  const fetchMock = jest.spyOn(global, "fetch")
    .mockResolvedValueOnce(answer(3000))
    .mockResolvedValueOnce(answer([{ id: 22, nombreCarro: "Mi puesto" }]))
    .mockResolvedValueOnce(answer(3000));
  renderStats("encargado");
  expect(await screen.findByText("Mi puesto")).toBeInTheDocument();
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(3));
  expect(JSON.parse(fetchMock.mock.calls[2][1].body)).toEqual({ idPuesto: 22, idEvento: "Todos" });
  expect(screen.queryByText("Total Gastado")).not.toBeInTheDocument();
});
