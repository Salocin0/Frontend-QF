import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaClipboardCheck, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import Footer from "../ComponentesGenerales/Footer";
import "./RequisitosEvento.css";

const exampleRequirements = [
  { id: 1, titulo: "Experiencia como repartidor", descripcion: "Contanos brevemente tu experiencia en entregas o eventos.", tipo: "Cadena de texto" },
  { id: 3, titulo: "Disponibilidad horaria", descripcion: "Cantidad de horas que podrías trabajar por jornada.", tipo: "Numerico" },
  { id: 4, titulo: "Documentación requerida", descripcion: "Adjuntá el documento solicitado por el organizador en formato PDF.", tipo: "PDF" },
];
export const requirementOptions = (value) => {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value !== "string") return [];
  try { const parsed = JSON.parse(value); if (Array.isArray(parsed)) return parsed.map(String); } catch (_) { /* Accept the comma-separated format used by the event editor. */ }
  return value.split(/[,;\n]/).map((option) => option.trim()).filter(Boolean);
};
function FormDinamicoRestricciones() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const preview = id === "ejemplo";
  const [requirements, setRequirements] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(!preview);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [readingFiles, setReadingFiles] = useState(0);
  const [fileNames, setFileNames] = useState({});
  const savingRef = useRef(false);
  useEffect(() => {
    setResponses({});
    if (preview) { setRequirements(exampleRequirements); setLoading(false); setError(false); return; }
    const controller = new AbortController();
    setLoading(true); setError(false);
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}restriccion/evento/${id}`, { headers: { ConsumidorId: user?.consumidorId }, signal: controller.signal });
        if (response.status === 404) { if (!controller.signal.aborted) setRequirements([]); return; }
        if (!response.ok) throw new Error("No se pudieron cargar los requisitos");
        const result = await response.json();
        if (!Array.isArray(result.data)) throw new Error("Respuesta inválida");
        if (!controller.signal.aborted) setRequirements(result.data);
      } catch (err) { if (!controller.signal.aborted) setError(true); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [id, preview, user?.consumidorId, attempt]);
  const isAvailability = (item) => item?.tipo === "Numerico" && String(item.titulo).trim().toLocaleLowerCase("es").includes("disponibilidad horaria");
  const change = (key, value) => {
    if (isAvailability(requirements.find((item) => item.id === key)) && Number(value) < 0) return;
    setResponses((current) => ({ ...current, [key]: value }));
  };
  const attachFile = async (item, input) => {
    const file = input.files?.[0];
    change(item.id, "");
    setFileNames((current) => ({ ...current, [item.id]: "" }));
    if (!file) return;
    const allowed = item.tipo === "PDF" ? file.type === "application/pdf" || (!file.type && /\.pdf$/i.test(file.name)) : ["image/jpeg", "image/png"].includes(file.type);
    if (!allowed || file.size > 5 * 1024 * 1024) { toast.error("Seleccioná un archivo válido de hasta 5 MB."); input.value = ""; return; }
    setReadingFiles((value) => value + 1);
    try {
      const data = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(new Error("No pudimos leer el archivo.")); reader.readAsDataURL(file); });
      change(item.id, { name: file.name, data: item.tipo === "PDF" && !file.type ? data.replace(/^data:[^;]*;base64,/, "data:application/pdf;base64,") : data, mimeType: file.type || "application/pdf" });
      setFileNames((current) => ({ ...current, [item.id]: file.name }));
    } catch (err) { toast.error("No pudimos leer el archivo. Seleccionalo nuevamente."); input.value = ""; }
    finally { setReadingFiles((value) => value - 1); }
  };
  const submit = async (event) => {
    event.preventDefault();
    if (preview || readingFiles || savingRef.current || loading || error || !requirements.length || !user?.consumidorId) return;
    if (requirements.some((item) => !String(responses[item.id] ?? "").trim())) { toast.error("Completá todos los requisitos antes de enviar."); return; }
    const restricciones = Object.fromEntries(requirements.map((item, index) => [`restriccion${index + 1}`, { respuesta: responses[item.id], RestriccionId: item.id }]));
    savingRef.current = true; setSaving(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}asociacion/evento/${id}/asociar/0/${user.consumidorId}`, { method: "POST", headers: { "Content-Type": "application/json", ConsumidorId: user.consumidorId }, body: JSON.stringify({ restricciones }) });
      const result = await response.json();
      if (!response.ok || result.status === "error" || Number(result.code) >= 400) throw new Error(result.msg || "No pudimos enviar tu solicitud. Intentá nuevamente.");
      toast.success("Solicitud de asociación enviada correctamente"); navigate("/asociarRepartidorAEvento");
    } catch (err) { toast.error(err.message || "No pudimos enviar tu solicitud. Intentá nuevamente."); }
    finally { savingRef.current = false; setSaving(false); }
  };
  return <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}><main className="qf-requirements-page">
    <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Asociarme a un evento", url: "/asociarRepartidorAEvento" }, { title: "Requisitos del evento", url: `/restriccionesEvento/${id}` }]} />
    <header className="qf-requirements-heading"><div><h1>Requisitos del evento</h1><p>Completá la información solicitada por el organizador para enviar tu asociación.</p></div><Link className="qf-requirements-button" to="/asociarRepartidorAEvento"><FaArrowLeft aria-hidden="true" /> Volver</Link></header>
    {preview && <aside className="qf-requirements-preview" role="note"><strong>Vista de ejemplo</strong><p>Estos requisitos son de muestra. Podés probar los campos; no se enviará ninguna solicitud.</p></aside>}
    {loading ? <p role="status" className="qf-requirements-feedback">Cargando requisitos…</p> : error ? <div role="alert" className="qf-requirements-feedback"><h2>No pudimos cargar los requisitos</h2><button type="button" className="qf-requirements-button" onClick={() => setAttempt((value) => value + 1)}>Reintentar</button></div> : !requirements.length ? <div className="qf-requirements-feedback"><FaClipboardCheck aria-hidden="true" /><h2>Este evento no tiene requisitos cargados</h2><p>Volvé al listado de eventos para continuar con tu asociación.</p><Link className="qf-requirements-button" to="/asociarRepartidorAEvento">Ver eventos</Link></div> : <form className="qf-requirements-form" onSubmit={submit}>
      <header><h2>Información para tu solicitud</h2><p>Todos los requisitos son obligatorios.</p></header><fieldset disabled={saving || readingFiles > 0}>
        {requirements.map((item, index) => <section className="qf-requirement-field" key={item.id}><span className="qf-requirement-number" aria-hidden="true">{index + 1}</span><div><label htmlFor={`requirement-${item.id}`}>{item.titulo}</label>{item.descripcion && <p id={`requirement-help-${item.id}`}>{item.descripcion}</p>}{["select", "Opciones"].includes(item.tipo) ? <select id={`requirement-${item.id}`} aria-describedby={`requirement-help-${item.id}`} required value={responses[item.id] ?? ""} onChange={(event) => change(item.id, event.target.value)}><option value="">Seleccioná una opción</option>{requirementOptions(item.opciones).map((option, optionIndex) => <option key={optionIndex} value={option}>{option}</option>)}</select> : ["PDF", "Imagen"].includes(item.tipo) ? <input id={`requirement-${item.id}`} aria-describedby={`requirement-help-${item.id}`} type="file" accept={item.tipo === "PDF" ? ".pdf,application/pdf" : "image/png,image/jpeg"} required onChange={(event) => attachFile(item, event.currentTarget)} /> : <input id={`requirement-${item.id}`} aria-describedby={`requirement-help-${item.id}`} type={item.tipo === "Numerico" ? "number" : "text"} min={isAvailability(item) ? 0 : undefined} onKeyDown={(event) => { if (isAvailability(item) && event.key === "-") event.preventDefault(); }} required value={responses[item.id] ?? ""} onChange={(event) => change(item.id, event.target.value)} />}{["PDF", "Imagen"].includes(item.tipo) && <p className="qf-requirement-file-hint">{fileNames[item.id] ? `Archivo listo: ${fileNames[item.id]}` : "Hasta 5 MB por archivo. El organizador podrá descargarlo para revisar tu solicitud."}</p>}</div></section>)}
      </fieldset><footer><p>{preview ? "Vista de muestra: el envío está deshabilitado." : "Revisá tus respuestas antes de enviar la solicitud."}</p><button className="qf-requirements-button qf-requirements-button--primary" type="submit" disabled={preview || saving || readingFiles > 0 || !user?.consumidorId}><FaPaperPlane aria-hidden="true" />{saving ? "Enviando…" : "Enviar solicitud"}</button></footer>
    </form>}
  </main><Footer /></PageLayout>;
}
export default FormDinamicoRestricciones;
