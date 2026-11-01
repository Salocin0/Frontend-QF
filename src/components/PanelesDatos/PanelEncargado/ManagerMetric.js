import React from "react";
const ManagerMetric = ({ title, value, caption, loading, error }) => <article className="qf-manager-metric"><h2>{title}</h2>{loading ? <span className="qf-manager-metric-placeholder" role="status">Cargando…</span> : error ? <span className="qf-manager-metric-placeholder" role="status">No disponible</span> : <strong>{value}</strong>}<p>{error ? "No pudimos cargar este indicador." : caption}</p></article>;
export default ManagerMetric;
