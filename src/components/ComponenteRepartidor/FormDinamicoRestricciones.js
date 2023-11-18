import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.css";
import "./asociarAEventos.css";

function FormDinamicoRestricciones({ data, userType }) {
  const navigate = useNavigate();
  const [formResponses, setFormResponses] = useState({});
  const [session, setSession] = useState(null);
  const { id } = useParams();
  const [filteredData, setFilteredData] = useState([]);

  const [nuevoRol, setNuevorol] = useState(false);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
      fetch("http://localhost:8000/user/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionID: sessionId }),
      })
        .then((response) => response.json())
        .then((data) => {
          setSession(data.data);
          console.log(data.data);
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  }, [nuevoRol]);

  const handleChange = (fieldName, value) => {
    setFormResponses({
      ...formResponses,
      [fieldName]: value,
    });
  };

  const handleSubmit = () => {
    const headers = new Headers();
    headers.append("ConsumidorId", session?.consumidorId);
    headers.append("Content-Type", "application/json");

    const restricciones = {};
    console.log(filteredData);
    Object.keys(formResponses).forEach((fieldName, index) => {
      const respuesta = formResponses[fieldName];
      const restriccion = {};
      restriccion[`restriccion${index + 1}`] = {
        respuesta: respuesta,
        RestriccionId: filteredData[index].id,
      };
      Object.assign(restricciones, restriccion);
    });

    if (Object.keys(formResponses).length < filteredData.length) {
      toast.error("Complete todos los campos");
      console.log(formResponses);
    } else {
      fetch(`http://localhost:8000/asociacion/evento/${id}/asociar/0/${session.consumidorId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({restricciones}),
      })
        .then((response) => response.json())
        .then((data) => {
          toast.success("Asocioacion registrada correctamente")
          navigate("/asociarRepartidorAEvento")
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  };

  useEffect(() => {
    const headers = new Headers();
    headers.append("ConsumidorId", session?.consumidorId);
    headers.append("Content-Type", "application/json");

    fetch(`http://localhost:8000/restriccion/evento/${id}`, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setFilteredData(data.data);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al crear el formulario");
      });
  }, [session]);

  return (
    <div className={`row m-0 mainFormRestricciones`}>
      <div className="col-2 p-0">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className={`col-10 contenedorCard`}>
        <div className="cardFormDin col-8">
          {filteredData.map((item, index) => (
            <div key={index} className="fila">
              <div className="tituloRestriccion">
                <h3>{item.titulo}</h3>
              </div>
              <div className="input">
                {item.tipo === "Imagen" && (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleChange(item.titulo, e.target.value)}
                  />
                )}
                {item.tipo === "select" && (
                  <select
                    onChange={(e) => handleChange(item.titulo, e.target.value)}
                  >
                    <option value="">Selecciona una opción</option>
                    {item.opciones.map((opcion, i) => (
                      <option key={i} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                )}
                {item.tipo === "Cadena de texto" && (
                  <input
                    type="text"
                    onChange={(e) => handleChange(item.titulo, e.target.value)}
                  />
                )}
              </div>
            </div>
          ))}
          <div className="text-end">
            <Link to="/asociarRepartidorAEvento" className="btn btn-info mx-2">
              Volver
            </Link>
            <button onClick={handleSubmit} className="btn btn-success">
              Asociar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormDinamicoRestricciones;
