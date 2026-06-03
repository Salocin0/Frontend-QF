import React from "react";

const FiltersPuestosConsumidor = ({ setEstrella, setTiempo }) => {
  const handleEstrellasChange = (value) => {
    setEstrella(value);
  };

  const handleTiempoChange = (value) => {
    setTiempo(value);
  };

  return (
    <div className="qf-filter-panel">
      <h2 className="qf-filter-panel__title">FILTROS</h2>
      <hr className="qf-filter-panel__divider" />
      <h3 className="qf-filter-panel__section-title">Estrellas Minimas</h3>
      <div className="qf-filter-panel__group">
        <label className="qf-filter-panel__label" htmlFor="estrella1">
          <input
            id="estrella1"
            type="radio"
            name="Estrellas"
            value="5"
            className="qf-filter-panel__checkbox"
            onChange={() => handleEstrellasChange("1")}
          />
          1 Estrella
        </label>
        <label className="qf-filter-panel__label" htmlFor="estrella2">
          <input
            id="estrella2"
            type="radio"
            name="Estrellas"
            value="25"
            className="qf-filter-panel__checkbox"
            onChange={() => handleEstrellasChange("2")}
          />
          2 Estrellas
        </label>
        <label className="qf-filter-panel__label" htmlFor="estrella3">
          <input
            id="estrella3"
            type="radio"
            name="Estrellas"
            value="25"
            className="qf-filter-panel__checkbox"
            onChange={() => handleEstrellasChange("3")}
          />
          3 Estrellas
        </label>
        <label className="qf-filter-panel__label" htmlFor="estrella4">
          <input
            id="estrella4"
            type="radio"
            name="Estrellas"
            value="25"
            className="qf-filter-panel__checkbox"
            onChange={() => handleEstrellasChange("4")}
          />
          4 Estrellas
        </label>
        <label className="qf-filter-panel__label" htmlFor="estrella5">
          <input
            id="estrella5"
            type="radio"
            name="Estrellas"
            value="25"
            className="qf-filter-panel__checkbox"
            onChange={() => handleEstrellasChange("5")}
          />
          5 Estrellas
        </label>
      </div>

      <hr className="qf-filter-panel__divider" />

      <h3 className="qf-filter-panel__section-title">Tiempo Entrega</h3>
      <div className="qf-filter-panel__group">
        <label className="qf-filter-panel__label" htmlFor="tiempo1">
          <input
            id="tiempo1"
            type="radio"
            name="Tiempo"
            className="qf-filter-panel__checkbox"
            onChange={() => handleTiempoChange("15")}
          />
          Menos de 15 Min
        </label>
        <label className="qf-filter-panel__label" htmlFor="tiempo2">
          <input
            id="tiempo2"
            type="radio"
            name="Tiempo"
            className="qf-filter-panel__checkbox"
            onChange={() => handleTiempoChange("60")}
          />
          Menos de 1 Hora
        </label>
      </div>
    </div>
  );
};

export default FiltersPuestosConsumidor;
