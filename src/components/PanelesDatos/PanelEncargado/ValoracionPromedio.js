import React from "react";
import ManagerMetric from "./ManagerMetric";
import useManagerStatistic from "./useManagerStatistic";
const ValoracionPromedio = (props) => {
  const result = useManagerStatistic("promedio-valoracion-puesto-evento", props.puestoId, props.eventoId);
  const rating = Number(result.data);
  return <ManagerMetric title="Valoración promedio" value={rating > 0 && Number.isFinite(rating) ? `${rating.toLocaleString("es-AR", { maximumFractionDigits: 1 })} / 5` : "Sin datos"} caption="Calificaciones recibidas de tus clientes." {...result} />;
};
export default ValoracionPromedio;
