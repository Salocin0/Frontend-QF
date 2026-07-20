import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

const EstadisticasTable = ({ id }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstadisticas = async () => {
      try {
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}estadisticas/total-recaudado-por-puesto-en-evento/${id}`
        );
        const result = await response.json();
        if (result.status === 'success') {
          console.log(result.data);
          setData(result.data);
        } else {
          throw new Error(result.msg || 'Error fetching data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if(id) fetchEstadisticas();
  }, [id]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
      <CircularProgress style={{ color: "var(--qf-naranja)" }} />
    </div>
  );
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 style={{ color: "var(--qf-naranja)" }}>Recaudado por Puesto</h2>
      <table
        style={{
          width: '100%',
          textAlign: 'left',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          color: "var(--qf-blanco-puro)",
          border: `1px solid var(--qf-naranja)`,
        }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: 'center', border: `1px solid var(--qf-naranja)`, padding: '8px', color: "var(--qf-naranja)" }}>Nombre</th>
            <th
              style={{
                textAlign: 'center',
                border: `1px solid var(--qf-naranja)`,
                width: '80px',
                padding: '8px',
                color: "var(--qf-naranja)",
              }}
            >
              Pedidos
            </th>
            <th style={{ textAlign: 'center', border: `1px solid var(--qf-naranja)`,width: '120px', padding: '8px', color: "var(--qf-naranja)" }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.idpuesto}>
              <td
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '200px',
                  border: `1px solid var(--qf-naranja)`,
                  padding: '8px',
                }}
                title={row.nombre}
              >
                {row.nombre}
              </td>
              <td
                style={{
                  textAlign: 'center',
                  width: '80px',
                  border: `1px solid var(--qf-naranja)`,
                  padding: '8px',
                }}
              >
                {row.cantidadpedidos}
              </td>
              <td style={{ textAlign: 'center', width: '120px', border: `1px solid var(--qf-naranja)`, padding: '8px' }}>
                {`$${Math.round(parseFloat(row.total) || 0).toLocaleString('es-AR')}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EstadisticasTable;
