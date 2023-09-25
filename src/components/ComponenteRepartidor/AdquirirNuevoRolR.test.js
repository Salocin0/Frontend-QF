import React from "react";
import { render, screen } from "@testing-library/react";
import AdquirirNuevoRolR from "./AdquirirNuevoRolR";
import { MemoryRouter } from "react-router-dom";

describe("Pruebas para AdquirirNuevoRolR", () => {
  test("Renderiza el componente", async () => {
    render(
      <MemoryRouter>
        <AdquirirNuevoRolR />
      </MemoryRouter>
    );

    const checkbox = screen.getByLabelText("Confirmo que tengo más de 18 años");
    const submitButton = screen.getByTestId("submit-button");

    expect(checkbox).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
});
