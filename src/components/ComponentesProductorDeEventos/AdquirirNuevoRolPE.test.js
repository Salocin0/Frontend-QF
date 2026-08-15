import React from "react";
import { render, screen } from "@testing-library/react";
import AdquirirNuevoRolPE from "./AdquirirNuevoRolPE";
import { MemoryRouter } from "react-router-dom";

describe("Pruebas para AdquirirNuevoRolPE", () => {
  test("Renderiza el componente", async () => {
    render(
      <MemoryRouter>
        <AdquirirNuevoRolPE />
      </MemoryRouter>
    );

  // El título se muestra partido en dos headings ("Adquirir Nuevo Rol" +
  // "Productor de Eventos"), no como un único string combinado.
  const titulo = screen.getByRole("heading", { name: "Adquirir Nuevo Rol" });
  const subtitulo = screen.getByText("Productor de Eventos");
  const boton = screen.getByText("Solicitar Nuevo Rol - Productor de Eventos");

  expect(titulo).toBeInTheDocument();
  expect(subtitulo).toBeInTheDocument();
  expect(boton).toBeInTheDocument();
  });
});
