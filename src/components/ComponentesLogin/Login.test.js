import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../ComponentesGenerales/UserContext';
import Login from './Login';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useHistory: () => ({
      push: jest.fn(),
    }),
  }));

describe('Test de Login', () => {
  it('debe mostrar el campo de usuario', () => {
    render(
      <UserContext.Provider value={{ updateUser: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );
    const usuarioInput = screen.getByLabelText('Usuario');
    expect(usuarioInput).toBeInTheDocument();
  });

  it('debe mostrar el campo de contraseña', () => {
    render(
      <UserContext.Provider value={{ updateUser: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );
    const contraseñaInput = screen.getByLabelText('Contraseña');
    expect(contraseñaInput).toBeInTheDocument();
  });

  it('debe mostrar el botón de Ingresar', () => {
    render(
      <UserContext.Provider value={{ updateUser: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );
    const ingresarButton = screen.getByText('Ingresar');
    expect(ingresarButton).toBeInTheDocument();
  });

  it('debe mostrar el enlace de Recuperar Contraseña', () => {
    render(
      <UserContext.Provider value={{ updateUser: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
    );
    const recuperarContraseñaLink = screen.getByText('Recuperar Contraseña');
    expect(recuperarContraseñaLink).toBeInTheDocument();
  });

 /* it('debe mostrar el enlace de Registrarme', () => {

    render(
        <UserContext.Provider value={{ updateUser: jest.fn() }}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </UserContext.Provider>
      );
    const registrarmeLink = screen.getByText('Registrarme');
    expect(registrarmeLink).toBeInTheDocument();

    fireEvent.click(registrarmeLink);

    // Verificar que la URL haya cambiado correctamente
    expect(useHistory().push).toHaveBeenCalledWith('/registrarse');
  });*/


});
