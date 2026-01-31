import useDynamicColors from "../../UseDinamicColors";
import { FaBolt } from 'react-icons/fa'

const ICON = "ICON";

const CardCompraInstantanea = ({ evento }) => {
    const Colors = useDynamicColors();

    // Verificamos el estado del evento
    const eventStatus = evento?.estado; // Asumiendo que 'evento' tiene un atributo 'estado'

    // Definir el mensaje de acuerdo al estado del evento
    const eventMessage = eventStatus !== "EnCurso"
        ? "El evento todavía no ha comenzado."
        : "Comprar en un evento de manera instantánea.";

    const styles = {
        card: {
            width: "calc(80% - 40px)", // 70%
            height: "30vh", // 30% del alto de la pantalla
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.GrisAzuladoClaro, // Fondo gris claro
            borderRadius: "8px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
            marginLeft:"calc(20% + 20px)",
            border: `1px solid ${Colors.Naranja}`,
            cursor: "pointer"
        },
        content: {
            textAlign: "center"
        },
        icon: {
            color: Colors.Naranja, // Color del ícono (puedes cambiarlo)
            marginBottom: "10px",
        },
        title: {
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "10px"
        },
        text: {
            fontSize: "16px",
            color: Colors.Blanco
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.content}>
                <span style={styles.icon}><FaBolt /></span>
                <h3 style={styles.title}>Compra Instantánea</h3>
                <p style={styles.text}>
                    {eventMessage}
                </p>
            </div>
        </div>
    );
}

export default CardCompraInstantanea;
