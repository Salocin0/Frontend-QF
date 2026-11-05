// Kanban column -> label understood by POST pedido/cambiarEstado/:id/:accion.
export const ESTADO_POR_COLUMNA = {
  'column-1': 'Pendiente',
  'column-2': 'Aceptado',
  'column-3': 'En Preparación',
  'column-4': 'En Camino',
  'column-5': 'Entregado',
  'column-6': 'Cancelado',
};

// Mirrors the backend state machine: an order only moves one step forward, can be cancelled before preparation,
// and "Entregado" is reached only by the courier confirming the delivery code.
export const MOVIMIENTOS_PERMITIDOS = {
  Pendiente: ['column-1', 'column-2', 'column-6'],
  Aceptado: ['column-2', 'column-3', 'column-6'],
  EnPreparacion: ['column-3', 'column-4'],
  EnCamino: ['column-4'],
  Entregado: ['column-5'],
  Cancelado: ['column-6'],
};

/**
 * Changes the state of an order and reports the real outcome. Never throws.
 * Resolves { ok: true } only when the backend accepted the change.
 */
export const cambiarEstadoPedido = async (backUrl, pedidoId, nuevoEstado, fetchImpl = fetch) => {
  try {
    const response = await fetchImpl(`${backUrl}pedido/cambiarEstado/${pedidoId}/${encodeURIComponent(nuevoEstado)}`, { method: 'POST' });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) return { ok: false, message: body?.message || 'No se pudo cambiar el estado del pedido.' };
    return { ok: true, estado: body?.data?.estado };
  } catch (error) {
    return { ok: false, message: 'No pudimos conectar con el servidor. Intentá de nuevo.' };
  }
};
