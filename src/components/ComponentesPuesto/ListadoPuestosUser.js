import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";
import PuestoUser from "./PuestoUser";
import { useParams } from 'react-router-dom';

const ListadoPuestosUser = () => {
  const { idEvento } = useParams();
  const [rows, setRows] = useState([]);
  const [carritos, setCarritos] = useState([]);
  const [session, setSession] = useState(null);

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
      console.log(idEvento)
      fetch(`http://localhost:8000/puesto/evento/${idEvento}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          setCarritos(data.data);
          console.log(data.data);
          const totalCarritos = Math.ceil(data.data.length / 4) * 4;
          const carritosConNulos = [
            ...data.data,
            ...Array(totalCarritos - data.data.length).fill(null),
          ];

          const generatedRows = [];
          for (let i = 0; i < carritosConNulos.length; i += 4) {
            const row = carritosConNulos.slice(i, i + 4);
            generatedRows.push(row);
          }
          setRows(generatedRows);
        })
        .catch((error) => console.log("No existen carritos."));
    }
  }, [session]);

  return (
    <div className={`mainFormEventos d-flex`}>
      <div>
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className="flex-grow-1 h-100">
        <div className="container pt-2 h-100">
          <div className="d-flex justify-content-center mb-3">
            <h1 className="pt-3" style={{ color: "white" }}>
              Puestos
            </h1>
          </div>
          <hr style={{ color: "white" }} className="me-4" />
          {Array.isArray(carritos) && carritos.length > 0 ? (
            rows.length > 0 &&
            rows.map((row, rowIndex) => (
              <div key={rowIndex} className={`row`}>
                {row.map((carrito, index) => (
                  <div
                    key={index}
                    className={`colmd3 col-md-3 pb-2`}
                  >
                    {carrito !== null ? <PuestoUser carrito={carrito} /> : null}
                  </div>
                ))}
              </div>
            ))
          ) : (
            <h2 className="centeredtext">
              No tenes ningun puesto en este momento.
            </h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListadoPuestosUser;
