import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";

const AdquirirNuevoRolR = () => {
  const navigate = useNavigate();
  const [confirmacionMayorDeEdad, setConfirmacionMayorDeEdad] = useState(false);
  const [session, setSession] = useState(null);
  const [nuevoRol, setNuevorol] = useState(false);

  useEffect(() => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
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
          console.log(data.data);
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  }, [nuevoRol]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (session) {
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}user/update/${session?.id}/to/repartidor`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );
  
        if (response.ok) {
          toast.success("actualizado a repartidor");
          const data = await response.json();
          setNuevorol(true);
          console.log(data);
          navigate(`/login`);
        } else {
          toast.error("error al actualizar a repartidor");
          console.log(response.json());
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("error");
    }
  };

  return (
    <div className={`background d-flex`}>
      <div className="col-2">
        <Sidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className={`form`}>
          <div
            className={`formularioAdquirirNuevoRolEPC card-body px-3`}
          >
            <h1 className="fs-4 card-title fw-bold mb-2 text-dark">
              Adquirir Nuevo Rol - Repartidor
            </h1>
            <hr />
            <form
              onSubmit={handleSubmit}
              className="needs-validation"
              encType="multipart/form-data"
            >
              <div className={`form-check mb-4 ms-4`}>
                <input
                  type="checkbox"
                  className={`form-check-input`}
                  id="confirmacionMayorDeEdad"
                  name="confirmacionMayorDeEdad"
                  checked={confirmacionMayorDeEdad}
                  onChange={() =>
                    setConfirmacionMayorDeEdad(!confirmacionMayorDeEdad)
                  }
                />
                <label
                  className={`form-check-label`}
                  htmlFor="confirmacionMayorDeEdad"
                  style={{ color: "black" }}
                >
                  Confirmo que tengo más de 18 años
                </label>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={!confirmacionMayorDeEdad}
                  data-testid="submit-button"
                >
                  Solicitar Nuevo Rol - Repartidor
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AdquirirNuevoRolR;
