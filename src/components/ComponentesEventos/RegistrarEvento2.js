/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { fileToBase64 } from "../ComponentesGenerales/Utils/base64";
import "./../sass/main.scss";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import CircularProgress from "@mui/material/CircularProgress";
import { FaArrowLeft, FaArrowRight, FaImage, FaMapMarkerAlt, FaRegSave } from "react-icons/fa";
import "./RegistrarEvento.css";
import { TIPOS_EVENTO, TIPOS_PAGO } from "../../constants/eventos";
import { esEventoEditable, esModoEditar, estadoPaso, MENSAJE_NO_EDITABLE } from "./editarEvento";

const DRAFT_ESTADOS = ["EnPreparacion1", "EnPreparacion2", "EnPreparacion3"];

const RegistrarEvento2 = () => {
  const EVENTO_CREACION_ID_KEY = "eventoCreacionId";
  const [nombre, setNombre] = useState("");
  const [imagenEvento, setImagenEvento] = useState(null);
  const [croquis, setCroquis] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [tipoPago, setTipoPago] = useState("");
  const [provincias, setProvincias] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [localidades, setLocalidades] = useState([]);
  const [selectedLocalidad, setSelectedLocalidad] = useState("");
  const [selectedOptionEvento, setSelectedOptionEvento] = useState(null);
  const [selectedOptionPago, setSelectedOptionPago] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionResults, setSuggestionResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  // Edit mode: the wizard was opened from "Editar evento" to change an existing (non-draft) event.
  const modoEditar = esModoEditar(location.state);
  // Address and coordinates loaded from the saved event: kept when the address is not changed.
  const savedLocationRef = useRef(null);
  // Saved draft awaiting the user decision (continue it or start a new event).
  const [pendingDraft, setPendingDraft] = useState(null);
  // False while a stored draft id is still being verified: saving is blocked until it resolves.
  const [draftCheckDone, setDraftCheckDone] = useState(
    () => !modoEditar && !localStorage.getItem(EVENTO_CREACION_ID_KEY)
  );
  const geocodeDebounceRef = useRef(null);

  const fetchNominatim = async (query, limit = 5) => {
    if (!query || query.trim().length < 3) return [];

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&countrycodes=ar&limit=${limit}&q=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          "Accept-Language": "es",
        },
      }
    );

    if (!response.ok) return [];

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data.map((item) => ({
      formatted: item.display_name,
      components: {
        state: item.address?.state || item.address?.province || "",
        city:
          item.address?.city ||
          item.address?.town ||
          item.address?.village ||
          item.address?.municipality ||
          "",
      },
      geometry: {
        lat: item.lat ? parseFloat(item.lat) : null,
        lng: item.lon ? parseFloat(item.lon) : null,
      },
    }));
  };

  const handleImagenEventoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    fileToBase64(file, (base64) => {
      setImagenEvento(base64);
    });
  };

  const handleCroquisChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    fileToBase64(file, (base64) => {
      setCroquis(base64);
    });
  };

  const handleSiguienteClick = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!draftCheckDone) {
      toast.info("Estamos verificando si tenés un borrador guardado. Probá de nuevo en unos segundos.");
      return;
    }

    if (pendingDraft) {
      toast.info("Elegí si querés continuar con el borrador o empezar un evento nuevo.");
      return;
    }

    // Validaciones
    if (!nombre.trim()) {
      toast.error("El nombre no puede estar vacío");
      return;
    }

    if (!descripcion.trim()) {
      toast.error("La descripción no puede estar vacía");
      return;
    }

    if (!ubicacion.trim()) {
      toast.error("La ubicación no puede estar vacía");
      return;
    }

    try {
      setIsSubmitting(true);

      // Para mejorar tiempo de guardado, reutilizamos resultados ya obtenidos del autocomplete.
      const normalizedUbicacion = ubicacion.trim().toLowerCase();
      const result =
        suggestionResults.find(
          (item) => item?.formatted?.trim().toLowerCase() === normalizedUbicacion
        ) ||
        suggestionResults.find((item) =>
          item?.formatted?.toLowerCase().includes(normalizedUbicacion)
        ) ||
        null;
      const addressComponents = result?.components || {};

      const prov = addressComponents.state;
      const loc =
        addressComponents.city ||
        addressComponents.town ||
        addressComponents.village;

      let lat = result?.geometry?.lat ?? null;
      let lng = result?.geometry?.lng ?? null;

      // Unchanged address of a saved event: keep its stored coordinates instead of geocoding it again.
      const saved = savedLocationRef.current;
      if ((lat === null || lng === null) && saved && saved.latitud != null && saved.longitud != null && saved.ubicacion.trim().toLowerCase() === normalizedUbicacion) {
        lat = saved.latitud;
        lng = saved.longitud;
      }

      // No coordinates from the autocomplete: one bounded geocoding attempt. The browser geolocation
      // fallback was removed: it blocked the save for up to 5 s (permission prompt) and stored the
      // user's position instead of the event's.
      if (lat === null || lng === null) {
        try {
          const [first] = await Promise.race([
            fetchNominatim(ubicacion, 1),
            new Promise((resolve) => setTimeout(() => resolve([]), 3000)),
          ]);
          lat = first?.geometry?.lat ?? null;
          lng = first?.geometry?.lng ?? null;
        } catch {
          console.warn("No se pudo geocodificar la ubicación del evento");
        }
      }

      setProvincia(prov || "");
      setLocalidad(loc || "");

      // Crear objeto evento parcial para guardar en la BD
      const eventoParcial = {
        nombre,
        descripcion,
        imagenEvento,
        ubicacion,
        localidad: loc || selectedLocalidad || localidad,
        provincia: prov || selectedProvince || provincia,
        tipoEvento,
        tipoPago,
        // Editing never sends a state: the backend keeps the event's own state (a draft still advances).
        ...(modoEditar ? {} : { estado: "EnPreparacion1" }),
        latitud: lat,
        longitud: lng,
        consumidorId: user?.consumidorId || user?.consumidoreId || user?.id,
        productorId: user?.productorId || user?.productoreId,
      };

      const existingEventoId =
        localStorage.getItem(EVENTO_CREACION_ID_KEY) || (modoEditar && location.state?.eventoId ? String(location.state.eventoId) : null);
      let endpoint = existingEventoId
        ? `${process.env?.REACT_APP_BACK_URL}evento/preparacion/${existingEventoId}`
        : `${process.env?.REACT_APP_BACK_URL}evento`;
      let method = existingEventoId ? "PUT" : "POST";

      const doSave = () =>
        fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
            ConsumidorId: String(user?.consumidorId || user?.consumidoreId || ""),
          },
          body: JSON.stringify(eventoParcial),
        });

      // Crear una sola vez y luego actualizar por id en cada paso.
      let saveResponse = await doSave();

      // El borrador guardado en localStorage puede apuntar a un evento que ya
      // no existe (por ejemplo, si se reseteó la base de datos). En ese caso
      // reintentamos creando uno nuevo en vez de dejar al usuario trabado.
      if (saveResponse.status === 404 && existingEventoId && !modoEditar) {
        localStorage.removeItem(EVENTO_CREACION_ID_KEY);
        endpoint = `${process.env?.REACT_APP_BACK_URL}evento`;
        method = "POST";
        saveResponse = await doSave();
      }

      const saveData = await saveResponse.json().catch(() => ({}));

      if (saveResponse.ok) {
        toast.success("Evento guardado correctamente");
        const eventoId = saveData?.data?.eventoId || saveData?.data?.id || existingEventoId;
        if (eventoId) {
          localStorage.setItem(EVENTO_CREACION_ID_KEY, String(eventoId));
        }
        navigate("/registrar-evento3", { state: estadoPaso(eventoId, modoEditar) });
      } else {
        toast.error(saveData?.msg || "Error al guardar el evento");
      }
    } catch (error) {
      console.error("Error al guardar el progreso:", error);
      const isNetworkError =
        error?.name === "TypeError" && String(error?.message || "").toLowerCase().includes("failed to fetch");
      if (isNetworkError) {
        toast.error("No se pudo conectar con el backend. Verificá que el servidor esté corriendo en puerto 8000.");
      } else {
        toast.error("Error al guardar el evento");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetch("https://apis.datos.gob.ar/georef/api/provincias")
      .then((response) => response.json())
      .then((data) => {
        setProvincias(data.provincias);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleLocalidadChange = (e) => {
    setSelectedLocalidad(e.target.value);
    setLocalidad(e.target.value);
  };

  // The selected option label (text) is what gets stored, never the numeric option code.
  const handleOptionClickEvento = (value) => {
    setSelectedOptionEvento(value);
    setTipoEvento(value);
  };

  const handleOptionClickPago = (value) => {
    setSelectedOptionPago(value);
    setTipoPago(value);
  };

  const handleUbicacionChange = (e) => {
    const value = e.target.value;
    setUbicacion(value);

    if (geocodeDebounceRef.current) {
      clearTimeout(geocodeDebounceRef.current);
    }

    if (value.length > 2) {
      geocodeDebounceRef.current = setTimeout(() => {
        fetchNominatim(value, 6)
        .then((results) => {
          if (results && results.length > 0) {
            setSuggestionResults(results);
            setSuggestions(results.map((result) => result.formatted));
            setShowSuggestions(true);
            return;
          }

          setSuggestionResults([]);
          setSuggestions([]);
          setShowSuggestions(false);
        })
        .catch(() => {
          setSuggestionResults([]);
          setSuggestions([]);
          setShowSuggestions(false);
        });
      }, 450);
    } else {
      setSuggestionResults([]);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setUbicacion(suggestion.formatted);
    setSuggestionResults([suggestion]);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleVolver = () => {
    navigate("/listado-eventos-productor");
  };

  const applyDraft = (ev) => {
    setNombre(ev.nombre || "");
    setDescripcion(ev.descripcion || "");
    setUbicacion(ev.ubicacion || "");
    setLocalidad(ev.localidad || "");
    setProvincia(ev.provincia || "");
    setTipoEvento(ev.tipoEvento || "");
    setTipoPago(ev.tipoPago || "");
    setSelectedOptionEvento(ev.tipoEvento || null);
    setSelectedOptionPago(ev.tipoPago || null);
    setImagenEvento(ev.img || null);
    setCroquis(ev.croquis || null);
    savedLocationRef.current = { ubicacion: ev.ubicacion || "", latitud: ev.latitud ?? null, longitud: ev.longitud ?? null };
  };

  const handleContinueDraft = () => {
    if (pendingDraft) applyDraft(pendingDraft);
    setPendingDraft(null);
  };

  const handleDiscardDraft = () => {
    localStorage.removeItem(EVENTO_CREACION_ID_KEY);
    setPendingDraft(null);
  };

  useEffect(() => {
    const storedEventoId =
      localStorage.getItem(EVENTO_CREACION_ID_KEY) || (modoEditar && location.state?.eventoId ? String(location.state.eventoId) : null);
    if (!storedEventoId) {
      setDraftCheckDone(true);
      return;
    }
    // Coming back from step 2/4 keeps working on the same draft without asking.
    const resumingFromNextStep = Boolean(location.state?.eventoId);

    const discardStaleKey = () => localStorage.removeItem(EVENTO_CREACION_ID_KEY);

    fetch(`${process.env?.REACT_APP_BACK_URL}evento/${storedEventoId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const ev = data?.data;
        if (modoEditar) {
          // Editing preloads any editable event (drafts, EnPreparacion, Pausado); the rest must be paused first.
          if (ev?.id && esEventoEditable(ev)) {
            localStorage.setItem(EVENTO_CREACION_ID_KEY, String(storedEventoId));
            applyDraft(ev);
          } else {
            discardStaleKey();
            toast.error(MENSAJE_NO_EDITABLE);
            navigate("/listado-eventos-productor");
          }
          return;
        }
        // Only unfinished drafts can be resumed ("EnPreparacion" without suffix is a completed event).
        if (!ev || !DRAFT_ESTADOS.includes(ev.estado)) {
          discardStaleKey();
          return;
        }
        if (resumingFromNextStep) {
          applyDraft(ev);
        } else {
          setPendingDraft(ev);
        }
      })
      .catch(() => {
        // The draft could not be verified: a stale id must never be reused to overwrite an event.
        discardStaleKey();
      })
      .finally(() => setDraftCheckDone(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (geocodeDebounceRef.current) {
        clearTimeout(geocodeDebounceRef.current);
      }
    };
  }, []);

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <main className="qf-event-registration-page">
        <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis eventos", url: "/listado-eventos-productor" }, { title: modoEditar ? "Editar evento" : "Crear un evento", url: "/registrar-evento2" }]} />
        <header className="qf-event-registration-heading"><h1>{modoEditar ? "Editar evento" : "Crear un Evento"}</h1><p>{modoEditar ? "Revisá la información general y la ubicación. Después vas a revisar las fechas y los puntos de encuentro." : "Empezá con la información general y la ubicación. Después vas a configurar las fechas y los puntos de encuentro."}</p></header>
        <ol className="qf-event-registration-steps" aria-label="Progreso del registro">{["Información", "Configuración", "Días del evento", "Puntos de encuentro"].map((step, index) => <li key={step} aria-current={index === 0 ? "step" : undefined}><span>{index + 1}</span><div><small>Paso {index + 1}</small><strong>{step}</strong></div></li>)}</ol>
        {pendingDraft && <aside className="qf-event-draft-banner" role="alert"><div><FaRegSave aria-hidden="true" /><p>Tenés un borrador sin terminar: <strong>{pendingDraft.nombre || "Evento sin nombre"}</strong>.<br />Si continuás con el borrador, se van a editar sus datos.</p></div><div><button type="button" className="qf-event-registration-button qf-event-registration-button--primary" onClick={handleContinueDraft}>Continuar borrador</button><button type="button" className="qf-event-registration-button" onClick={handleDiscardDraft}>Empezar uno nuevo</button></div></aside>}
        <form className="qf-event-registration-form" onSubmit={handleSiguienteClick} noValidate>
          <fieldset disabled={isSubmitting} className="qf-event-registration-layout">
            <legend className="qf-event-registration-sr">Información general del evento</legend>
            <div className="qf-event-registration-fields">
              <section className="qf-event-registration-section"><h2>Información del evento</h2><p>Contá de qué se trata y cómo lo van a encontrar los asistentes.</p>
                <label htmlFor="nombre">Nombre Del Evento*<input type="text" id="nombre" value={nombre} onChange={(event) => setNombre(event.target.value)} placeholder="Ej.: Fiesta del Cuarteto" /></label>
                <label htmlFor="descripcion">Descripción Del Evento*<textarea id="descripcion" value={descripcion} onChange={(event) => setDescripcion(event.target.value)} placeholder="Contá qué ofrece tu evento y qué lo hace especial." rows={4} /></label>
              </section>
              <fieldset className="qf-event-registration-section qf-event-type-options"><legend>Tipo de Evento*</legend><div className="qf-event-registration-options">{TIPOS_EVENTO.map((option) => <label key={option}><input type="radio" name="event-type" checked={selectedOptionEvento === option} onChange={() => handleOptionClickEvento(option)} /><span>{option}</span></label>)}</div></fieldset>
              <fieldset className="qf-event-registration-section qf-event-payment-options"><legend>Tipo de Pago*</legend><div className="qf-event-registration-options">{TIPOS_PAGO.map((option) => <label key={option}><input type="radio" name="payment-type" checked={selectedOptionPago === option} onChange={() => handleOptionClickPago(option)} /><span>{option}</span></label>)}</div></fieldset>
              <section className="qf-event-registration-section qf-event-registration-location"><h2><FaMapMarkerAlt aria-hidden="true" /> Ubicación</h2><label htmlFor="ubicacion">Ubicación Del Evento*<input type="text" id="ubicacion" value={ubicacion} onChange={handleUbicacionChange} placeholder="Dirección, localidad y provincia" autoComplete="off" aria-describedby="event-address-help" /></label><p id="event-address-help">Elegí una sugerencia para ubicar el evento con mayor precisión.</p>{showSuggestions && <ul className="qf-event-address-suggestions" aria-label="Direcciones sugeridas">{suggestionResults.map((suggestion, index) => <li key={index}><button type="button" onClick={() => handleSuggestionClick(suggestion)}><FaMapMarkerAlt aria-hidden="true" /><span>{suggestion.formatted}</span></button></li>)}</ul>}</section>
            </div>
            <aside className="qf-event-registration-photo"><h2>Imagen del evento</h2><p>Elegí una imagen que ayude a reconocerlo.</p><div className="qf-event-registration-preview">{imagenEvento ? <img src={imagenEvento} alt="Vista previa del evento" /> : <div><FaImage aria-hidden="true" /><span>Tu evento empieza a verse acá</span></div>}</div><label htmlFor="imagen">Imagen del Evento<input type="file" id="imagen" accept="image/*" onChange={handleImagenEventoChange} /></label><span className="qf-event-photo-help">Usá una foto clara, con el contenido principal en el centro.</span></aside>
          </fieldset>
          <footer className="qf-event-registration-footer"><span>Paso 1 de 4 · {modoEditar ? "Tus cambios se guardan al continuar." : "Tu avance se guarda al continuar."}</span><div><button type="button" className="qf-event-registration-button" onClick={handleVolver} disabled={isSubmitting}><FaArrowLeft aria-hidden="true" /> Volver</button><button type="submit" className="qf-event-registration-button qf-event-registration-button--primary" disabled={isSubmitting}>{isSubmitting ? <><CircularProgress size={18} style={{ color: "inherit" }} /> Guardando...</> : <>Siguiente <FaArrowRight aria-hidden="true" /></>}</button></div></footer>
        </form>
      </main><Footer />
    </PageLayout>
  );
};
export default RegistrarEvento2;
