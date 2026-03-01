import React, { useState, useEffect } from "react";
import useDynamicColors from "../../UseDinamicColors";

const Buscador = ({ 
  placeholder = "Buscar...", 
  onBuscar, 
  botonBuscar = true,
  delay = 300 
}) => {
  const Colors = useDynamicColors();
  const [searchText, setSearchText] = useState("");

  // Estilos consistentes con BuscadorEventosConsumidor
  const styles = {
    container: {
      display: "flex",
      width: "100%",
      gap: "10px",
      padding: "10px",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      flexDirection: "row",
      backgroundColor: Colors.GrisAzuladoClaro,
      alignItems: "center",
      border: `1px solid ${Colors.Naranja}`,
    },
    input: {
      flex: 1,
      padding: "10px",
      border: `1px solid ${Colors.Gris}`,
      borderRadius: "4px",
      fontSize: "16px",
      outline: "none",
    },
    button: {
      padding: "10px 15px",
      backgroundColor: Colors.Verde,
      color: Colors.Blanco,
      fontWeight: "bold",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      transition: "background-color 0.3s",
      width: botonBuscar ? "100%" : "auto",
    },
  };

  // Efecto para búsqueda con debounce
  useEffect(() => {
    if (!botonBuscar) {
      const timer = setTimeout(() => {
        onBuscar(searchText);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [searchText, delay, botonBuscar, onBuscar]);

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearch = () => {
    onBuscar(searchText);
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchText}
        onChange={handleInputChange}
        style={styles.input}
        onKeyPress={(e) => !botonBuscar && e.key === 'Enter' && handleSearch()}
      />
      {botonBuscar && (
        <button style={styles.button} onClick={handleSearch}>
          Buscar
        </button>
      )}
    </div>
  );
};

export default Buscador;