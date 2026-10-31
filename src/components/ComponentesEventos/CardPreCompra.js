import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { formatDateAR } from "../ComponentesGenerales/Utils/formatDate";
import "./CompraOpciones.css";

const CardPreCompra = ({ evento }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const availableDays = Array.isArray(evento?.diaEventos)
    ? [...new Set(evento.diaEventos.map((day) => day.fechaHoraInicioDiaEvento))]
    : [];
  const canSelect = (day) => new Date(day) > currentDate;
  const hasDays = availableDays.some(canSelect);

  const handleAccept = () => {
    if (!selectedDay || !canSelect(selectedDay)) return;
    const end = Math.max(...(evento.diaEventos || []).map((day) => new Date(day.fechaHoraFinDiaEvento)));
    if (end <= Date.now()) {
      toast.error("El evento ha finalizado. No se pueden realizar pedidos.");
      setShowModal(false);
      return;
    }
    setShowModal(false);
    navigate(`/listado-puestos/${evento.id}`, { state: { selectedDay } });
  };
  return (
    <>
      <button type="button" className="qf-purchase-card qf-purchase-instant"
        disabled={!evento?.tienePreventa} onClick={() => setShowModal(true)}>
        <span className="qf-purchase-icon" aria-hidden="true"><FaCalendarAlt /></span>
        <span className="qf-purchase-copy">
          <span className="qf-purchase-title">Precompra</span>
          <span className="qf-purchase-description">Comprá antes del evento y retirá tu pedido allá, el día que elijas.</span>
          <span className="qf-purchase-hint">{evento?.tienePreventa ? "Elegí la fecha de retiro para continuar." : "Precompra no disponible en este evento."}</span>
        </span>
        <FaArrowRight className="qf-purchase-arrow" aria-hidden="true" />
      </button>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="qf-purchase-modal">
        <Modal.Header closeButton><Modal.Title>Elegí el día de retiro</Modal.Title></Modal.Header>
        <Modal.Body>
          <p className="qf-purchase-description">Comprá ahora y retirá tu pedido en el evento. La compra será válida únicamente para el día elegido.</p>
          <div className="qf-purchase-days" role="group" aria-label="Fechas de retiro">
            {availableDays.map((day) => <button key={day} type="button" disabled={!canSelect(day)}
              aria-pressed={selectedDay === day} onClick={() => setSelectedDay(day)}>{formatDateAR(day)}</button>)}
          </div>
          {!hasDays && <p className="qf-purchase-hint" role="status">No hay fechas disponibles para precomprar.</p>}
          {selectedDay && <p className="qf-purchase-hint">Retiro seleccionado: {formatDateAR(selectedDay)}</p>}
        </Modal.Body>
        <Modal.Footer>
          <button type="button" className="qf-purchase-back" onClick={() => setShowModal(false)}>Volver</button>
          <button type="button" className="qf-purchase-continue" disabled={!selectedDay || !canSelect(selectedDay)} onClick={handleAccept}>Continuar con la precompra</button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default CardPreCompra;
