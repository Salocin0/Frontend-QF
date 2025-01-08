import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";

const GraficaTorta = ({ id }) => {
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
        if (result.status === "success") {
          setData(result.data);
        } else {
          throw new Error(result.msg || "Error fetching data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if(id) fetchEstadisticas();
  }, [id]);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;

  const formattedData = data.map((item) => ({
    value: parseFloat(item.total),
    name: item.nombre,
  }));

  const option = {
    height: "90%",
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "Total Recaudado",
        type: "pie",
        radius: ["30%", "60%"], // Ajusta el tamaño del gráfico (más pequeño o más grande)
        center: ["50%", "50%"], // Ajusta la posición del gráfico dentro del contenedor
        data: formattedData,

        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  return (
    <div
      style={{
        borderRadius: "20px",
        overflow: "hidden", // Recorta las esquinas del contenido
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // (Opcional) Añade un poco de sombra para resaltar
        height: "28vh", // Ajusta el tamaño del contenedor
        border: "1px solid white",
      }}
    >
      <ReactECharts
        option={option}
        theme="dark"
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

export default GraficaTorta;
