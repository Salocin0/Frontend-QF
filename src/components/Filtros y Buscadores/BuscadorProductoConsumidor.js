import React, { useState } from "react";

const BuscadorProductoConsumidor = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchText);
    }
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
      <button className="qf-search-panel__button" onClick={handleSearch}>
        Buscar
      </button>
    </div>
  );
};

export default BuscadorProductoConsumidor;
