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

  const titulo = screen.getByText("Adquirir Nuevo Rol - Encargado de Puesto de Comida");
  const boton = screen.getByText("Solicitar Nuevo Rol - Encargado Puesto de Comida");

  expect(titulo).toBeInTheDocument();
  expect(boton).toBeInTheDocument();
  });
});
