import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdquirirNuevoRolEPC from '../components/ComponentesEPC/AdquirirNuevoRolEPC';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../mocks';
import { rest } from 'msw';

describe('Adquirir nuevo rol (Puesto de Comida) - integracion', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    process.env.REACT_APP_BACK_URL = 'http://127.0.0.1:8000';
  });

  test('renderiza componente', () => {
    render(
      <MemoryRouter>
        <AdquirirNuevoRolEPC />
      </MemoryRouter>
    );

    expect(screen.getByText('Adquirir Nuevo Rol - Encargado de Puesto de Comida')).toBeInTheDocument();
  });

  test('envío exitoso', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/role/puesto', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ code: 200 }));
      })
    );

    render(
      <MemoryRouter>
        <AdquirirNuevoRolEPC />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('CUIT'), { target: { value: '123456789' } });
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar Nuevo Rol - Encargado Puesto de Comida' }));

    await waitFor(() => expect(screen.getByText('Adquirir Nuevo Rol - Encargado de Puesto de Comida')).toBeInTheDocument());
  });
});