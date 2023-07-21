import React, { useState, useEffect } from 'react';
import './ConsultarUsuario.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import Footer from '../ComponentesGenerales/Footer';
import Sidebar from '../ComponentesGenerales/Sidebar';
import ConsultarUsuarioPE from '../ComponentesProductorDeEventos/ConsultarUsuarioPE';

const ConsultarUsuario = () => {
  const location = useLocation();
  const id = location.state && location.state.value;

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [dni, setDni] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [username, setUsername] = useState('');
  const [documentos, setDocumentos] = useState('');

  const [editMode, setEditMode] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState('Usuario');

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

  const handleDocumentoChange = (e) => {
    const files = e.target.files;
    setDocumentos(files);
  };

  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setEditMode(false);
  };

  const buscarDatosConsumidor = async () => {
    try {
      let userid = 0;

      const response1 = await fetch(`http://127.0.0.1:8000/consumidor/${id}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response1.ok) {
        const data1 = await response1.json();
        setApellido(data1.consumidor.apellido);
        setNombre(data1.consumidor.nombre);
        setDni(data1.consumidor.dni);
        setFechaNacimiento(data1.consumidor.fechaNacimiento);
        setLocalidad(data1.consumidor.localidad);
        setTelefono(data1.consumidor.telefono);
        userid = data1.consumidor.usuario;
        if (data1.codigo === 200) {
          toast.success('Datos cargados correctamente');
        } else if (data1.codigo === 400) {
          toast.error('Error al cargar los datos');
        }
      } else {
        throw new Error('Error en la respuesta HTTP');
      }

      const response2 = await fetch(`http://127.0.0.1:8000/user/${userid}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response2.ok) {
        const data2 = await response2.json();
        setUsername(data2.user.nombreDeUsuario);
        if (data2.codigo === 200) {
          toast.success('Datos cargados correctamente');
        } else if (data2.codigo === 400) {
          toast.error('Error al cargar los datos');
        }
      } else {
        throw new Error('Error en la respuesta HTTP');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    buscarDatosConsumidor();
  }, []);

  const handleRolChange = (e) => {
    setRolSeleccionado(e.target.value);

    switch (e.target.value) {
      case 'Usuario':
        window.location.href = '/consultar-usuario';
        break;
      case 'Productor de Eventos':
        window.location.href = '/consultar-usuarioPE';
        break;
      case 'Encargado Puesto de Comida':
        window.location.href = '/consultar-usuarioEPC';
        break;
      case 'Repartidor':

        window.location.href = '/ruta-repartidor';
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          <section className="align-items-center justify-content-center">
            <div className="card shadow-lg">
              <div className="card-body p-3 formulario">
                <h1 className="fs-5 card-title fw-bold mb-2 text-dark">Tu Perfil</h1>
                <form onSubmit={handleSaveChanges} className="needs-validation">
                  <div className="row">

                    <div className="mb-2">
                      <label className="mb-2 text-dark" htmlFor="rol">
                        Rol
                      </label>
                      <select id="rol" className="form-control" value={rolSeleccionado} onChange={handleRolChange}>
                        <option value="Usuario">Usuario</option>
                        <option value="Productor de Eventos">Productor de Eventos</option>
                        <option value="Encargado Puesto de Comida">Encargado Puesto de Comida</option>
                        <option value="Repartidor" disabled>Repartidor</option>
                      </select>
                    </div>
                    <div className="mb-2">
                    <label className="mb-2 text-dark" htmlFor="username">
                      Nombre de Usuario
                    </label>
                    <input
                      type="text"
                      id="username"
                      className="form-control"
                      value={username}
                      onChange={handleUsernameChange}
                      readOnly={!editMode}
                    />
                  </div>
                    <div className="col-md-6 mb-2">
                      <label className="mb-2 text-dark" htmlFor="nombre">
                        Nombre
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        className="form-control"
                        value={nombre}
                        onChange={handleNombreChange}
                        readOnly={!editMode}
                      />
                    </div>
                    <div className="col-md-6 mb-2">
                      <label className="mb-2 text-dark" htmlFor="apellido">
                        Apellido
                      </label>
                      <input
                        type="text"
                        id="apellido"
                        className="form-control"
                        value={apellido}
                        onChange={handleApellidoChange}
                        readOnly={!editMode}
                      />
                    </div>
                  </div>

                  <div className="mb-2">
                    <label className="mb-2 text-dark" htmlFor="fechaNacimiento">
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      id="fechaNacimiento"
                      className="form-control"
                      value={fechaNacimiento}
                      onChange={handleFechaNacimientoChange}
                      readOnly={!editMode}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="mb-2 text-dark" htmlFor="dni">
                      DNI
                    </label>
                    <input
                      type="text"
                      id="dni"
                      className="form-control"
                      value={dni}
                      onChange={handleDniChange}
                      readOnly={!editMode}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="mb-2 text-dark" htmlFor="localidad">
                      Localidad
                    </label>
                    <input
                      type="text"
                      id="localidad"
                      className="form-control"
                      value={localidad}
                      onChange={handleLocalidadChange}
                      readOnly={!editMode}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="mb-2 text-dark" htmlFor="telefono">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      id="telefono"
                      className="form-control"
                      value={telefono}
                      onChange={handleTelefonoChange}
                      readOnly={!editMode}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="mb-2 text-dark" htmlFor="documentos">
                      Documentos
                    </label>
                    <input
                      type="file"
                      id="documentos"
                      className="form-control"
                      onChange={handleDocumentoChange}
                      multiple
                      required
                    />
                  </div>

                  <div className="d-grid">
                    {!editMode && (
                      <>
                        <button type="button" className="btn btn-primary" onClick={handleEditModeToggle} >
                          Editar
                        </button>
                        <button type="button" className="btn btn-danger deshabilitar">
                          Deshabilitar Usuario
                        </button>
                      </>
                    )}
                    {editMode && (
                      <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Guardar Cambios
                      </button>
                    )}
                  </div>

                </form>
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default ConsultarUsuario;
