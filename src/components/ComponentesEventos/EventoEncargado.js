import { default as React, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useDynamicColors from "../../UseDinamicColors";
import { UserContext } from "../ComponentesGenerales/UserContext";
import imgDefault from "../img/logoevento.webp";

const EventoEncargado = ({ evento, puestoId, recargar }) => {
  const Colors = useDynamicColors();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [isEnPreparacion, setIsEnPreparacion] = useState(false);
  const [tieneAsociacionPendiente, setTieneAsociacionPendiente] =
    useState(false);

  useEffect(() => {
    if (evento) {
      switch (evento.estado) {
        case "EnPreparacion":
          setIsEnPreparacion(true);
          break;
        default:
          break;
      }
    }
  }, [evento]);

  const asociarmeAEvento = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", user?.consumidorId);
    headers.append("Content-Type", "application/json");

    console.log(evento.id);
    console.log(puestoId);

    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/evento/${evento.id}/asociarSimple/${puestoId}/0`,
      {
        method: "POST",
        headers: headers,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("Asociacion Guardada");
          recargar();
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al asociar");
      });
  };

  const handleTieneRestriciones = async () => {
    try {
      const headers = new Headers();
      headers.append("ConsumidorId", user?.consumidorId);
      headers.append("Content-Type", "application/json");

      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}restriccion/evento/${evento.id}`,
        {
          method: "GET",
          headers: headers,
        }
      );
      if (response.status === 404) {
        asociarmeAEvento(evento.id);
      } else if (response.status === 200) {
        const responseData = await response.json();
        handleCrearForm();
      } else {
        console.error(`Error: ${response.status}`);
        toast.error("Error al comunicarse con el servidor");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al crear el formulario");
    }
  };

  const handleCrearForm = () => {
    console.log("Entre a CrearForm");
    console.log(evento.id);
    const url = `/restriccionesEvento/${evento.id}`;
    navigate(url);
  };

  useEffect(() => {
    const handleTieneAsociacionPendiente = async () => {
      try {
        const headers = new Headers();
        headers.append("ConsumidorId", user?.consumidorId);
        headers.append("Content-Type", "application/json");
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}asociacion/evento/${evento.id}/asociarSimple/${puestoId}/0`,
          {
            method: "GET",
            headers: headers,
          }
        );
        console.log(response.status);
        if (response.status === 400) {
          setTieneAsociacionPendiente(true);
        } else if (response.status === 200) {
          console.log("Sin asociaciones");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al verificar la asociación");
      }
    };

    if (isEnPreparacion) {
      handleTieneAsociacionPendiente();
    }
  }, [evento, puestoId, user, isEnPreparacion]);

  const styles = {
    container: {
      padding: "0",
      margin: "0",
      backgroundColor: Colors.GrisAzuladoClaro,
      borderRadius: "10px",
      border: `1px solid ${Colors.Naranja}`,
    },
    card: { marginBottom: "20px", position: "relative" }, // Aseguramos que la tarjeta tenga posición relativa
    cardBody: { padding: "15px" },
    row: {
      display: "flex",
      flexWrap: "wrap",
      width: "100%",
      flexDirection: "row",
    },
    colMd3: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "20%",
    },
    colMd8: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      width: "80%",
    },
    imgFluid: { maxWidth: "80%", borderRadius: "10px" },
    cardTitle: { fontSize: "2rem", fontWeight: "bold", color: Colors.Naranja },
    cardDescripcion: { fontSize: "1.5rem", color: Colors.BlancoEnBlanco },
    cardText: {
      fontSize: "1.5rem",
      marginBottom: "1rem",
      color: Colors.BlancoEnBlanco,
    },
    cardEstado: {
      fontSize: "18px",
      color: Colors.BlancoEnBlanco,
      fontWeight: "bold",
      backgroundColor: Colors.Verde,
      padding: "5px",
      borderRadius: "5px",
      position: "absolute", // Cambiar a absolute
      top: "30px", // Posiciona en la parte superior
      right: "30px", // Posiciona en la esquina derecha
    },
    mt2: { marginTop: "10px" },
    dFlex: { display: "flex" },
    justifyCenter: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    btnSuccess: {
      backgroundColor: Colors.Verde,
      color: Colors.BlancoEnBlanco,
      padding: "10px 15px",
      borderRadius: "10px",
      marginTop: "10px",
      fontWeight: "bold",
    },
    cardTextYellow: {
      color: Colors.Naranja,
      fontWeight: "bold",
      fontSize: "1.5rem",
      display: "flex",
      justifyContent: "center",
      width: "100%",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardBody}>
          <div style={styles.row}>
            <div style={styles.colMd3}>
              <img
                src={evento.img || imgDefault}
                alt="Logo del Evento"
                style={styles.imgFluid}
              />
            </div>
            <div style={styles.colMd8}>
              <h5 style={styles.cardTitle}>{evento.nombre}</h5>
              <p style={styles.cardDescripcion}>{evento.descripcion}</p>
              <p style={styles.cardText}>
                {evento.ubicacion} - {evento.localidad}, {evento.provincia}
              </p>
              <p style={styles.cardEstado}>{evento.estado}</p>
            </div>
          </div>
          <div style={styles.dFlex}>
            <div style={styles.justifyCenter}>
              {!tieneAsociacionPendiente && isEnPreparacion && (
                <div style={{ width: "100%" }}>
                  <hr style={{ color: Colors.Naranja }} />
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button
                      style={styles.btnSuccess}
                      onClick={handleTieneRestriciones}
                    >
                      Asociarme a Evento
                    </button>
                  </div>
                </div>
              )}
              {tieneAsociacionPendiente && (
                <div style={styles.justifyCenter}>
                  <hr style={{ color: Colors.Naranja }} />
                  <p style={styles.cardTextYellow}>
                    Tiene una asociación pendiente
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventoEncargado;
