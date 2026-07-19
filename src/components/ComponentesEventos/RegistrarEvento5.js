import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import useBreakpoint from "../../useBreakpoint";
import { UserContext } from "../ComponentesGenerales/UserContext";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const toNumber = (value) => {
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
  const { isMobile } = useBreakpoint();
  const { user } = useContext(UserContext);
  const EVENTO_CREACION_ID_KEY = "eventoCreacionId";
  const { eventoId, diferenciaDiasEvento } = useParams();
  const effectiveEventoId = eventoId || localStorage.getItem(EVENTO_CREACION_ID_KEY);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchPuntos();
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveEventoId]);

  const generateCode = (length = 6) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i += 1) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const openModal = (type, punto = null) => {
    setModalType(type);
    setSelectedPunto(punto);

    if (type === "create") {
      setNombre(generateCode(6));
      setUbicacion("");
      setLatitud("");
      setLongitud("");
    } else if (punto) {
      setNombre(punto.nombre || "");
      setUbicacion("");
      setLatitud(punto.latitud || "");
      setLongitud(punto.longitud || "");
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

  const styles = {
    contentCol: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      width: "100%",
      boxSizing: "border-box",
      padding: isMobile ? "0 12px 70px" : "0 20px 70px",
    },
    titleWrap: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
      color: "var(--qf-text-primary)",
      width: "100%",
    },
    breadcrumbWrapper: {
      width: "100%",
      paddingTop: "10px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    panel: {
      margin: "20px",
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "10px",
      backgroundColor: "var(--qf-bg-secondary)",
      padding: "20px",
      color: "var(--qf-text-primary)",
    },
    topActions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "10px",
      marginBottom: "15px",
      flexWrap: "wrap",
    },
    button: {
      backgroundColor: "var(--qf-blue)",
      color: "var(--qf-text-primary)",
      border: "none",
      borderRadius: "6px",
      padding: "10px 14px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    buttonSecondary: {
      backgroundColor: "#6c757d",
    },
    greenButton: {
      backgroundColor: "var(--qf-green)",
    },
    redButton: {
      backgroundColor: "var(--qf-rojo)",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      borderBottom: `1px solid var(--qf-naranja)`,
      padding: "10px",
      color: "var(--qf-naranja)",
      textAlign: "left",
    },
    td: {
      borderBottom: `1px solid rgba(255,255,255,0.12)`,
      padding: "10px",
      color: "var(--qf-text-primary)",
    },
    actionsCell: {
      display: "flex",
      gap: "8px",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.45)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1100,
    },
    modal: {
      backgroundColor: "var(--qf-bg-secondary)",
      border: `1px solid var(--qf-naranja)`,
      borderRadius: "10px",
      width: "min(680px, 92vw)",
      padding: "20px",
      color: "var(--qf-text-primary)",
    },
    input: {
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #999",
      marginBottom: "10px",
    },
    rowButtons: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "10px",
      flexWrap: "wrap",
    },
    mapHint: {
      fontSize: "0.9rem",
      color: "rgba(255,255,255,0.85)",
      marginTop: "4px",
      marginBottom: "8px",
    },
    mapContainer: {
      width: "100%",
      height: "260px",
      borderRadius: "10px",
      overflow: "hidden",
      border: `1px solid var(--qf-naranja)`,
      marginTop: "8px",
      marginBottom: "8px",
    },
    map: {
      width: "100%",
      height: "100%",
    },
    mobileHint: {
      marginTop: "14px",
      marginBottom: "0",
      padding: "10px 12px",
      borderRadius: "8px",
      border: `1px dashed var(--qf-naranja)`,
      color: "var(--qf-text-primary)",
      backgroundColor: "rgba(0,0,0,0.18)",
      fontSize: "0.95rem",
    },
    suggestions: {
      listStyle: "none",
      margin: "0",
      padding: "0",
      maxHeight: "180px",
      overflowY: "auto",
      border: "1px solid #999",
      borderRadius: "8px",
      backgroundColor: "var(--qf-blanco-puro)",
      color: "#111",
    },
    suggestionItem: {
      padding: "8px 10px",
      cursor: "pointer",
      borderBottom: "1px solid #ddd",
    },
    successOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      zIndex: 1049,
    },
    successCard: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "var(--qf-bg-secondary)",
      color: "var(--qf-text-primary)",
      padding: "2rem",
      borderRadius: "12px",
      border: `1px solid var(--qf-naranja)`,
      boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.35)",
      textAlign: "center",
      zIndex: 1050,
      maxWidth: "460px",
      width: "100%",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Eventos", url: "/listado-eventos-productor" },
    { title: "Crear un Evento (4/4)", url: `/registrar-evento5/${effectiveEventoId}` },
  ];

  const latitudParsed = toNumber(latitud);
  const longitudParsed = toNumber(longitud);
  const mapCenter =
    latitudParsed !== null && longitudParsed !== null
      ? [latitudParsed, longitudParsed]
      : [-34.603722, -58.381592];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
          <div style={styles.contentCol}>
          <div style={styles.titleWrap}>
            <h1>Crear un Evento</h1>
          </div>
          <hr style={{ color: "var(--qf-naranja)", border: `1px solid var(--qf-naranja)` }} />

          <div style={styles.breadcrumbWrapper}>
            <Breadcrumb
              items={breadcrumbItems}
              style={{ width: "100%" }}
            />
          </div>

          <div style={styles.panel}>
            <div style={styles.topActions}>
              <h3 style={{ color: "var(--qf-naranja)", margin: 0 }}>Puntos de Encuentro</h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  style={styles.button}
                  onClick={() => navigate(`/registrar-evento4/${diferenciaDiasEvento}`, { state: { eventoId } })}
                >
                  Volver
                </button>
                <button style={{ ...styles.button, ...styles.greenButton }} onClick={() => openModal("create")}>
                  Crear Punto de Encuentro
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "30px" }}>
                <CircularProgress style={{ color: "var(--qf-naranja)" }} />
              </div>
            ) : puntos.length === 0 ? (
              <p style={{ color: "var(--qf-text-primary)" }}>
                No hay puntos de encuentro cargados. Debes crear al menos uno para finalizar.
              </p>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Nombre</th>
                    <th style={styles.th}>Latitud</th>
                    <th style={styles.th}>Longitud</th>
                    <th style={styles.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {puntos.map((punto) => (
                    <tr key={punto.id}>
                      <td style={styles.td}>{punto.nombre}</td>
                      <td style={styles.td}>{punto.latitud}</td>
                      <td style={styles.td}>{punto.longitud}</td>
                      <td style={styles.td}>
                        <div style={styles.actionsCell}>
                          <button style={styles.button} onClick={() => openModal("edit", punto)}>
                            Editar
                          </button>
                          <button
                            style={{ ...styles.button, ...styles.redButton }}
                            onClick={() => handleDelete(punto)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
              <button
                style={{ ...styles.button, ...styles.greenButton }}
                onClick={handleFinish}
                disabled={isFinishing}
              >
                {isFinishing && <CircularProgress size={18} style={{ color: "var(--qf-text-primary)", marginRight: 8 }} />}
                {isFinishing ? "Finalizando..." : "Finalizar Registro"}
              </button>
            </div>

            <p style={styles.mobileHint}>
              Recomendacion: para finalizar esta configuracion con mayor comodidad,
              te sugerimos hacerlo desde el telefono.
            </p>
        </div>
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h4 style={{ color: "var(--qf-naranja)", marginTop: 0 }}>
              {modalType === "create" ? "Crear Punto de Encuentro" : "Editar Punto de Encuentro"}
            </h4>

            <input
              style={styles.input}
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Buscar ubicación"
              value={ubicacion}
              onChange={handleUbicacionChange}
            />

            {showSuggestions && suggestions.length > 0 && (
              <ul style={styles.suggestions}>
                {suggestions.map((item, index) => (
                  <li
                    key={`${item.display}-${index}`}
                    style={styles.suggestionItem}
                    onClick={() => handleSelectSuggestion(item)}
                  >
                    {item.display}
                  </li>
                ))}
              </ul>
            )}

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <input
                style={styles.input}
                placeholder="Latitud"
                value={latitud}
                onChange={(e) => setLatitud(e.target.value)}
              />
              <input
                style={styles.input}
                placeholder="Longitud"
                value={longitud}
                onChange={(e) => setLongitud(e.target.value)}
              />
            </div>

            <p style={styles.mapHint}>Marca el punto exacto haciendo click en el mapa.</p>
            <div style={styles.mapContainer}>
              <MapContainer center={mapCenter} zoom={14} style={styles.map} scrollWheelZoom>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <RecenterMap center={mapCenter} />
                <MapClickHandler onPick={handleMapPick} />
                {latitudParsed !== null && longitudParsed !== null && (
                  <Marker position={[latitudParsed, longitudParsed]} />
                )}
              </MapContainer>
            </div>

            <div style={styles.rowButtons}>
              <button style={styles.button} onClick={handleUseCurrentLocation}>
                Usar mi ubicación
              </button>
              <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={closeModal}>
                Cancelar
              </button>
              <button style={{ ...styles.button, ...styles.greenButton }} onClick={handleSave} disabled={isSaving}>
                {isSaving && <CircularProgress size={16} style={{ color: "var(--qf-text-primary)", marginRight: 8 }} />}
                {isSaving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {successOpen && (
        <>
          <div style={styles.successOverlay} />
          <div style={styles.successCard}>
            <h5 style={{ color: "var(--qf-naranja)", marginBottom: "0.75rem", fontWeight: "bold", fontSize: "1.5rem" }}>
              ¡Registro Exitoso!
            </h5>
            <p style={{ color: "var(--qf-text-primary)", margin: 0, lineHeight: "1.5", fontSize: "1rem" }}>
              El evento quedó creado y con puntos de encuentro configurados.
            </p>
          </div>
        </>
      )}

      <Footer />
    </PageLayout>
  );
};

export default RegistrarEvento5;
