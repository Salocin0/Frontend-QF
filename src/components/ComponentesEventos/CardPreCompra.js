import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap"; // Utilizando Bootstrap para el modal

const CardPreCompra = ({ evento }) => {
    const [selectedDay, setSelectedDay] = useState(null); // Día seleccionado
    const [showModal, setShowModal] = useState(false); // Estado para mostrar el modal

    // Obtener la fecha actual
    const currentDate = new Date();
    
    // Verificar si evento.diaEventos existe y es un array antes de filtrarlo
    const filteredDays = Array.isArray(evento?.diaEventos)
        ? evento.diaEventos.filter(fechaHoraInicioDiaEvento => new Date(fechaHoraInicioDiaEvento) <= currentDate)
        : []; // Si no es un array, devolvemos un array vacío
        
    // Manejador para seleccionar un día
    const handleSelectDay = (day) => {
        setSelectedDay(day);
    };

    // Manejador para el botón "Siguiente" que muestra el modal de advertencia
    const handleNext = () => {
        setShowModal(true);
    };

    // Manejadores para el modal de advertencia
    const handleCloseModal = () => setShowModal(false);
    const handleAccept = () => {
        // Lógica para proceder con la compra
        setShowModal(false);
        console.log("Compra confirmada para el día:", selectedDay);
    };
    const handleReject = () => setShowModal(false);

    const styles = {
        card: {
            width: "100%",
            padding: "20px",
            backgroundColor: "#f3f3f3",
            borderRadius: "8px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
        },
        icon: {
            color: "#ff6600",
            marginBottom: "10px",
        },
        title: {
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "10px",
        },
        description: {
            fontSize: "16px",
            color: "#666",
            marginBottom: "20px",
        },
        dayList: {
            listStyleType: "none",
            padding: 0,
            marginBottom: "20px",
        },
        dayItem: {
            padding: "10px",
            margin: "5px 0",
            cursor: "pointer",
            border: "1px solid #ccc",
            borderRadius: "5px",
        },
        disabledDay: {
            backgroundColor: "#f1f1f1",
            cursor: "not-allowed",
            color: "#ccc",
        },
        activeDay: {
            backgroundColor: "#ff6600",
            color: "#fff",
        },
        button: {
            backgroundColor: "#ff6600",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
        },
    };

    return (
        <div style={styles.card}>
            <FontAwesomeIcon icon={faCalendarAlt} size="3x" style={styles.icon} />
            <h2 style={styles.title}>PreCompra</h2>
            <p style={styles.description}>Información sobre la precompra del evento.</p>

            <ul style={styles.dayList}>
                {filteredDays?.map((dia, index) => (
                    <li
                        key={index}
                        onClick={() => dia !== currentDate.toISOString().split('T')[0] && handleSelectDay(dia)}
                        style={{
                            ...styles.dayItem,
                            ...(dia === currentDate.toISOString().split('T')[0]
                                ? styles.disabledDay
                                : selectedDay === dia
                                ? styles.activeDay
                                : {}),
                        }}
                    >
                        {new Date(dia).toLocaleDateString()}
                    </li>
                ))}
            </ul>

            <button
                onClick={handleNext}
                style={styles.button}
                disabled={!selectedDay}
            >
                Siguiente
            </button>

            {/* Modal de advertencia */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Advertencia</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>¿Está seguro de que desea continuar con la compra para el día {new Date(selectedDay).toLocaleDateString()}?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleReject}>
                        Rechazar
                    </Button>
                    <Button variant="primary" onClick={handleAccept}>
                        Aceptar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CardPreCompra;
