import React, { useEffect, useState } from 'react';
import useDynamicColors from '../../../UseDinamicColors';
import { CircularProgress } from '@mui/material';

const EstadisticasTable = ({ id }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Colors = useDynamicColors();

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
      <CircularProgress style={{ color: Colors.Naranja }} />
    </div>
  );
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2 style={{ color: Colors.Naranja }}>Recaudado por Puesto</h2>
      <table
        style={{
          width: '100%',
          textAlign: 'left',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          color: Colors.BlancoEnBlanco
        }}
      >
        <thead>
          <tr>
            <th style={{ textAlign: 'center', borderBottom: `1px solid ${Colors.Naranja}` }}>Nombre</th>
            <th
              style={{
                textAlign: 'center',
                borderBottom: `1px solid ${Colors.Naranja}`,
                width: '80px',
              }}
            >
              Pedidos
            </th>
            <th style={{ textAlign: 'center', borderBottom: `1px solid ${Colors.Naranja}`,width: '120px'}}>Total</th>
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
                }}
                title={row.nombre}
              >
                {row.nombre}
              </td>
              <td
                style={{
                  textAlign: 'center',
                  width: '80px',
                }}
              >
                {row.cantidadpedidos}
              </td>
              <td style={{ textAlign: 'center',width: '120px' }}>
                {parseFloat(row.total).toLocaleString('es-ES', { style: 'currency', currency: 'ARS' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EstadisticasTable;
