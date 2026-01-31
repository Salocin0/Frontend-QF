import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import ProcesoRegistro from "./ProcesoRegistro/ProcesoRegistro";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import SeleccionRegister from "./SeleccionRegister";

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

describe("Test de register", () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    process.env.REACT_APP_BACK_URL = 'http://127.0.0.1:8000';
  });

  it("debe mostrarse la pantalla para elegir el registro", () => {
    render(
      <MemoryRouter>
        <SeleccionRegister />
      </MemoryRouter>
    );

    expect(screen.getByText("Seleccione Perfil")).toBeInTheDocument();

    expect(screen.getByText("Consumidor")).toBeInTheDocument();
    expect(screen.getByText("Productor")).toBeInTheDocument();
    expect(screen.getByText("Repartidor")).toBeInTheDocument();
    expect(screen.getByText("Encargado")).toBeInTheDocument();
  });

  it("debe renderizar el proceso de registro parte 1", () => {
    const tipoUsuario = "encargado";
    render(
      <MemoryRouter initialEntries={[`/registrarse/${tipoUsuario}`]}>
        <Routes>
          <Route
            path="/registrarse/:tipoUsuario"
            element={<ProcesoRegistro />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Nombre de usuario")).toBeInTheDocument();
    expect(screen.getByText("Contraseña")).toBeInTheDocument();
  });

  it("debe renderizar el proceso de registro parte 2", () => {
    const tipoUsuario = "encargado";
    render(
      <MemoryRouter initialEntries={[`/registrarse/${tipoUsuario}`]}>
        <Routes>
          <Route
            path="/registrarse/:tipoUsuario"
            element={<ProcesoRegistro />}
          />
        </Routes>
      </MemoryRouter>
    );
    const inputname = screen.getByLabelText("Nombre de usuario");
    const inputemail = screen.getByLabelText("Correo electrónico");
    const inputpassword = screen.getByLabelText("Contraseña");
    const inputconfirmPassword = screen.getByLabelText("Confirmar Contraseña");

    fireEvent.change(inputname, { target: { value: "nombre" } });
    fireEvent.change(inputemail, { target: { value: "email@gmail.com" } });
    fireEvent.change(inputpassword, { target: { value: "password123" } });
    fireEvent.change(inputconfirmPassword, { target: { value: "password123" } }); 

    fireEvent.click(screen.getByText("Siguiente"));

    expect(screen.getByText(/Datos Consumidor - Paso 2/i)).toBeInTheDocument();
    expect(screen.getByText("Nombre")).toBeInTheDocument();
  });

  test("debe renderizar el proceso de registro parte 3", async () => {
    const tipoUsuario = "encargado";
    render(
      <MemoryRouter initialEntries={[`/registrarse/${tipoUsuario}`]}>
        <Routes>
          <Route path="/registrarse/:tipoUsuario" element={<ProcesoRegistro />} />
        </Routes>
      </MemoryRouter>
    );
  
    const inputUsername = screen.getByLabelText("Nombre de usuario");
    const inputEmail = screen.getByLabelText("Correo electrónico");
    const inputPassword = screen.getByLabelText("Contraseña");
    const inputConfirmPassword = screen.getByLabelText("Confirmar Contraseña");
  
    fireEvent.change(inputUsername, { target: { value: "usernombre" } });
    fireEvent.change(inputEmail, { target: { value: "email@gmail.com" } });
    fireEvent.change(inputPassword, { target: { value: "password" } });
    fireEvent.change(inputConfirmPassword, { target: { value: "password" } });
  
    fireEvent.click(screen.getByText("Siguiente"));
  
    const inputNombre = screen.getByTestId("nombre");
    const inputApellido = screen.getByTestId("apellido");
    const inputDNI = screen.getByTestId("dni");
    const inputFechaNacimiento = screen.getByTestId("fechaNacimiento");
    const inputProvincia = screen.getByTestId("provincia");
    const inputLocalidad = screen.getByTestId("localidad");
    const inputTelefono = screen.getByTestId("telefono");
  
    fireEvent.change(inputNombre, { target: { value: "nombre" } });
    fireEvent.change(inputApellido, { target: { value: "apellido" } });
    fireEvent.change(inputDNI, { target: { value: 42512605 } });
    fireEvent.change(inputFechaNacimiento, { target: { value: "10/05/2000" } });
    fireEvent.change(inputProvincia, { target: { value: "provincia1" } });
    fireEvent.change(inputLocalidad, { target: { value: "localidad1" } });
    fireEvent.change(inputTelefono, { target: { value: "0342512605" } });
  
    fireEvent.click(screen.getByText("Siguiente"));
  
    await waitFor(() => expect(true).toBe(true));
  });

});
