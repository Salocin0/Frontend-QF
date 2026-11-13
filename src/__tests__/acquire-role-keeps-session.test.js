import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('../__mocks__/react-router-dom.js'),
  useNavigate: () => mockNavigate,
}));
import { UserContext } from '../components/ComponentesGenerales/UserContext';
import AdquirirNuevoRolR from '../components/ComponenteRepartidor/AdquirirNuevoRolR';
import AdquirirNuevoRolEPC from '../components/ComponentesEPC/AdquirirNuevoRolEPC';
import AdquirirNuevoRolPE from '../components/ComponentesProductorDeEventos/AdquirirNuevoRolPE';

const BACK = 'http://127.0.0.1:8000/';

// Acquiring a new role must not send the user to the login nor close the session:
// the session is updated in place with the new role and the user lands on /inicio.
describe.each([
  ['repartidor', AdquirirNuevoRolR, () => fireEvent.click(screen.getByLabelText(/Confirmo que tengo/i))],
  ['encargado', AdquirirNuevoRolEPC, () => {}],
  ['productor', AdquirirNuevoRolPE, () => {}],
])('Adquirir nuevo rol %s mantiene la sesión', (rol, Componente, completarFormulario) => {
  const fetchOriginal = global.fetch;

  beforeEach(() => {
    process.env.REACT_APP_BACK_URL = BACK;
    mockNavigate.mockClear();
    global.fetch = jest.fn(async () => ({ ok: true, status: 200, json: async () => ({ status: 'sucess' }) }));
  });

  afterEach(() => {
    global.fetch = fetchOriginal;
  });

  test('actualiza el rol del usuario y navega al inicio', async () => {
    const user = { id: 7, usuario: 'camila', tipoUsuario: 'consumidor', sessionId: 'abc' };
    const updateUser = jest.fn();

    const { container } = render(
      <UserContext.Provider value={{ user, updateUser, clearUser: jest.fn() }}>
        <MemoryRouter>
          <Componente />
        </MemoryRouter>
      </UserContext.Provider>
    );

    completarFormulario();
    const formularios = [...container.querySelectorAll('form')];
    fireEvent.submit(formularios.find((f) => f.querySelector('[type="submit"]')) || formularios[formularios.length - 1]);

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/inicio'));
    expect(mockNavigate).not.toHaveBeenCalledWith('/login');
    expect(updateUser).toHaveBeenCalledWith({ ...user, tipoUsuario: rol });
    expect(updateUser).not.toHaveBeenCalledWith({});
    const urls = global.fetch.mock.calls.map(([url]) => String(url));
    expect(urls).toContain(`${BACK}user/update/7/to/${rol}`);
    expect(urls.some((url) => url.includes('cerrarWeb'))).toBe(false);
  });
});
