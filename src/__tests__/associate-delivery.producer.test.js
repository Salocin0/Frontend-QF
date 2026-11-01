import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import AsociarRepartidorAEvento from '../components/ComponenteRepartidor/AsociarRepartidorAEvento';
import { MemoryRouter } from 'react-router-dom';
import { UserContext } from '../components/ComponentesGenerales/UserContext';

describe('Asociar Repartidor (Productor) - integracion', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'test-token');
    process.env.REACT_APP_BACK_URL = 'http://127.0.0.1:8000/';
  });

  afterEach(() => global.fetch.mockRestore());

  test('muestra el estado vacío cuando no hay eventos disponibles', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: [] }) });

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
      expect(screen.getByText('Todavía no hay eventos disponibles')).toBeInTheDocument()
    );
  });
});