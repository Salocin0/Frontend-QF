import React from "react";
import ManagerMetric from "./ManagerMetric";
import useManagerStatistic from "./useManagerStatistic";
const TotalRecaudadoEvento = (props) => {
  const result = useManagerStatistic("total-recaudado-puesto-evento", props.puestoId, props.eventoId);
  const amount = Number(result.data);
  const value = result.data == null || !Number.isFinite(amount) ? "Sin datos" : new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(amount);
  return <ManagerMetric title="Total recaudado" value={value} caption="Según el evento y puesto seleccionados." {...result} />;
};
export default TotalRecaudadoEvento;
