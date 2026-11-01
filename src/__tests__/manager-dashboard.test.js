import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PanelEncargado from '../components/PanelesDatos/PanelEncargado/PanelEncargado';
import TotalRecaudado from '../components/PanelesDatos/PanelEncargado/TotalRecaudado';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('../components/PanelesDatos/GraficaLineas', () => ({ puestoId, eventId }) => <div data-testid="revenue-chart">{puestoId}:{eventId}</div>);
jest.mock('../components/PanelesDatos/GraficaTortaProductos', () => () => <div>Gráfico de productos</div>);
jest.mock('../components/PanelesDatos/BotonDescargaPDF', () => () => <button>Descargar PDF</button>);
const wrapper = ({ children }) => <UserContext.Provider value={{ user: { consumidorId: 7 } }}>{children}</UserContext.Provider>;
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); });
const api = async (url) => ({ ok: true, json: async () => ({ data: url.includes('eventos-con-pedidos') ? [{ id: 9, nombre: 'Cuarteto' }] : url.includes('puestos-con-pedidos') ? [{ id: 4, nombreCarro: 'Papas' }] : url.includes('top-productos') ? [{ nombre: 'Pizza', pedidos: 2, dinero: 3000 }] : url.includes('valoracion') ? 4.5 : url.includes('tiempo') ? 12.3 : 3000 }) });

test('dashboard keeps labels, PDF export and passes filters to every statistic and revenue chart', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(api);
  render(<PanelEncargado />, { wrapper });
  await screen.findByRole('option', { name: 'Cuarteto' });
  await screen.findByRole('option', { name: 'Papas' });
  expect(screen.getByRole('heading', { name: 'Total recaudado' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Valoración promedio' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Tiempo de entrega' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Descargar PDF' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Evento'), { target: { value: '9' } });
  fireEvent.change(screen.getByLabelText('Puesto'), { target: { value: '4' } });
  await screen.findByText('Pizza');
  await waitFor(() => expect(screen.getByTestId('revenue-chart')).toHaveTextContent('4:9'));
  const requests = fetchMock.mock.calls.filter(([, request]) => request?.body && JSON.parse(request.body).idPuesto === 4 && JSON.parse(request.body).idEvento === 9);
  expect(new Set(requests.map(([url]) => url.split('/').slice(-2, -1)[0])).size).toBe(4);
});

test('zero revenue is displayed as zero rather than a failed statistic', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: 0 }) });
  render(<TotalRecaudado />, { wrapper });
  expect(await screen.findByText(/\$\s*0/)).toBeInTheDocument();
  expect(screen.queryByText('Sin datos')).not.toBeInTheDocument();
});

test('failed statistic retains its label and distinguishes an error from missing data', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: false });
  render(<TotalRecaudado />, { wrapper });
  expect(await screen.findByText('No disponible')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Total recaudado' })).toBeInTheDocument();
});
