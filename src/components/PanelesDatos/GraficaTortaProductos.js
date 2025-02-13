import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import useDynamicColors from "../../UseDinamicColors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const GraficaTortaProductos = ({ height, productos }) => {
  const [chartData, setChartData] = useState([]);
  const [decalEnabled, setDecalEnabled] = useState(false); // Estado para activar/desactivar decal
  const Colors = useDynamicColors();

  useEffect(() => {
    if (productos.length > 0) {
      const totalRecaudado = productos.reduce((sum, producto) => sum + producto.dinero, 0);
      const dataFormatted = productos.map((producto) => ({
        name: producto.nombre,
        value: ((producto.dinero / totalRecaudado) * 100).toFixed(2),
      }));
      setChartData(dataFormatted);
    }
  }, [productos]);

  // Patrones para los decals
  const patterns = [
    { symbol: "circle" },
    { symbol: "rect" },
    { symbol: "triangle" },
    { symbol: "diamond" },
    { symbol: "line" },
  ];

  const option = {
    backgroundColor: Colors.GrisAzuladoClaro,
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}% ({d}%)",
    },
    legend: {
      top: "7%",
      left: "center",
    },
    series: [
      {
        name: "Recaudación",
        type: "pie",
        radius: ["25%", "40%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 0,
          border: "none",
        },
        label: {
          show: true,
          fontSize: "10px",
        },
        labelLine: {
          show: true,
        },
        data: chartData.map((item, index) => ({
          ...item,
          itemStyle: {
            decal: decalEnabled ? { symbol: patterns[index % patterns.length].symbol } : null,
          },
        })),
      },
    ],
  };

  return (
    <div style={{ position: "relative", height: "34vh", width: "100%" }}>
      <button
        onClick={() => setDecalEnabled((prev) => !prev)}
        style={{
          backgroundColor: Colors.GrisAzuladoOscuro,
          padding: "3px 10px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          color: Colors.BlancoEnBlanco,
          position: "absolute",
          top: "-5px",
          right: "0px",
          zIndex: 900,
        }}
      >
        <FontAwesomeIcon icon={!decalEnabled ? faEye : faEyeSlash} />
      </button>
      <ReactECharts option={option} theme="dark" style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default GraficaTortaProductos;
