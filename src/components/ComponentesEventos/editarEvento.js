// Editing an event reuses the creation wizard (/registrar-evento2 -> 3 -> 4 -> 5) with its data preloaded.
// Only drafts, completed-but-unconfirmed events (EnPreparacion) and paused events can be edited: a confirmed or
// running event has to be paused first. The backend enforces the same rule on PUT evento/preparacion/:id.
import { EVENTO_CREACION_ID_KEY } from "./seguirPreparando";

export const MODO_EDITAR = "editar";
export const ESTADOS_EDITABLES = ["EnPreparacion1", "EnPreparacion2", "EnPreparacion3", "EnPreparacion", "Pausado"];
export const MENSAJE_NO_EDITABLE = "Este evento no se puede editar en su estado actual. Pausalo para editarlo.";

export const esEventoEditable = (evento) => ESTADOS_EDITABLES.includes(evento?.estado);

/** True when the wizard step was opened to edit an existing event (navigation state { modo: "editar" }). */
export const esModoEditar = (locationState) => locationState?.modo === MODO_EDITAR;

/** Navigation state for the next/previous wizard step: edit mode travels with it, creation keeps its old shape. */
export const estadoPaso = (eventoId, modoEditar) => (modoEditar ? { eventoId, modo: MODO_EDITAR } : { eventoId });

/** Formats a stored date as the wall-clock value a datetime-local input expects (browser timezone). */
export const toDatetimeLocal = (value) => {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/** Opens the creation wizard preloaded with the event. Returns false (and does nothing) when it is not editable. */
export const editarEvento = (evento, navigate) => {
  if (!evento?.id || !esEventoEditable(evento)) return false;
  try {
    localStorage.setItem(EVENTO_CREACION_ID_KEY, String(evento.id));
    // Step 3 rebuilds its days from this key: a value left by another event must not leak into this edit.
    localStorage.removeItem("eventoDatos");
  } catch {
    // Without storage the wizard still receives the event id through the navigation state.
  }
  navigate("/registrar-evento2", { state: { eventoId: evento.id, modo: MODO_EDITAR } });
  return true;
};
