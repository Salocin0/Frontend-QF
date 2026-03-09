import { default as React, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";
import imgDefault from "../img/logoevento.webp";

const EventoRepartidor = ({ evento, recargar }) => {
  const navigate = useNavigate();
  const Colors = useDynamicColors();
  const [isEnPreparacion,] = useState(
    evento.estado === "EnPreparacion"
  );
  const [tieneAsociacionPendiente, setTieneAsociacionPendiente] =
    useState(false);
  const { user } = useContext(UserContext);

  const styles = {
    containerFluid: {
      width: "Calc(100% - 40px)",
      margin: "0 20px",
    },
    hr:{
      color : Colors.Naranja
    },
    datos:{
      width: "90%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    },
    card: {
      border: `1px solid ${Colors.Naranja}`,
      borderRadius: "10px",
      padding: "15px",
      marginBottom: "15px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      backgroundColor: Colors.GrisAzuladoClaro,
      position: "relative",
    },
    cardBody: {
      padding: "15px",
    },
    row: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginRight: "15%",
    },
    img: {
      maxWidth: "100%",
      height: "200px",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      objectFit: "cover",
      marginLeft: "3%",
    },
    cardTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: Colors.Naranja
    },
    cardDescripcion: {
      fontSize: "1rem",
      color: Colors.Negro,
      marginBottom: "10px",
    },
    cardText: {
      fontSize: "0.9rem",
      color: Colors.Negro,
    },
    cardEstado: {
      fontSize: "1rem",
      fontWeight: "bold",
      color:  Colors.Negro,
      position: "absolute",
      top: "30px",
      right: "30px",
      backgroundColor: Colors.Verde,
      padding: "5px 10px",
      borderRadius: "10px",
    },
    cardTextFecha: {
      fontSize: "0.8rem",
      color: Colors.Negro,
    },
    mt2: {
      marginTop: "10px",
    },
    btnSuccess: {
      backgroundColor: Colors.Verde,
      color: Colors.Blanco,
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    cardTextYellow: {
      fontSize: "0.9rem",
      color: Colors.Naranja,
      fontWeight: "bold",
    },
  };

  const asociarmeAEvento = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", user?.consumidorId);
    headers.append("Content-Type", "application/json");

    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/evento/${evento.id}/asociarSimple/0/${user.consumidorId}`,
      {
        method: "POST",
        headers: headers,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("Asociacion Guardada");
          window.location.reload();
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
        //const responseData = await response.json();
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
          `${process.env?.REACT_APP_BACK_URL}asociacion/evento/${evento.id}/asociarRepartidor/${user.consumidorId}`,
          {
            method: "GET",
            headers: headers,
          }
        );
        if (response.status === 400) {
          setTieneAsociacionPendiente(true);
        } else if (response.status === 200) {
          setTieneAsociacionPendiente(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (isEnPreparacion) {
      handleTieneAsociacionPendiente();
    }
  }, [evento, user, isEnPreparacion]);

  return (
    <div style={styles.containerFluid}>
      <div style={styles.card}>
        <div style={styles.cardBody}>
          <div style={styles.row}>
            <img
              src={
                evento?.img && !String(evento.img).includes("vendimia.mendoza.gov.ar")
                  ? evento.img
                  : imgDefault
              }
              alt="Logo del Evento"
              style={styles.img}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = imgDefault;
              }}
            />
            <div style={styles.datos}>
              <h5 style={styles.cardTitle}>{evento.nombre}</h5>
              <p style={styles.cardDescripcion}>{evento.descripcion}</p>
              <p style={styles.cardText}>
                {evento.ubicacion} - {evento.localidad}, {evento.provincia}
              </p>
              <p style={styles.cardEstado}>{evento.estado==="EnPreparacion"? "En Preparación" : evento.estado}</p>
            </div>
          </div>
          <hr style={styles.hr}/>
          <div style={styles.mt2}>
            <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
              {!tieneAsociacionPendiente && isEnPreparacion && (
                <button
                  style={styles.btnSuccess}
                  onClick={handleTieneRestriciones}
                >
                  Asociarme a Evento
                </button>
              )}
              {tieneAsociacionPendiente && (
                <p style={styles.cardTextYellow}>
                  Tiene una asociación pendiente
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventoRepartidor;
