import { ESTADO_POR_COLUMNA, MOVIMIENTOS_PERMITIDOS, cambiarEstadoPedido } from '../components/ComponentesEPC/pedidoEstado';

const reply = (ok, body) => jest.fn().mockResolvedValue({ ok, json: async () => body });

describe('cambiarEstadoPedido', () => {
  test('posts the encoded label and reports success with the new state', async () => {
    const fetchMock = reply(true, { message: 'Estado del pedido actualizado.', data: { estado: 'EnPreparacion' } });
    const result = await cambiarEstadoPedido('http://api/', 152, 'En Preparación', fetchMock);
    expect(fetchMock).toHaveBeenCalledWith('http://api/pedido/cambiarEstado/152/En%20Preparaci%C3%B3n', { method: 'POST' });
    expect(result).toEqual({ ok: true, estado: 'EnPreparacion' });
  });

  test.each([[400, 'No se encontró la acción para el estado actual.'], [404, 'El pedido no existe.'], [409, 'Error el pedido no se puede preperar']])(
    'a %s response is a failure carrying the backend message',
    async (_status, message) => {
      const result = await cambiarEstadoPedido('http://api/', 1, 'Aceptado', reply(false, { message }));
      expect(result).toEqual({ ok: false, message });
    },
  );

  test('a failure without a body still gives a readable message', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: false, json: async () => { throw new Error('not json'); } });
    const result = await cambiarEstadoPedido('http://api/', 1, 'Aceptado', fetchMock);
    expect(result).toEqual({ ok: false, message: 'No se pudo cambiar el estado del pedido.' });
  });

  test('a network error never throws and is reported as a failure', async () => {
    const result = await cambiarEstadoPedido('http://api/', 1, 'Aceptado', jest.fn().mockRejectedValue(new Error('offline')));
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/conectar/);
  });
});

describe('Kanban allowed moves', () => {
  const targets = (estado) => MOVIMIENTOS_PERMITIDOS[estado].filter((column) => ESTADO_POR_COLUMNA[column] !== undefined);

  test('every column maps to a label the backend understands', () => {
    expect(Object.values(ESTADO_POR_COLUMNA)).toEqual(['Pendiente', 'Aceptado', 'En Preparación', 'En Camino', 'Entregado', 'Cancelado']);
  });

  test('orders move only one step forward and keep their own column as a no-op', () => {
    expect(targets('Pendiente')).toEqual(['column-1', 'column-2', 'column-6']);
    expect(targets('Aceptado')).toEqual(['column-2', 'column-3', 'column-6']);
    expect(targets('EnPreparacion')).toEqual(['column-3', 'column-4']);
  });

  test('no skipping states: Pendiente cannot jump to preparation, on its way or delivered', () => {
    for (const column of ['column-3', 'column-4', 'column-5']) expect(MOVIMIENTOS_PERMITIDOS.Pendiente).not.toContain(column);
    for (const column of ['column-4', 'column-5']) expect(MOVIMIENTOS_PERMITIDOS.Aceptado).not.toContain(column);
  });

  test('cancelling is only possible before preparation', () => {
    expect(MOVIMIENTOS_PERMITIDOS.Pendiente).toContain('column-6');
    expect(MOVIMIENTOS_PERMITIDOS.Aceptado).toContain('column-6');
    for (const estado of ['EnPreparacion', 'EnCamino', 'Entregado']) expect(MOVIMIENTOS_PERMITIDOS[estado]).not.toContain('column-6');
  });

  test('delivery belongs to the courier: nobody can drag an order into Entregado, and final states are frozen', () => {
    for (const estado of ['Pendiente', 'Aceptado', 'EnPreparacion', 'EnCamino']) expect(MOVIMIENTOS_PERMITIDOS[estado]).not.toContain('column-5');
    expect(MOVIMIENTOS_PERMITIDOS.Entregado).toEqual(['column-5']);
    expect(MOVIMIENTOS_PERMITIDOS.Cancelado).toEqual(['column-6']);
  });
});
