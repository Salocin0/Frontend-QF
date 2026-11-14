import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { UserContext } from "../ComponentesGenerales/UserContext";
import PageLayout from "../ComponentesGenerales/PageLayout";
import FormPuestoEditar from "./FormPuestoEditar";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import Footer from "../ComponentesGenerales/Footer";
import "./PuestoInformacion.css";
import LoadingSpinner from "../ComponentesGenerales/LoadingSpinner";

const ConsultarPuestoSolicitud = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const initial = state && String(state.id) === String(id) ? state : null;
  const [carrito, setCarrito] = useState(initial);
  const [loading, setLoading] = useState(!initial);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (state && String(state.id) === String(id)) { setCarrito(state); setLoading(false); setError(false); return; }
    const controller = new AbortController();
    setLoading(true); setError(false);
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}puesto/consultar/${id}`, { signal: controller.signal });
        if (!response.ok) throw new Error("No se pudo cargar el puesto");
        const result = await response.json();
        if (!result.data?.id) throw new Error("Puesto no encontrado");
        if (!controller.signal.aborted) setCarrito(result.data);
      } catch (err) { if (!controller.signal.aborted) setError(true); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [id, state, attempt]);
  return <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
    <main className="qf-stand-info-page">
      <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis puestos", url: "/listado-puestos-encargado" }, { title: "Información de mi puesto", url: `/info-puesto/${id}` }]} />
      <header className="qf-stand-info-heading"><div><h1>Información del puesto</h1><p>Consultá y actualizá los datos de tu puesto de comida.</p></div><Link className="qf-stand-info-button" to="/listado-puestos-encargado"><FaArrowLeft aria-hidden="true" /> Mis puestos</Link></header>
      {loading ? <p className="qf-stand-info-feedback" role="status"><LoadingSpinner label="Cargando información del puesto…" /></p> : error ? <div className="qf-stand-info-feedback" role="alert"><h2>No pudimos cargar el puesto</h2><button type="button" className="qf-stand-info-button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div> : <FormPuestoEditar key={carrito.id} carrito={carrito} onSaved={setCarrito} />}
    </main><Footer />
  </PageLayout>;
};
export default ConsultarPuestoSolicitud;
