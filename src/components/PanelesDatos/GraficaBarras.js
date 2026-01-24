import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { toast } from "react-toastify";
import useDynamicColors from "../../UseDinamicColors";

const ICON = "ICON";

const GraficaBarras = ({ eventId }) => {
  const [chartData, setChartData] = useState(null); // Estado para los datos de la gráfica
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para errores
  const [decalEnabled, setDecalEnabled] = useState(false); // Estado para activar/desactivar decal
  const Colors = useDynamicColors();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}estadisticas/pedidos-por-tiempo-y-carrito/${eventId}`
        );
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        const data = await response.json();

        if (data.data === 0) {
          toast.error("No hay Pedidos en este evento para mostrar");
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

        let index = 0;
        puestosMap.forEach((data, puesto) => {
          const patterns = [
            { symbol: "circle" },
            { symbol: "rect" },
            { symbol: "triangle" },
            { symbol: "diamond" },
            { symbol: "line" },
          ];
          const pattern = patterns[index % patterns.length];

          seriesData.push({
            name: puesto,
            type: "bar",
            stack: "total",
            label: { show: true },
            emphasis: { focus: "series" },
            data,
            itemStyle: {
              decal: decalEnabled ? { symbol: pattern.symbol } : null, // Condicional para mostrar/ocultar decal
            },
          });

          index++;
        });

        setChartData({
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
          },
          backgroundColor: Colors.GrisAzuladoClaro,
          title: {
            text: "Recaudacion por Puesto y Dia",
            subtext: "Total Recaudado por cada Puesto en cada Dia",
            top: "3%",
            left: "center",
          },
          legend: { top: "20%" },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            top: "30%",
            containLabel: true,
          },
          yAxis: { type: "value" },
          xAxis: { type: "category", data: xAxisData },
          series: seriesData,
        });

        setLoading(false);
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId, decalEnabled]); // Dependencia decalEnabled para actualizar el gráfico

  const toggleDecal = () => {
    setDecalEnabled(!decalEnabled);
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-100 w-100" style={{position:"relative"}}>
      {chartData ? (
        <>
          <ReactECharts
            option={chartData}
            theme="dark"
            className="h-100 w-100"
          />
          <button
            onClick={toggleDecal}
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
              right: "20px",
              zIndex:"900"
            }}
          >
            <span>{ICON}</span>
          </button>
        </>
      ) : (
        <div
          style={{
            backgroundColor: Colors.GrisAzuladoClaro,
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              color: Colors.BlancoEnBlanco,
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
