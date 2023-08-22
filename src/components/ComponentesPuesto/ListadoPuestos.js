import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../ComponentesGenerales/Sidebar';
import carro1 from '../QuickFoodLogo.png';

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


                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default ListadoPuestos;
