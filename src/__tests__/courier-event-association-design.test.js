import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import AsociarRepartidorAEvento from '../components/ComponenteRepartidor/AsociarRepartidorAEvento';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate, Link: ({ children, to }) => <a href={to}>{children}</a> }));
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
const event = { id: 3, nombre: 'Cuarteto', descripcion: 'Festival de música', estado: 'EnPreparacion2', ubicacion: 'Villa María', fechaHoraInicio: '2026-11-01T12:00:00Z', fechaHoraFin: '2026-11-02T12:00:00Z' };
const setup = ({ restricted = false, pending = false } = {}) => jest.spyOn(global, 'fetch').mockImplementation(async (url) => {
  if (url.includes('evento/enEstado/')) return { ok: true, json: async () => ({ data: url.endsWith('EnPreparacion2') ? [event] : [] }) };
  if (url.includes('asociarRepartidor')) return { status: pending ? 400 : 200 };
  if (url.includes('restriccion/evento')) return { status: restricted ? 200 : 404, json: async () => ({ data: restricted ? [{ id: 1, titulo: 'Documento' }] : [] }) };
  return { ok: true, json: async () => ({ code: 200 }) };
});
const renderPage = () => render(<UserContext.Provider value={{ user: { consumidorId: 7, tipoUsuario: 'repartidor' } }}><AsociarRepartidorAEvento /></UserContext.Provider>);
afterEach(() => { global.fetch.mockRestore(); jest.clearAllMocks(); });
test('groups draft states in filters and clears searches without losing events', async () => {
  setup(); renderPage();
  await screen.findByRole('heading', { name: 'Cuarteto' });
  expect(screen.getByRole('option', { name: 'En preparación' })).toHaveValue('EnPreparacion');
  fireEvent.change(screen.getByRole('combobox'), { target: { value: 'EnPreparacion' } });
  expect(screen.getByRole('heading', { name: 'Cuarteto' })).toBeInTheDocument();
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'otro evento' } });
  expect(screen.getByText('No encontramos eventos con esos filtros')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }));
  expect(screen.getByRole('heading', { name: 'Cuarteto' })).toBeInTheDocument();
});
test('confirms before navigating to required documents', async () => {
  const fetchMock = setup({ restricted: true }); renderPage();
  fireEvent.click(await screen.findByRole('button', { name: 'Asociarme a evento' }));
  expect(screen.getByRole('dialog', { name: 'Confirmar asociación' })).toBeInTheDocument();
  expect(fetchMock.mock.calls.some(([, options]) => options?.method === 'POST')).toBe(false);
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/restriccionesEvento/3'));
});
test('confirms before sending a simple association without requirements', async () => {
  const fetchMock = setup(); renderPage();
  fireEvent.click(await screen.findByRole('button', { name: 'Asociarme a evento' }));
  expect(fetchMock.mock.calls.some(([, options]) => options?.method === 'POST')).toBe(false);
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }));
  await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Asociación guardada'));
  expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('asociacion/evento/3/asociarSimple/0/7'), expect.objectContaining({ method: 'POST' }));
});
test('existing association disables another request', async () => {
  setup({ pending: true }); renderPage();
  expect(await screen.findByText('Ya tenés una asociación pendiente para este evento.')).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Asociarme a evento' })).not.toBeInTheDocument();
});
test('failed event loading offers retry rather than an empty list', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: false }); renderPage();
  expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar los eventos');
  expect(screen.getByRole('button', { name: 'Reintentar' })).toBeInTheDocument();
});

test.each([[true, 'Con restricciones'], [false, 'Sin restricciones']])('shows requirement status at the top of each event: %s', async (restricted, label) => {
  setup({ restricted }); renderPage();
  expect(await screen.findByText(label)).toBeInTheDocument();
});
test('does not claim there are no restrictions when the request fails', async () => {
  const fetchMock = setup();
  const implementation = fetchMock.getMockImplementation();
  fetchMock.mockImplementation((url, options) => url.includes('restriccion/evento') ? Promise.resolve({ status: 500 }) : implementation(url, options));
  renderPage();
  expect(await screen.findByText('Restricciones sin confirmar')).toBeInTheDocument();
  expect(screen.queryByText('Sin restricciones')).not.toBeInTheDocument();
});
