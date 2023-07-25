import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CambiarContraseña = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { codigo } = useParams();
  const navigate = useNavigate();

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      const json_contrasenia = {
          contraseña:newPassword
      }
      fetch('http://127.0.0.1:8000/user/recuperarcontrasenia/'+codigo+'/', {
      method: 'PUT',
      headers: {'Content-Type': 'application/json',},
      body: JSON.stringify(json_contrasenia)
    })
      .then(response => response.json()).then(data => {
        if (data.code===200){
          toast.success("Contraseña guardada correctamente");
          setTimeout(() => {
            navigate(`/`);
          }, 1500);
        }else if(data.code===400){
          toast.error("Error al guardar la contraseña");
        }
    })
      .catch(error => {
        console.error(error);
    });
    } else {
      toast.error("Las contraseñas no coinciden");
    }
  };

  return (
    <section className="vh-100 d-flex align-items-center justify-content-center" style={{ background: 'url(QuickFoodFondo.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="container">
        <div className="row justify-content-sm-center">
          <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-7 col-sm-9">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <h1 className="fs-4 card-title fw-bold mb-4 text-black">Cambiar Contraseña</h1>
                <form onSubmit={handleSubmit} className="needs-validation">
                  <div className="mb-3">
                    <label className="mb-2 text-muted" htmlFor="newPassword">
                      Nueva Contraseña:
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      className="form-control"
                      value={newPassword}
                      onChange={handleNewPasswordChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="mb-2 text-muted" htmlFor="confirmPassword">
                      Repetir Contraseña:
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className="form-control"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      required
                    />
                  </div>
                  <div className="d-grid">
                    <button type="submit" className="btn btn-primary">Cambiar Contraseña</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CambiarContraseña;