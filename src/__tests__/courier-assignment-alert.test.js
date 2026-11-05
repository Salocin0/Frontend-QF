import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { toast } from 'react-toastify';
import AsignacionRepartidorAlert from '../components/ComponentesGenerales/AsignacionRepartidorAlert';
import { UserContext } from '../components/ComponentesGenerales/UserContext';

jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));

const offer = (overrides = {}) => ({
  id: 102,
  estado: 'Pendiente',
  createdAt: new Date().toISOString(),
  Pedido: { id: 152, total: 14950, puesto: { nombreCarro: 'Puesto Cuarteto' }, consumidore: { nombre: 'Consumidor', apellido: 'Demo' } },
  ...overrides,
});
const renderAlert = (user = { consumidorId: 3, tipoUsuario: 'repartidor' }) =>
  render(<UserContext.Provider value={{ user }}><AsignacionRepartidorAlert /></UserContext.Provider>);
const jsonResponse = (body, ok = true) => ({ ok, json: async () => body });

beforeEach(() => { process.env.REACT_APP_BACK_URL = 'http://api/'; });
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); jest.clearAllMocks(); });

test('shows the pending offer to a courier, polling with the courier header', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(jsonResponse({ data: offer() }));
  renderAlert();
  const dialog = await screen.findByRole('dialog');
  expect(dialog).toHaveTextContent('Pedido #152');
  expect(dialog).toHaveTextContent('Puesto Cuarteto');
  expect(dialog).toHaveTextContent('Consumidor Demo');
  expect(dialog).toHaveTextContent('5:00');
  expect(fetchMock.mock.calls[0][0]).toBe('http://api/asignaciones');
  expect(fetchMock.mock.calls[0][1].headers.ConsumidorId).toBe(3);
});

test('does not poll or render anything for non-couriers', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue(jsonResponse({ data: offer() }));
  renderAlert({ consumidorId: 4, tipoUsuario: 'consumidor' });
  await act(async () => {});
  expect(fetchMock).not.toHaveBeenCalled();
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('shows nothing when there is no pending offer', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue(jsonResponse({ status: 'Error', data: {} }));
  renderAlert();
  await act(async () => {});
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test.each([['Aceptar pedido', 'aceptar'], ['Rechazar', 'rechazar']])('%s sends a POST and closes the popup', async (label, action) => {
  const fetchMock = jest.spyOn(global, 'fetch')
    .mockResolvedValueOnce(jsonResponse({ data: offer() }))
    .mockResolvedValue(jsonResponse({ status: 'success' }));
  renderAlert();
  fireEvent.click(await screen.findByRole('button', { name: label }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  const call = fetchMock.mock.calls.find(([url]) => url.endsWith(`/${action}`));
  expect(call[0]).toBe(`http://api/asignaciones/102/${action}`);
  expect(call[1]).toMatchObject({ method: 'POST', headers: { ConsumidorId: 3 } });
  expect(toast.success).toHaveBeenCalled();
});

test('a rejected response shows the backend message and still closes the popup', async () => {
  jest.spyOn(global, 'fetch')
    .mockResolvedValueOnce(jsonResponse({ data: offer() }))
    .mockResolvedValue(jsonResponse({ msg: 'La asignación ya no está disponible (Caducado)' }, false));
  renderAlert();
  fireEvent.click(await screen.findByRole('button', { name: 'Aceptar pedido' }));
  await waitFor(() => expect(toast.error).toHaveBeenCalledWith('La asignación ya no está disponible (Caducado)'));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

test('an expired offer is not shown', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue(jsonResponse({ data: offer({ createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() }) }));
  renderAlert();
  await act(async () => {});
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});
