import React, { useState, useEffect, useCallback} from 'react';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';


const ConsultarUsuario = () => {
  const location = useLocation();
  const id = location.state && location.state.value;
  
  const [nombre, setNombre] = useState();
  const [apellido, setApellido] = useState();
  const [fechaNacimiento, setFechaNacimiento] = useState();
  const [dni, setDni] = useState();
  const [localidad, setLocalidad] = useState();
  const [telefono, setTelefono] = useState();
  const [username, setUsername] = useState();
  const [editMode, setEditMode] = useState(false);

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

  const handleEditModeToggle = () => {
    setEditMode(!editMode);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setEditMode(false);
  };

  const buscarDatosConsumidor = useCallback(async () => {
    try {
      let userid = 0;
      
      console.log("id antes: " + userid);
      const response1 = await fetch(`http://127.0.0.1:8000/consumidor/${id}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response1.ok) {
        const data1 = await response1.json();
        setApellido(data1.consumidor.apellido)
        setNombre(data1.consumidor.nombre)
        setDni(data1.consumidor.dni)
        setFechaNacimiento(data1.consumidor.fechaNacimiento)
        setLocalidad(data1.consumidor.localidad)
        setTelefono(data1.consumidor.telefono)
        console.log(data1)
        if (data1.codigo===200){
          toast.success("Datos cargado correctamente");
        }else if(data1.codigo===400){
          toast.error("Error al cargar los datos");
        }
        userid = data1.consumidor.usuario;
      } else {
        throw new Error('Error en la respuesta HTTP');
      }
      
      const response2 = await fetch(`http://127.0.0.1:8000/user/${userid}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response2.ok) {
        const data2 = await response2.json();
        setUsername(data2.user.nombreDeUsuario)
        if (data2.codigo===200){
          toast.success("Datos cargado correctamente");
        }else if(data2.codigo===400){
          toast.error("Error al cargar los datos");
        }
      } else {
        throw new Error('Error en la respuesta HTTP');
      }
    } catch (error) {
      console.error(error);
    }
  }, [id]);
  
  useEffect(() => {
    const fetchData = async () => {
      await buscarDatosConsumidor();
    };
  
    fetchData();
  }, [buscarDatosConsumidor]);

  return (
    <section
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{ background: 'url(QuickFoodFondo.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
        <div className="container" style={{ marginTop: '10px' }}>
        <div className="row justify-content-sm-center">
          <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <h1 className="fs-4 card-title fw-bold mb-4 text-dark">Perfil de Usuario</h1>
                <form onSubmit={handleSaveChanges} className="needs-validation">
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
                        readOnly={!editMode}
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
                        readOnly={!editMode}
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
                      readOnly={!editMode}
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
                      readOnly={!editMode}
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
                      readOnly={!editMode}
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
                      readOnly={!editMode}
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
                      readOnly={!editMode}
                    />
                  </div>

                  <div className="d-grid">
                    {!editMode && (
                      <button type="button" className="btn btn-primary" onClick={handleEditModeToggle}>
                        Editar
                      </button>
                    )}
                    {editMode && (
                      <button type="submit" className="btn btn-primary">
                        Guardar Cambios
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default ConsultarUsuario;