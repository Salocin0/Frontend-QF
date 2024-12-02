import React from "react";
import { Link } from "react-router-dom";
import logoevento from "./../img/logoevento.webp";
import useDynamicColors from "../../UseDinamicColors";

const EventoUser = ({ evento }) => {
  const Color = useDynamicColors();
  const calcularTiempoRestante = (fecha) => {
    const ahora = new Date();
    const diferencia = fecha - ahora;
    const horasTotales = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(horasTotales / 24);
    const horas = horasTotales % 24;
    console.log(evento);

    if (dias > 0) {
      return `${dias} día${dias > 1 ? "s" : ""} y ${horas} hora${
        horas !== 1 ? "s" : ""
      }`;
    }

    return `${horas} hora${horas !== 1 ? "s" : ""}`;
  };

  const calcularTextoTiempo = (fechaInicio, fechaFin) => {
    if (fechaInicio > new Date()) {
      return `Empieza en ${calcularTiempoRestante(fechaInicio)}`;
    }

    if (fechaFin > new Date()) {
      return `Termina en ${calcularTiempoRestante(fechaFin)}`;
    }

    return "Evento finalizado";
  };

  const fechaInicio = evento?.diaEventos?.length
    ? new Date(
        Math.min(
          ...evento.diaEventos.map((d) => new Date(d.fechaHoraInicioDiaEvento))
        )
      )
    : null;
  const fechaFin = evento?.diaEventos?.length
    ? new Date(
        Math.max(
          ...evento.diaEventos.map((d) => new Date(d.fechaHoraFinDiaEvento))
        )
      )
    : null;

  const textoTiempo =
    fechaInicio && fechaFin
      ? calcularTextoTiempo(fechaInicio, fechaFin)
      : "Fecha no disponible";

  const styles = {
    container: {
      width: "79%",
      margin: "0 30px",
    },
    card: {
      border: `1px solid ${Color.Naranja}`,
      borderRadius: "8px",
      width: "100%",
      backgroundColor: Color.GrisAzuladoClaro,
      marginBottom: "20px",
      color: Color.Blanco,
      padding: "0px",
      transition: "transform 0.2s ease-in-out",
    },
    cardBody: {
      display: "flex",
      flexDirection: "row",
      gap: "20px",
      alignItems: "center",
      cursor: "pointer",
    },
    img: {
      width: "100%",
      maxWidth: "150px",
      borderRadius: "8px",
      marginLeft: "40px",
    },
    content: {
      flexGrow: 1,
      position: "relative",
      justifyContent: "start",
      alignItems: "start",
      display: "flex",
      flexDirection: "column",
      marginLeft: "40px",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: Color.Naranja,
      marginBottom: "10px",
    },
    descripcion: {
      fontSize: "18px",
      color: Color.Gris,
      marginBottom: "10px",
    },
    text: {
      fontSize: "16px",
      color: Color.Gris,
      marginBottom: "5px",
    },
    distance: {
      fontSize: "16px",
      fontWeight: "bold",
      color: Color.Verde,
      marginBottom: "5px",
    },
    estado: {
      fontSize: "16px",
      backgroundColor: Color.Verde,
      color: Color.Negro,
      borderRadius: "5px",
      padding: "5px 5px",
      fontWeight: "bold",
      display: "flex",
      justifyContent: "center",
      width: "200px",
    },
    fecha: {
      fontSize: "16px",
      color: Color.Gris,
    },
    estadoContainer: {
      display: "flex",
      position: "absolute",
      top: "10px",
      right: "10px",
      width: "180px",
    },
    preventa: {
      fontSize: "16px",
      color: Color.Blanco,
      fontWeight: "bold",
      padding: "5px 10px",
      borderRadius: "5px",
      backgroundColor: Color.Naranja,
      display: "flex",
      justifyContent: "center",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <Link to={`/tipo-compra/${evento.id}`} style={styles.cardLink}>
          <div style={styles.cardBody}>
            <div>
              <img
                src={evento.img || logoevento}
                alt="Logo del Evento"
                style={styles.img}
              />
            </div>

            <div style={styles.content}>
              {evento.estado !== "EnCurso" && (
                <div style={styles.estadoContainer}>
                  <p style={styles.estado}>
                    {evento.estado === "EnCurso"
                      ? ""
                      : evento.estado === "Confirmado"
                      ? "Empieza pronto"
                      : evento.estado}
                  </p>
                </div>
              )}
              <p style={styles.title}>{evento.nombre}</p>
              <p style={styles.descripcion}>{evento.descripcion}</p>
              <p style={styles.text}>
                {evento.ubicacion} - {evento.localidad}, {evento.provincia}
              </p>
              <p style={styles.distance}>A 1km de distancia</p>

              <p style={styles.fecha}>{textoTiempo}</p>

              {evento?.tienePreventa && (
                <p style={styles.preventa}>Tiene preventa</p>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default EventoUser;
