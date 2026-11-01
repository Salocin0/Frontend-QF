import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
import { toast } from 'react-toastify';
jest.mock('react-router-dom', () => ({ useNavigate: () => jest.fn(), useParams: () => ({ eventoId: '19', diferenciaDiasEvento: '2' }) }));
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('leaflet/dist/images/marker-icon-2x.png', () => 'mock-icon-2x', { virtual: true });
jest.mock('leaflet/dist/images/marker-icon.png', () => 'mock-icon', { virtual: true });
jest.mock('leaflet/dist/images/marker-shadow.png', () => 'mock-shadow', { virtual: true });
jest.mock('leaflet/dist/leaflet.css', () => ({}), { virtual: true });
jest.mock('leaflet', () => ({ Icon: { Default: { prototype: {}, mergeOptions: jest.fn() } } }));
jest.mock('react-leaflet', () => ({ MapContainer: ({ children }) => <div data-testid="point-map">{children}</div>, TileLayer: () => null, Marker: () => null, useMap: () => ({ setView: jest.fn(), getZoom: () => 14 }), useMapEvents: () => null }));
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
const RegistrarEvento5 = require('../components/ComponentesEventos/RegistrarEvento5').default;
const point = { id: 5, nombre: 'Entrada principal', latitud: -31.4, longitud: -64.1 };
const renderPage = () => render(<UserContext.Provider value={{ user: { consumidorId: 7 } }}><RegistrarEvento5 /></UserContext.Provider>);
const setup = (points = []) => jest.spyOn(global, 'fetch').mockImplementation(async (url, request) => ({ ok: true, status: 200, json: async () => ({ status: 'success', data: String(url).includes('evento/19') ? { latitud: -31.4, longitud: -64.1 } : request?.method === 'GET' ? points : {} }) }));
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); jest.clearAllMocks(); localStorage.clear(); });

test('shows step four and preserves the requirement for at least one point', async () => {
  setup();
  renderPage();
  await screen.findByText('Todavía no agregaste puntos de encuentro');
  expect(screen.getByLabelText('Progreso del registro').querySelector('[aria-current="step"]')).toHaveTextContent('Puntos de encuentro');
  fireEvent.click(screen.getByRole('button', { name: 'Finalizar Registro' }));
  expect(toast.error).toHaveBeenCalledWith('Debes crear al menos un punto de encuentro para finalizar');
});

test('create dialog retains the map, validation and existing save endpoint', async () => {
  const fetchMock = setup();
  renderPage();
  await screen.findByText('Todavía no agregaste puntos de encuentro');
  fireEvent.click(screen.getByRole('button', { name: 'Crear Punto de Encuentro' }));
  const dialog = screen.getByRole('dialog', { name: 'Crear Punto de Encuentro' });
  expect(within(dialog).getByTestId('point-map')).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole('button', { name: 'Guardar' }));
  expect(toast.error).toHaveBeenCalledWith('Nombre, latitud y longitud son obligatorios');
  fireEvent.change(within(dialog).getByLabelText('Nombre'), { target: { value: 'Entrada principal' } });
  fireEvent.change(within(dialog).getByLabelText('Latitud'), { target: { value: '-31.4' } });
  fireEvent.change(within(dialog).getByLabelText('Longitud'), { target: { value: '-64.1' } });
  fireEvent.click(within(dialog).getByRole('button', { name: 'Guardar' }));
  await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Punto de encuentro creado'));
  const request = fetchMock.mock.calls.find(([, options]) => options?.method === 'POST');
  expect(request[0]).toContain('puntosEncuentro/');
  expect(JSON.parse(request[1].body)).toEqual({ nombre: 'Entrada principal', latitud: '-31.4', longitud: '-64.1', eventoId: '19' });
});

test('existing numeric coordinates remain editable and save through PUT', async () => {
  const fetchMock = setup([point]);
  renderPage();
  fireEvent.click(await screen.findByRole('button', { name: 'Editar' }));
  const dialog = screen.getByRole('dialog', { name: 'Editar Punto de Encuentro' });
  expect(within(dialog).getByLabelText('Latitud')).toHaveValue('-31.4');
  fireEvent.click(within(dialog).getByRole('button', { name: 'Guardar' }));
  await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Punto de encuentro actualizado'));
  expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('puntosEncuentro/5'), expect.objectContaining({ method: 'PUT' }));
});
