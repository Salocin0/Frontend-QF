import React from "react";
const money = (value) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(Number(value) || 0);
const TablaPuestos = ({ data = [] }) => <div className="qf-manager-products-table"><table><thead><tr><th>Puesto</th><th>Pedidos</th><th>Recaudación</th></tr></thead><tbody>{data.map((stand, index) => <tr key={stand.idpuesto || index}><td>{stand.nombre}</td><td>{stand.cantidadpedidos}</td><td>{money(stand.total)}</td></tr>)}</tbody></table></div>;
export default TablaPuestos;
