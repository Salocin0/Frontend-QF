import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import VerSolicitudes from '../components/ComponentesEventos/VerSolicitudes';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
jest.mock('react-router-dom', () => ({ useParams: () => ({ evento: '3' }), Link: ({ children, to }) => <a href={to}>{children}</a> }));
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
const pending = { id: 7, estado: 'PendienteDeAceptacion', puesto: { nombreCarro: 'Papas Demo', telefonoCarro: '351123', tipoNegocio: 'Comida rápida' } };
const renderPage = () => render(<UserContext.Provider value={{ user: { consumidorId: 1, tipoUsuario: 'productor' } }}><VerSolicitudes /></UserContext.Provider>);
const setup = (associations) => jest.spyOn(global, 'fetch').mockImplementation(async (url) => ({ ok: true, json: async () => ({ data: url.includes('asociacion/evento/') ? associations : { nombre: 'Cuarteto' } }) }));
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); jest.clearAllMocks(); });

test.each([
  ['PendienteDeAceptacion', ['Info', 'Aceptar Solicitud', 'Rechazar Solicitud']],
  ['ConObservacion', ['Info', 'Aceptar Solicitud', 'Rechazar Solicitud']],
  ['Aceptada', ['Info', 'Cancelar Solicitud']],
  ['Cancelada', ['Info']],
  ['Rechazada', ['Info']],
])('keeps existing actions for %s', async (state, names) => {
  setup([{ ...pending, estado: state }]);
  renderPage();
  await screen.findByRole('heading', { name: 'Papas Demo' });
  expect(within(screen.getByRole('article')).getAllByRole('button').map((button) => button.textContent.trim())).toEqual(names);
});

test.each([['Aceptar Solicitud', 'aceptar'], ['Rechazar Solicitud', 'rechazada']])('preserves confirmation and endpoint for %s', async (label, action) => {
  const fetchMock = setup([pending]);
  renderPage();
  fireEvent.click(await screen.findByRole('button', { name: label }));
  expect(fetchMock.mock.calls.filter(([, request]) => request?.method === 'POST')).toHaveLength(0);
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining(`asociacion/cambiarEstado/7/${action}`), { method: 'POST' }));
});

test('search and state filters combine and can be cleared', async () => {
  setup([pending, { id: 8, estado: 'Aceptada', repartidor: { nombre: 'Ana', apellido: 'Demo', telefono: '351999' } }]);
  renderPage();
  await screen.findByRole('heading', { name: 'Papas Demo' });
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'Ana' } });
  expect(screen.queryByRole('heading', { name: 'Papas Demo' })).not.toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Ana Demo' })).toBeInTheDocument();
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'PendienteDeAceptacion' } });
  fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
  expect(screen.getByRole('heading', { name: 'Papas Demo' })).toBeInTheDocument();
});

test('Info opens a readable, accessible detail without modifying the association', async () => {
  const fetchMock = setup([pending]);
  renderPage();
  fireEvent.click(await screen.findByRole('button', { name: 'Info' }));
  const dialog = screen.getByRole('dialog', { name: 'Papas Demo' });
  expect(within(dialog).getByText('351123')).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Cerrar' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(fetchMock.mock.calls.filter(([, request]) => request?.method === 'POST')).toHaveLength(0);
});
