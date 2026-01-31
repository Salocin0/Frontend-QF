import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ListadoPuestos from '../components/ComponentesPuesto/ListadoPuestos';
import { server } from '../mocks';
import { rest } from 'msw';

describe('Consultar puestos de comida - integracion', () => {
  beforeEach(() => {
    localStorage.setItem('sessionId', 'test-session');
    process.env.REACT_APP_BACK_URL = 'http://127.0.0.1:8000/';
  });

  test('muestra lista de puestos', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/user/session', (req, res, ctx) => {
        return res(ctx.json({ code: 200, data: { consumidorId: 1, tipoUsuario: 'Usuario' } }));
      }),
      rest.get('http://127.0.0.1:8000/puesto', (req, res, ctx) => {
        return res(ctx.json({ code: 200, data: [{ id: 1, nombre: 'Puesto 1' }] }));
      })
    );

    render(<ListadoPuestos />);

    await waitFor(() => expect(screen.getByText(/No tenes ningun puesto en este momento/i)).toBeInTheDocument());
  });
});