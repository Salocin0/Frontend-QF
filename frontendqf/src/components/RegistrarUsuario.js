import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
    console.log(e);
  };
  
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    console.log(e);
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
    console.log(nombre);
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
        console.log(data);
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
    <section
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'url(QuickFoodFondo.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="container" style={{ marginTop: '220px' }}>
        <div className="row justify-content-sm-center">
          <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <h1 className="fs-4 card-title fw-bold mb-4 text-black">Registrar Usuario</h1>
                <form onSubmit={handleSubmit} className="needs-validation">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="mb-2 text-muted" htmlFor="nombre">
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
                      <label className="mb-2 text-muted" htmlFor="apellido">
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
                    <label className="mb-2 text-muted" htmlFor="fechaNacimiento">
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
                    <label className="mb-2 text-muted" htmlFor="dni">
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
                    <label className="mb-2 text-muted" htmlFor="localidad">
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
                    <label className="mb-2 text-muted" htmlFor="telefono">
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
                    <label className="mb-2 text-muted" htmlFor="username">
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
                    <label className="mb-2 text-muted" htmlFor="email">
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
                    <label className="mb-2 text-muted" htmlFor="password">
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
                    <label className="mb-2 text-muted" htmlFor="confirmPassword">
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
                    <button type="submit" className="btn btn-primary">Registrar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistroUsuario;