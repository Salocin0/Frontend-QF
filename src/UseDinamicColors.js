import { useEffect, useState } from "react";

const useDynamicColors = () => {
  const [modoOscuroActivo, setModoOscuroActivo] = useState(false);

  useEffect(() => {
    const modoOscuro = localStorage.getItem("modoOscuroActivo") === "true";
    setModoOscuroActivo(modoOscuro);
  }, [modoOscuroActivo]); // Escucha los cambios en el modo oscuro

  const Colors = {
    modoOscuroActivo,
    Naranja: "#c5a145",
    Rojo: "#ff5733",
    GrisClaro: modoOscuroActivo ? "#2F2F2F" : "#101010",
    GrisOscuro: modoOscuroActivo ? "#A4A8AA" : "#101010",
    GrisAzulado: modoOscuroActivo ? "#0D1E32" : "#101010",
    GrisAzuladoOscuro: modoOscuroActivo ? "#e5e5e5" : "#1a1a1a",
    GrisAzuladoClaro: modoOscuroActivo ? "#efefef" : "#2b2b2b",
    BlancoEnBlanco: "#ffffff",
    Blanco: modoOscuroActivo ? "#000000" : "#ffffff",
    Negro: modoOscuroActivo ? "#ffffff" : "#ffffff",
    Gris: modoOscuroActivo ? "#616161" : "#ffffff",
    GrisClaroPeroNoTanClaro: modoOscuroActivo ? "#333333" : "#212121",
    Azul: modoOscuroActivo ? "#0085fa" : "#028AFF",
    Rosa: modoOscuroActivo ? "#BE185D" : `#EC4899`,
    Purpura: modoOscuroActivo ? "#7E22CE" : `#A855F7`,
    NaranjaDetalle: modoOscuroActivo ? "#ff6d05" : "#ffd600",
    NaranjaOscuro: modoOscuroActivo ? "#af6e0e" : "#ffd600",
    Verde: modoOscuroActivo ? "#45a145" : "#4caf50",
    Info: modoOscuroActivo ? "#45d0e8" : "#17a2b8",
  };

  return Colors;
};

export default useDynamicColors;
