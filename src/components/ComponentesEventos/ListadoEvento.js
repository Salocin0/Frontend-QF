import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "../ComponentesConsumidor/ConsultarUsuario.module.css";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import stylepuesto from "./eventos.module.css";
import villamaria from "./img/villa maria.png";
import cosquin from "./img/cosquin.png";
import { toast } from "react-toastify";

const ListadoEventos = () => {
  const [rows, setRows] = useState([]);
  const [session, setSession] = useState(null);
  const [eventos, setEventos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [editProductId, setEditProductId] = useState(null);
  const [editedValues, setEditedValues] = useState({
    nombre: "",
    descripcion: "",
    tipoEvento: "",
    tipoPago: "",
    fechaInicio: Date.now(),
    horaInicio: Date.now(),
    fechaFin: Date.now(),
    cantidadPuestos: 0,
    cantidadRepartidores: 0,
    capacidadMaxima: 0,
    conButaca: false,
    conRepartidor: false,
    conPreventa: false,
    tipoPreventa: 0,
    fechaInicioPreventa: Date.now(),
    fechaFinPreventa: Date.now(),
    plazoCancelacionPreventa: 0,
    linkVentaEntradas: "",
    ubicacion: "",
    consumidorId: 0,
  });

  const recargarComponente = () => {
    setRecargar(+1);
  };

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (!sessionId) {
      console.error("No session ID found.");
      return;
    }

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
        console.log(data.data.tipoUsuario);
      })
      .catch((error) => console.error("Error fetching session:", error));
  }, []);

  useEffect(() => {
    if (session) {
      const headers = new Headers();
      headers.append("ConsumidorId", session.consumidorId);

      fetch("http://localhost:8000/evento", {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setEventos(data.data);
          const totalEventos = Math.ceil(data.data.length / 4) * 4;
          const eventosConNulos = [
            ...data.data,
            ...Array(totalEventos - data.data.length).fill(null),
          ];

          const generatedRows = [];
          for (let i = 0; i < eventosConNulos.length; i += 4) {
            const row = eventosConNulos.slice(i, i + 4);
            generatedRows.push(row);
          }
          setRows(generatedRows);
        })
        .catch((error) => console.log("No existen carritos.", error));
    }
  }, [session, recargar]);

  const onDelete = (eventoId) => {
    fetch(`http://localhost:8000/evento/${eventoId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        toast.success("Producto eliminado con éxito");

        setRecargar(+1);
      })
      .catch((error) => toast.error("Error al eliminar el producto"));
  };

  const onEdit = (eventoid) => {
    setEditProductId(eventoid);

    const eventoToEdit = eventos.find((evento) => evento.id === eventoid);
    if (eventoToEdit) {
      setEditedValues({
        nombre: eventoToEdit.nombre,
        descripcion: eventoToEdit.descripcion,
        tipoEvento: eventoToEdit.tipoEvento,
        tipoPago: eventoToEdit.tipoPago,
        fechaInicio: eventoToEdit.fechaInicio,
        horaInicio: eventoToEdit.horaInicio,
        fechaFin: eventoToEdit.fechaFin,
        cantidadPuestos: eventoToEdit.cantidadPuestos,
        cantidadRepartidores: eventoToEdit.cantidadRepartidores,
        capacidadMaxima: eventoToEdit.capacidadMaxima,
        conButaca: eventoToEdit.conButaca,
        conRepartidor: eventoToEdit.conRepartidor,
        conPreventa: eventoToEdit.conPreventa,
        tipoPreventa: eventoToEdit.tipoPreventa,
        fechaInicioPreventa: eventoToEdit.fechaInicioPreventa,
        fechaFinPreventa: eventoToEdit.fechaFinPreventa,
        plazoCancelacionPreventa: eventoToEdit.plazoCancelacionPreventa,
        linkVentaEntradas: eventoToEdit.linkVentaEntradas,
        ubicacion: eventoToEdit.ubicacion,
        consumidorId: eventoToEdit.consumidorId,
      });
    }
  };

  return (
    <div className={`${style.background} d-flex`}>
      <div className="col-2">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className="flex-grow-1 pb-5">
        <div className="container pt-2 h-100">
          <div className="d-flex justify-content-center mb-3">
            <h1 className="pt-3" style={{ color: "white" }}>
              Eventos
            </h1>
          </div>
          <hr style={{ color: "white" }} className="me-4" />
          {Array.isArray(eventos) && eventos.length > 0 ? (
            rows.length > 0 &&
            rows.map((row, rowIndex) => (
              <div key={rowIndex} className={`row ${stylepuesto.row}`}>
                {row.map((evento, index) => (
                  <div
                    key={index}
                    className={`${stylepuesto.colmd3} col-md-3 pb-2`}
                  >
                    {evento !== null ? (
                      <Link
                        to={`/listado-puestos/${evento?.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <div className={stylepuesto.cardlink}>
                          <div className="card shadow-sm">
                            <img
                              src={`${evento?.img}`}
                              className={`${stylepuesto.cardimgtop} img-fluid`}
                              alt="Thumbnail"
                              style={{ height: "300px" }}
                            />
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center">
                                <h4 className={`card-text`}>{evento.nombre}</h4>
                              </div>
                              <div>
                                <h5
                                  className={`card-text`}
                                  style={{ fontWeight: "normal" }}
                                >
                                  {evento.categoria}
                                </h5>
                              </div>
                              <div>
                                <h6
                                  className={`card-text`}
                                  style={{ fontWeight: "normal" }}
                                >
                                  {evento.ciudad} - {evento.fecha}
                                </h6>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : null}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <h2 className={stylepuesto.centeredtext}>
              No existen eventos en este momento.
            </h2>
          )}
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ListadoEventos;
