import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { formatDateAR } from "../components/ComponentesGenerales/Utils/formatDate";
import CardPreCompra from "../components/ComponentesEventos/CardPreCompra";

const evento = { id: 1, tienePreventa: true, diaEventos: [{ fechaHoraInicioDiaEvento: "2099-06-01T12:00:00Z", fechaHoraFinDiaEvento: "2099-06-01T23:00:00Z" }] };

test("precompra opens date selection and requires choosing a date", () => {
  render(<MemoryRouter><CardPreCompra evento={evento} /></MemoryRouter>);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Precompra Comprá antes/ }));
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Continuar con la precompra" })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name: formatDateAR(evento.diaEventos[0].fechaHoraInicioDiaEvento) }));
  expect(screen.getByRole("button", { name: "Continuar con la precompra" })).toBeEnabled();
});

test("unavailable precompra retains the card but cannot be opened", () => {
  render(<MemoryRouter><CardPreCompra evento={{ ...evento, tienePreventa: false }} /></MemoryRouter>);
  expect(screen.getByRole("button", { name: /Precompra Comprá antes/ })).toBeDisabled();
});
