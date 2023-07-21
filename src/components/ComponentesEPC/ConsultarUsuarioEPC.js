import React, { useState, useEffect } from 'react';
import '../ComponentesConsumidor/ConsultarUsuario.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import Footer from '../ComponentesGenerales/Footer';
import Sidebar from '../ComponentesGenerales/Sidebar';

const ConsultarUsuarioEPC = () => {
  const location = useLocation();
  const id = location.state && location.state.value;

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [cuit, setCuit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [documento, setDocumentos] = useState([]);
  const [editMode, setEditMode] = useState(false);

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

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setEditMode(false);
  };

  const buscarDatosProductorEventos = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/productor-eventos/${id}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setApellido(data.productorEventos.apellido);
        setNombre(data.productorEventos.nombre);
        setDni(data.productorEventos.dni);
        setCuit(data.productorEventos.cuit);
        setRazonSocial(data.productorEventos.razonSocial);
        setLocalidad(data.productorEventos.localidad);
        setTelefono(data.productorEventos.telefono);
        setDocumentos(data.productorEventos.documento);
        if (data.codigo === 200) {
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

  useEffect(() => {
    buscarDatosProductorEventos();
  }, []);

  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          <section className="align-items-center justify-content-center">
            <div className="card shadow-lg">
              <div className="card-body p-3 formulario">
                <h1 className="fs-5 card-title fw-bold mb-2 text-dark">Tu Perfil - Productor de Eventos</h1>
                <form onSubmit={handleSaveChanges} className="needs-validation">
                  <div className="row">
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

export default ConsultarUsuarioEPC;
