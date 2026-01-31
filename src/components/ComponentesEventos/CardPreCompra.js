import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap"; // Utilizando Bootstrap para el modal
import useDynamicColors from "../../UseDinamicColors";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from 'react-icons/fa';

const ICON = "ICON";

const CardPreCompra = ({ evento }) => {
  const [selectedDay, setSelectedDay] = useState(null); // Día seleccionado
  const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal
  const Colors = useDynamicColors();
  const navigate = useNavigate();

  // Obtener la fecha actual y establecerla al inicio del día (para evitar conflictos de horas)
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  // Verificar si evento.diaEventos existe y es un array antes de mapearlo
  const availableDays = Array.isArray(evento?.diaEventos)
    ? evento.diaEventos.map((fecha) => fecha.fechaHoraInicioDiaEvento)
    : []; // Si no es un array, devolvemos un array vacío

  // Manejador para seleccionar un día
  const handleSelectDay = (day) => {
    if (new Date(day) > currentDate) {
      setSelectedDay(day);
    }
  };

  // Manejador para el botón "Siguiente" que muestra el modal de advertencia
  const handleNext = () => {
    setShowModal(true);
    navigate(`/listado-puestos/${evento.id}`, { state: { selectedDay } });
  };

  // Manejadores para el modal de advertencia
  const handleCloseModal = () => setShowModal(false);
  const handleAccept = () => {
    setShowModal(false);
  };
  const handleReject = () => setShowModal(false);

  const styles = {
    card: {
      width: "calc(80% - 40px)",
      padding: "20px",
      backgroundColor: Colors.GrisAzuladoClaro,
      borderRadius: "8px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      height: "55vh",
      marginLeft: "calc(20% + 20px)",
      border: `1px solid ${Colors.Naranja}`,
      position:"relative"
    },
    icon: {
      color: Colors.Naranja,
      marginBottom: "10px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: Colors.Blanco,
    },
    description: {
      fontSize: "16px",
      color: Colors.Blanco,
      marginBottom: "20px",
    },
    dayGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      gap: "10px",
    },
    dayItem: {
      padding: "10px",
      textAlign: "center",
      cursor: "pointer",
      border: `1px solid ${Colors.Blanco}`,
      borderRadius: "5px",
      color: Colors.Blanco,
      backgroundColor: Colors.GrisAzuladoClaro,
    },
    disabledDay: {
      backgroundColor: Colors.GrisAzuladoOscuro,
      cursor: "not-allowed",
      color: Colors.Blanco,
    },
    activeDay: {
      backgroundColor: Colors.Naranja,
      color: Colors.Blanco,
    },
    button: {
      backgroundColor: Colors.Naranja,
      color: Colors.Blanco,
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      position: "absolute",
      bottom: "20px",
      width: "200px",
      right: "calc(50% - 100px)",
    },
    modalHeader: {
      backgroundColor: Colors.GrisAzuladoClaro,
      color: Colors.Blanco,
      borderBottom: `1px solid ${Colors.Naranja}`,
    },
    modalBody: {
      backgroundColor: Colors.GrisAzuladoOscuro,
      color: Colors.Blanco,
    },
    modalFooter: {
      backgroundColor: Colors.GrisAzuladoClaro,
      borderTop: `1px solid ${Colors.Naranja}`,
    },
    modalButton: {
      backgroundColor: Colors.Naranja,
      border: "none",
      color: Colors.Blanco,
    },
  };

  return (
    <div style={styles.card}>
      {evento.tienePreventa ? (
        <>
          <span style={styles.icon}>{ICON}</span>
          <h2 style={styles.title}>PreCompra</h2>
          <p style={styles.description}>
            Seleccione una fecha disponible para la precompra.
          </p>

            <div style={styles.dayGrid}>
              {availableDays.map((dia, index) => {
                const isDisabled = new Date(dia) <= currentDate;
                return (
                  <div
                    key={index}
                    onClick={() => !isDisabled && handleSelectDay(dia)}
                    style={{
                      ...styles.dayItem,
                      ...(isDisabled ? styles.disabledDay : {}),
                      ...(selectedDay === dia ? styles.activeDay : {}),
                    }}
                  >
                    {new Date(dia).toLocaleDateString()}
                  </div>
                );
              })}
            </div>

          <button
            onClick={handleNext}
            style={styles.button}
            disabled={!selectedDay}
          >
            Siguiente
          </button>
        </>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "100%"}}>
          <span style={styles.icon}><FaCalendarAlt /></span>
          <h2 style={styles.title}>Precompra no disponible</h2>
          <p style={styles.description}>
            Precompra no disponible en este evento.
          </p>
        </div>
      )}

      {/* Modal de advertencia */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header style={styles.modalHeader} closeButton>
          <Modal.Title>Advertencia</Modal.Title>
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          <p style={styles.description}>
            ¿Está seguro de que desea continuar con la compra para el día{" "}
            {new Date(selectedDay).toLocaleDateString()}? Su compra será válida
            únicamente para ese día del evento.
          </p>
        </Modal.Body>
        <Modal.Footer style={styles.modalFooter}>
          <Button
            variant="secondary"
            onClick={handleReject}
            style={{ ...styles.modalButton, backgroundColor: Colors.Rojo }}
          >
            Rechazar
          </Button>
          <Button
            variant="primary"
            onClick={handleAccept}
            style={{ ...styles.modalButton, backgroundColor: Colors.Verde }}
          >
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CardPreCompra;
