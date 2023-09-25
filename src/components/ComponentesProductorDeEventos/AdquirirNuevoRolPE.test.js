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

  const titulo = screen.getByText("Adquirir Nuevo Rol - Productor de Eventos");
  const boton = screen.getByText("Solicitar Nuevo Rol - Productor de Eventos");

  expect(titulo).toBeInTheDocument();
  expect(boton).toBeInTheDocument();
  });
});
