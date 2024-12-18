import React from "react";
import useDynamicColors from "../../UseDinamicColors";
const UserProfileForm = ({
  user,
  editModeC,
  isDisabledC,
  username,
  handleUsernameChangeC,
  nombreC,
  handleNombreChangeC,
  apellidoC,
  handleApellidoChangeC,
  fechaNacimiento,
  handleFechaNacimientoChangeC,
  dniC,
  handleDniChangeC,
  provinciaC,
  selectedProvince,
  handleProvinceChange,
  localidades,
  localidad,
  handleLocalidadChange,
  telefono,
  handleTelefonoChangeC,
  handleSaveChangesCPrueba,
  handleCancelChangesC,
  handleEditModeToggleC,
  handleSaveChangesC,
  handleEliminarCuenta,
  mostrarBotonHabilitarDeNuevoR,
  handleVolverAHabilitarR,
  mostrarBotonHabilitarDeNuevoEPC,
  handleVolverAHabilitarEPC,
  mostrarBotonHabilitarDeNuevoPE,
  handleVolverAHabilitarPE,
  provincias,
  filteredLocalidades,
}) => {
  const Colors = useDynamicColors();
  const styles = {
    container: {
      padding: "1rem",
      border: `1px solid ${Colors.Blanco}`,
      borderRadius: "10px",
      backgroundColor: Colors.GrisAzuladoClaro,
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "0rem",
    },
    input: {
      width: "100%",
      padding: "0.5rem",
      marginBottom: "1rem",
      border:"none",
      borderRadius: "5px",
      backgroundColor: Colors.GrisAzuladoOscuro,
      color: Colors.Blanco,
    },
    select: {
      width: "100%",
      padding: "0.5rem",
      marginBottom: "1rem",
      border: "none",
      borderRadius: "5px",
      backgroundColor: Colors.GrisAzuladoOscuro,
      color: Colors.Blanco,
    },
    button: {
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "0.5rem",
    },
    dangerButton: { backgroundColor: Colors.Rojo, color: "white" },
    successButton: { backgroundColor: Colors.Verde, color: "white" },
    primaryButton: { backgroundColor: Colors.Azul, color: "white" },
    titulo: {
      fontWeight: "bold",
      color: Colors.Blanco,
      marginBottom: "0",
    },
    label: {
      margin: "0",
      marginBottom: "5px",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <h1 style={styles.titulo}>
          Usuario <p>{user?.tipoUsuario}</p>
        </h1>
        <div>
          {editModeC ? (
            <>
              <button
                type="button"
                style={{ ...styles.button, ...styles.successButton }}
                onClick={handleSaveChangesCPrueba}
              >
                Guardar
              </button>
              <button
                type="button"
                style={{ ...styles.button, ...styles.dangerButton }}
                onClick={handleCancelChangesC}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={handleEditModeToggleC}
            >
              Editar
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSaveChangesC}>
        <label style={styles.label} htmlFor="nombreUsuario">
          Nombre de Usuario
        </label>
        <input
          id="nombreUsuario"
          type="text"
          style={styles.input}
          value={username}
          onChange={handleUsernameChangeC}
          readOnly={!editModeC}
          disabled={isDisabledC}
          required
        />

        <label style={styles.label} htmlFor="Nombre">
          Nombre
        </label>
        <input
          type="text"
          id="Nombre"
          style={styles.input}
          value={nombreC}
          onChange={handleNombreChangeC}
          readOnly={!editModeC}
          disabled={isDisabledC}
          required
        />
        <label style={styles.label} htmlFor="Apellido">
        Apellido
        </label>
        <input
          type="text"
          id="Apellido"
          style={styles.input}
          value={apellidoC}
          onChange={handleApellidoChangeC}
          readOnly={!editModeC}
          disabled={isDisabledC}
          required
        />
        <label style={styles.label} htmlFor="FechaNacimiento">
        Fecha de Nacimiento
        </label>
        <input
          type="text"
          id="FechaNacimiento"
          style={styles.input}
          value={fechaNacimiento}
          onChange={handleFechaNacimientoChangeC}
          readOnly={!editModeC}
          disabled={isDisabledC}
          required
        />
        <label style={styles.label} htmlFor="DNI">
        DNI
        </label>
        <input
          type="text"
          id="DNI"
          style={styles.input}
          value={dniC}
          onChange={handleDniChangeC}
          readOnly={!editModeC}
          disabled={isDisabledC}
          required
        />
        <label style={styles.label} htmlFor="Provincia">
        Provincia
        </label>
        <select
          style={styles.select}
          id="Provincia"
          value={selectedProvince}
          onChange={handleProvinceChange}
          readOnly={!editModeC}
          disabled={isDisabledC}
          required
        >
          <option value="" disabled>
            {provinciaC}
          </option>
          {provincias.map((prov) => (
            <option key={prov.id} value={prov.id}>
              {prov.nombre}
            </option>
          ))}
        </select>
        <label style={styles.label} htmlFor="Localidad">
        Localidad
        </label>
        <select
          style={styles.select}
          id="Localidad"
          value={localidad}
          onChange={handleLocalidadChange}
          readOnly={!editModeC}
          disabled={isDisabledC}
          required
        >
          <option value={localidad} disabled>
            {localidad}
          </option>
          {filteredLocalidades.map((loc) => (
            <option key={loc.nombre} value={loc.nombre}>
              {loc.nombre}
            </option>
          ))}
        </select>
        <label style={styles.label} htmlFor="Telefono">
        Telefono
        </label>
        <input
          type="text"
          id="Teléfono"
          style={styles.input}
          value={telefono}
          onChange={handleTelefonoChangeC}
          readOnly={!editModeC}
          disabled={isDisabledC}
          required
        />
      </form>

      <button
        type="button"
        style={{ ...styles.button, ...styles.dangerButton, width: "100%" }}
        onClick={handleEliminarCuenta}
      >
        Eliminar mi cuenta
      </button>

      {mostrarBotonHabilitarDeNuevoR && (
        <button
          type="button"
          style={{ ...styles.button, ...styles.successButton, width: "100%" }}
          onClick={handleVolverAHabilitarR}
        >
          Volver a habilitarme como 'Repartidor'
        </button>
      )}

      {mostrarBotonHabilitarDeNuevoEPC && (
        <button
          type="button"
          style={{ ...styles.button, ...styles.successButton, width: "100%" }}
          onClick={handleVolverAHabilitarEPC}
        >
          Volver a habilitarme como 'Encargado de Puesto'
        </button>
      )}

      {mostrarBotonHabilitarDeNuevoPE && (
        <button
          type="button"
          style={{ ...styles.button, ...styles.successButton, width: "100%" }}
          onClick={handleVolverAHabilitarPE}
        >
          Volver a habilitarme como 'Productor de Evento'
        </button>
      )}
    </div>
  );
};

export default UserProfileForm;
