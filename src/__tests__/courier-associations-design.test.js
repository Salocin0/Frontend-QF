import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { toast } from 'react-toastify';
import AsociacionesR from '../components/ComponenteRepartidor/VerAsociacionesR';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
jest.mock('react-router-dom', () => ({ Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a> }));
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
const event = { id: 3, nombre: 'Cuarteto', descripcion: 'Festival', ubicacion: 'Villa María' };
const renderPage = () => render(<UserContext.Provider value={{ user: { consumidorId: 7, tipoUsuario: 'repartidor' } }}><AsociacionesR /></UserContext.Provider>);
const setup = (state = 'PendienteDeAceptacion') => jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: { eventos: [event], asociaciones: [{ id: 19, eventoId: '3', estado: state }] } }) });
afterEach(() => { global.fetch.mockRestore(); jest.clearAllMocks(); });
test.each(['PendienteDeAceptacion', 'Aceptada', 'Cancelada', 'Rechazada', 'ConObservacion'])('keeps cancellation restricted to pending associations: %s', async (state) => {
  setup(state); renderPage();
  await screen.findByRole('heading', { name: 'Cuarteto' });
  expect(within(screen.getByRole('article')).queryAllByRole('button', { name: 'Cancelar asociación' })).toHaveLength(state === 'PendienteDeAceptacion' ? 1 : 0);
});
test('filters combine and can be cleared', async () => {
  setup(); renderPage();
  await screen.findByRole('heading', { name: 'Cuarteto' });
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'inexistente' } });
  expect(screen.getByText('No encontramos asociaciones con esos filtros')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
  expect(screen.getByRole('heading', { name: 'Cuarteto' })).toBeInTheDocument();
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'PendienteDeAceptacion' } });
  expect(screen.getByRole('article')).toBeInTheDocument();
});
test('cancel requires confirmation, retains the dialog after failure and refreshes after success', async () => {
  const fetchMock = setup(); renderPage();
  fireEvent.click(await screen.findByRole('button', { name: 'Cancelar asociación' }));
  expect(fetchMock.mock.calls.filter(([, request]) => request?.method === 'POST')).toHaveLength(0);
  fetchMock.mockResolvedValueOnce({ ok: false, json: async () => ({ message: 'No se puede cancelar' }) });
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar cancelación' }));
  await waitFor(() => expect(toast.error).toHaveBeenCalledWith('No se puede cancelar'));
  expect(screen.getByRole('dialog', { name: 'Cancelar asociación' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar cancelación' }));
  await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Asociación cancelada correctamente'));
  expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('asociacion/cambiarEstado/19/cancelar'), { method: 'POST' });
  await waitFor(() => expect(fetchMock.mock.calls.filter(([, request]) => request?.method === 'GET')).toHaveLength(2));
});
test('empty list links to the courier association screen', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: { eventos: [], asociaciones: [] } }) });
  renderPage();
  expect(await screen.findByRole('link', { name: 'Explorar eventos' })).toHaveAttribute('href', '/asociarRepartidorAEvento');
});
test('event without matching association does not crash or allow cancellation', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: { eventos: [event], asociaciones: null } }) });
  renderPage();
  expect(await screen.findByText('Sin asociación informada')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Cancelar asociación' })).not.toBeInTheDocument();
});
test('load error offers retry', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValueOnce({ ok: false }).mockResolvedValue({ ok: true, json: async () => ({ data: {} }) });
  renderPage();
  expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar tus asociaciones');
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
  expect(await screen.findByText('Todavía no tenés asociaciones')).toBeInTheDocument();
});
