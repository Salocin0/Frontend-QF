import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Login from "./Login";

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

describe("Test de Login", () => {
  it("debe mostrar el campo de usuario", () => {
    render(
      <UserContext.Provider value={{ updateUser: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );
    const usuarioInput = screen.getByLabelText("Usuario");
    expect(usuarioInput).toBeInTheDocument();
  });

  it("debe mostrar el campo de contraseña", () => {
    render(
      <UserContext.Provider value={{ updateUser: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );
    const contraseñaInput = screen.getByLabelText("Contraseña");
    expect(contraseñaInput).toBeInTheDocument();
  });

  it("debe mostrar el botón de Ingresar", () => {
    render(
      <UserContext.Provider value={{ updateUser: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );
    const ingresarButton = screen.getByText("Iniciar sesión");
    expect(ingresarButton).toBeInTheDocument();
  });

  it("debe mostrar el enlace de Recuperar Contraseña", () => {
    render(
      <UserContext.Provider value={{ updateUser: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );
    const recuperarContraseñaLink = screen.getByText(/¿Olvidaste tu contraseña\?/i);
    expect(recuperarContraseñaLink).toBeInTheDocument();
  });

  it("debe redirigir a la página de recuperar contraseña al hacer clic en el enlace", () => {
    render(
      <UserContext.Provider value={{ updateUser: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );

    const recuperarContraseñaLink = screen.getByText(/¿Olvidaste tu contraseña\?/i);
    expect(recuperarContraseñaLink).toBeInTheDocument();
    expect(recuperarContraseñaLink).toHaveAttribute("href", "/recuperar");
  });

  it("debe redirigir a la página de registrarse al hacer clic en el enlace", () => {
    render(
      <UserContext.Provider value={{ updateUser: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );

    const registrarmeLink = screen.getByText(/registrarse/i);
    expect(registrarmeLink).toBeInTheDocument();
    expect(registrarmeLink).toHaveAttribute("href", "/seleccion-perfil");
  });

  it("debe tener un boton que redirija la navegacion", () => {
    render(
      <UserContext.Provider value={{ updateUser: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );

    const ingresarButton = screen.getByRole("button", { name: /iniciar sesión/i });
    expect(ingresarButton).toBeInTheDocument();
  });

  it("debe redirigir a /home al hacer clic en el botón de Ingresar con éxito", async () => {
    const navigateMock = require("react-router-dom").useNavigate;
    navigateMock.mockReturnValue(() => {});

    render(
      <UserContext.Provider value={{ updateUser: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );

    const ingresarButton = screen.getByRole("button", { name: /iniciar sesión/i });
    fireEvent.click(ingresarButton);
    await Promise.resolve();
    expect(navigateMock).toHaveBeenCalledTimes(1);
  });
});
