import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import Sidebar from "../ComponentesGenerales/Sidebar";
import "./../sass/main.scss";
import { useNavigate } from "react-router-dom";

const AdquirirNuevoRolEPC = () => {
  const [cuit, setCuit] = useState("");
  const [razonSocial, setRazonSocial] = useState("");
  const [condicionIva, setCondicionIva] = useState("");
  const [nuevoRol, setNuevorol] = useState(false);
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

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

  const handleCuitChange = (e) => {
    setCuit(e.target.value);
  };

  const handleRazonSocialChange = (e) => {
    setRazonSocial(e.target.value);
  };

  const handleCondicionIvaChange = (e) => {
    setCondicionIva(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const encargado = {
          cuit: cuit,
          razonSocial: razonSocial,
          condicionIva: condicionIva
      };
      const response = await fetch(`http://localhost:8000/user/update/${session.id}/to/encargado`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(encargado),
      });

      if (response.ok) {
        toast.success("actualizado a Encargado de puesto")
        const data = await response.json();
        console.log(data);
        setNuevorol(true)
        navigate(`/login`);
      } else {
        toast.error("error al actualizar a Encargado de puesto")
        console.log(response.json());
      }

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className={`background d-flex`}>
        <div className="col-2">
          <Sidebar tipoUsuario={session?.tipoUsuario} />
        </div>
        <div className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className={`form card shadow-lg`}>
            <div
              className={`formularioAdquirirNuevoRolEPC card-body px-3`}
            >
              <h1 className="fs-4 card-title fw-bold mb-2 text-dark">
                Adquirir Nuevo Rol - Encargado de Puesto de Comida
              </h1>
              <hr />
              <form
                onSubmit={handleSubmit}
                className="needs-validation"
                encType="multipart/form-data"
              >
                
                <div className="mb-2">
                  <label className="mb-2 text-dark" htmlFor="cuit">
                    CUIT
                  </label>
                  <input
                    type="text"
                    id="cuit"
                    className="form-control"
                    value={cuit}
                    onChange={handleCuitChange}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="mb-2 text-dark" htmlFor="razonSocial">
                    Razón Social
                  </label>
                  <input
                    type="text"
                    id="razonSocial"
                    className="form-control"
                    value={razonSocial}
                    onChange={handleRazonSocialChange}
                    required
                  />
                </div>

                <div className={`form-group`}>
                  <label htmlFor="ivaCondicion" style={{ color: "black" }}>
                    Condición frente al IVA
                  </label>
                  <select className={`form-control`} name="ivaCondicion" onChange={handleCondicionIvaChange} value={condicionIva}>
                    <option value="">Seleccionar</option> 
                    <option value="responsable_inscripto">Responsable Inscripto</option>
                    <option value="monotributista">Monotributista</option>
                  </select>
                </div>
                <div className="pb-3" />
                <div className="d-grid">
                  <button type="submit" className="btn btn-success">
                    Solicitar Nuevo Rol - Encargado Puesto de Comida
                  </button>
                </div>
              </form>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default AdquirirNuevoRolEPC;
