import React, { useState, useEffect } from "react";

const BuscadorPuestosConsumidor = ({ setNombre }) => {
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      if (setNombre) {
        setNombre(searchText);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, setNombre]);

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="qf-search-panel">
      <input
        type="text"
        placeholder="Buscar..."
        value={searchText}
        onChange={handleInputChange}
        className="qf-search-panel__input"
      />
    </div>
  );
};

export default BuscadorPuestosConsumidor;
