import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import LoadingSpinner from "../../ComponentesGenerales/LoadingSpinner";
export const summarizeDeliveryRatings = (data) => {
  const ratings = (Array.isArray(data) ? data : []).filter((rating) => Number.isInteger(Number(rating.puntuacion)) && Number(rating.puntuacion) >= 1 && Number(rating.puntuacion) <= 5);
  const distribution = [5, 4, 3, 2, 1].map((score) => ({ score, count: ratings.filter((rating) => Number(rating.puntuacion) === score).length }));
  return { count: ratings.length, average: ratings.length ? ratings.reduce((sum, rating) => sum + Number(rating.puntuacion), 0) / ratings.length : null, distribution };
};
const ValoracionesRepartidor = ({ consumidorId }) => {
  const [state, setState] = useState({ loading: true, error: false, data: [] });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, error: false, data: [] });
    (async () => {
      try {
        const base = (process.env.REACT_APP_BACK_URL || "").replace(/\/?$/, "/");
        const response = await fetch(`${base}valoracion/user/${consumidorId}`, { headers: { ConsumidorId: consumidorId }, signal: controller.signal });
        if (!response.ok) throw new Error("No se pudieron cargar las valoraciones");
        const result = await response.json();
        if (!controller.signal.aborted) setState({ loading: false, error: false, data: result.data });
      } catch (error) { if (!controller.signal.aborted) setState({ loading: false, error: true, data: [] }); }
    })();
    return () => controller.abort();
  }, [consumidorId, attempt]);
  const summary = summarizeDeliveryRatings(state.data);
  return <section className="qf-profile-chart qf-delivery-rating-chart" aria-labelledby="courier-profile-rating-title" aria-busy={state.loading}>
    <header className="qf-profile-chart-heading"><h3 id="courier-profile-rating-title">Mis valoraciones como repartidor</h3><p className="qf-profile-chart-caption">Calificaciones recibidas de tus clientes en todos los eventos.</p></header>
    {state.loading ? <p role="status" className="qf-profile-empty"><LoadingSpinner label="Cargando valoraciones…" /></p> : state.error ? <div role="alert"><p>No pudimos cargar tus valoraciones.</p><button type="button" className="qf-delivery-profile-button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div> : !summary.count ? <p className="qf-profile-empty">Todavía no recibiste valoraciones. Cuando un cliente califique tu entrega, vas a verla acá.</p> : <div className="qf-delivery-rating-layout"><div className="qf-delivery-rating-overview"><span>Mi valoración promedio</span><strong><FaStar aria-hidden="true" /> {summary.average.toLocaleString("es-AR", { maximumFractionDigits: 1 })}<small> / 5</small></strong><p>{summary.count} {summary.count === 1 ? "calificación recibida" : "calificaciones recibidas"}</p></div><ul className="qf-delivery-rating-bars" aria-label="Distribución de calificaciones">{summary.distribution.map(({ score, count }) => <li key={score}><span>{score} <FaStar aria-hidden="true" /><span className="visually-hidden">estrellas</span></span><div className="qf-profile-bar-track" aria-hidden="true"><div className="qf-profile-bar-fill" style={{ width: `${count / summary.count * 100}%` }} /></div><strong>{count}<span className="visually-hidden"> calificaciones</span></strong></li>)}</ul></div>}
  </section>;
};
export default ValoracionesRepartidor;
