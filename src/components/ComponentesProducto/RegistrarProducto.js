import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import Sidebar from '../ComponentesGenerales/Sidebar';
import banner from '../ComponentesProducto/banner.png';
import imagenProducto from '../ComponentesProducto/f1.png';
import './RegistrarProducto.css';

const RegistrarProducto = () => {
    return (
        <div className="main-container">

            <div className="d-flex ">
            <div className="col-2 ">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <div className="imagen-contenedor">
                        <img
                            src={banner}
                            alt="Nombre de la imagen"
                        />
                    </div>
                </div>
            </div>


            <div className="d-flex flex-wrap">
                <div className="col-12 col-md-2">
                    {/* Aquí puedes agregar contenido adicional para el sidebar si es necesario */}
                </div>
                <div className="col-12 col-md-10">
                    <div className="d-flex flex-wrap">
                        <div className="col-md-2 mx-2">
                            <div className="card mb-2">
                                <img
                                    src={imagenProducto}
                                    className="card-img-top img-fluid"
                                />
                                <div className="card-body">
                                    <h5>Pizza</h5>
                                    <p className="card-text">
                                        Pizza rellena de varios ingredientes entre ellos: Tomate, Huevo, Jamón y Queso
                                    </p>
                                    <h6 className="precio">$2000</h6>
                                    <button className="btn-pedido">AGREGAR</button>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-2 mx-2">
                            <div className="card mb-2">
                                <img
                                    src={imagenProducto}
                                    className="card-img-top img-fluid"
                                />
                                <div className="card-body">
                                    <h5>Pizza</h5>
                                    <p className="card-text">
                                        Pizza rellena de varios ingredientes entre ellos: Tomate, Huevo, Jamón y Queso
                                    </p>
                                    <h6 className="precio">$2000</h6>
                                    <button className="btn-pedido">AGREGAR</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegistrarProducto;
