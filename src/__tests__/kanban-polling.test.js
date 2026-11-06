import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { toast } from 'react-toastify';
import KanbanBoard, { PEDIDOS_POLLING_MS } from '../components/ComponentesEPC/KanbanBoard';
import { UserContext } from '../components/ComponentesGenerales/UserContext';

jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));
jest.mock('../components/ComponentesEPC/PedidoDetalleDialog', () => () => null);

const pedido = (id, estado = 'Pendiente') => ({ id, estado, total: 1000, fecha: '2026-11-06T12:00:00Z', detalles: [] });
const respuesta = (pedidos) => Promise.resolve({ json: async () => ({ data: pedidos }) });

const renderBoard = () =>
  render(
    <UserContext.Provider value={{ user: { consumidorId: 2 } }}>
      <KanbanBoard id={1} />
    </UserContext.Provider>
  );

beforeEach(() => {
  jest.useFakeTimers();
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

const avanzarPolling = async () => {
  await act(async () => {
    jest.advanceTimersByTime(PEDIDOS_POLLING_MS);
  });
};

test('un pedido nuevo del consumidor aparece en el tablero sin recargar la página y se avisa', async () => {
  global.fetch.mockReturnValueOnce(respuesta([pedido(1)])).mockReturnValue(respuesta([pedido(1), pedido(2)]));
  renderBoard();
  expect(await screen.findByText('Pedido #1')).toBeInTheDocument();
  expect(screen.queryByText('Pedido #2')).not.toBeInTheDocument();

  await avanzarPolling();

  expect(await screen.findByText('Pedido #2')).toBeInTheDocument();
  expect(toast.info).toHaveBeenCalledWith('Nuevo pedido #2');
  expect(toast.info).toHaveBeenCalledTimes(1);
});

test('los cambios de estado hechos desde otro lado (p. ej. el repartidor entrega) se reflejan solos', async () => {
  global.fetch.mockReturnValueOnce(respuesta([pedido(5, 'EnCamino')])).mockReturnValue(respuesta([pedido(5, 'Entregado')]));
  renderBoard();
  const contador = (columna) => screen.getByRole('heading', { name: new RegExp(`^${columna}`) }).textContent;
  await waitFor(() => expect(contador('En Camino')).toBe('En Camino1'));
  expect(contador('Entregado')).toBe('Entregado0');

  await avanzarPolling();

  await waitFor(() => expect(contador('Entregado')).toBe('Entregado1'));
  expect(contador('En Camino')).toBe('En Camino0');
  expect(toast.info).not.toHaveBeenCalled();
});

test('no consulta mientras la pestaña está oculta', async () => {
  global.fetch.mockReturnValue(respuesta([pedido(1)]));
  renderBoard();
  await screen.findByText('Pedido #1');
  const llamadas = global.fetch.mock.calls.length;

  Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
  await avanzarPolling();
  expect(global.fetch.mock.calls.length).toBe(llamadas);

  Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
  await avanzarPolling();
  expect(global.fetch.mock.calls.length).toBe(llamadas + 1);
});
