import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Footer from '../ComponentesGenerales/Footer';
import './RecuperarContraseña.css';

const RecuperarContraseña = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const json_recuperarEmail = {
      correoElectronico: email,
    };

    fetch('http://127.0.0.1:8000/user/recuperarcontrasenia', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(json_recuperarEmail),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          toast.success('Email sent');
          navigate(`/`);
        } else if (data.code === 400) {
          toast.error('Error recovering password');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
    <section className="vh-100 d-flex align-items-center justify-content-center" style={{ background: 'url(QuickFoodFondo.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="container ">
          <div className="row justify-content-sm-center">
            <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9 border-0">
              <div className="card">
                <div className="card-top rounded-top bg-dark">
                  <h1 className="fs-4 card-title fw-bold text-white text-center mt-3 mb-4 rounded-pill">Recuperar Contraseña</h1>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center mt-3">
            <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
              <div className="card shadow-lg">
                <div className="card-body bg-dark p-4 rounded-lg">
                  <form onSubmit={handleSubmit} className="needs-validation">
                    <div className="mb-3">
                      <div className="input-group">

                        <input
                          type="email"
                          id="email"
                          className="form-control input-contraseña"
                          value={email}
                          onChange={handleEmailChange}
                          placeholder="Ingresa tu Correo"
                          required
                        />
                      </div>

                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-center mt-3">
            <button type="submit" className="btn btn-warning botonRecuperacion">
              Enviar Correo de Recuperación
            </button>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default RecuperarContraseña;
