import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../ComponentesGenerales/Footer";
import "./RegistrarUsuario.css";

const RegistroUsuario = () => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [dni, setDni] = useState("");
  const [provincias, setProvincias] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [localidad, setLocalidad] = useState([]);
  const [filteredLocalidades, setFilteredLocalidades] = useState([]);
  const [telefono, setTelefono] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

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

  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleApellidoChange = (e) => {
    setApellido(e.target.value);
  };

  const handleFechaNacimientoChange = (event) => {
    setFechaNacimiento(event.target.value);
  };

  const handleDniChange = (e) => {
    setDni(e.target.value);
  };

  const handleLocalidadChange = (e) => {
    setLocalidad(e.target.value);
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setLocalidad([]);

    if (e.target.value !== "") {
      fetch(
        `https://apis.datos.gob.ar/georef/api/municipios?provincia=${e.target.value}&campos=id,nombre&max=700`
      )
        .then((response) => response.json())
        .then((data) => {
          const sortedLocalidades = data.municipios.sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          );
          setLocalidad(sortedLocalidades);
          setFilteredLocalidades(data.municipios);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setLocalidad([]);
      setFilteredLocalidades([]);
    }
  };

  const handleTelefonoChange = (e) => {
    setTelefono(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const hoy = new Date();
    const fechaNacimientoDate = new Date(fechaNacimiento);
    const edad = hoy.getFullYear() - fechaNacimientoDate.getFullYear();

    if (edad < 18) {
      toast.error("Debes tener al menos 18 años para registrarte.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (!password.trim()) {
      toast.error("La contraseña no puede estar vacía.");
      return;
    }

    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    const fecha = Date.now();
    const usuario = {
      contraseña: password,
      fechaAlta: fecha,
      nombreDeUsuario: username,
      correoElectronico: email,
      tipoUsuario: "Consumidor",
    };
    const consumidor = {
      nombre: nombre,
      apellido: apellido,
      fechaDeNacimiento: fechaNacimiento,
      dni: dni,
      localidad: localidad,
      provincia: provincias.filter((p) => p.id === selectedProvince)[0].nombre,
      telefono: telefono,
      usuario: usuario,
    };
    const json_consumidor = {
      correoElectronico: email,
      contraseña: password,
      consumidor: consumidor,
    };
    fetch("http://127.0.0.1:8000/user/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(json_consumidor),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success("Usuario registrado correctamente");
          setTimeout(() => {
            navigate(`/login`);
          }, 1500);
        } else if (data.code === 300) {
          toast.error("Error el usuario ya existe");
        } else {
          toast.error("Error al registrar");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <div className="fondo">
        <div className="containerRegistrar d-flex justify-content-center align-items-center">
          <div className="cardRegistrar shadow-lg">
            <div className="cardRegistrar-body p-2 formularioRegistrar">
              <h1 className="fs-4 cardRegistrar-title fw-bold mb-4 text-black">
                Registrar Usuario
              </h1>
              <form onSubmit={handleSubmit} className="needs-validation">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="mb-2 text-black" htmlFor="nombre">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      className="form-control"
                      value={nombre}
                      onChange={handleNombreChange}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="mb-2 text-black" htmlFor="apellido">
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="apellido"
                      className="form-control"
                      value={apellido}
                      onChange={handleApellidoChange}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="fechaNacimiento">
                    Fecha de Nacimiento
                  </label>
                  <input
                    type="date"
                    id="fechaNacimiento"
                    className="form-control"
                    value={fechaNacimiento}
                    onChange={handleFechaNacimientoChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="dni">
                    DNI
                  </label>
                  <input
                    type="number"
                    id="dni"
                    className="form-control"
                    min="0"
                    max="99999999"
                    value={dni}
                    onChange={handleDniChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="provincia">
                    Provincia
                  </label>
                  <select
                    id="provincia"
                    className="form-control"
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    required
                  >
                    <option value="" disabled>
                      Seleccione una provincia
                    </option>
                    {provincias.map((prov) => (
                      <option key={prov.id} value={prov.id}>
                        {prov.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="localidad">
                    Localidad
                  </label>

                  <select
                    className="form-control mt-2"
                    value={localidad}
                    onChange={handleLocalidadChange}
                    required
                  >
                    <option value="" disabled>
                      Seleccione una localidad
                    </option>
                    {filteredLocalidades.map((loc) => (
                      <option key={loc.nombre} value={loc.nombre}>
                        {loc.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="telefono">
                    Teléfono
                  </label>
                  <input
                    type="number"
                    id="telefono"
                    className="form-control"
                    value={telefono}
                    onChange={handleTelefonoChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="username">
                    Nombre de Usuario
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    onChange={handleUsernameChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="password">
                    Contraseña
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={toggleShowPassword}
                    >
                      {showPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="mb-2 text-black" htmlFor="confirmPassword">
                    Confirmar Contraseña
                  </label>
                  <div className="input-group">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      className="form-control"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={toggleShowConfirmPassword}
                    >
                      {showConfirmPassword ? "Ocultar" : "Mostrar"}
                    </button>
                  </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-success">
                    Registrar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <Footer className="footer" />
      </div>
    </>
  );
};

export default RegistroUsuario;
