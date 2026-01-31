import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../components/ComponentesLogin/Login';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../mocks';
import { rest } from 'msw';

describe('Iniciar Sesión (Consumidor) - integracion', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    process.env.REACT_APP_BACK_URL = 'http://127.0.0.1:8000';
  });

  test('renderiza campos y enlaces', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Usuario')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
    expect(screen.getByText('¿Olvidaste tu contraseña?')).toBeInTheDocument();
  });

  test('login exitoso navega', async () => {
    const navigateMock = require('react-router-dom').useNavigate;
    navigateMock.mockReturnValue(() => {});

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const ingresarButton = screen.getByRole('button', { name: 'Iniciar sesión' });
    fireEvent.click(ingresarButton);

    await waitFor(() => expect(navigateMock).toHaveBeenCalledTimes(1));
  });

  test('credenciales inválidas muestra error', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/login/', (req, res, ctx) => {
        return res(ctx.status(401), ctx.json({ code: 401, error: 'Invalid credentials' }));
      })
    );

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const ingresarButton = screen.getByRole('button', { name: 'Iniciar sesión' });
    fireEvent.click(ingresarButton);

    await waitFor(() => expect(screen.getByText(/invalid credentials|credenciales/i)).toBeInTheDocument());
  });
});