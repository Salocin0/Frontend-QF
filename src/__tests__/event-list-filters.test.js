import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ListadoEventosUsers, { filterEvents } from "../components/ComponentesEventos/ListadoEventoUsers";
import { UserContext } from "../components/ComponentesGenerales/UserContext";

jest.mock("../components/ComponentesGenerales/PageLayout", () => ({ children }) => <div>{children}</div>);
jest.mock("../components/ComponentesGenerales/Footer", () => () => null);
jest.mock("../components/ComponentesEventos/EventoUser", () => ({ evento }) => <article>{evento.nombre}</article>);
const events = [
  { id: 1, nombre: "Festival Norte", tienePreventa: true, latitud: 0, longitud: 0, diaEventos: [{ fechaHoraInicioDiaEvento: "2099-04-01", fechaHoraFinDiaEvento: "2099-04-02" }] },
  { id: 2, nombre: "Feria Sur", tienePreventa: false, latitud: 1, longitud: 1, diaEventos: [{ fechaHoraInicioDiaEvento: "2099-03-01", fechaHoraFinDiaEvento: "2099-03-02" }] },
  { id: 3, nombre: "Sin ubicación", tienePreventa: false },
];
const options = { nombre: "", distancia: "", preventa: { conPreventa: true, sinPreventa: true }, order: "date" };
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); });

test("name, presale and date order combine without changing original events", () => {
  expect(filterEvents(events, options, null).map((e) => e.id)).toEqual([2, 1, 3]);
  expect(filterEvents(events, { ...options, nombre: " FESTIVAL ", preventa: { conPreventa: true, sinPreventa: false } }, null).map((e) => e.id)).toEqual([1]);
  expect(events[0].distanciaCalculada).toBeUndefined();
});

test("distance accepts zero coordinates and excludes unknown distances", () => {
  expect(filterEvents(events, { ...options, distancia: "5", order: "distance" }, { lat: 0, lon: 0 }).map((e) => e.id)).toEqual([1]);
});

test("finished events are hidden", () => {
  const expired = { ...events[0], diaEventos: [{ fechaHoraFinDiaEvento: "2000-01-01" }] };
  expect(filterEvents([expired], options, null)).toEqual([]);
});

test("search and clear work in the list and duplicates are merged", async () => {
  jest.spyOn(global, "fetch").mockImplementation(async () => ({ ok: true, json: async () => ({ data: events }) }));
  render(<UserContext.Provider value={{ user: { consumidorId: 7 } }}><ListadoEventosUsers /></UserContext.Provider>);
  expect(await screen.findByText("3 eventos disponibles")).toBeInTheDocument();
  fireEvent.change(screen.getByRole("searchbox", { name: "Buscar evento" }), { target: { value: "Festival" } });
  expect(screen.getByText("1 evento disponible")).toBeInTheDocument();
  expect(screen.queryByText("Feria Sur")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Limpiar filtros" }));
  expect(screen.getByText("3 eventos disponibles")).toBeInTheDocument();
});

test("API failures have a retry action instead of an empty results message", async () => {
  jest.spyOn(global, "fetch").mockResolvedValue({ ok: false });
  render(<UserContext.Provider value={{ user: { consumidorId: 7 } }}><ListadoEventosUsers /></UserContext.Provider>);
  expect(await screen.findByRole("alert")).toHaveTextContent("No pudimos cargar los eventos");
  expect(screen.getByRole("button", { name: "Reintentar" })).toBeInTheDocument();
});
