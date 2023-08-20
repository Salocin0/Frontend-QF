import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Footer from '../ComponentesGenerales/Footer';
import './RecuperarContraseña.css'; // Add your custom CSS file for additional styling

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
        <div className="container">
          <div className="row justify-content-sm-center">
            <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
              <div className="card shadow-lg">
                <div className="card-body p-3 text-center">
                  <h1 className="fs-4 card-title fw-bold mb-1 text-black">Recuperar Contraseña</h1>
                  <form onSubmit={handleSubmit} className="needs-validation">
                    <div className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text bg-white text-dark">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          value={email}
                          onChange={handleEmailChange}
                          placeholder='Ingrese su Correo'
                          required
                        />
                      </div>
                    </div>
                    <div className="d-grid">
                      <button type="submit" className="btn btn-warning">
                          Enviar Mail de Recuperación
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default RecuperarContraseña;
