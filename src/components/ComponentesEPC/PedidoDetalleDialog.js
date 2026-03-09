import React from 'react';
import useDynamicColors from "../../UseDinamicColors";

const formatStatus = (s) => {
  if (!s) return '';
  return s.replace(/([a-z])([A-Z])/g, '$1 $2');
};

const PedidoDetalleDialog = ({ infoDialog, detailData, onClose }) => {
  const Colors = useDynamicColors();

  if (!infoDialog.open) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1099,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          background: Colors.GrisAzuladoOscuro,
          color: Colors.Blanco,
          padding: '20px',
          zIndex: 1100,
          borderRadius: '8px',
          width: '80%',
          maxWidth: '600px',
          overflowY: 'auto',
          maxHeight: '80vh',
        }}
      >
        <h3 style={{ marginTop: 0 }}>Pedido #{infoDialog.task.id.replace('task-', '')}</h3>

        {/* datos basicos card */}
        <div
          style={{
            border: `1px solid ${Colors.Naranja}`,
            borderRadius: '6px',
            padding: '10px',
            marginBottom: '1rem',
          }}
        >
          <h4 style={{ color: Colors.Naranja }}>Resumen</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td><strong>Fecha:</strong></td>
                <td>{new Date(infoDialog.task.fecha).toLocaleString('es-ES')}</td>
              </tr>
              <tr>
                <td><strong>Total:</strong></td>
                <td>${Number(infoDialog.task.total).toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Estado:</strong></td>
                <td>{formatStatus(infoDialog.task.estado)}</td>
              </tr>
              {detailData?.codigoEntrega && (
                <tr>
                  <td><strong>Código entrega:</strong></td>
                  <td>{detailData.codigoEntrega}</td>
                </tr>
              )}
              {detailData?.fechaPreCompra && (
                <tr>
                  <td><strong>Fecha precompra:</strong></td>
                  <td>{new Date(detailData.fechaPreCompra).toLocaleString('es-ES')}</td>
                </tr>
              )}
              {detailData?.fechaEntrega && (
                <tr>
                  <td><strong>Fecha entrega:</strong></td>
                  <td>{new Date(detailData.fechaEntrega).toLocaleString('es-ES')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* consumidor card */}
        {detailData?.Consumidor && (
          <div
            style={{
              border: `1px solid ${Colors.Naranja}`,
              borderRadius: '6px',
              padding: '10px',
              marginBottom: '1rem',
            }}
          >
            <h4 style={{ color: Colors.Naranja }}>Consumidor</h4>
            <p>
              {detailData.Consumidor.nombre} {detailData.Consumidor.apellido}
            </p>
            {detailData.Consumidor.telefono && (
              <p>Tel: {detailData.Consumidor.telefono}</p>
            )}
            {detailData.Consumidor.usuario?.email && (
              <p>Email: {detailData.Consumidor.usuario.email}</p>
            )}
          </div>
        )}
        {/* repartidor card */}
        {detailData?.repartidor && (
          <div
            style={{
              border: `1px solid ${Colors.Naranja}`,
              borderRadius: '6px',
              padding: '10px',
              marginBottom: '1rem',
            }}
          >
            <h4 style={{ color: Colors.Naranja }}>Repartidor</h4>
            <p>
              {detailData.repartidor?.Consumidor?.nombre || ''}{' '}
              {detailData.repartidor?.Consumidor?.apellido || ''}
            </p>
            {detailData.repartidor?.Consumidor?.telefono && (
              <p>Tel: {detailData.repartidor.Consumidor.telefono}</p>
            )}
            {detailData.repartidor?.Consumidor?.usuario?.email && (
              <p>Email: {detailData.repartidor.Consumidor.usuario.email}</p>
            )}
          </div>
        )}

        {/* productor card */}
        {detailData?.Evento?.Productor && (
          <div
            style={{
              border: `1px solid ${Colors.Naranja}`,
              borderRadius: '6px',
              padding: '10px',
              marginBottom: '1rem',
            }}
          >
            <h4 style={{ color: Colors.Naranja }}>Productor</h4>
            <p>{detailData.Evento.Productor.nombre || ''}</p>
            {detailData.Evento.Productor?.telefono && (
              <p>Tel: {detailData.Evento.Productor.telefono}</p>
            )}
            {detailData.Evento.Productor?.email && (
              <p>Email: {detailData.Evento.Productor.email}</p>
            )}
          </div>
        )}
        {/* productos card */}
        {detailData && (
          <div
            style={{
              border: `1px solid ${Colors.Naranja}`,
              borderRadius: '6px',
              padding: '10px',
              marginBottom: '1rem',
            }}
          >
            <h4 style={{ color: Colors.Naranja }}>Productos</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Cantidad</th>
                  <th style={{ textAlign: 'left' }}>Nombre</th>
                  <th style={{ textAlign: 'left' }}>Precio unit.</th>
                </tr>
              </thead>
              <tbody>
                {(detailData.detalles || []).map((d) => (
                  <tr key={d.id}>
                    <td>{d.cantidad}</td>
                    <td>{d.producto?.nombre || d.productoId}</td>
                    <td>${Number(d.precio).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={onClose}
          style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: Colors.Naranja, border: 'none', cursor: 'pointer', color: Colors.Negro }}
        >
          Cerrar
        </button>
      </div>
    </>
  );
};

export default PedidoDetalleDialog;
