/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { fileToBase64 } from "../ComponentesGenerales/Utils/base64";
import "./../sass/main.scss";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import CircularProgress from "@mui/material/CircularProgress";
import useBreakpoint from "../../useBreakpoint";

const RegistrarEvento2 = () => {
  const { isMobile } = useBreakpoint();
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
    const file = e.target.files[0];

    fileToBase64(file, (base64) => {
      setImagenEvento(base64);
    });
  };

  const handleCroquisChange = (e) => {
    const file = e.target.files[0];

    fileToBase64(file, (base64) => {
      setCroquis(base64);
    });
  };

  const handleSiguienteClick = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

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

      // Si Nominatim no encontró coordenadas, intentar con geolocalización del navegador
      if (lat === null || lng === null) {
        try {
          const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 5000,
            });
          });
          lat = String(pos.coords.latitude);
          lng = String(pos.coords.longitude);
        } catch {
          // No se pudo obtener ubicación, sigue con null
          console.warn("No se pudo obtener ubicación del navegador");
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
        estado: "EnPreparacion1",
        latitud: lat,
        longitud: lng,
        consumidorId: user?.consumidorId || user?.consumidoreId || user?.id,
        productorId: user?.productorId || user?.productoreId,
      };

      const existingEventoId = localStorage.getItem(EVENTO_CREACION_ID_KEY);
      const endpoint = existingEventoId
        ? `${process.env?.REACT_APP_BACK_URL}evento/preparacion/${existingEventoId}`
        : `${process.env?.REACT_APP_BACK_URL}evento`;
      const method = existingEventoId ? "PUT" : "POST";

      // Crear una sola vez y luego actualizar por id en cada paso.
      const saveResponse = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
          ConsumidorId: String(user?.consumidorId || user?.consumidoreId || ""),
        },
        body: JSON.stringify(eventoParcial),
      });

      const saveData = await saveResponse.json().catch(() => ({}));

      if (saveResponse.ok) {
        toast.success("Evento guardado correctamente");
        const eventoId = existingEventoId || saveData?.data?.eventoId || saveData?.data?.id;
        if (eventoId) {
          localStorage.setItem(EVENTO_CREACION_ID_KEY, String(eventoId));
        }
        navigate("/registrar-evento3", { state: { eventoId } });
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

  useEffect(() => {
    const storedEventoId = localStorage.getItem(EVENTO_CREACION_ID_KEY);
    if (!storedEventoId) return;

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
        if (!ev) return;
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
      })
      .catch(() => {
        // Si falla la carga de borrador, no bloqueamos el formulario.
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (geocodeDebounceRef.current) {
        clearTimeout(geocodeDebounceRef.current);
      }
    };
  }, []);

  const styles = {
    rowFormEvento: {
      display: "flex",
      flexDirection: "column",
      flex: 1,
      minHeight: 0,
      height: "100%",
      boxSizing: "border-box",
    },
    colForm: {
      flex: 1,
      minHeight: 0,
      padding: 0,
      display: "flex",
      justifyContent: "center",
      boxSizing: "border-box",
      overflowY: "auto",
      width: "100%",
    },
    darkFormWrapper: {
      backgroundColor: "var(--qf-bg-secondary)",
      border: `1px solid var(--qf-naranja)`,
      padding: "1rem",
      borderRadius: "10px",
      boxSizing: "border-box",
      width: "100%",
      maxWidth: "800px",
      height: "fit-content",
      margin: isMobile ? "0 12px 20px" : "0 20px 20px",
    },
    formGroup: {
      marginBottom: "0.5rem",
      position: "relative",
    },
    formLabel: {
      display: "block",
      fontSize: "1rem",
      color: "var(--qf-text-white)",
      margin: "0",
    },
    formInput: {
      width: "100%",
      padding: "0.5rem",
      fontSize: "1rem",
      borderRadius: "10px",
    },
    optionContainerEvento: {
      display: "flex",
      justifyContent: "space-between",
    },
    opcionesEvento: {
      padding: "0.5rem 1rem",
      backgroundColor: "var(--qf-bg-main)",
      color: "var(--qf-text-primary)",
      cursor: "pointer",
      borderRadius: "5px",
      textAlign: "center",
      flex: 1,
      marginRight: "0.5rem",
    },
    opcionesEventoSelected: {
      backgroundColor: "var(--qf-naranja)",
    },
    optionContainerPago: {
      display: "flex",
      justifyContent: "space-between",
    },
    opcionesPago: {
      padding: "0.5rem 1rem",
      backgroundColor: "var(--qf-bg-main)",
      color: "var(--qf-text-primary)",
      cursor: "pointer",
      borderRadius: "5px",
      textAlign: "center",
      flex: 1,
      marginRight: "0.5rem",
    },
    opcionesPagoSelected: {
      backgroundColor: "var(--qf-naranja)",
    },
    suggestionsList: {
      listStyleType: "none",
      padding: 0,
      margin: 0,
      backgroundColor: "var(--qf-text-primary)",
      borderRadius: "5px",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
      position: "absolute", // Para que las sugerencias estén sobre el formulario
      top: "100%", // Justo debajo del input
      left: 0,
      right: 0,
      zIndex: 10, // Asegura que esté por encima de otros elementos
    },
    suggestionItem: {
      padding: "0.5rem",
      cursor: "pointer",
    },
    suggestionItemHover: {
      backgroundColor: "var(--qf-text-primary)",
    },
    btnPrimary: {
      width: "100%",
      padding: "0.8rem",
      fontSize: "1rem",
      color: "var(--qf-text-primary)",
      backgroundColor: "var(--qf-green)",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "10px",
    },
    btnPrimaryDisabled: {
      opacity: 0.7,
      cursor: "not-allowed",
    },
    buttonsRow: {
      display: "flex",
      gap: "10px",
      marginTop: "10px",
    },
    btnSecondary: {
      width: "40%",
      padding: "0.8rem",
      fontSize: "1rem",
      color: "var(--qf-text-primary)",
      backgroundColor: "var(--qf-text-secondary)",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "0.5rem",
      color: "var(--qf-naranja)",
    },
    tituloSeccion: {
      display: "flex",
      justifyContent: "center",
      marginTop: "20px",
      fontSize: "24px",
      color: "var(--qf-text-primary)",
    },
    separator: {
      border: "none",
      marginBottom: "5px",
      marginTop: "0px",
      borderTop: `1px solid var(--qf-naranja)`,
    },
    breadcrumbWrapper: {
      width: "100%",
      boxSizing: "border-box",
      padding: isMobile ? "10px 12px 0" : "10px 20px 0",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    hr: {
      color: "var(--qf-naranja)",
      border: `1px solid var(--qf-naranja)`,
      width: "100%",
    },
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Eventos", url: "/listado-eventos-productor" },
    { title: "Crear un Evento (1/4)", url: "registrar-evento2" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={styles.rowFormEvento}>
        <div style={styles.tituloSeccion}>
          <h1>Crear un Evento</h1>
        </div>
        <hr style={styles.hr} />
        <div style={styles.breadcrumbWrapper}>
          <Breadcrumb
            items={breadcrumbItems}
            style={{ width: "100%" }}
          />
        </div>
        <div style={styles.colForm}>
          <div style={styles.darkFormWrapper}>
            <form action="#" method="POST">
              <div style={styles.formGroup}>
                <label htmlFor="nombre" style={styles.formLabel}>
                  Nombre Del Evento*
                </label>
                <input
                  type="text"
                  id="nombre"
                  style={styles.formInput}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="descripcion" style={styles.formLabel}>
                  Descripción Del Evento*
                </label>
                <textarea
                  id="descripcion"
                  style={styles.formInput}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={2}
                />
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="tipoEvento" style={styles.formLabel}>
                  Tipo de Evento*
                </label>
                <div style={styles.optionContainerEvento}>
                  <div
                    style={{
                      ...styles.opcionesEvento,
                      ...(selectedOptionEvento === 1
                        ? styles.opcionesEventoSelected
                        : {}),
                    }}
                    onClick={() => handleOptionClickEvento(1)}
                  >
                    Cines
                  </div>
                  <div
                    style={{
                      ...styles.opcionesEvento,
                      ...(selectedOptionEvento === 2
                        ? styles.opcionesEventoSelected
                        : {}),
                    }}
                    onClick={() => handleOptionClickEvento(2)}
                  >
                    Festival
                  </div>
                  <div
                    style={{
                      ...styles.opcionesEvento,
                      ...(selectedOptionEvento === 3
                        ? styles.opcionesEventoSelected
                        : {}),
                    }}
                    onClick={() => handleOptionClickEvento(3)}
                  >
                    Deporte
                  </div>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label htmlFor="tipoPago" style={styles.formLabel}>
                  Tipo de Pago*
                </label>
                <div style={styles.optionContainerPago}>
                  <div
                    style={{
                      ...styles.opcionesPago,
                      ...(selectedOptionPago === 1
                        ? styles.opcionesPagoSelected
                        : {}),
                    }}
                    onClick={() => handleOptionClickPago(1)}
                  >
                    Pago
                  </div>
                  <div
                    style={{
                      ...styles.opcionesPago,
                      ...(selectedOptionPago === 2
                        ? styles.opcionesPagoSelected
                        : {}),
                    }}
                    onClick={() => handleOptionClickPago(2)}
                  >
                    Gratuito
                  </div>
                </div>
              </div>
              <div style={{display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "0.5rem" : 0}}>
                <div style={{...styles.formGroup, width: isMobile ? "100%" : "50%", marginRight: isMobile ? 0 : "10px"}}>
                  <label htmlFor="ubicacion" style={styles.formLabel}>
                    Ubicación Del Evento*
                  </label>
                  <input
                    type="text"
                    id="ubicacion"
                    style={styles.formInput}
                    value={ubicacion}
                    onChange={handleUbicacionChange}
                  />
                  {showSuggestions && (
                    <ul style={styles.suggestionsList}>
                      {suggestionResults.map((suggestion, index) => (
                        <li
                          key={index}
                          style={styles.suggestionItem}
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion.formatted}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div style={{...styles.formGroup, width: isMobile ? "100%" : "50%"}}>
                  <label htmlFor="imagen" style={styles.formLabel}>
                    Imagen del Evento
                  </label>
                  <input
                    type="file"
                    id="imagen"
                    accept="image/*"
                    onChange={handleImagenEventoChange}
                    style={{
                      ...styles.formInput,
                      backgroundColor: "var(--qf-text-primary)",
                    }}
                  />
                </div>
              </div>

              <div style={styles.buttonsRow}>
                <button
                  type="button"
                  style={styles.btnSecondary}
                  onClick={handleVolver}
                  disabled={isSubmitting}
                >
                  Volver
                </button>
                <button
                  type="button"
                  style={{
                    ...styles.btnPrimary,
                    width: "60%",
                    ...(isSubmitting ? styles.btnPrimaryDisabled : {}),
                  }}
                  onClick={handleSiguienteClick}
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <CircularProgress size={18} style={{ color: "var(--qf-text-primary)" }} />
                  )}
                  {isSubmitting ? "Guardando..." : "Siguiente"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default RegistrarEvento2;
