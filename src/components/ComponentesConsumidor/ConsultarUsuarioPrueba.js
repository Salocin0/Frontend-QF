import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Footer from '../ComponentesGenerales/Footer';
import Sidebar from '../ComponentesGenerales/Sidebar';
import { UserContext } from '../ComponentesGenerales/UserContext';
import './ConsultarUsuario.css';

const ConsultarUsuario = () => {
    const { user } = useContext(UserContext);
    const location = useLocation();
    const id = location.state && location.state.value;
  const [mostrarContenidoProductor, setMostrarContenidoProductor] = useState(false);
  const [mostrarContenidoEncargadoPuesto, setMostrarContenidoEncargadoPuesto] = useState(false);
  const [mostrarContenidoRepartidor, setMostrarContenidoRepartidor] = useState(false);

    const [productor, setProductor] = useState("");
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [dni, setDni] = useState('');
    const [localidad, setLocalidad] = useState('');
    const [telefono, setTelefono] = useState('');
    const [cuit, setCuit] = useState('');
    const [razonSocial, setRazonSocial] = useState('');
    const [documentos, setDocumentos] = useState('');


    const [username, setUsername] = useState('');
    const [isDisabled, setIsDisabled] = useState(true);

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

    const handleCuitChange = (e) => {
        setCuit(e.target.value);
    };

    const handleRazonSocialChange = (e) => {
        setRazonSocial(e.target.value);
    };

    const handleDocumentosChange = (e) => {
        setDocumentos(e.target.files);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };










    const handleEditModeToggle = () => {
        setEditMode(!editMode);
        setIsDisabled(!isDisabled);
    };

    const handleSaveChanges = (e) => {
        e.preventDefault();
        setEditMode(false);
    };

    useEffect(() => {
        if (user) {
            cargarDatos(user);
        }
    }, [user]);

    const cargarDatos = async (user) => {
        setUsername(user.usuario);

        try {
            const response1 = await fetch(`http://localhost:8000/consumidor/${user.consumidoreId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response1.ok) {
                const data1 = await response1.json();
                console.log(data1);

                setApellido(data1.data.apellido);
                setNombre(data1.data.nombre);
                setDni(data1.data.dni);

                const fechaNacimientoEspañol = new Date(data1.data.fechaNacimiento).toLocaleDateString('es-ES');
                setFechaNacimiento(fechaNacimientoEspañol);

                setLocalidad(data1.data.localidad);
                setTelefono(data1.data.telefono);


                if (data1.data.Productor.cuit || data1.data.Productor.razonSocial) {
                    setMostrarContenidoProductor(true);

                    setCuit(data1.data.Productor.cuit);
                    setRazonSocial(data1.data.Productor.razonSocial);
                }

                if (data1.data.encargado.cuit || data1.data.encargado.razonSocial) {
                    setMostrarContenidoEncargadoPuesto(true);

                    setCuit(data1.data.encargado.cuit);
                    setRazonSocial(data1.data.encargado.razonSocial);
                }

                /*
                if (data1.data.repartidor.cuit || data1.data.repartidor.razonSocial) {
                    setMostrarContenidoRepartidor(true);

                    setCuit(data1.data.repartidor.cuit);
                    setRazonSocial(data1.data.repartidor.razonSocial);
                }*/

                if (data1.codigo === 200) {
                    toast.success('Datos cargados correctamente');
                } else if (data1.codigo === 400) {
                    toast.error('Error al cargar los datos');
                }
            } else {
                throw new Error('Error en la respuesta HTTP');
            }
        } catch (error) {
            console.error('Error al cargar los datos:', error);
        }
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

    return (
        <>
            <div className="d-flex">
                <div className='col-2'>
                    <Sidebar />
                </div>
                <div className="flex-grow-1 background">
                    <section className="align-items-center justify-content-center col-6 offset-3 form mt-0">
                        <div className="card shadow-lg">
                            <div className="card-body p-3 formulario">
                                <h1 className="fs-5 card-title fw-bold mb-2 text-dark">Tu Perfil</h1>
                                <form onSubmit={handleSaveChanges} className="needs-validation">
                                    <div>


                                        <hr />

                                        <h1 className="fs-5 card-title fw-bold mb-2 text-dark">Usuario</h1>

                                        <section className="align-items-center justify-content-center col form">
                                            <div className="card shadow-lg">
                                                <div className="card-body p-3 formulario">
                                                    <div className="d-flex justify-content-end">
                                                        <button
                                                            type="button"
                                                            className="btn btn-link text-primary"
                                                            style={{ margin: '0px 0px -25px 0px', textDecoration: 'none' }}
                                                            onClick={handleEditModeToggle}
                                                        >
                    Editar >
                                                        </button>
                                                    </div>
                                                    <form onSubmit={handleSaveChanges} className="needs-validation">

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
                                                                disabled={isDisabled}
                                                            />
                                                        </div>
                                                        <div className=" mb-2">
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
                                                                disabled={isDisabled}

                                                            />
                                                        </div>
                                                        <div className=" mb-2">
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
                                                                disabled={isDisabled}

                                                            />
                                                        </div>
                                                        <div className="mb-2">
                                                            <label className="mb-2 text-dark" htmlFor="fechaNacimiento">
                                                                Fecha de Nacimiento
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="fechaNacimiento"
                                                                className="form-control"
                                                                value={fechaNacimiento}
                                                                onChange={handleFechaNacimientoChange}
                                                                readOnly={!editMode}
                                                                disabled={isDisabled}

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
                                                                disabled={isDisabled}

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
                                                                disabled={isDisabled}

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
                                                                disabled={isDisabled}

                                                            />
                                                        </div>




                                                    </form>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    <hr />

                                        {mostrarContenidoProductor && (


<>
                                            <h1 className="fs-5 card-title fw-bold mb-2 text-dark">Productor de Eventos</h1>
                                            <section className="align-items-center justify-content-center col form">
                                                <div className="card shadow-lg">
                                                    <div className="card-body p-3 formulario">
                                                        <div className="d-flex justify-content-end">
                                                            <button
                                                                type="button"
                                                                className="btn btn-link text-primary"
                                                                style={{ margin: '0px 0px -25px 0px', textDecoration: 'none' }}
                                                                onClick={handleEditModeToggle}
                                                            >
                    Editar >
                                                            </button>
                                                        </div>
                                                        <form onSubmit={handleSaveChanges} className="needs-validation">
                                                            {/* CUIT */}
                                                            <div className="mb-2">
                                                                <label className="mb-2 text-dark" htmlFor="cuit">
                                                                    CUIT
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    id="cuit"
                                                                    className="form-control"
                                                                    value={cuit}
                                                                    onChange={handleCuitChange}
                                                                    readOnly={!editMode}
                                                                    disabled={!editMode}
                                                                />
                                                            </div>
                                                            {/* Razon Social */}
                                                            <div className="mb-2">
                                                                <label className="mb-2 text-dark" htmlFor="razonSocial">
                                                                    Razon Social
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    id="razonSocial"
                                                                    className="form-control"
                                                                    value={razonSocial}
                                                                    onChange={handleRazonSocialChange}
                                                                    readOnly={!editMode}
                                                                    disabled={!editMode}
                                                                />
                                                            </div>
                                                            {/* Documentos */}
                                                            <div className="mb-2">
                                                                <label className="mb-2 text-dark" htmlFor="documentos">
                                                                    Documentos
                                                                </label>
                                                                <input
                                                                    type="file"
                                                                    id="documentos"
                                                                    className="form-control"
                                                                    onChange={handleDocumentosChange}
                                                                    readOnly={!editMode}
                                                                    disabled={!editMode}
                                                                />
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </section>
</>
)}
                                    <hr />
                                    {mostrarContenidoEncargadoPuesto && (
<>
                                    <h1 className="fs-5 card-title fw-bold mb-2 text-dark">Encargado Puesto de Comida</h1>

                                    <section className="align-items-center justify-content-center col form">
                                        <div className="card shadow-lg">
                                            <div className="card-body p-3 formulario">
                                                <div className="d-flex justify-content-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-link text-primary"
                                                        style={{ margin: '0px 0px -25px 0px', textDecoration: 'none' }} // Ajusta los valores según lo necesario
                                                        onClick={handleEditModeToggle}
                                                    >
                    Editar >
                                                    </button>
                                                </div>
                                                <form onSubmit={handleSaveChanges} className="needs-validation">
                                                    {/* CUIT */}
                                                    <div className="mb-2">
                                                        <label className="mb-2 text-dark" htmlFor="cuit">
                                                            CUIT
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="cuit"
                                                            className="form-control"
                                                            value={cuit}
                                                            onChange={handleCuitChange}
                                                            readOnly={!editMode}
                                                            disabled={!editMode}
                                                        />
                                                    </div>
                                                    {/* Razon Social */}
                                                    <div className="mb-2">
                                                        <label className="mb-2 text-dark" htmlFor="razonSocial">
                                                            Razon Social
                                                        </label>
                                                        <input
                                                            type="text"
                                                            id="razonSocial"
                                                            className="form-control"
                                                            value={razonSocial}
                                                            onChange={handleRazonSocialChange}
                                                            readOnly={!editMode}
                                                            disabled={!editMode}
                                                        />
                                                    </div>
                                                    {/* Documentos */}
                                                    <div className="mb-2">
                                                        <label className="mb-2 text-dark" htmlFor="documentos">
                                                            Documentos
                                                        </label>
                                                        <input
                                                            type="file"
                                                            id="documentos"
                                                            className="form-control"
                                                            onChange={handleDocumentosChange}
                                                            readOnly={!editMode}
                                                            disabled={!editMode}
                                                        />
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </section>
</>
)}

                                    <hr />
                                    {mostrarContenidoRepartidor && (
<>
                                    <h1 className="fs-5 card-title fw-bold mb-2 text-dark">Repartidor</h1>
                                    <section className="align-items-center justify-content-center col form">
                                        <div className="card shadow-lg">
                                            <div className="card-body p-3 formulario">
                                                <div className="d-flex justify-content-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-link text-primary"
                                                        style={{ margin: '0px 0px -25px 0px', textDecoration: 'none' }} // Ajusta los valores según lo necesario

                                                        onClick={handleEditModeToggle}
                                                    >
                    Editar >
                                                    </button>
                                                </div>
                                                <form onSubmit={handleSaveChanges} className="needs-validation">
                                                    {/* CUIT */}
                                                    <div className="mb-2 mt-0">
                                                        <label className="mb-1 text-dark" htmlFor="cuit"> {/* <-- Ajustar aquí: mb-0 */}
                                                            CUIT
                                                        </label>
                                                        <input
                                                            type="number"
                                                            id="cuit"
                                                            className="form-control"
                                                            value={cuit}
                                                            onChange={handleCuitChange}
                                                            readOnly={!editMode}
                                                            disabled={!editMode}
                                                        />
                                                    </div>

                                                    {/* Documentos */}
                                                    <div className="mb-2">
                                                        <label className="mb-2 text-dark" htmlFor="documentos">
                                                            Documentos
                                                        </label>
                                                        <input
                                                            type="file"
                                                            id="documentos"
                                                            className="form-control"
                                                            onChange={handleDocumentosChange}
                                                            readOnly={!editMode}
                                                            disabled={!editMode}
                                                        />
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </section>
                                    </>
)}



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
                                            <button type="submit" className="btn btn-primary" onClick={handleEditModeToggle} style={{ width: '100%' }}>
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
