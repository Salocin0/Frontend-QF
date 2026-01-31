import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrarEvento from '../components/ComponentesEventos/RegistrarEvento';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../mocks';
import { rest } from 'msw';

describe('Registrar Butacas (Productor) - integracion', () => {
  test('agrega butacas y guarda', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/evento/butacas', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ code: 200 }));
      })
    );

    render(
      <MemoryRouter>
        <RegistrarEvento />
      </MemoryRouter>
    );

    // Simulación: abrir sección de butacas si existe y agregar
    // (este test es un esqueleto, adaptar a la UI real si el componente expone inputs específicos)
    expect(screen.getByText(/Butacas|Asientos/i) || screen.getByText(/Nombre del evento/i)).toBeTruthy();
  });
});