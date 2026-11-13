import React, { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";
import LoadingSpinner from "../ComponentesGenerales/LoadingSpinner";
const RequisitosSolicitud = ({ asociacionId, consumidorId }) => {
  const [state, setState] = useState({ loading: true, error: false, answers: [] });
  const [attempt, setAttempt] = useState(0);
  const [downloading, setDownloading] = useState(null);
  const path = `${process.env.REACT_APP_BACK_URL}asociacion/${asociacionId}/requisitos`;
  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, error: false, answers: [] });
    (async () => {
      try {
        const response = await fetch(path, { headers: { ConsumidorId: consumidorId }, signal: controller.signal });
        if (!response.ok) throw new Error("No se pudieron cargar los requisitos");
        const result = await response.json();
        if (!controller.signal.aborted) setState({ loading: false, error: false, answers: Array.isArray(result.data) ? result.data : [] });
      } catch (error) { if (!controller.signal.aborted) setState({ loading: false, error: true, answers: [] }); }
    })();
    return () => controller.abort();
  }, [path, consumidorId, attempt]);
  const download = async (answer) => {
    if (downloading != null) return;
    setDownloading(answer.id);
    let url;
    try {
      const response = await fetch(`${path}/${answer.id}/archivo`, { headers: { ConsumidorId: consumidorId } });
      if (!response.ok) throw new Error("No se pudo descargar el archivo");
      const blob = await response.blob();
      url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = answer.archivo.nombre; document.body.appendChild(anchor); anchor.click(); anchor.remove();
    } catch (error) { toast.error("No pudimos descargar el archivo. Intentá nuevamente."); }
    finally { if (url) { const revoke = URL.revokeObjectURL.bind(URL); setTimeout(() => revoke(url), 1000); } setDownloading(null); }
  };
  return <section className="qf-request-requirements" aria-label="Requisitos y documentos de la solicitud"><h3>Requisitos y documentos</h3>{state.loading ? <p role="status"><LoadingSpinner label=<LoadingSpinner label="Cargando requisitos…" /> /></p> : state.error ? <div role="alert"><p>No pudimos cargar los requisitos de esta solicitud.</p><button type="button" className="qf-event-request-button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div> : state.answers.length ? <ul>{state.answers.map((answer) => <li key={answer.id}><h4>{answer.titulo}</h4>{answer.archivo ? <div><span>{answer.archivo.nombre}</span><button type="button" className="qf-event-request-button" disabled={downloading != null} onClick={() => download(answer)}><FaDownload aria-hidden="true" />{downloading === answer.id ? "Descargando…" : "Descargar archivo"}</button></div> : <p>{answer.respuesta}</p>}</li>)}</ul> : <p>Esta solicitud no tiene requisitos adjuntos.</p>}</section>;
};
export default RequisitosSolicitud;
