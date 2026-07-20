import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import useBreakpoint from "../../useBreakpoint";

const GraficaBarras = ({ eventId = "Todos", puestoId = "Todos" }) => {
  const [chartData, setChartData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decalEnabled, setDecalEnabled] = useState(true); // Estado para los decals
  const [categorias, setCategorias] = useState([]); // Guardar categorías en estado
  const [groupedData, setGroupedData] = useState({}); // Guardar datos agrupados en estado
  const [puestos, setPuestos] = useState([]); // Guardar puestos en estadon
  const { isMobile } = useBreakpoint();
  useEffect(() => {
    console.log("Evento seleccionado:", eventId, "Puesto seleccionado:", puestoId);

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}estadisticas/pedidos-por-tiempo-y-carrito/${eventId}/${puestoId}`
        );

        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Datos obtenidos:", eventId, puestoId, data);

        if (!data.data || data.data.length === 0) {
          toast.error("No hay Pedidos en este evento para mostrar");
          setChartData(null);
          setLoading(false);
          return;
        }

        const groupedDataTemp = {};
        const puestosSet = new Set();

        data.data.forEach((item) => {
          const dia = new Date(item.diaevento).toLocaleDateString();
          const puesto = item.nombrepuesto || "Desconocido"; // Nombre del puesto
          puestosSet.add(puesto);

          if (!groupedDataTemp[dia]) {
            groupedDataTemp[dia] = {};
          }

          groupedDataTemp[dia][puesto] = (groupedDataTemp[dia][puesto] || 0) + parseFloat(item.totalrecaudado);
        });

        const categoriasTemp = Object.keys(groupedDataTemp); // Fechas
        const puestosTemp = Array.from(puestosSet); // Lista de nombres de puestos

        setCategorias(categoriasTemp);
        setGroupedData(groupedDataTemp);
        setPuestos(puestosTemp);
        setLoading(false);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, puestoId]); // Solo depende de eventId y puestoId

  // Segundo useEffect para actualizar chartData cuando decalEnabled cambia
  useEffect(() => {
    if (categorias.length === 0 || puestos.length === 0) return;

    const patterns = ["circle", "rect", "triangle", "diamond", "line"];

    const series = puestos.map((puesto, index) => ({
      name: puesto,
      type: "bar",
      stack: puestoId === "Todos" ? "total" : undefined,
      data: categorias.map((dia) => groupedData[dia][puesto] || 0),
      emphasis: { focus: "series" },
      itemStyle: {
        decal: decalEnabled ? { symbol: patterns[index % patterns.length] } : undefined,
      },
      // Solo la última serie del stack muestra el total de la barra completa
      label:
        index === puestos.length - 1
          ? {
              show: true,
              position: "top",
              color: "#ffffff",
              fontWeight: "bold",
              formatter: (params) => {
                const total = puestos.reduce(
                  (sum, p) => sum + (Number(groupedData[categorias[params.dataIndex]]?.[p]) || 0),
                  0
                );
                return `$${Math.round(total).toLocaleString("es-AR")}`;
              },
            }
          : { show: false },
    }));

    const formatMonto = (valor) => `$${Math.round(Number(valor) || 0).toLocaleString("es-AR")}`;

    setChartData({
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
      title: { 
        text: "Recaudación por Día", 
        left: "center", 
        top: "1%",
        textStyle: { color: "#ffffff" }
      },
      legend: { 
        data: puestos, 
        top: isMobile ? "auto" : 30,
        bottom: isMobile ? 0 : "auto",
        orient: isMobile ? "horizontal" : "vertical",
        textStyle: { color: "#ffffff" }
      },
      xAxis: { 
        type: "category", 
        data: categorias,
        axisLabel: { color: "#ffffff" },
        axisLine: { lineStyle: { color: "#ffffff" } }
      },
      yAxis: { 
        type: "value",
        axisLabel: {
          color: "#ffffff",
          formatter: (value) => `$${Math.round(value).toLocaleString("es-AR")}`,
        },
        axisLine: { lineStyle: { color: "#ffffff" } },
        splitLine: { lineStyle: { color: "rgba(217, 143, 11, 0.2)" } }
      },
      series,
      backgroundColor: "transparent",
    });
  }, [decalEnabled, categorias, groupedData, puestos, puestoId, isMobile]);

  const onChartClick = (params) => {
    setSelectedDay(params.name);
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
      <CircularProgress style={{ color: "var(--qf-naranja)" }} />
    </div>
  );
  if (error) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%", color: "var(--qf-naranja)" }}>
      Error: {error}
    </div>
  );

  return (
    <div style={{ position: "relative", height: "100%", width: "100%", minHeight: "400px", overflow: "visible" }} data-testid="grafica-wrapper">
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
          top: "10px",
          right: "10px",
          zIndex: 900,
        }}
      >
        <span>{decalEnabled ? <FaEye /> : <FaEyeSlash />}</span>
      </button>

      {/* Renderiza la gráfica de barras o la gráfica de líneas según el estado */}
      {!selectedDay ? (
        chartData && (
          <ReactECharts
            option={chartData}
            theme="dark"
            notMerge={true}
            style={{ height: "100%", width: "100%" }}
            onEvents={{ click: onChartClick }}
          />
        )
      ) : (
        <GraficaLineas
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
          idevento={eventId}
          idpuesto={puestoId}
          decalEnabled={decalEnabled} // Pasamos decalEnabled a GraficaLineas
        />
      )}
    </div>
  );
};

const GraficaLineas = ({ selectedDay, setSelectedDay, idevento, idpuesto }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isMobile } = useBreakpoint();

  const formatFecha = (fecha) => {
    const [day, month, year] = fecha.split("/");
    return `${year}-${day}-${month}`;
  };

  useEffect(() => {
    if (!selectedDay) return;
    setLoading(true);
    setError(null);

    fetch(
      `${process.env?.REACT_APP_BACK_URL}estadisticas/productos-vendidos-dia-evento/${idevento}/${idpuesto}/${formatFecha(selectedDay)}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        return response.json();
      })
      .then((data) => {
        const xAxisData = [...new Set(data.data.map(item => {
          const date = new Date(item.intervalo_30min);
          return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        }))].sort();

        const seriesData = {};
        
        data.data.forEach((item) => {
          if (!seriesData[item.producto]) {
            seriesData[item.producto] = Array(xAxisData.length).fill(0);
          }
          const date = new Date(item.intervalo_30min);
          const formattedInterval = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const index = xAxisData.indexOf(formattedInterval);
          if (index !== -1) {
            seriesData[item.producto][index] = parseInt(item.cantidad_vendida, 10);
          }
        });

        setChartData({
          backgroundColor: "transparent",
          tooltip: { trigger: "axis", axisPointer: { type: "cross" }, confine: true },
          title: { 
            text: `Detalle de Ventas - ${selectedDay}`, 
            left: "center",
            top : "1%",
            textStyle: { color: "#ffffff" }
          },
          xAxis: { 
            type: "category", 
            data: xAxisData,
            axisLabel: { color: "#ffffff" },
            axisLine: { lineStyle: { color: "#ffffff" } }
          },
          yAxis: { 
            type: "value",
            axisLabel: { color: "#ffffff" },
            axisLine: { lineStyle: { color: "#ffffff" } },
            splitLine: { lineStyle: { color: "rgba(217, 143, 11, 0.2)" } }
          },
          grid: { bottom: isMobile ? 40 : 100 },
          legend: { 
            data: Object.keys(seriesData), 
            bottom: isMobile ? 0 : "auto",
            orient: isMobile ? "horizontal" : "vertical",
            textStyle: { color: "#ffffff" }
          },
          series: Object.keys(seriesData).map((key) => ({
            name: key,
            type: "line",
            data: seriesData[key],
            lineStyle: { width: 3 },
          })),
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedDay, idevento, idpuesto, isMobile]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%" }}>
      <CircularProgress style={{ color: "var(--qf-naranja)" }} />
    </div>
  );
  if (error) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%", color: "var(--qf-naranja)" }}>
      Error: {error}
    </div>
  );

  return (
    <div style={{ position: "relative", overflow: "visible" }} className="h-100 w-100">
      <ReactECharts option={chartData} theme="dark" notMerge={true} className="h-100 w-100" />
      <button
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "5px 10px",
          backgroundColor: "var(--qf-naranja)",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => setSelectedDay(null)}
      >
        Volver
      </button>
    </div>
  );
};

export default GraficaBarras;
