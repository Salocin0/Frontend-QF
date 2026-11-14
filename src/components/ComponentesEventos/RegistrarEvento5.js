import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import CircularProgress from "@mui/material/CircularProgress";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Dialog } from "@mui/material";
import { FaArrowLeft, FaCheck, FaPlus, FaMapMarkerAlt, FaPen, FaTrash, FaTimes, FaLocationArrow } from "react-icons/fa";
import "./RegistrarEvento.css";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { esModoEditar, estadoPaso } from "./editarEvento";
import LoadingSpinner from "../ComponentesGenerales/LoadingSpinner";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DEFAULT_MAP_CENTER = [-34.603722, -58.381592];

const toNumber = (value) => {
  // Number("") is 0: treat empty values as missing so the map is not centered on (0, 0).
  if (String(value ?? "").trim() === "") return null;
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
};

const MapClickHandler = ({ onPick }) => {
  useMapEvents({
    click: (event) => {
      onPick(event.latlng);
    },
  });

  return null;
};

const RecenterMap = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);

  return null;
};

const RegistrarEvento5 = () => {
  const { user } = useContext(UserContext);
  const EVENTO_CREACION_ID_KEY = "eventoCreacionId";
  const { eventoId, diferenciaDiasEvento } = useParams();
  const effectiveEventoId = eventoId || localStorage.getItem(EVENTO_CREACION_ID_KEY);
  const navigate = useNavigate();
  const modoEditar = esModoEditar(useLocation().state);

  const [puntos, setPuntos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("create");
  const [selectedPunto, setSelectedPunto] = useState(null);
  const [nombre, setNombre] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [latitud, setLatitud] = useState("");
  const [longitud, setLongitud] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [eventoCenter, setEventoCenter] = useState(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const debounceRef = useRef(null);

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
      display: item.display_name,
      lat: item.lat ? String(item.lat) : "",
      lon: item.lon ? String(item.lon) : "",
    }));
  };

  const fetchPuntos = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}puntosEncuentro/${effectiveEventoId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 404) {
        setPuntos([]);
        return;
      }

      const data = await response.json();
      if (response.ok && data?.status === "success") {
        setPuntos(Array.isArray(data.data) ? data.data : []);
      } else {
        setPuntos([]);
      }
    } catch (error) {
      toast.error("Error al cargar puntos de encuentro");
      setPuntos([]);
    } finally {
      setLoading(false);
    }
  };

  // Center the map on the event location by default.
  useEffect(() => {
    if (!effectiveEventoId) return;
    fetch(`${process.env?.REACT_APP_BACK_URL}evento/${effectiveEventoId}`)
      .then((res) => res.json())
      .then((data) => {
        const lat = toNumber(data?.data?.latitud);
        const lng = toNumber(data?.data?.longitud);
        if (lat !== null && lng !== null) setEventoCenter([lat, lng]);
      })
      .catch(() => {
        // Keep the default center when the event cannot be loaded.
      });
  }, [effectiveEventoId]);

  useEffect(() => {
    fetchPuntos();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveEventoId]);

  const openModal = (type, punto = null) => {
    setModalType(type);
    setSelectedPunto(punto);

    if (type === "create") {
      // Readable default name (editable); replaced by the address when picking a point on the map.
      setNombre(`Punto de encuentro ${puntos.length + 1}`);
      setUbicacion("");
      setLatitud("");
      setLongitud("");
    } else if (punto) {
      setNombre(punto.nombre || "");
      setUbicacion("");
      setLatitud(String(punto.latitud ?? ""));
      setLongitud(String(punto.longitud ?? ""));
    }

    setSuggestions([]);
    setShowSuggestions(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPunto(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleUbicacionChange = (e) => {
    const value = e.target.value;
    setUbicacion(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length > 2) {
      debounceRef.current = setTimeout(async () => {
        try {
          const results = await fetchNominatim(value, 6);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
        } catch {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 450);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (item) => {
    setUbicacion(item.display);
    setLatitud(item.lat);
    setLongitud(item.lon);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Tu navegador no soporta geolocalización");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitud(String(position.coords.latitude));
        setLongitud(String(position.coords.longitude));
        toast.success("Ubicación actual obtenida");
      },
      () => {
        toast.error("No se pudo obtener tu ubicación actual");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleMapPick = async ({ lat, lng }) => {
    setLatitud(lat.toFixed(6));
    setLongitud(lng.toFixed(6));

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      if (data && data.address) {
        const { road, house_number, city, town, village, state } = data.address;
        const street = road ? (house_number ? `${road} ${house_number}` : road) : "";
        const locality = city || town || village || "";
        const province = state || "";

        const cleanAddress = [street, locality, province].filter(Boolean).join(", ");
        if (cleanAddress) {
          setNombre(cleanAddress);
        }
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleSave = async () => {
    if (isSaving) return;

    if (!nombre.trim() || !latitud.trim() || !longitud.trim()) {
      toast.error("Nombre, latitud y longitud son obligatorios");
      return;
    }

    setIsSaving(true);
    try {
      if (modalType === "create") {
        const response = await fetch(`${process.env?.REACT_APP_BACK_URL}puntosEncuentro/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombre: nombre.trim(),
            latitud: latitud.trim(),
            longitud: longitud.trim(),
            eventoId: effectiveEventoId,
          }),
        });

        if (!response.ok) throw new Error("create failed");
        toast.success("Punto de encuentro creado");
      } else if (selectedPunto?.id) {
        const response = await fetch(
          `${process.env?.REACT_APP_BACK_URL}puntosEncuentro/${selectedPunto.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nombre: nombre.trim(),
              latitud: latitud.trim(),
              longitud: longitud.trim(),
            }),
          }
        );

        if (!response.ok) throw new Error("update failed");
        toast.success("Punto de encuentro actualizado");
      }

      await fetchPuntos();
      closeModal();
    } catch {
      toast.error("Error al guardar el punto de encuentro");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (punto) => {
    try {
      const response = await fetch(
        `${process.env?.REACT_APP_BACK_URL}puntosEncuentro/${punto.id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("delete failed");

      toast.success("Punto de encuentro eliminado");
      await fetchPuntos();
    } catch {
      toast.error("Error al eliminar el punto de encuentro");
    }
  };

  const handleFinish = () => {
    if (isFinishing) return;

    if (puntos.length === 0) {
      toast.error("Debes crear al menos un punto de encuentro para finalizar");
      return;
    }

    setIsFinishing(true);
    setSuccessOpen(true);
    setTimeout(() => {
      localStorage.removeItem(EVENTO_CREACION_ID_KEY);
      localStorage.removeItem("eventoDatos");
      navigate("/listado-eventos-productor");
    }, 2200);
  };

  const latitudParsed = toNumber(latitud);
  const longitudParsed = toNumber(longitud);
  const mapCenter = latitudParsed !== null && longitudParsed !== null ? [latitudParsed, longitudParsed] : eventoCenter || DEFAULT_MAP_CENTER;
  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <main className="qf-event-registration-page">
        <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis eventos", url: "/listado-eventos-productor" }, { title: modoEditar ? "Editar evento · Puntos de encuentro" : "Crear un evento · Puntos de encuentro", url: `/registrar-evento5/${effectiveEventoId}/${diferenciaDiasEvento}` }]} />
        <header className="qf-event-registration-heading"><h1>{modoEditar ? "Editar evento" : "Crear un Evento"}</h1><p>Definí dónde se encontrarán los asistentes y los repartidores para entregar sus pedidos.</p></header>
        <ol className="qf-event-registration-steps" aria-label="Progreso del registro">{["Información", "Configuración", "Días del evento", "Puntos de encuentro"].map((step, index) => <li key={step} aria-current={index === 3 ? "step" : undefined} className={index < 3 ? "qf-event-step-completed" : ""}><span>{index < 3 ? <FaCheck aria-hidden="true" /> : index + 1}</span><div><small>Paso {index + 1}</small><strong>{step}</strong></div></li>)}</ol>
        <section className="qf-event-registration-form qf-event-meeting-section">
          <header className="qf-event-meeting-heading"><div><h2><FaMapMarkerAlt aria-hidden="true" /> Puntos de Encuentro</h2><p>Agregá al menos uno para completar el registro.</p></div><button type="button" className="qf-event-registration-button qf-event-registration-button--primary" onClick={() => openModal("create")} disabled={isFinishing}><FaPlus aria-hidden="true" /> Crear Punto de Encuentro</button></header>
          {loading ? <div className="qf-event-meeting-empty" role="status"><LoadingSpinner label="Cargando puntos de encuentro…" /></div> : !puntos.length ? <div className="qf-event-meeting-empty"><FaMapMarkerAlt aria-hidden="true" /><h3>Todavía no agregaste puntos de encuentro</h3><p>Elegí lugares fáciles de reconocer, como una entrada o un sector señalizado del evento.</p></div> : <><p className="qf-event-meeting-count">{puntos.length} {puntos.length === 1 ? "punto de encuentro" : "puntos de encuentro"}</p><ul className="qf-event-meeting-list">{puntos.map((punto, index) => <li key={punto.id}><span className="qf-event-meeting-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{punto.nombre}</h3><p><span>Latitud: {punto.latitud}</span><span>Longitud: {punto.longitud}</span></p></div><div className="qf-event-meeting-actions"><button type="button" className="qf-event-registration-button" onClick={() => openModal("edit", punto)} disabled={isFinishing}><FaPen aria-hidden="true" /> Editar</button><button type="button" className="qf-event-registration-button" onClick={() => handleDelete(punto)} disabled={isFinishing}><FaTrash aria-hidden="true" /> Eliminar</button></div></li>)}</ul></>}
          <footer className="qf-event-registration-footer"><span>Paso 4 de 4 · {puntos.length ? "Todo listo para completar el registro." : "Agregá un punto de encuentro antes de finalizar."}</span><div><button type="button" className="qf-event-registration-button" onClick={() => navigate(`/registrar-evento4/${diferenciaDiasEvento}`, { state: estadoPaso(eventoId, modoEditar) })} disabled={isFinishing}><FaArrowLeft aria-hidden="true" /> Volver</button><button type="button" className="qf-event-registration-button qf-event-registration-button--primary" onClick={handleFinish} disabled={isFinishing}>{isFinishing ? <><CircularProgress size={18} style={{ color: "inherit" }} /> Finalizando...</> : <><FaCheck aria-hidden="true" /> {modoEditar ? "Finalizar edición" : "Finalizar Registro"}</>}</button></div></footer>
        </section>
      </main>
      <Dialog open={showModal} onClose={() => { if (!isSaving) closeModal(); }} fullWidth maxWidth="md" className="qf-event-point-dialog" aria-labelledby="event-point-dialog-title" slotProps={{ paper: { className: "qf-event-point-paper" } }}>
        <header className="qf-event-point-dialog-heading"><div><span>Punto de encuentro</span><h2 id="event-point-dialog-title">{modalType === "create" ? "Crear Punto de Encuentro" : "Editar Punto de Encuentro"}</h2></div><button type="button" className="qf-event-point-close" aria-label="Cerrar punto de encuentro" onClick={closeModal} disabled={isSaving}><FaTimes aria-hidden="true" /></button></header>
        {showModal && <form className="qf-event-point-form" onSubmit={(event) => { event.preventDefault(); handleSave(); }} noValidate>
          <fieldset disabled={isSaving}><legend className="qf-event-registration-sr">Datos del punto de encuentro</legend><div className="qf-event-point-layout"><div className="qf-event-point-fields">
            <label htmlFor="meeting-point-name">Nombre<input id="meeting-point-name" placeholder="Nombre" value={nombre} onChange={(event) => setNombre(event.target.value)} /></label>
            <label htmlFor="meeting-point-address">Buscar ubicación<input id="meeting-point-address" placeholder="Buscar ubicación" autoComplete="off" value={ubicacion} onChange={handleUbicacionChange} /></label>
            {showSuggestions && suggestions.length > 0 && <ul className="qf-event-address-suggestions">{suggestions.map((item, index) => <li key={`${item.display}-${index}`}><button type="button" onClick={() => handleSelectSuggestion(item)}>{item.display}</button></li>)}</ul>}
            <div className="qf-event-point-coordinates"><label htmlFor="meeting-point-lat">Latitud<input id="meeting-point-lat" placeholder="Latitud" value={latitud} onChange={(event) => setLatitud(event.target.value)} /></label><label htmlFor="meeting-point-lng">Longitud<input id="meeting-point-lng" placeholder="Longitud" value={longitud} onChange={(event) => setLongitud(event.target.value)} /></label></div>
            <button type="button" className="qf-event-registration-button" onClick={handleUseCurrentLocation}><FaLocationArrow aria-hidden="true" /> Usar mi ubicación</button>
          </div><div className="qf-event-point-map-section"><p>Marcá el punto exacto haciendo clic en el mapa.</p><div className="qf-event-point-map"><MapContainer center={mapCenter} zoom={14} style={{ height: "100%", width: "100%" }} scrollWheelZoom><TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' /><RecenterMap center={mapCenter} /><MapClickHandler onPick={handleMapPick} />{latitudParsed !== null && longitudParsed !== null && <Marker position={[latitudParsed, longitudParsed]} />}</MapContainer></div></div></div></fieldset>
          <footer><button type="button" className="qf-event-registration-button" onClick={closeModal} disabled={isSaving}>Cancelar</button><button type="submit" className="qf-event-registration-button qf-event-registration-button--primary" disabled={isSaving}>{isSaving ? <><CircularProgress size={18} style={{ color: "inherit" }} /> Guardando...</> : "Guardar"}</button></footer>
        </form>}
      </Dialog>
      <Dialog open={successOpen} fullWidth maxWidth="xs" className="qf-event-registration-success-dialog" aria-labelledby="event-registration-success-title" slotProps={{ paper: { className: "qf-event-registration-success" } }}><FaCheck aria-hidden="true" /><h2 id="event-registration-success-title">{modoEditar ? "¡Cambios guardados!" : "¡Registro Exitoso!"}</h2><p>{modoEditar ? "Los cambios del evento quedaron guardados." : "El evento quedó creado y con puntos de encuentro configurados."}</p></Dialog>
      <Footer />
    </PageLayout>
  );
};
export default RegistrarEvento5;
