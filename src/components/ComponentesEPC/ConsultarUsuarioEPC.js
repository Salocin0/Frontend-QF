import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../ComponentesGenerales/UserContext';
import '../ComponentesConsumidor/ConsultarUsuario.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import Footer from '../ComponentesGenerales/Footer';
import Sidebar from '../ComponentesGenerales/Sidebar';

const ConsultarUsuarioEPC = () => {
  const location = useLocation();
  const { user, updateUser } = useContext(UserContext);
  const id = location.state && location.state.value;

  const [encargado, setEncargado] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [cuit, setCuit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [documento, setDocumentos] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState('Encargado Puesto de Comida');

  const handleNombreChange = (e) => {
    setNombre(e.target.value);
  };

  const handleApellidoChange = (e) => {
    setApellido(e.target.value);
  };

  const handleDniChange = (e) => {
    setDni(e.target.value);
  };

  const handleCuitChange = (e) => {
    setCuit(e.target.value);
  };

  const handleRazonSocialChange = (e) => {
    setRazonSocial(e.target.value);
  };

  const handleLocalidadChange = (e) => {
    setLocalidad(e.target.value);
  };

  const handleTelefonoChange = (e) => {
    setTelefono(e.target.value);
  };

  const handleDocumentosChange = (e) => {
    setDocumentos(e.target.files);
  };

  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };
  
  const deshabilitarUsuario = async () => {
    try {

      const response = await fetch(`http://127.0.0.1:8000/encargado/${encargado.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        if (data.code === 200) {
          setApellido(user.apellido);
          setNombre(user.nombre);
          setDni(user.dni);
          setCuit("");
          setRazonSocial("");
          setLocalidad(user.localidad);
          setTelefono(user.telefono);
          setDocumentos("");
          toast.success('Encargado eliminado correctamente');
        } else if (data.codigo === 400) {
          toast.error('Error al eliminar');
        }
      } else {
        throw new Error('Error en la respuesta HTTP');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleDelete = () => {
    deshabilitarUsuario();
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    updateEncargado()
    setEditMode(false);
  };

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

  const updateEncargado = async () => {
    try {
      const nuevoEncargado={
        cuit:cuit,
        razonSocial:razonSocial
      }

      const response = await fetch(`http://127.0.0.1:8000/encargado/${encargado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEncargado)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        if (data.code === 200) {
          toast.success('Datos cargados correctamente');
        } else if (data.codigo === 400) {
          toast.error('Error al cargar los datos');
        }
      } else {
        throw new Error('Error en la respuesta HTTP');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const buscarDatosEncargado = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/consumidor/${user.consumidoreId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const consumidor = await response.json();
        setEncargado(consumidor.data.encargado)
        setApellido(consumidor.data.apellido);
        setNombre(consumidor.data.nombre);
        setDni(consumidor.data.dni);
        setTelefono(consumidor.data.telefono);
        setCuit(consumidor.data.encargado.cuit);
        setRazonSocial(consumidor.data.encargado.razonSocial);
        setLocalidad(consumidor.data.localidad)
        setDocumentos(consumidor.data.encargado.documento);
        if (consumidor.codigo === 200) {
          toast.success('Datos cargados correctamente');
        } else if (consumidor.codigo === 400) {
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
    buscarDatosEncargado();
  }, []);

  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 background">
          <section className="align-items-center justify-content-center col-6 offset-3 form ">
            <div className="card shadow-lg  ">
              <div className="card-body p-3 formulario ">
                <h1 className="fs-5 card-title fw-bold mb-2 text-dark">Tu Perfil - Productor de Eventos</h1>
                <form onSubmit={handleSaveChanges} className="needs-validation">
                  <div className="row">
                  <div className="mb-2">
                      <label className="mb-2 text-dark" htmlFor="rol">
                        Rol
                      </label>
                      <select
                        id="rol"
                        className="form-control"
                        value={rolSeleccionado}
                        onChange={handleRolChange}
                      >
                        <option value="Encargado Puesto de Comida" >Encargado Puesto de Comida</option>
                        <option value="Usuario">Usuario</option>
                        <option value="Productor de Eventos">Productor de Eventos</option>
                        <option value="Repartidor" disabled>
                          Repartidor
                        </option>
                      </select>
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
                        disabled={!editMode}
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
                        disabled={!editMode}
                      />
                    </div>
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
                      disabled={!editMode}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="mb-2 text-dark" htmlFor="cuit">
                      CUIT
                    </label>
                    <input
                      type="text"
                      id="cuit"
                      className="form-control"
                      value={cuit}
                      onChange={handleCuitChange}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="mb-2 text-dark" htmlFor="razonSocial">
                      Razón Social
                    </label>
                    <input
                      type="text"
                      id="razonSocial"
                      className="form-control"
                      value={razonSocial}
                      onChange={handleRazonSocialChange}
                      disabled={!editMode}
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
                      disabled={!editMode}
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
                      disabled={!editMode}
                    />
                  </div>

                  <div className="mb-2">
                    <label className="mb-2 text-dark" htmlFor="documentos">
                      Documentos
                    </label>
                    <input
                      type="file"
                      id="documentos"
                      className="form-control"
                      onChange={handleDocumentosChange}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="d-grid">
                    {!editMode && (
                      <>
                        <button type="button" className="btn btn-primary" onClick={handleEditModeToggle}>
                          Editar
                        </button>
                        <button type="button" className="btn btn-danger deshabilitar" onClick={handleDelete}>
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

export default ConsultarUsuarioEPC;
