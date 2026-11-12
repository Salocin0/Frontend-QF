import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import PanelProductor from '../components/PanelesDatos/PanelProductor/PanelProductor';
import TotalGenerado from '../components/PanelesDatos/PanelProductor/TotalGenerado';
import { UserContext } from '../components/ComponentesGenerales/UserContext';
jest.mock('../components/ComponentesGenerales/PageLayout', () => ({ children }) => <div>{children}</div>);
jest.mock('../components/ComponentesGenerales/Footer', () => () => null);
jest.mock('../components/PanelesDatos/GraficaBarras', () => ({ eventId }) => <div data-testid="producer-bar-chart">{eventId}</div>);
jest.mock('../components/PanelesDatos/GraficaTortaProductos', () => ({ productos }) => <div data-testid="producer-pie-chart">{productos.map((product) => product.nombre).join(',')}</div>);
jest.mock('../components/PanelesDatos/BotonDescargaPDF', () => ({ idEvento }) => <button data-event={idEvento}>Descargar PDF</button>);
const wrapper = ({ children }) => <UserContext.Provider value={{ user: { id: 99, consumidorId: 7, tipoUsuario: 'productor' } }}>{children}</UserContext.Provider>;
afterEach(() => { if (global.fetch.mockRestore) global.fetch.mockRestore(); });
const api = async (url) => ({ ok: true, json: async () => ({ status: 'success', data: url.includes('evento/all') ? [{ id: 9, nombre: 'Cuarteto', fechaHoraInicio: '2099-02-01' }, { id: 8, nombre: 'Feria', fechaHoraInicio: '2099-01-01' }] : url.includes('total-recaudado-por-puesto') ? [{ idpuesto: 1, nombre: 'Pizzas Demo', cantidadpedidos: 2, total: '3500' }] : url.includes('valoracion') ? '4.6' : '3500' }) });

test('starts on "Todos los eventos", lists events chronologically and keeps the PDF filter in sync', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockImplementation(api);
  render(<PanelProductor />, { wrapper });
  await screen.findByRole('option', { name: 'Feria' });
  expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(['Todos los eventos', 'Feria', 'Cuarteto']);
  expect(screen.getByLabelText('Evento')).toHaveValue('Todos');
  expect(screen.getByRole('button', { name: 'Descargar PDF' })).toHaveAttribute('data-event', 'Todos');
  await waitFor(() => expect(screen.getByText('4,6 / 5')).toBeInTheDocument());
  expect(fetchMock.mock.calls.filter(([url]) => url.includes('total-recaudado-por-puesto-en-evento/Todos'))).toHaveLength(1);
  expect(fetchMock.mock.calls.filter(([url]) => url.includes('total-recaudado-por-puesto-en-evento/8'))).toHaveLength(0);
  fireEvent.change(screen.getByLabelText('Evento'), { target: { value: '9' } });
  await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('total-recaudado-evento/9'), expect.any(Object)));
  expect(screen.getByTestId('producer-bar-chart')).toHaveTextContent('9');
  expect(screen.getByRole('button', { name: 'Descargar PDF' })).toHaveAttribute('data-event', '9');
});

test('zero revenue retains its label and is shown as zero', async () => {
  jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: 0 }) });
  render(<TotalGenerado eventId="Todos" />);
  expect(await screen.findByText(/\$\s*0/)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Total generado' })).toBeInTheDocument();
});

test('a delayed previous response does not overwrite the newly selected event statistic', async () => {
  let resolveOld;
  jest.spyOn(global, 'fetch').mockImplementationOnce(() => new Promise((done) => { resolveOld = done; })).mockResolvedValueOnce({ ok: true, json: async () => ({ data: 200 }) });
  const { rerender } = render(<TotalGenerado eventId="1" />);
  rerender(<TotalGenerado eventId="2" />);
  await screen.findByText(/200/);
  await act(async () => resolveOld({ ok: true, json: async () => ({ data: 999 }) }));
  expect(screen.queryByText(/999/)).not.toBeInTheDocument();
  expect(screen.getByText(/200/)).toBeInTheDocument();
});
