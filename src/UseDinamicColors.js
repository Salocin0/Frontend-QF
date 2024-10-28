import { useEffect, useState } from "react";

const useDynamicColors = () => {
  const [modoOscuroActivo, setModoOscuroActivo] = useState(false);

  useEffect(() => {
    const modoOscuro = localStorage.getItem("modoOscuroActivo") === "true";
    setModoOscuroActivo(modoOscuro);
  }, [modoOscuroActivo]); // Escucha los cambios en el modo oscuro

  const Colors = {
    modoOscuroActivo,
    Naranja: "#FAB607",
    Rojo: "#E24E2A",
    GrisClaro: modoOscuroActivo ? "#2F2F2F" : "#F7F7FF",
    GrisOscuro: modoOscuroActivo ? "#A4A8AA" : "#2F2F2F",
    BlancoEnBlanco: "#ffffff",
    Blanco: modoOscuroActivo ? "#000000" : "#ffffff",
    Negro: modoOscuroActivo ? "#ffffff" : "#000000",
    Gris: modoOscuroActivo ? "#616161" : "#9d9d9d",
    GrisClaroPeroNoTanClaro: modoOscuroActivo ? "#333333" : "#cccccc",
    Azul: modoOscuroActivo ? "#0085fa" : "#028AFF",
    Rosa: modoOscuroActivo ? "#BE185D" : `#EC4899`,
    Purpura: modoOscuroActivo ? "#7E22CE" : `#A855F7`,
    NaranjaDetalle: modoOscuroActivo ? "#ff6d05" : "#F76500",
    NaranjaOscuro: modoOscuroActivo ? "#af6e0e" : "#f0ad4e",
    Verde: modoOscuroActivo ? "#45a145" : "#5cb85c",
    Info: modoOscuroActivo ? "#45d0e8" : "#17a2b8",
  };

  return Colors;
};

export default useDynamicColors;
