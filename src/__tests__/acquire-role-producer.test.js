import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdquirirNuevoRolPE from '../components/ComponentesProductorDeEventos/AdquirirNuevoRolPE';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../mocks';
import { rest } from 'msw';

describe('Adquirir nuevo rol (Productor) - integracion', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    process.env.REACT_APP_BACK_URL = 'http://127.0.0.1:8000';
  });

  test('renderiza y confirma', () => {
    render(
      <MemoryRouter>
        <AdquirirNuevoRolPE />
      </MemoryRouter>
    );

    expect(screen.getByText('CUIT')).toBeInTheDocument();
  });

  test('envío exitoso', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/role/productor', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ code: 200 }));
      })
    );

    render(
      <MemoryRouter>
        <AdquirirNuevoRolPE />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('CUIT'), { target: { value: '123456789' } });
    fireEvent.click(screen.getByRole('button', { name: 'Solicitar Nuevo Rol - Productor de Eventos' }));

    // El título se muestra partido en dos headings ("Adquirir Nuevo Rol" +
    // "Productor de Eventos"), no como un único string combinado.
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Adquirir Nuevo Rol' })).toBeInTheDocument());
    expect(screen.getByText('Productor de Eventos')).toBeInTheDocument();
  });
});