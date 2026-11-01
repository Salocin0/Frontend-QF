import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import useBreakpoint from "../../useBreakpoint";
import useTheme from "../../useTheme";

const cssVar = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || name;

const CHART_PATTERNS = ["circle", "rect", "triangle", "diamond", "line"];

const GraficaBarras = ({ eventId }) => {
  const [chartData, setChartData] = useState(null); // Estado para los datos de la gráfica
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para errores
  const [decalEnabled, setDecalEnabled] = useState(true); // Estado para activar/desactivar decaln
  const { isMobile } = useBreakpoint();
  const { isDark } = useTheme();
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setChartData(null);
      try {
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}estadisticas/pedidos-por-tiempo-y-carrito/${eventId}`,
          { signal: controller.signal }
        );
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();
        if (controller.signal.aborted) return;

        if (!Array.isArray(data.data) || data.data.length === 0) {
          setChartData(null);
          setLoading(false);
          return;
        }

        const groupedData = {};
        data.data.forEach((item) => {
          const dia = new Date(item.diaevento).toLocaleDateString();
          if (!groupedData[dia]) {
            groupedData[dia] = [];
          }
          groupedData[dia].push({
            nombrepuesto: item.nombrepuesto,
            totalrecaudado: parseFloat(item.totalrecaudado),
          });
        });

        const xAxisData = Object.keys(groupedData);
        const seriesData = [];
        const puestosMap = new Map();

        xAxisData.forEach((dia) => {
          groupedData[dia].forEach((puesto) => {
            if (!puestosMap.has(puesto.nombrepuesto)) {
              puestosMap.set(
                puesto.nombrepuesto,
                new Array(xAxisData.length).fill(0)
              );
            }
            const index = xAxisData.indexOf(dia);
            puestosMap.get(puesto.nombrepuesto)[index] = puesto.totalrecaudado;
          });
        });

        puestosMap.forEach((data, puesto) => {
          seriesData.push({
            name: puesto,
            type: "bar",
            stack: "total",
            label: { show: false },
            emphasis: { focus: "series" },
            data,
          });
        });

        setChartData({
          xAxisData,
          seriesData,
        });

        setLoading(false);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    if (eventId) {
      fetchData();
    }
    return () => controller.abort();
  }, [eventId]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
      <CircularProgress style={{ color: "var(--qf-naranja)" }} />
    </div>
  );
  if (error) return <div>Error: {error}</div>;

  const naranja = cssVar("--qf-highlight-text");
  const bgSecondary = cssVar("--qf-bg-secondary");
  const formatMonto = (valor) => `$${Math.round(Number(valor) || 0).toLocaleString("es-AR")}`;
  const option = chartData ? {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      confine: true,
      formatter: (params) => {
        const total = params.reduce((sum, p) => sum + (Number(p.value) || 0), 0);
        const lineas = params
          .map((p) => `${p.marker} ${p.seriesName}: <b>${formatMonto(p.value)}</b>`)
          .join("<br/>");
        return `${params[0]?.axisValueLabel || ""}<br/>${lineas}<br/><hr style="margin:4px 0;border-color:rgba(255,255,255,0.2)"/><b>Total: ${formatMonto(total)}</b>`;
      },
    },
    backgroundColor: bgSecondary,
    title: {
      text: "Recaudación por día",
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
      type: "scroll",
      top: "14%",
      left: "center",
      orient: "horizontal",
      textStyle: {
        color: naranja,
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "28%",
      containLabel: true,
    },
    yAxis: {
      type: "value",
      max: (value) => Math.ceil((value.max || 0) * 1.2),
      axisLabel: {
        color: naranja,
        formatter: (value) => `$${Math.round(value).toLocaleString("es-AR")}`,
      },
      axisLine: {
        lineStyle: {
          color: naranja,
        },
      },
    },
    xAxis: {
      type: "category",
      data: chartData.xAxisData,
      axisLabel: {
        color: naranja,
      },
      axisLine: {
        lineStyle: {
          color: naranja,
        },
      },
    },
    series: chartData.seriesData.map((serie, idx) => {
      const styledSerie = { ...serie, itemStyle: { ...serie.itemStyle, decal: decalEnabled ? { symbol: CHART_PATTERNS[idx % CHART_PATTERNS.length] } : null } };
      if (idx !== chartData.seriesData.length - 1) return styledSerie;
      // Última serie del stack: mostrar el total de la barra completa arriba
      return {
        ...styledSerie,
        label: {
          show: true,
          position: "top",
          color: naranja,
          fontWeight: "bold",
          formatter: (params) => {
            const total = chartData.seriesData.reduce(
              (sum, s) => sum + (Number(s.data[params.dataIndex]) || 0),
              0
            );
            return `$${Math.round(total).toLocaleString("es-AR")}`;
          },
        },
      };
    }),
  } : null;

  return (
    <div className="h-100 w-100" style={{position:"relative", width: "100%", maxWidth: isMobile ? "100%" : "800px"}} data-testid="grafica-wrapper">
      {option ? (
        <>
          <ReactECharts
            option={option}
            theme={isDark ? "dark" : undefined}
            notMerge={true}
            className="h-100 w-100"
          />
          <button
            aria-label={decalEnabled ? "Ocultar patrones del gráfico" : "Mostrar patrones del gráfico"}
            onClick={() => setDecalEnabled(!decalEnabled)}
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
              right: "20px",
              zIndex:"900"
            }}
          >
            {decalEnabled ? <FaEye /> : <FaEyeSlash />}
          </button>
        </>
      ) : (
        <div
          style={{
            backgroundColor: "var(--qf-bg-secondary)",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              color: "var(--qf-text-primary)",
              fontSize: "18px",
            }}
          >
            Todavia no hay Pedidos Realizados
          </h1>
        </div>
      )}
    </div>
  );
};

export default GraficaBarras;
