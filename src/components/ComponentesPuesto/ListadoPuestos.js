import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../ComponentesGenerales/Sidebar';
import carro1 from '../QuickFoodLogo.png';
import carro from '../img/carro.png';
import eventos from '../img/eventos.png';
import pedidos from '../img/pedidos.png';
import perfil from '../img/perfil.png';

const ListadoPuestos = () => {
    return (
        <>
            <div className="d-flex">
                <div className="col-2">
                    <Sidebar />
                </div>
                <div className="flex-grow-1 background">
                    <section className="col-10 offset-1 py-5">
                        <div className="container">
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                                <div className="col">
                                    <div className="card shadow-sm">
                                        <img src={carro1} className="card-img-top" alt="Thumbnail" />
                                        <div className="card-body">
                                            <p className="card-text">QuickFood</p>
                                            <div className="d-flex justify-content-end">
                                                <Link to="/ruta-del-carrito" className="btn btn-sm btn-primary">Ver Carrito</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card shadow-sm">
                                        <img src={carro1} className="card-img-top" alt="Thumbnail" />
                                        <div className="card-body">
                                            <p className="card-text">QuickFood</p>
                                            <div className="d-flex justify-content-end">
                                                <Link to="/ruta-del-carrito" className="btn btn-sm btn-primary">Ver Carrito</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card shadow-sm">
                                        <img src={carro1} className="card-img-top" alt="Thumbnail" />
                                        <div className="card-body">
                                            <p className="card-text">QuickFood</p>
                                            <div className="d-flex justify-content-end">
                                                <Link to="/ruta-del-carrito" className="btn btn-sm btn-primary">Ver Carrito</Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Link to="/perfil" style={{ textDecoration: "none" }}>
                                    <div className="col">
                                        <div className="card bg-warning shadow-sm">
                                            <img src={perfil} className="card-img-top mx-auto mt-3" style={{ width: "100px", height: "100px" }} alt="Icono de perfil" />
                                            <div className="card-body text-center">
                                                <h2 className="card-title">Perfil</h2>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <Link to="/perfil" style={{ textDecoration: "none" }}>
                                    <div className="col">
                                        <div className="card bg-warning shadow-sm">
                                            <img src={eventos} className="card-img-top mx-auto mt-3" style={{ width: "100px", height: "100px" }} alt="Icono de perfil" />
                                            <div className="card-body text-center">
                                                <h2 className="card-title">Eventos</h2>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <Link to="/perfil" style={{ textDecoration: "none" }}>
                                    <div className="col">
                                        <div className="card bg-warning shadow-sm">
                                            <img src={pedidos} className="card-img-top mx-auto mt-3" style={{ width: "100px", height: "100px" }} alt="Icono de perfil" />
                                            <div className="card-body text-center">
                                                <h2 className="card-title">Pedidos</h2>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <Link to="/perfil" style={{ textDecoration: "none" }}>
                                    <div className="col">
                                        <div className="card bg-warning shadow-sm">
                                            <img src={carro} className="card-img-top mx-auto mt-3" style={{ width: "100px", height: "100px" }} alt="Icono de perfil" />
                                            <div className="card-body text-center">
                                                <h2 className="card-title">Puestos de Comida</h2>
                                            </div>
                                        </div>
                                    </div>
                                </Link>




                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default ListadoPuestos;
