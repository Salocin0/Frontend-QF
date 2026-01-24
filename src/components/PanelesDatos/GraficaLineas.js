import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { toast } from "react-toastify";
import useDynamicColors from "../../UseDinamicColors";

const ICON = "ICON";

const GraficaBarras = ({ eventId = "Todos", puestoId = "Todos" }) => {
  const [chartData, setChartData] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decalEnabled, setDecalEnabled] = useState(false); // Estado para los decals
  const Colors = useDynamicColors();

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

        const groupedData = {};
        const puestosSet = new Set();

        data.data.forEach((item) => {
          const dia = new Date(item.diaevento).toLocaleDateString();
          const puesto = item.nombrepuesto || "Desconocido"; // Nombre del puesto
          puestosSet.add(puesto);

          if (!groupedData[dia]) {
            groupedData[dia] = {};
          }

          groupedData[dia][puesto] = (groupedData[dia][puesto] || 0) + parseFloat(item.totalrecaudado);
        });

        const categorias = Object.keys(groupedData); // Fechas
        const puestos = Array.from(puestosSet); // Lista de nombres de puestos

        const patterns = ["circle", "rect", "triangle", "diamond", "line"];

        const series = puestos.map((puesto, index) => ({
          name: puesto,
          type: "bar",
          stack: puestoId === "Todos" ? "total" : undefined,
          data: categorias.map((dia) => groupedData[dia][puesto] || 0),
          emphasis: { focus: "series" },
          itemStyle: {
            decal: decalEnabled ? { symbol: patterns[index % patterns.length] } : null,
          },
        }));

        setChartData({
          tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
          title: { text: "Recaudación por Día", left: "center", top: "1%" },
          legend: { data: puestos, top: 30 },
          xAxis: { type: "category", data: categorias },
          yAxis: { type: "value" },
          series,
          backgroundColor: Colors.GrisAzuladoClaro,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, puestoId, decalEnabled]); // Se ejecuta también cuando cambia decalEnabled

  const onChartClick = (params) => {
    setSelectedDay(params.name);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {/* Botón para activar/desactivar los decals */}
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
          top: "10px",
          right: "10px",
          zIndex: 900,
        }}
      >
        <span>{ICON}</span>
      </button>

      {/* Renderiza la gráfica de barras o la gráfica de líneas según el estado */}
      {!selectedDay ? (
        chartData && (
          <ReactECharts
            option={chartData}
            theme="dark"
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
  const Colors = useDynamicColors();

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
          backgroundColor: Colors.GrisAzuladoClaro,
          tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
          title: { text: `Detalle de Ventas - ${selectedDay}`, left: "center",top : "1%" },
          xAxis: { type: "category", data: xAxisData },
          yAxis: { type: "value" },
          grid: { bottom: 100 },
          legend: { data: Object.keys(seriesData), bottom: 0 },
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
  }, [selectedDay, idevento, idpuesto]);

  if (loading) return <p>Cargando datos...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ position: "relative" }} className="h-100 w-100">
      <ReactECharts option={chartData} theme="dark" className="h-100 w-100" />
      <button
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "5px 10px",
          backgroundColor: "#4CAF50",
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
