import React, { useState, useEffect } from "react";

const FiltersEventosConsumidor = ({
  distancia: externalDistancia,
  setDistancia: externalSetDistancia,
  setPreventa: externalSetPreventa,
}) => {
  // Estado interno para cuando se usa standalone (sin props externas)
  const [internalDistancia, setInternalDistancia] = useState(100);
  const [localPreventa, setLocalPreventa] = useState({
    conPreventa: true,
    sinPreventa: true,
  });

  // Determinar si estamos en modo conectado o standalone
  const hasExternal = typeof externalSetDistancia === "function";
  const distancia = hasExternal ? externalDistancia : internalDistancia;
  const setDistancia = hasExternal ? externalSetDistancia : setInternalDistancia;
  const setPreventa = hasExternal ? externalSetPreventa : setLocalPreventa;

  // Sincronizar preventa local con el padre SOLO en modo conectado
  useEffect(() => {
    if (hasExternal) {
      externalSetPreventa(localPreventa);
    }
  }, [localPreventa, hasExternal, externalSetPreventa]);

  const handleDistanciaChange = (value) => {
    setDistancia(value);
  };

  const handlePreventaChange = (key, value) => {
    setLocalPreventa((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setLocalPreventa({ conPreventa: true, sinPreventa: true });
    setDistancia(100);
  };

  return (
    <div className="qf-filter-panel">
      <h2 className="qf-filter-panel__title">FILTROS</h2>
      <hr className="qf-filter-panel__divider" />

      <h3 className="qf-filter-panel__section-title">DISTANCIA</h3>
      <div className="qf-filter-panel__group">
        <label className="qf-filter-panel__label" htmlFor="menos5">
          <input
            id="menos5"
            type="radio"
            name="distancia"
            value="5"
            className="qf-filter-panel__checkbox"
            checked={distancia === "5"}
            onChange={() => handleDistanciaChange("5")}
          />
          Menos de 5 KM
        </label>
        <label className="qf-filter-panel__label" htmlFor="menos25">
          <input
            id="menos25"
            type="radio"
            name="distancia"
            value="25"
            className="qf-filter-panel__checkbox"
            checked={distancia === "25"}
            onChange={() => handleDistanciaChange("25")}
          />
          Menos de 25 KM
        </label>
        <label className="qf-filter-panel__label" htmlFor="menos100">
          <input
            id="menos100"
            type="radio"
            name="distancia"
            value="100"
            className="qf-filter-panel__checkbox"
            checked={distancia === "100"}
            onChange={() => handleDistanciaChange("100")}
          />
          Menos de 100 KM
        </label>
      </div>

      <hr className="qf-filter-panel__divider" />

      <h3 className="qf-filter-panel__section-title">PREVENTA</h3>
      <div className="qf-filter-panel__group">
        <label className="qf-filter-panel__label" htmlFor="conPreventa">
          <input
            id="conPreventa"
            type="checkbox"
            className="qf-filter-panel__checkbox"
            checked={localPreventa.conPreventa}
            onChange={(e) => handlePreventaChange("conPreventa", e.target.checked)}
          />
          Con Preventa
        </label>
        <label className="qf-filter-panel__label" htmlFor="sinPreventa">
          <input
            id="sinPreventa"
            type="checkbox"
            className="qf-filter-panel__checkbox"
            checked={localPreventa.sinPreventa}
            onChange={(e) => handlePreventaChange("sinPreventa", e.target.checked)}
          />
          Sin Preventa
        </label>
      </div>

      <hr className="qf-filter-panel__divider" />
      <button
        className="qf-filter-panel__clear-btn"
        onClick={handleClearFilters}
      >
        Limpiar filtros
      </button>
    </div>
  );
};

export default FiltersEventosConsumidor;
