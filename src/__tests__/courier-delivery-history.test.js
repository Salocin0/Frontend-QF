import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HistorialEntregasEvento, { deliveredForEvent } from '../components/ComponenteRepartidor/HistorialEntregasEvento';
const orders = [{ id: 1, eventoId: 3, estado: 'Entregado', total: '1500', fechaEntrega: '2026-11-01T12:00:00Z', puesto: { nombreCarro: 'Papas Demo' }, detalles: [{ cantidad: 2, producto: { nombre: 'Papas' } }] }, { id: 2, eventoId: '3', estado: 'Valorado', total: 1000 }, { id: 3, eventoId: 4, estado: 'Entregado' }, { id: 4, eventoId: 3, estado: 'EnCamino' }];
afterEach(() => global.fetch.mockRestore?.());
test('matches event ids and includes valued deliveries while excluding other events and ongoing orders', () => {
  expect(deliveredForEvent(orders, '3').map((order) => order.id)).toEqual([1, 2]);
});
test('loads current courier history and shows products without inventing missing delivery dates', async () => {
  const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValue({ ok: true, json: async () => ({ data: orders }) });
  render(<HistorialEntregasEvento evento={{ id: 3, nombre: 'Cuarteto' }} consumidorId={7} onClose={jest.fn()} />);
  expect(await screen.findByRole('article', { name: 'Pedido #1' })).toHaveTextContent('2 × Papas');
  expect(screen.getAllByRole('article')).toHaveLength(2);
  expect(screen.getByText('Sin fecha de entrega registrada')).toBeInTheDocument();
  expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('pedido/repartidor?historial=true'), expect.objectContaining({ headers: { ConsumidorId: 7 } }));
});
test('failed history can retry and then display an empty result', async () => {
  let attempts = 0;
  jest.spyOn(global, 'fetch').mockImplementation(async (url) => {
    if (url.includes('pedido/repartidor') && attempts++ === 0) return { ok: false };
    return { ok: true, json: async () => ({ data: [] }) };
  });
  render(<HistorialEntregasEvento evento={{ id: 3, nombre: 'Cuarteto' }} consumidorId={7} onClose={jest.fn()} />);
  expect(await screen.findByRole('alert')).toHaveTextContent('No pudimos cargar tus entregas');
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
  expect(await screen.findByText('No hay pedidos entregados por vos registrados en este evento.')).toBeInTheDocument();
});

test('shows courier ratings by order and averages only deliveries from this event', async () => {
  jest.spyOn(global, 'fetch').mockImplementation(async (url) => ({ ok: true, json: async () => ({ data: url.includes('valoracion/user') ? [{ pedidoId: 1, puntuacion: 4, opinion: 'Muy puntual' }, { pedidoId: 2, puntuacion: 5 }, { pedidoId: 3, puntuacion: 1 }] : orders }) }));
  render(<HistorialEntregasEvento evento={{ id: 3, nombre: 'Cuarteto' }} consumidorId={7} onClose={jest.fn()} />);
  expect(await screen.findByText('Muy puntual')).toBeInTheDocument();
  expect(screen.getByRole('region', { name: 'Mi valoración en este evento' })).toHaveTextContent('4,5 / 5');
  expect(screen.getByRole('region', { name: 'Mi valoración en este evento' })).toHaveTextContent('2 calificaciones recibidas');
});
test('rating failure does not hide delivered orders', async () => {
  jest.spyOn(global, 'fetch').mockImplementation(async (url) => url.includes('valoracion/user') ? { ok: false } : { ok: true, json: async () => ({ data: orders }) });
  render(<HistorialEntregasEvento evento={{ id: 3, nombre: 'Cuarteto' }} consumidorId={7} onClose={jest.fn()} />);
  expect(await screen.findByRole('article', { name: 'Pedido #1' })).toBeInTheDocument();
  expect(await screen.findByText('No pudimos cargar tus valoraciones.')).toBeInTheDocument();
});

test('ratings and comments are always visible inside each delivered order without another detail button', async () => {
  jest.spyOn(global, 'fetch').mockImplementation(async (url) => ({ ok: true, json: async () => ({ data: url.includes('valoracion/user') ? [{ id: 10, pedidoId: 1, puntuacion: 5, opinion: 'Muy buena entrega' }, { id: 11, pedidoId: 2, puntuacion: 3 }, { id: 12, pedidoId: 3, puntuacion: 1, opinion: 'Otro evento' }] : orders }) }));
  render(<HistorialEntregasEvento evento={{ id: 3, nombre: 'Cuarteto' }} consumidorId={7} onClose={jest.fn()} />);
  expect(await screen.findByRole('region', { name: 'Tu valoración en el pedido #1' })).toHaveTextContent('5 / 5');
  expect(screen.getByRole('article', { name: 'Pedido #1' })).toHaveTextContent('Muy buena entrega');
  expect(screen.getByRole('article', { name: 'Pedido #1' })).toHaveTextContent('2 × Papas');
  expect(screen.getByRole('article', { name: 'Pedido #2' })).toHaveTextContent('Sin comentario.');
  expect(screen.queryByText('Otro evento')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Ver valoraciones|Ver detalles/i })).not.toBeInTheDocument();
});
