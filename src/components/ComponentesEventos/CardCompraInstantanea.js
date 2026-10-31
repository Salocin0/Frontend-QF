import { FaBolt, FaArrowRight } from "react-icons/fa";
import "./CompraOpciones.css";

const CardCompraInstantanea = ({ evento, onSelect }) => (
  <button type="button" className="qf-purchase-card qf-purchase-instant" onClick={onSelect}>
    <span className="qf-purchase-icon" aria-hidden="true"><FaBolt /></span>
    <span className="qf-purchase-copy">
      <span className="qf-purchase-title">Compra instantánea</span>
      <span className="qf-purchase-description">Comprá durante el evento y recibí tu pedido en el momento.</span>
      {evento?.estado !== "EnCurso" && <span className="qf-purchase-hint">Disponible cuando comience el evento.</span>}
    </span>
    <FaArrowRight className="qf-purchase-arrow" aria-hidden="true" />
  </button>
);
export default CardCompraInstantanea;
