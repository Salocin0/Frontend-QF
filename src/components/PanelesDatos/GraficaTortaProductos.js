import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import useBreakpoint from "../../useBreakpoint";

const GraficaTortaProductos = ({ height, productos }) => {
  const [chartData, setChartData] = useState([]);
  const [decalEnabled, setDecalEnabled] = useState(true); // Estado para activar/desactivar decaln
  const { isMobile } = useBreakpoint();
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

  const tortaHeight = height || "40vh";

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c}% ({d}%)",
      confine: true,
    },
    legend: {
      top: isMobile ? "auto" : "7%",
      left: "center",
      bottom: isMobile ? 0 : "auto",
      orient: isMobile ? "horizontal" : "vertical",
      textStyle: {
        color: "#ffffff",
      }
    },
    series: [
      {
        name: "Recaudación",
        type: "pie",
        radius: ["25%", "45%"],
        center: ["50%", isMobile ? "45%" : "58%"],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 0,
          border: "none",
        },
        label: {
          show: true,
          fontSize: "11px",
          fontWeight: "bold",
          color: "#ffffff",
          alignTo: "labelLine",
          overflow: "truncate",
          width: 90,
        },
        labelLine: {
          show: true,
          length: 12,
          length2: 10,
          lineStyle: {
            color: "rgba(255,255,255,0.4)",
          },
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
    <div style={{ position: "relative", height: tortaHeight, width: "100%", maxWidth: isMobile ? "100%" : "800px", minHeight: "300px", overflow: "visible" }} data-testid="grafica-wrapper">
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
      <ReactECharts option={option} theme="dark" notMerge={true} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};

export default GraficaTortaProductos;
