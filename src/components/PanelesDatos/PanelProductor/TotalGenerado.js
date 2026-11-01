import React from "react";
import ManagerMetric from "../PanelEncargado/ManagerMetric";
import useProducerStatistic from "./useProducerStatistic";
const TotalQuickFood = ({ eventId }) => {
  const result = useProducerStatistic("total-recaudado-evento", eventId);
  const amount = Number(result.data);
  const value = result.data == null || !Number.isFinite(amount) ? "Sin datos" : new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(amount);
  return <ManagerMetric title="Total generado" value={value} caption="Recaudación de los eventos seleccionados." {...result} />;
};
export default TotalQuickFood;
