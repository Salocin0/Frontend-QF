import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import useDynamicColors from "../../UseDinamicColors";

const ICON = "ICON";

const GraficaTorta = ({ id }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decalEnabled, setDecalEnabled] = useState(false); // Estado para activar/desactivar decal
  const Colors = useDynamicColors();

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
    if (id) fetchEstadisticas();
  }, [id]);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;

  const formattedData = data.map((item) => ({
    value: parseFloat(item.total),
    name: item.nombre,
  }));

  // Patrones para los decals
  const patterns = [
    { symbol: "circle" },
    { symbol: "rect" },
    { symbol: "triangle" },
    { symbol: "diamond" },
    { symbol: "line" },
  ];

  const option = {
    height: "90%",
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    backgroundColor: Colors.GrisAzuladoClaro,
    title: {
      text: "Porcentaje de Recaudación por Puesto",
      subtext: "Porcentaje de lo recaudado en el evento por cada puesto",
      top: "3%",
      left: "center",
    },
    legend: {
      show: false,
    },
    series: [
      {
        top: "15%",
        name: "Total Recaudado",
        type: "pie",
        radius: ["30%", "60%"], // Ajusta el tamaño del gráfico (más pequeño o más grande)
        center: ["50%", "50%"], // Ajusta la posición del gráfico dentro del contenedor
        data: formattedData.map((item, index) => ({
          ...item,
          itemStyle: {
            decal: decalEnabled ? { symbol: patterns[index % patterns.length].symbol } : null, // Aplica un patrón distinto por sección
          },
        })),
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
        height: "30vh", // Ajusta el tamaño del contenedor
        position: "relative",
      }}
    >
      <button
                  onClick={() => setDecalEnabled((prev) => !prev)}
                  style={{
                    backgroundColor: Colors.GrisAzuladoOscuro,
                    padding: "3px 10px",
                    borderRadius:"10px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: Colors.BlancoEnBlanco,
                    position: "absolute",
                    top: "20px",
                    right: "5px",
                    zIndex:"900"
                  }}
                >
                  <span>{ICON}</span>
                </button>
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
