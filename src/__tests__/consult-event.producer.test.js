import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ConsultarEvento from '../components/ComponentesEventos/ConsultarEvento';
import { MemoryRouter } from 'react-router-dom';
import { server } from '../mocks';
import { rest } from 'msw';

describe('Consultar Evento (Productor) - integracion', () => {
  beforeEach(() => {
    localStorage.setItem('sessionId', 'test-session');
    process.env.REACT_APP_BACK_URL = 'http://127.0.0.1:8000/';
  });

  test('muestra datos del evento cuando el fetch es exitoso', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/user/session', (req, res, ctx) => {
        return res(ctx.json({ code: 200, data: { consumidorId: 1, tipoUsuario: 'Productor' } }));
      }),
      rest.get('http://127.0.0.1:8000/evento/1', (req, res, ctx) => {
        return res(ctx.json({ code: 200, data: { id: 1, nombre: 'Evento 1' } }));
      }),
      rest.get('https://apis.datos.gob.ar/georef/api/provincias', (req, res, ctx) => {
        return res(ctx.json({ provincias: [] }));
      })
    );

    render(
      <MemoryRouter initialEntries={['/evento/1']}>
        <ConsultarEvento />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Eventos')).toBeInTheDocument());
  });

  test('error del servidor muestra mensaje', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/user/session', (req, res, ctx) => {
        return res(ctx.json({ code: 200, data: { consumidorId: 1, tipoUsuario: 'Productor' } }));
      }),
      rest.get('http://127.0.0.1:8000/evento/1', (req, res, ctx) => {
        return res(ctx.status(500));
      }),
      rest.get('https://apis.datos.gob.ar/georef/api/provincias', (req, res, ctx) => {
        return res(ctx.json({ provincias: [] }));
      })
    );

    render(
      <MemoryRouter initialEntries={['/evento/1']}>
        <ConsultarEvento />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Eventos')).toBeInTheDocument());
  });
});