import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";
import Evento from "./Evento.js";

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
    <div>
      <div className={`row m-0 background`}>
        <div className="col-2 p-0">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className={`col-10`}>
          <div className="d-flex justify-content-center mb-3">
            <h1 className="pt-3" style={{ color: "white" }}>
              Eventos
            </h1>
          </div>
          <hr style={{ color: "white" }} className="me-4" />
          <div className="d-flex justify-content-end col-11">
            <Link
              to={`/registrar-evento`}
              className={`btn btn-success btn-lg btnfloating`}
            >
              <i className="bi bi-plus-lg"></i> Agregar Evento
            </Link>
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <div className="pt-3 pb-4 h-100 w-100">
              {Array.isArray(eventos) && eventos.length > 0 ? (
                rows.length > 0 &&
                rows.map((row, rowIndex) => (
                  <div key={rowIndex} className={`row`}>
                    {row.map((evento, index) => (
                      <div
                        key={index}
                        className={`colmd3 pb-4`}
                      >
                        {evento !== null ? (
                          <Evento
                            evento={evento}
                            session={session}
                            recargar={recargarComponente}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <h2 className="centeredtext">
                  No tenes ningun producto asociado a este carrito.
                </h2>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ListadoEventos;
