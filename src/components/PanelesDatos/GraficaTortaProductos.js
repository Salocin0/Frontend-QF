import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const GraficaTortaProductos = ({ height, productos }) => {
  const [chartData, setChartData] = useState([]);
  const [decalEnabled, setDecalEnabled] = useState(true); // Estado para activar/desactivar decaln
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
    backgroundColor: "var(--qf-bg-secondary)",
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}% ({d}%)",
    },
    legend: {
      top: "7%",
      left: "center",
      textStyle: {
        color: "var(--qf-naranja)",
      }
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
          color: "var(--qf-naranja)",
        },
        labelLine: {
          show: true,
        },
        data: chartData.map((item, index) => ({
          ...item,
          itemStyle: {
            decal: decalEnabled ? { symbol: patterns[index % patterns.length].symbol } : undefined,
          },
        })),
      },
    ],
  };

  return (
    <div style={{ position: "relative", height: "32vh", width: "100%" }}>
      <button
        onClick={() => setDecalEnabled((prev) => !prev)}
        style={{
          backgroundColor: "var(--qf-bg-main)",
          padding: "3px 10px",
          borderRadius: "10px",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          color: "var(--qf-naranja)",
          position: "absolute",
          top: "-5px",
          right: "0px",
          zIndex: 900,
        }}
      >
        <span>{decalEnabled ? <FaEye /> : <FaEyeSlash />}</span>
      </button>
      <ReactECharts option={option} theme="dark" style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default GraficaTortaProductos;
