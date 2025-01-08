import React, { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import { toast } from "react-toastify";
import useDynamicColors from "../../UseDinamicColors";

const GraficaBarras = ({ eventId }) => {
  const [chartData, setChartData] = useState(null); // Estado para los datos de la gráfica
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado para errores
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

        // Si no hay pedidos, mostramos un toast y limpiamos completamente el gráfico
        if (data.data === 0) {
          toast.error("No hay Pedidos en este evento para mostrar");
          setChartData(null); // Aseguramos que el gráfico quede vacío
          setLoading(false);
          return;
        }

        const groupedData = {};

        // Procesar datos para la gráfica
        data.data.forEach((item) => {
          const dia = new Date(item.diaevento).toLocaleDateString(); // Agrupar por día en formato legible
          if (!groupedData[dia]) {
            groupedData[dia] = [];
          }
          groupedData[dia].push({
            nombrepuesto: item.nombrepuesto,
            totalrecaudado: parseFloat(item.totalrecaudado),
          });
        });

        const xAxisData = Object.keys(groupedData); // Fechas de los días
        const seriesData = [];
        const puestosMap = new Map();

        // Estructurar series dinámicamente
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
            label: { show: true },
            emphasis: { focus: "series" },
            data,
          });
        });

        setChartData({
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
          },
          legend: { top: "3%" },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            top: "25%",
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

    if (eventId !== null) {
      fetchData();
    }
  }, [eventId]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="h-100 w-100">
      {chartData ? (
        <ReactECharts option={chartData} theme="dark" className="h-100 w-100" />
      ) : (
        <div style={{backgroundColor:Colors.GrisAzuladoClaro,height:"100%", display:"flex",justifyContent:"center",alignItems:"center"}}>
          <h1 style={{color:Colors.BlancoEnBlanco,fontSize:"18px"}}>Todavia no hay Pedidos Realizados</h1>
          </div>
      )}
    </div>
  );
};

export default GraficaBarras;
