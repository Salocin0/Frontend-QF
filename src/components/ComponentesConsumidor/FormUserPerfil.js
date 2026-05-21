import React from "react";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const UserProfileForm = ({
  mostrarBotonHabilitarDeNuevoR,
  handleVolverAHabilitarR,
  mostrarBotonHabilitarDeNuevoEPC,
  handleVolverAHabilitarEPC,
  mostrarBotonHabilitarDeNuevoPE,
  handleVolverAHabilitarPE,
}) => {
  const [username, setUsername] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [dni, setDNI] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [, setLocalidadPrueba] = useState("");
  const [filteredLocalidades, setFilteredLocalidades] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const styles = {
    container: {
      padding: "1rem",
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "10px",
      backgroundColor: "var(--qf-bg-secondary)",
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
      border: "none",
      borderRadius: "5px",
      backgroundColor: "var(--qf-bg-main)",
      color: "var(--qf-text-primary)",
    },
    select: {
      width: "100%",
      padding: "0.5rem",
      marginBottom: "1rem",
      border: "none",
      borderRadius: "5px",
      backgroundColor: "var(--qf-bg-main)",
      color: "var(--qf-text-primary)",
    },
    button: {
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "0.5rem",
    },
    dangerButton: { backgroundColor: "var(--qf-rojo)", color: "white" },
    successButton: { backgroundColor: "var(--qf-green)", color: "white" },
    primaryButton: { backgroundColor: "var(--qf-blue)", color: "white" },
    titulo: {
      fontWeight: "bold",
      color: "var(--qf-text-primary)",
      marginBottom: "20px",
    },
    label: {
      margin: "0",
      marginBottom: "5px",
      fontWeight: "bold",
    },
  };
  const handleEditModeToggle = () => {
    setEditMode(true);
    setIsDisabled(!isDisabled);
  };

  useEffect(() => {
    if (user) {
      cargarDatos(user);
    }
  }, [user]);

  const handleCancelChanges = () => {
    setEditMode(false);
    setIsDisabled(true);
    cargarDatos(user);
  };

  useEffect(() => {
    fetch("https://apis.datos.gob.ar/georef/api/provincias")
      .then((response) => response.json())
      .then((data) => {
        setProvincias(data.provincias);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setLocalidadPrueba([]);

    if (e.target.value !== "") {
      fetch(
        `https://apis.datos.gob.ar/georef/api/municipios?provincia=${e.target.value}&campos=id,nombre&max=700`
      )
        .then((response) => response.json())
        .then((data) => {
          const sortedLocalidades = data.municipios.sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          );
          setLocalidadPrueba(sortedLocalidades);
          setFilteredLocalidades(data.municipios);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setLocalidadPrueba([]);
      setFilteredLocalidades([]);
    }
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    if (
      !nombre ||
      !apellido ||
      !dni ||
      !fechaNacimiento ||
      !provincia ||
      !localidad ||
      !telefono ||
      !username
    ) {
      toast.error("Rellene todos los campos");
      return;
    }

    const datosActualizados = {
      nombre,
      apellido,
      dni,
      fechaNacimiento,
      provincia,
      localidad,
      telefono,
      nombreUsuario: username,
    };

    try {
      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}consumidor/${user.consumidorId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosActualizados),
        }
      );

      if (response.ok) {
        toast.success("Datos actualizados correctamente");
        setEditMode(false);
        updateUser({ ...user, usuario: username });
        setIsDisabled(!isDisabled);
        cargarDatos(user);
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al actualizar los datos del repartidor:", error);
      toast.error("Error al actualizar los datos");
    }
  };

  const handleEliminarCuenta = async () => {
    try {
      console.log(user);
      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}user/${user.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Cuenta deshabilitada correctamente");
        navigate(`/login`);
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al eliminar los datos del productor:", error);
      toast.error("Error al actualizar los datos");
    }
  };

  const cargarDatos = async (user) => {
    try {
      const response1 = await fetch(
        `${process.env?.REACT_APP_BACK_URL}consumidor/${user.consumidorId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response1.ok) {
        const data1 = await response1.json();
        setApellido(data1.data.apellido);
        setNombre(data1.data.nombre);
        setDNI(data1.data.dni);
        setUsername(user.usuario);

        const fechaNacimientoEspañol = new Date(
          data1.data.fechaNacimiento
        ).toLocaleDateString("es-ES");
        setFechaNacimiento(fechaNacimientoEspañol);

        setLocalidad(data1.data.localidad);
        setProvincia(data1.data.provincia);
        setTelefono(data1.data.telefono);

        if (data1.codigo === 200) {
          toast.success("Datos cargados correctamente");
        } else if (data1.codigo === 400) {
          toast.error("Error al cargar los datos");
        }
      } else {
        throw new Error("Error en la respuesta HTTP");
      }
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };

  const handleApellidoChange = (e) => {
    setApellido(e.target.value);
  };
  const handleFechaNacimientoChange = (e) => {
    setFechaNacimiento(e.target.value);
  };

  const handleDniChange = (e) => {
    setDNI(e.target.value);
  };

  const handleLocalidadChange = (e) => {
    setLocalidad(e.target.value);
  };

  const handleTelefonoChange = (e) => {
    setTelefono(e.target.value);
  };

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <h1 style={styles.titulo}>Usuario {user?.tipoUsuario}</h1>
        <div>
          {editMode ? (
            <>
              <button
                type="button"
                style={{ ...styles.button, ...styles.successButton }}
                onClick={handleSaveChanges}
              >
                Guardar
              </button>
              <button
                type="button"
                style={{ ...styles.button, ...styles.dangerButton }}
                onClick={handleCancelChanges}
              >
                Cancelar
              </button>
            </>
          ) : (
            <button
              type="button"
              style={{ ...styles.button, ...styles.primaryButton }}
              onClick={handleEditModeToggle}
            >
              Editar
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSaveChanges}>
        <label style={styles.label} htmlFor="nombreUsuario">
          Nombre de Usuario
        </label>
        <input
          id="nombreUsuario"
          type="text"
          style={styles.input}
          value={username}
          onChange={handleUsernameChange}
          readOnly={!editMode}
          disabled={isDisabled}
          required
        />

        <label style={styles.label} htmlFor="Nombre">
          Nombre
        </label>
        <input
          type="text"
          id="Nombre"
          style={styles.input}
          value={nombre}
          onChange={handleNombreChange}
          readOnly={!editMode}
          disabled={isDisabled}
          required
        />
        <label style={styles.label} htmlFor="Apellido">
          Apellido
        </label>
        <input
          type="text"
          id="Apellido"
          style={styles.input}
          value={apellido}
          onChange={handleApellidoChange}
          readOnly={!editMode}
          disabled={isDisabled}
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
          onChange={handleFechaNacimientoChange}
          readOnly={!editMode}
          disabled={isDisabled}
          required
        />
        <label style={styles.label} htmlFor="DNI">
          DNI
        </label>
        <input
          type="text"
          id="DNI"
          style={styles.input}
          value={dni}
          onChange={handleDniChange}
          readOnly={!editMode}
          disabled={isDisabled}
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
          readOnly={!editMode}
          disabled={isDisabled}
          required
        >
          <option value="" disabled>
            {provincia}
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
          readOnly={!editMode}
          disabled={isDisabled}
          required
        >
          <option value={localidad} disabled>
            {localidad}
          </option>
          {filteredLocalidades.map((loc, index) => (
            <option key={`${loc.nombre}-${index}`} value={loc.nombre}>
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
          onChange={handleTelefonoChange}
          readOnly={!editMode}
          disabled={isDisabled}
          required
        />
      </form>

      {mostrarBotonHabilitarDeNuevoR && (
        <button
          type="button"
          style={{ ...styles.button, ...styles.successButton, width: "100%", marginBottom: "10px" }}
          onClick={handleVolverAHabilitarR}
        >
          Volver a habilitarme como 'Repartidor'
        </button>
      )}

      {mostrarBotonHabilitarDeNuevoEPC && (
        <button
          type="button"
          style={{ ...styles.button, ...styles.successButton, width: "100%", marginBottom: "10px" }}
          onClick={handleVolverAHabilitarEPC}
        >
          Volver a habilitarme como 'Encargado de Puesto'
        </button>
      )}

      {mostrarBotonHabilitarDeNuevoPE && (
        <button
          type="button"
          style={{ ...styles.button, ...styles.successButton, width: "100%", marginBottom: "10px" }}
          onClick={handleVolverAHabilitarPE}
        >
          Volver a habilitarme como 'Productor de Evento'
        </button>
      )}

      <button
        type="button"
        style={{ ...styles.button, ...styles.dangerButton, width: "100%" }}
        onClick={handleEliminarCuenta}
      >
        Eliminar mi cuenta
      </button>
    </div>
  );
};

export default UserProfileForm;
