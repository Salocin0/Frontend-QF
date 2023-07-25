import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import Footer from '../ComponentesGenerales/Footer';
import Sidebar from '../ComponentesGenerales/Sidebar';
import './AdquirirNuevoRolEPC.css';

const AdquirirNuevoRolEPC = () => {
  const location = useLocation();
  const id = location.state && location.state.value;

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [cuit, setCuit] = useState('');
  const [razonSocial, setRazonSocial] = useState('');
  const [localidad, setLocalidad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [documentos, setDocumentos] = useState([]);

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

  const handleDocumentoChange = (e) => {
    const files = e.target.files;
    setDocumentos(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('id', id);
      formData.append('nombre', nombre);
      formData.append('apellido', apellido);
      formData.append('dni', dni);
      formData.append('cuit', cuit);
      formData.append('razonSocial', razonSocial);
      formData.append('localidad', localidad);
      formData.append('telefono', telefono);

      for (let i = 0; i < documentos.length; i++) {
        formData.append('documentos', documentos[i]);
      }

      const response = await fetch('http://localhost:8000/adquirir_rol_epc', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.codigo === 200) {
          toast.success('Nuevo rol adquirido correctamente');
        } else if (data.codigo === 400) {
          toast.error('Error al adquirir el nuevo rol');
        }
      } else {
        throw new Error('Error en la respuesta HTTP');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/datos_usuario/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          setNombre(data.nombre);
          setApellido(data.apellido);
          setDni(data.dni);
          setLocalidad(data.localidad);
          setTelefono(data.telefono);
        } else {
          throw new Error('Error en la respuesta HTTP');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1">
          <section className="align-items-center justify-content-center">
            <div className="card shadow-lg">
              <div className="card-body p-3 formularioAdquirirNuevoRolEPC">
                <h1 className="fs-4 card-title fw-bold mb-2 text-dark">Adquirir Nuevo Rol - Encargado de Puesto de Comida</h1>
                <form onSubmit={handleSubmit} className="needs-validation" encType="multipart/form-data">
                  <div className="mb-3">
                    <label className="mb-2 text-dark" htmlFor="nombre">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      className="form-control"
                      value={nombre}
                      onChange={handleNombreChange}
                      disabled
                    />
                  </div>

                  <div className="mb-2">
                    <label className="mb-2 text-dark" htmlFor="apellido">
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="apellido"
                      className="form-control"
                      value={apellido}
                      onChange={handleApellidoChange}
                      disabled
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
                      disabled
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
                      required
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
                      required
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
                      required
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
                      onChange={handleDocumentoChange}
                      multiple
                      required
                    />
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-success">
                      Solicitar Nuevo Rol - Encargado Puesto de Comida
                    </button>
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

export default AdquirirNuevoRolEPC;
