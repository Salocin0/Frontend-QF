import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AsociarRepartidorAEvento from '../components/ComponenteRepartidor/AsociarRepartidorAEvento';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
import { server } from '../mocks';
import { rest } from 'msw';

describe('Asociar Repartidor (Productor) - integracion', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    process.env.REACT_APP_BACK_URL = 'http://127.0.0.1:8000';
  });

  test('renderiza y asocia con éxito', async () => {
    server.use(
      rest.post('http://127.0.0.1:8000/asociacion/evento/1/asociar', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ code: 200 }));
      })
    );

    render(
      <MemoryRouter>
        <UserContext.Provider value={{ user: { consumidorId: 1, tipoUsuario: 'productor' }, updateUser: jest.fn(), clearUser: jest.fn() }}>
          <AsociarRepartidorAEvento />
        </UserContext.Provider>
      </MemoryRouter>
    );

    // El listado de eventos se carga async (fetch mockeado por MSW), hay
    // que esperar a que resuelva antes de que aparezca el estado vacío.
    await waitFor(() =>
      expect(screen.getByText('No hay eventos activos en este momento.')).toBeInTheDocument()
    );
  });
});