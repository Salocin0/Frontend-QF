import React from "react";
import ManagerMetric from "./ManagerMetric";
import useManagerStatistic from "./useManagerStatistic";
const TiempoPromedioEntrega = (props) => {
  const result = useManagerStatistic("promedio-tiempo-entrega-puesto-evento", props.puestoId, props.eventoId);
  const minutes = Number(result.data);
  return <ManagerMetric title="Tiempo de entrega" value={minutes > 0 && Number.isFinite(minutes) ? `${minutes.toLocaleString("es-AR", { maximumFractionDigits: 1 })} min` : "Sin datos"} caption="Tiempo promedio de los pedidos entregados." {...result} />;
};
export default TiempoPromedioEntrega;
