import React from "react";
import TablaPuestos from "./TablaPuestos"; // Asegúrate de ajustar la ruta del import
import GraficaTorta from "../GraficaTorta";

const TopPuestos = ({eventoId}) => {
  console.log("eventoid",eventoId)
  return (
    <div className="text-center p-3">
      <TablaPuestos id={eventoId} />
      <GraficaTorta id={eventoId}/>
      
    </div>
  );
};

export default TopPuestos;
