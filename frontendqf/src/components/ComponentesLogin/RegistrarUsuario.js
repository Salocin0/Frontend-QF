import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './RegistrarUsuario.css';
import Footer from '../ComponentesGenerales/Footer';

const RegistroUsuario = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [dni, setDni] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleApellidoChange = (e) => {
    setApellido(e.target.value);
  };

  const handleFechaNacimientoChange = (e) => {
    setFechaNacimiento(e.target.value);
  };

  const handleDniChange = (e) => {
    setDni(e.target.value);
  };

  const handleLocalidadChange = (e) => {
    setLocalidad(e.target.value);
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

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fecha = Date.now();
    const usuario = {
      contraseña: password,
      fechaAlta: fecha,
      nombreDeUsuario: username,
      correoElectronico: email
    };
    const consumidor = {
      nombre: nombre,
      apellido: apellido,
      fechaDeNacimiento: fechaNacimiento,
      dni: dni,
      localidad: localidad,
      telefono: telefono,
      usuario: usuario
    };
    const json_consumidor ={
      consumidor:consumidor
    }

    fetch('http://127.0.0.1:8000/user/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify(json_consumidor)
    })
      .then(response => response.json()).then(data => {
        if (data.code===200){
          toast.success("Usuario registrado correctamente");
          setTimeout(() => {
            navigate(`/`);
          }, 1500);
        }else if(data.code===400){
          toast.error("Error al registrar el usuario");
        }
    })
      .catch(error => {
        console.error(error);
    });
  };



  return (
    <>
      <div className="containerRegistrar">
            <div className="cardRegistrar shadow-lg">
              <div className="cardRegistrar-body p-2 formularioRegistrar">
                <h1 className="fs-4 cardRegistrar-title fw-bold mb-4 text-black">Registrar Usuario</h1>
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
                      type="text"
                      id="dni"
                      className="form-control"
                      value={dni}
                      onChange={handleDniChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="mb-2 text-black" htmlFor="localidad">
                      Localidad
                    </label>
                    <input
                      type="text"
                      id="localidad"
                      className="form-control"
                      value={localidad}
                      onChange={handleLocalidadChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="mb-2 text-black" htmlFor="telefono">
                      Teléfono
                    </label>
                    <input
                      type="text"
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
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="mb-2 text-black" htmlFor="confirmPassword">
                      Confirmar Contraseña
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                    />
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-success">Registrar</button>
                  </div>
                </form>
              </div>

          </div>

      </div>
      <Footer/>
      </>
      );
};

export default RegistroUsuario;
