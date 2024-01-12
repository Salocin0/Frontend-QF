import { format } from "date-fns";
import { default as React, useEffect, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./../sass/main.scss";
import imgdefault from "./img/villa maria.png";
//TODO MODIFICACIONES PARA QUE ANDE, ESTA HARDCODEADO EN LISTADOEVENTOS
const Evento = ({ evento,recargar }) => {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.error("No session ID found.");
      return;
    }

    fetch(`${process.env?.REACT_APP_BACK_URL}user/session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sessionID: sessionId }),
    })
      .then((response) => response.json())
      .then((data) => {
        setSession(data.data);
        console.log(data.data.tipoUsuario);
      })
      .catch((error) => console.error("Error fetching session:", error));
  }, []);

  const handleConfirm = () => {
    fetch(`${process.env?.REACT_APP_BACK_URL}evento/cambiarEstado/${evento.id}/confirmar`, {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Evento confirmado con éxito");
        recargar();
      })
      .catch((error) => toast.error("Error al confirmar evento"));
  };

  const handleDelete = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session.consumidorId);

    fetch(`${process.env?.REACT_APP_BACK_URL}evento/${evento.id}}`, {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => {
        if (response.ok) {
          toast.success("Evento deshabilitado correctamente");
          navigate(`/listado-eventos`);
          recargar();
        } else {
          response.json().then((errorData) => {
            const errorMessage = errorData.message || "Ha ocurrido un error";
            toast.error(errorMessage);
          });
        }
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div className="cardlink">
      <div className="card shadow-sm">
        <img
          src={`${evento?.img || imgdefault}`}
          className="cardimgtop"
          alt="Thumbnail"
        />
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div className="row">
              <div>
                <h5 className={`card-text`} title={evento.nombre}>
                  {evento.nombre}
                </h5>
              </div>
              
              <div>
                <h6 className={`card-text`}>{`${evento.localidad} - ${evento.provincia}`}</h6>
              </div>
              <div>
                <h6 className={`card-text`}>{format(new Date(evento.fechaInicio), "dd/MM/yyyy")}</h6>
              </div>
            </div>

            <Dropdown>
              <Dropdown.Toggle variant="danger"></Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item as={Link} to={`/evento/${evento.id}`}>
                  Modificar Datos Evento
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleDelete}>
                  Deshabilitar Evento
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleConfirm}>
                  Confirmar Evento
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Evento;
