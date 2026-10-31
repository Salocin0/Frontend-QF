import { cartAmounts } from "./cartAmounts";
import { Link } from "react-router-dom";
import { formatDateAR } from "../ComponentesGenerales/Utils/formatDate";

const money = (value) => Number(value || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });
const CartOverview = ({ groups, checkoutControl }) => {
  const amounts = groups.map((group) => cartAmounts(group.productos));
  const subtotal = amounts.reduce((sum, amount) => sum + amount.subtotal, 0);
  const commission = amounts.reduce((sum, amount) => sum + amount.commission, 0);
  const total = amounts.reduce((sum, amount) => sum + amount.total, 0);
  return (
    <aside className="qf-cart-overview" aria-labelledby="cart-overview-title">
      <h2 id="cart-overview-title">Resumen general</h2>
      <p className="qf-cart-overview-intro">Todo lo que agregaste, por puesto y evento.</p>
      <div className="qf-cart-overview-groups">
        {groups.filter((group) => group.productos.length).map(({ key, productos }) => {
          const first = productos[0];
          const groupAmount = cartAmounts(productos);
          const groupSubtotal = groupAmount.subtotal;
          return (
            <section key={key} className="qf-cart-overview-group">
              <p><Link className="qf-cart-event-link" to={`/tipo-compra/${first.eventoId ?? first.evento?.id}`}>{first.evento?.nombre || `Evento #${first.eventoId}`}</Link></p>
              <h3>{first.producto.puesto?.nombreCarro || `Puesto #${first.producto.puestoId}`}</h3>
              <span className="qf-cart-overview-date">{first.fecha ? `Retiro el ${formatDateAR(first.fecha)}` : "Compra instantánea"}</span>
              <ul>{productos.map((item) => <li key={item.producto.id}><span><b>{item.cantidad} ×</b> {item.producto.nombre}</span><strong>{money(Number(item.cantidad) * Number(item.producto.precio))}</strong></li>)}</ul>
              <div className="qf-cart-overview-group-total"><span>Subtotal del puesto</span><strong>{money(groupSubtotal)}</strong></div>
              <div className="qf-cart-overview-group-total"><span>Comisión de servicio (15%)</span><strong>{money(groupAmount.commission)}</strong></div>
              <div className="qf-cart-overview-group-total"><span>Total del pedido</span><strong>{money(groupAmount.total)}</strong></div>
            </section>
          );
        })}
      </div>
      <dl className="qf-cart-overview-totals"><div><dt>Subtotal de productos</dt><dd>{money(subtotal)}</dd></div><div><dt>Comisión de servicio (15%)</dt><dd>{money(commission)}</dd></div><div className="qf-cart-overview-total"><dt>Total general</dt><dd>{money(total)}</dd></div></dl>
      {checkoutControl}
      <p className="qf-cart-overview-note">Un solo pago para todos tus pedidos, con la comisión incluida.</p>
    </aside>
  );
};
export default CartOverview;
