import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import AdquirirNuevoRolR from "./AdquirirNuevoRolR";
import { MemoryRouter } from "react-router-dom";
import { toast } from "react-toastify";

describe("Pruebas para AdquirirNuevoRolR", () => {
  test("Redirige después de enviar el formulario y muestra el toast de éxito", async () => {
    render(
      <MemoryRouter>
        <AdquirirNuevoRolR />
      </MemoryRouter>
    );

    const checkbox = screen.getByLabelText("Confirmo que tengo más de 18 años");
    fireEvent.click(checkbox);

    const submitButton = screen.getByTestId("submit-button");
    fireEvent.click(submitButton);

  });
});
