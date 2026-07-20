import React, { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import useBreakpoint from "../../useBreakpoint";

const cssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || name;

const GraficaTorta = ({ id }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decalEnabled, setDecalEnabled] = useState(true); // Estado para activar/desactivar decaln
  const { isMobile } = useBreakpoint();
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

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "30vh" }}>
      <CircularProgress style={{ color: "var(--qf-naranja)" }} />
    </div>
  );
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

  const naranja = cssVar("--qf-naranja");
  const bgSecondary = cssVar("--qf-bg-secondary");
  const option = {
    height: "90%",
    tooltip: {
      trigger: "item",
      confine: true,
      formatter: (params) =>
        `${params.seriesName}<br/>${params.marker} ${params.name}: <b>$${Math.round(Number(params.value) || 0).toLocaleString("es-AR")}</b> (${params.percent}%)`,
    },
    backgroundColor: bgSecondary,
    title: {
      text: "Porcentaje de Recaudación por Puesto",
      subtext: "Porcentaje de lo recaudado en el evento por cada puesto",
      top: "3%",
      left: "center",
      textStyle: {
        color: naranja,
      },
      subtextStyle: {
        color: naranja,
      },
    },
    legend: {
      show: true,
      top: "6%",
      left: "center",
      orient: "horizontal",
      textStyle: {
        color: naranja,
      },
    },
    series: [
      {
        top: "18%",
        bottom: "8%",
        name: "Total Recaudado",
        type: "pie",
        radius: ["25%", "48%"],
        center: ["50%", "58%"],
        avoidLabelOverlap: true,
        label: {
          color: naranja,
          alignTo: "labelLine",
          overflow: "truncate",
          width: 90,
        },
        labelLine: {
          length: 10,
          length2: 8,
          lineStyle: {
            color: naranja,
          },
        },
        data: formattedData.map((item, index) => ({
          ...item,
          itemStyle: {
            decal: decalEnabled ? { symbol: patterns[index % patterns.length].symbol } : null,
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
        overflow: "hidden",
        height: "30vh",
        position: "relative",
        maxWidth: isMobile ? "100%" : "800px",
        width: "100%",
      }}
      data-testid="grafica-wrapper"
    >
      <button
                  onClick={() => setDecalEnabled((prev) => !prev)}
                  style={{
                    backgroundColor: "var(--qf-bg-main)",
                    padding: "3px 10px",
                    borderRadius:"10px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: "var(--qf-naranja)",
                    position: "absolute",
                    top: "20px",
                    right: "5px",
                    zIndex:"900"
                  }}
                >
                  {decalEnabled ? <FaEye /> : <FaEyeSlash />}
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
