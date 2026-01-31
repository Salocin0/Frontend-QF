import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdquirirNuevoRolR from '../components/ComponenteRepartidor/AdquirirNuevoRolR';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../mocks';
import { rest } from 'msw';

describe('Adquirir nuevo rol (Repartidor) - integracion', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    process.env.REACT_APP_BACK_URL = 'http://127.0.0.1:8000';
  });

  test('renderiza y permite enviar', () => {
    render(
      <MemoryRouter>
        <AdquirirNuevoRolR />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Confirmo que tengo/i)).toBeInTheDocument();
  });

  test('envío exitoso', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/role/repartidor', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ code: 200 }));
      })
    );

    render(
      <MemoryRouter>
        <AdquirirNuevoRolR />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText(/Confirmo que tengo/i));
    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => expect(screen.getByText('Adquirir Nuevo Rol - Repartidor')).toBeInTheDocument());
  });
});