import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Footer from '../ComponentesGenerales/Footer';

const RecuperarContraseña = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const json_recuperarEmail ={
      correoElectronico:email
    }

    fetch('http://127.0.0.1:8000/user/recuperarcontrasenia/', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify(json_recuperarEmail)
    })
      .then(response => response.json()).then(data => {
        if (data.code===200){
          toast.success("Email enviado");
          navigate(`/`);
        }else if(data.code===400){
          toast.error("Error al recuperar contraseña");
        }
    })
      .catch(error => {
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
              <div className="card-body p-5">
                <h1 className="fs-4 card-title fw-bold mb-4 text-black">Recuperar Contraseña</h1>
                <form onSubmit={handleSubmit} className="needs-validation">
                  <div className="mb-3">
                    <label className="mb-2 text-muted" htmlFor="email">
                      Ingrese su correo electrónico:
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      value={email}
                      onChange={handleEmailChange}
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">Enviar correo de recuperación</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <Footer/>
    </>
  );
};

export default RecuperarContraseña;