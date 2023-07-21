import React, { useState } from 'react';
import Footer from '../ComponentesGenerales/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      contraseña: password,
      correoElectronico: email
    }

    fetch('http://127.0.0.1:8000/user/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const value = data.id_consumidor
        if (data.codigo===200){
          toast.success("Login correcto");
          setTimeout(() => {
            navigate(`/home/${value}`);
          }, 500);
        }else if(data.codigo===1010){
          toast.error("Email no registrado");
        }else if(data.codigo===1000){
          toast.error("Contraseña incorrecta");
        }

      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <>
  <section className="vh-100 d-flex align-items-center justify-content-center" style={{ background: `url('QuickFoodFondo.png')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container">
        <div className="row justify-content-sm-center">
          <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <h1 className="fs-4 card-title fw-bold mb-4 text-black">QuickFood</h1>
                <form onSubmit={handleSubmit} className="needs-validation">
                  <div className="mb-3">
                    <label className="mb-2 text-muted" htmlFor="usuario">
                      Usuario
                    </label>
                    <input
                      id="usuario"
                      type="text"
                      className="form-control"
                      name="usuario"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      autoFocus
                    />
                  </div>

                  <div className="mb-3">
                    <div className="mb-2 w-100">
                      <label className="text-muted" htmlFor="contraseña">
                        Contraseña
                      </label>
                    </div>
                    <input
                      id="contraseña"
                      type="password"
                      className="form-control"
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}
                      required
                    />
                    <div className="invalid-feedback">Contraseña Requerida</div>
                  </div>

                  <div className="d-flex align-items-center">
                    <div className="form-check">
                      <input type="checkbox" name="remember" id="remember" className="form-check-input" />
                      <label htmlFor="remember" className="form-check-label">
                        Recordar
                      </label>
                    </div>
                    <button type="submit" className="btn btn-primary btn-strong ms-auto">
                      Ingresar
                    </button>
                  </div>

                  <div className="mt-2 text-center">
                    <a href="/recuperar" className="text-primary">Recuperar Contraseña</a>
                  </div>


                  <div className="mt-2 text-center">
                    ¿No tienes cuenta? <a href="/registrarse" className="text-primary">Registrarme</a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

    </section>

    </>

  );
};

export default Login;