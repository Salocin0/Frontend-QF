import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrarEvento from '../components/ComponentesEventos/RegistrarEvento';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../mocks';
import { rest } from 'msw';

describe('Registrar Evento (Productor) - integracion', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    process.env.REACT_APP_BACK_URL = 'http://127.0.0.1:8000';
  });

  test('renderiza formulario', () => {
    render(
      <MemoryRouter>
        <RegistrarEvento />
      </MemoryRouter>
    );
    expect(screen.getByText('Registrar Evento')).toBeInTheDocument();
  });

  test('registro exitoso llama al backend', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/evento', (req, res, ctx) => {
        return res(ctx.status(201), ctx.json({ code: 201, data: { id: 55 } }));
      })
    );

    render(
      <MemoryRouter>
        <RegistrarEvento />
      </MemoryRouter>
    );

    // rellenar campos mínimos y enviar
    fireEvent.change(screen.getByLabelText(/Nombre del evento|Titulo/i), { target: { value: 'Evento Prueba' } });
    fireEvent.click(screen.getByRole('button', { name: /Guardar|Registrar/i }));

    await waitFor(() => expect(screen.getByText('Registrar Evento')).toBeInTheDocument());
  });
});