// Where an unfinished event draft resumes its creation wizard.
//   EnPreparacion1: step 1 (general info) is saved -> step 2, /registrar-evento3.
//   EnPreparacion2: step 2 (dates and settings) is saved -> step 3, /registrar-evento4/:days. That step reads the
//   dates from localStorage "eventoDatos", which only exists in the browser where step 2 was done, so it is rebuilt
//   from the saved event. Without valid dates the draft goes back to step 2.
export const EVENTO_CREACION_ID_KEY = "eventoCreacionId";
const DIA_MS = 1000 * 60 * 60 * 24;

const fechaValida = (value) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
};

const pasoDos = (evento) => ({ path: "/registrar-evento3", state: { eventoId: evento.id }, eventoDatos: null });

/** @returns {{ path: string, state: object, eventoDatos: object|null } | null} null when the event is not a draft. */
export const destinoSeguirPreparando = (evento) => {
  if (!evento?.id) return null;
  if (evento.estado === "EnPreparacion1") return pasoDos(evento);
  if (evento.estado !== "EnPreparacion2") return null;

  const inicio = fechaValida(evento.fechaHoraInicio);
  const fin = fechaValida(evento.fechaHoraFin);
  if (!inicio || !fin || fin <= inicio) return pasoDos(evento);

  // Same day count step 2 computes before navigating to step 3.
  const cantidadDiasEvento = Math.ceil((fin - inicio) / DIA_MS);
  return {
    path: `/registrar-evento4/${cantidadDiasEvento}`,
    state: { eventoId: evento.id },
    eventoDatos: { fechaInicio: inicio.toISOString(), fechaFin: fin.toISOString(), tienePreventa: Boolean(evento.tienePreventa), cantidadDiasEvento },
  };
};

/** Prepares the wizard storage for the draft and navigates to its pending step. */
export const seguirPreparando = (evento, navigate) => {
  const destino = destinoSeguirPreparando(evento);
  if (!destino) return false;
  try {
    localStorage.setItem(EVENTO_CREACION_ID_KEY, String(evento.id));
    if (destino.eventoDatos) localStorage.setItem("eventoDatos", JSON.stringify(destino.eventoDatos));
  } catch {
    // Without storage the wizard still receives the event id through the navigation state.
  }
  navigate(destino.path, { state: destino.state });
  return true;
};
