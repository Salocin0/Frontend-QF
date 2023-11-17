import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";

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
    <div className="contenedor-principal">
      <div className="sidebar">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className="contenedor-grid">
        <div className="tituloSeccion">
          <h2>Eventos</h2>
        </div>
        <div className="descripcion">
          <p>
            Con Quickfood, crea tu evento para hacerlo mejor. Descubre nuestras
            increíbles características y ofrece una experiencia única a tus
            consumidores.
          </p>
        </div>
        <Link to={`/registrar-evento`} className="LinkAgregarEvento">
          Crear Evento
        </Link>
      </div>
    </div>
  );




};

export default ListadoEventos;
