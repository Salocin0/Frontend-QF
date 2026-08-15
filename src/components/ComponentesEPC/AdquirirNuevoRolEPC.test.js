import React from "react";
import { render, screen } from "@testing-library/react";
import AdquirirNuevoRolEPC from "./AdquirirNuevoRolEPC";
import { MemoryRouter } from "react-router-dom";

describe("Pruebas para AdquirirNuevoRolEPC", () => {
  test("Renderiza el componente", async () => {
    render(
      <MemoryRouter>
        <AdquirirNuevoRolEPC />
      </MemoryRouter>
    );

  // El título se muestra partido en dos headings ("Adquirir Nuevo Rol" +
  // "Encargado de Puesto de Comida"), no como un único string combinado.
  const titulo = screen.getByRole("heading", { name: "Adquirir Nuevo Rol" });
  const subtitulo = screen.getByText("Encargado de Puesto de Comida");
  const boton = screen.getByText("Solicitar Nuevo Rol - Encargado Puesto de Comida");

  expect(titulo).toBeInTheDocument();
  expect(subtitulo).toBeInTheDocument();
  expect(boton).toBeInTheDocument();
  });
});
