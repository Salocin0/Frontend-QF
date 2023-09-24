import { fireEvent, render, screen } from "@testing-library/react";
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
  it("debe mostrarse la pantalla para elegir el registro", () => {
    render(
      <MemoryRouter>
        <SeleccionRegister />
      </MemoryRouter>
    );

    expect(screen.getByText("Seleccione Perfil")).toBeInTheDocument();

    const checkboxConsumidor = screen.getByLabelText("Consumidor");
    expect(checkboxConsumidor).toBeInTheDocument();

    const radioProductor = screen.getByLabelText("Productor");
    expect(radioProductor).toBeInTheDocument();

    const radioRepartidor = screen.getByLabelText("Repartidor");
    expect(radioRepartidor).toBeInTheDocument();

    const radioEncargado = screen.getByLabelText("Encargado");
    expect(radioEncargado).toBeInTheDocument();
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

    expect(screen.getByText("Datos Usuario 1/3")).toBeInTheDocument();
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
    const inputname = screen.getByTestId("username");
    const inputemail = screen.getByTestId("email");
    const inputpassword = screen.getByTestId("password");
    const inputconfirmPassword = screen.getByTestId("confirmPassword");
    
    fireEvent.change(inputname, { target: { value: "nombre" } });
    fireEvent.change(inputemail, { target: { value: "email@gmail.com" } });
    fireEvent.change(inputpassword, { target: { value: "password" } });
    fireEvent.change(inputconfirmPassword, { target: { value: "password" } }); 

    fireEvent.click(screen.getByText("Siguiente"));

    expect(screen.getByText("Datos Consumidor 2/3")).toBeInTheDocument();
    expect(screen.getByText("Nombre")).toBeInTheDocument();
  });

  test("debe renderizar el proceso de registro parte 3", () => {
    const tipoUsuario = "encargado";
    render(
      <MemoryRouter initialEntries={[`/registrarse/${tipoUsuario}`]}>
        <Routes>
          <Route path="/registrarse/:tipoUsuario" element={<ProcesoRegistro />} />
        </Routes>
      </MemoryRouter>
    );
  
    const inputUsername = screen.getByTestId("username");
    const inputEmail = screen.getByTestId("email");
    const inputPassword = screen.getByTestId("password");
    const inputConfirmPassword = screen.getByTestId("confirmPassword");
  
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
  
    expect(screen.getByText("Datos Encargado")).toBeInTheDocument();
    expect(screen.getByText("CUIT:")).toBeInTheDocument();
  });

});
