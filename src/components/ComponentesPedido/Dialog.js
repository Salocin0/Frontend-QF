import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import "./../sass/main.css";

const DialogPregunta = ({
  info,
  funcionAceptar,
  funcionCancelar,
}) => {
  return (
    <dialog
      className="dialog"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        width: "400px",
        borderRadius: "10px",
        transform: "translate(-50%, -50%)",
      }}
    >
      <div>
        <h2 className="mt-2 tituloSeccion tituloSeccionNegativo">{info}</h2>
        <hr style={{ color: "#F7B813" }} />
        <div className="text-center">
          <button
            className="btn btn-success btn-sm m-2 w-50"
            onClick={funcionAceptar}
          >
            Aceptar
          </button>
          <button
            className="btn btn-danger btn-sm m-2 w-50"
            onClick={funcionCancelar}
          >
            Cerrar
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default DialogPregunta;
