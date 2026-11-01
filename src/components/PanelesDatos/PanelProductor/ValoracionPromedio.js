import React from "react";
import ManagerMetric from "../PanelEncargado/ManagerMetric";
import useProducerStatistic from "./useProducerStatistic";
const ValoracionPromedio = ({ eventoId }) => {
  const result = useProducerStatistic("promedio-valoracion-puesto", eventoId);
  const rating = Number(result.data);
  return <ManagerMetric title="Valoración promedio" value={rating > 0 && Number.isFinite(rating) ? `${rating.toLocaleString("es-AR", { maximumFractionDigits: 1 })} / 5` : "Sin datos"} caption="Calificaciones de los puestos del evento." {...result} />;
};
export default ValoracionPromedio;
