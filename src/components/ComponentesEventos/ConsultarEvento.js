import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./../sass/main.scss";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { fileToBase64 } from "../ComponentesGenerales/Utils/base64";
import { FaArrowLeft, FaPen, FaSave, FaImage, FaPlus, FaTrash } from "react-icons/fa";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import "./RegistrarEvento.css";
import "./EditarEvento.css";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { TIPOS_EVENTO, TIPOS_PAGO } from "../../constants/eventos";

const datePart = (value) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return value;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const timePart = (value) => {
  const date = value ? new Date(value) : null;
  return !date || Number.isNaN(date.getTime()) ? "" : `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};
const combineDate = (date, time, original) => {
  if (!date) return undefined;
  if (original && date === datePart(original) && time === timePart(original)) return original;
  const result = new Date(`${date}T${time || "00:00"}`);
  return Number.isNaN(result.getTime()) ? undefined : result.toISOString();
};

const ConsultarEvento = () => {
  const { id } = useParams();
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const { user } = useContext(UserContext);
  const [legacySession, setLegacySession] = useState(null);
  const session = user || legacySession;
  const consumerId = session?.consumidorId;
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [nombre, setNombre] = useState("");
  const [imagenEvento, setImagenEvento] = useState(null);
  const [croquis, setCroquis] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [tieneButacas, setTieneButacas] = useState(false);
  const [estado, setEstado] = useState("Standby");
  const [ubicacion, setUbicacion] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [fechaInicioEvento, setFechaInicioEvento] = useState("");
  const [horaInicioEvento, setHoraInicioEvento] = useState("");
  const [fechaFinEvento, setFechaFinEvento] = useState("");
  const [tienePreventa, setTienePreventa] = useState(false);
  const [fechaInicioPreventa, setFechaInicioPreventa] = useState("");
  const [fechaFinPreventa, setFechaFinPreventa] = useState("");
  const [plazoCancelacionPreventa, setPlazoCancelacionPreventa] = useState("");
  const [tipoPreventa, setTipoPreventa] = useState("");
  const [cantidadPuestos, setCantidadPuestos] = useState("");
  const [tieneRepartidores, setTieneRepartidores] = useState(false);
  const [cantidadRepartidores, setCantidadRepartidores] = useState("");
  const [capacidadMaxima, setCapacidadMaxima] = useState("");
  const [tipoPago, setTipoPago] = useState("");
  const [linkVentaEntradas, setLinkVentaEntradas] = useState("");
  const [loadedEvent, setEvento] = useState({});

  const [provincias, setProvincias] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [localidades, setLocalidades] = useState([]);
  const [selectedLocalidad, setSelectedLocalidad] = useState("");

  // Cargar provincias al montar el componente
  React.useEffect(() => {
    fetch("https://apis.datos.gob.ar/georef/api/provincias")
      .then((resp) => resp.json())
      .then((data) => setProvincias(Array.isArray(data.provincias) ? data.provincias : []))
      .catch((err) => console.error("Error fetching provinces:", err));
  }, []);

  const [restriccionesdb, setRestriccionesdb] = useState([]);

  const [restriccionesEvento, setRestriccionesEvento] = useState([]);



  const [nuevaColumna, setNuevaColumna] = useState({
    titulo: "",
    tipo: "",
    opciones: "",
    usuario: "",
  });



  const handleEditModeToggle = (event) => {
    event.preventDefault();
    setEditMode(true);
  };



  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (savingRef.current || !editMode || !session || loadingEvent || loadError) return;
    savingRef.current = true;
    setSaving(true);
    const nuevoEvento = {
      nombre: nombre,
      descripcion: descripcion,
      img: imagenEvento,
      croquis: croquis,
      ubicacion: ubicacion,
      localidad: localidad,
      provincia: provincia,
      tipoEvento: tipoEvento,
      fechaInicio: combineDate(fechaInicioEvento, horaInicioEvento, loadedEvent.fechaHoraInicio),
      horaInicio: horaInicioEvento,
      fechaFin: combineDate(fechaFinEvento, timePart(loadedEvent.fechaHoraFin), loadedEvent.fechaHoraFin),
      conPreventa: tienePreventa,
      tienePreventa,
      fechaInicioPreventa: fechaInicioPreventa || null,
      fechaFinPreventa: fechaFinPreventa || null,
      plazoCancelacionPreventa: plazoCancelacionPreventa,
      tipoPreventa: tipoPreventa,
      cantidadPuestos: cantidadPuestos,
      conRepartidor: tieneRepartidores,
      cantidadRepartidores: cantidadRepartidores === "" ? undefined : Number(cantidadRepartidores),
      capacidadMaxima: capacidadMaxima === "" ? undefined : Number(capacidadMaxima),
      tipoPago: tipoPago,
      linkVentaEntradas: linkVentaEntradas,
      conButaca: tieneButacas,
      habilitado: true,
      estado: estado,
      restricciones: restriccionesEvento,
      consumidorId: session.consumidorId,
    };
    // Realizar la solicitud HTTP para enviar los datos al servidor
    fetch(`${process.env?.REACT_APP_BACK_URL}evento/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ evento: nuevoEvento }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.msg || "Error al guardar los cambios");
        return data;
      })
      .then((data) => {
        // Manejo de la respuesta del servidor
        // Mostrar mensaje de éxito
        toast.success("Cambios guardados correctamente");
        // Desactivar el modo de edición
        setEditMode(false);
      })
      .catch((error) => {
        // Manejo de errores
        console.error(error);
        toast.error(error.message && error.message !== "Failed to fetch" ? `Error al guardar los cambios: ${error.message}` : "Error al guardar los cambios. Revisá la conexión e intentá nuevamente.");
      })
      .finally(() => { savingRef.current = false; setSaving(false); });
  };

  useEffect(() => {
    const controller = new AbortController();
    setLoadingEvent(true);
    setLoadError(false);
    setEditMode(false);
    (async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_URL}evento/${id}`, {
          method: "GET", headers: consumerId ? { ConsumidorId: String(consumerId) } : {}, signal: controller.signal,
        });
        if (!response.ok) throw new Error("No se pudo cargar el evento");
        const result = await response.json();
        const data = result.data;
        if (!data || !data.id) throw new Error("Evento no encontrado");
        if (controller.signal.aborted) return;
        setEvento(data);
        setNombre(data.nombre ?? ""); setDescripcion(data.descripcion ?? "");
        setImagenEvento(data.img ?? null); setCroquis(data.croquis ?? null);
        setUbicacion(data.ubicacion ?? ""); setLocalidad(data.localidad ?? ""); setProvincia(data.provincia ?? "");
        setSelectedProvince(data.provincia ?? ""); setSelectedLocalidad(data.localidad ?? "");
        setTipoEvento(data.tipoEvento ?? "");
        setFechaInicioEvento(datePart(data.fechaHoraInicio ?? data.fechaInicioEvento));
        setHoraInicioEvento(data.horaInicioEvento ?? data.horaInicio ?? timePart(data.fechaHoraInicio));
        setFechaFinEvento(datePart(data.fechaHoraFin ?? data.fechafinevento ?? data.fechaFinEvento));
        setTienePreventa(data.tienePreventa ?? data.conPreventa ?? false);
        setFechaInicioPreventa(datePart(data.fechaInicioPreventa)); setFechaFinPreventa(datePart(data.fechaFinPreventa));
        setPlazoCancelacionPreventa(data.plazoCancelacionPreventa ?? ""); setTipoPreventa(data.tipoPreventa ?? "");
        setCantidadPuestos(data.cantidadPuestos ?? "");
        setTieneRepartidores(data.conRepartidor ?? data.tieneRepartidores ?? false);
        setTieneButacas(data.conButaca ?? data.tieneButacas ?? false);
        setCantidadRepartidores(data.cantidadRepartidores ?? ""); setCapacidadMaxima(data.capacidadMaxima ?? "");
        setTipoPago(data.tipoPago ?? ""); setLinkVentaEntradas(data.linkVentaEntradas ?? ""); setEstado(data.estado);
      } catch (error) {
        if (!controller.signal.aborted) setLoadError(true);
      } finally {
        if (!controller.signal.aborted) setLoadingEvent(false);
      }
    })();
    return () => controller.abort();
  }, [id, consumerId, loadAttempt]);

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

  useEffect(() => {
    if (user) return;
    const sessionId = localStorage.getItem("sessionId");
    if (!sessionId) return;
    const controller = new AbortController();
    fetch(`${process.env.REACT_APP_BACK_URL}user/session`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionID: sessionId }), signal: controller.signal,
    }).then((response) => response.json()).then((result) => {
      if (!controller.signal.aborted && result.data?.consumidorId) setLegacySession(result.data);
    }).catch(() => {});
    return () => controller.abort();
  }, [user]);

  const handleLocalidadChange = (e) => {
    setSelectedLocalidad(e.target.value);
    setLocalidad(e.target.value);
  };

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setProvincia(e.target.value);
    if (e.target.value !== "") {
      fetch(
        `https://apis.datos.gob.ar/georef/api/municipios?provincia=${e.target.value}&campos=id,nombre&max=700`
      )
        .then((response) => response.json())
        .then((data) => {
          const sortedLocalidades = (Array.isArray(data.municipios) ? data.municipios : []).sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          );
          setLocalidades(sortedLocalidades);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setLocalidades([]);
    }
  };

  const agregarColumna = () => {
    setRestriccionesEvento([...restriccionesEvento, nuevaColumna]);
    setNuevaColumna({
      titulo: "",
      tipo: "",
      opciones: "",
      usuario: "",
    });
  };

  const eliminarfila = (indice) => {
    if (restriccionesEvento[indice]?.id == null) {
      setRestriccionesEvento((current) => current.filter((_, index) => index !== indice));
      return;
    }
    if (restriccionesEvento[indice].id !== "undefined") {
      const headers = new Headers();
      headers.append("ConsumidorId", session?.consumidorId);
      headers.append("Content-Type", "application/json");
      fetch(
        `${process.env?.REACT_APP_BACK_URL}restriccion/${restriccionesEvento[indice].id}`,
        {
          method: "DELETE",
          headers: headers,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          const nuevasRestricciones = [...restriccionesEvento];
          nuevasRestricciones.splice(indice, 1);
          setRestriccionesEvento(nuevasRestricciones);
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error al registrar el evento");
        });
    }
  };

  useEffect(() => {
    const headers = new Headers();
    headers.append("ConsumidorId", session?.consumidorId);
    headers.append("Content-Type", "application/json");

    fetch(`${process.env?.REACT_APP_BACK_URL}restriccion`, {
      method: "GET",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setRestriccionesdb(Array.isArray(data?.data) ? data.data : []);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al registrar el evento");
      });
  }, [session]);

  useEffect(() => {
    fetch(`${process.env?.REACT_APP_BACK_URL}restriccion/evento/${id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setRestriccionesEvento(Array.isArray(data?.data) ? data.data : []);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error al registrar el evento");
      });
  }, [id]);

  return (
    <PageLayout sidebarProps={{ tipoUsuario: session?.tipoUsuario }}>
      <main className="qf-event-registration-page qf-event-editor-page">
        <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis eventos", url: "/listado-eventos-productor" }, { title: "Editar evento", url: `/evento/${id}` }]} />
        <header className="qf-event-editor-heading"><div className="qf-event-registration-heading"><h1>Editar evento</h1><p>Consultá y actualizá la información, la configuración y las restricciones.</p></div><Link className="qf-event-registration-button" to={`/evento-detalle/${id}`}><FaArrowLeft aria-hidden="true" /> Volver al detalle</Link></header>
        {loadingEvent && <p role="status">Cargando los datos del evento…</p>}
        {loadError && <div role="alert" className="qf-event-editor-load-error"><p>No pudimos cargar los datos del evento. La edición está bloqueada para evitar guardar información vacía.</p><button type="button" className="qf-event-registration-button" onClick={() => setLoadAttempt((value) => value + 1)}>Reintentar</button></div>}
        <form className={`qf-event-registration-form qf-event-editor-form${editMode ? " qf-event-editor-form--editing" : ""}`} onSubmit={handleSaveChanges}>
          <div className="qf-event-editor-title"><h2>{nombre || "Información del evento"}</h2><span>{editMode ? "Modo edición" : "Solo lectura"}</span></div>
          <fieldset disabled={!editMode || saving || loadingEvent || loadError} className="qf-event-editor-sections"><legend className="qf-event-registration-sr">Datos del evento</legend>
            <section className="qf-event-configuration-section"><h2>Información general</h2><div className="qf-event-configuration-fields">
              <label htmlFor="nombre">Nombre del Evento<input id="nombre" value={nombre ?? ""} onChange={(event) => setNombre(event.target.value)} /></label>
              <label htmlFor="tipoEvento">Tipo Evento<select id="tipoEvento" value={tipoEvento ?? ""} onChange={(event) => setTipoEvento(event.target.value)}><option value="">Seleccioná un tipo</option>{[...(TIPOS_EVENTO.includes(tipoEvento) || !tipoEvento ? [] : [tipoEvento]), ...TIPOS_EVENTO].map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              <label htmlFor="descripcion" className="qf-event-editor-wide">Descripción<textarea id="descripcion" value={descripcion ?? ""} onChange={(event) => setDescripcion(event.target.value)} rows={3} /></label>
            </div><div className="qf-event-editor-images">{[{ key: "imagenEvento", label: "Imagen de evento", value: imagenEvento, handler: handleImagenEventoChange }, { key: "croquis", label: "Croquis", value: croquis, handler: handleCroquisChange }].map((image) => <div key={image.key}><div className="qf-event-editor-preview">{image.value ? <img src={image.value} alt={`Vista previa: ${image.label}`} /> : <FaImage aria-hidden="true" />}</div><label htmlFor={image.key}>{image.label}<input type="file" id={image.key} accept="image/*" onChange={image.handler} /></label></div>)}</div></section>
            <section className="qf-event-configuration-section"><h2>Ubicación</h2><div className="qf-event-configuration-fields">
              <label htmlFor="provincia">Provincia<select id="provincia" name="provincia" data-testid="provincia" value={selectedProvince || provincia || ""} onChange={handleProvinceChange}><option value="">Seleccioná una provincia</option>{provincia && !provincias.some((item) => item.nombre === provincia) && <option value={provincia}>{provincia}</option>}{provincias.map((province) => <option key={province.nombre} value={province.nombre}>{province.nombre}</option>)}</select></label>
              <label htmlFor="localidad">Localidad<select id="localidad" name="localidad" data-testid="localidad" value={selectedLocalidad || localidad || ""} onChange={handleLocalidadChange}><option value="">Seleccioná una localidad</option>{localidad && !localidades.some((item) => item.nombre === localidad) && <option value={localidad}>{localidad}</option>}{localidades.map((city, index) => <option key={`${city.nombre}-${index}`} value={city.nombre}>{city.nombre}</option>)}</select></label>
              <label htmlFor="ubicacion" className="qf-event-editor-wide">Ubicación<input id="ubicacion" value={ubicacion ?? ""} onChange={(event) => setUbicacion(event.target.value)} /></label>
            </div></section>
            <section className="qf-event-configuration-section"><h2>Fechas y capacidad</h2><div className="qf-event-configuration-fields">
              <label htmlFor="fechaInicioEvento">Fecha inicio evento<input type="date" id="fechaInicioEvento" value={fechaInicioEvento ?? ""} onChange={(event) => setFechaInicioEvento(event.target.value)} /></label>
              <label htmlFor="horaInicioEvento">Hora inicio evento<input type="time" id="horaInicioEvento" value={horaInicioEvento ?? ""} onChange={(event) => setHoraInicioEvento(event.target.value)} /></label>
              <label htmlFor="fechaFinEvento">Fecha fin evento<input type="date" id="fechaFinEvento" value={fechaFinEvento ?? ""} onChange={(event) => setFechaFinEvento(event.target.value)} /></label>
              <label htmlFor="cantidadPuestos">Cantidad Puestos<input type="number" id="cantidadPuestos" value={cantidadPuestos ?? ""} onChange={(event) => setCantidadPuestos(event.target.value)} /></label>
              <label htmlFor="capacidadMaxima">Capacidad máxima<input type="number" id="capacidadMaxima" value={capacidadMaxima ?? ""} onChange={(event) => setCapacidadMaxima(event.target.value)} /></label>
            </div></section>
            <section className="qf-event-configuration-section"><h2>Venta y configuración</h2><div className="qf-event-configuration-fields">
              <label htmlFor="tipoPago">Tipo Pago<select id="tipoPago" value={tipoPago ?? ""} onChange={(event) => setTipoPago(event.target.value)}><option value="">Seleccioná un tipo</option>{[...(TIPOS_PAGO.includes(tipoPago) || !tipoPago ? [] : [tipoPago]), ...TIPOS_PAGO].map((option) => <option key={option} value={option}>{option}</option>)}</select></label>
              <label htmlFor="linkVentaEntradas">Link Venta Entradas<input id="linkVentaEntradas" value={linkVentaEntradas ?? ""} onChange={(event) => setLinkVentaEntradas(event.target.value)} /></label>
            </div><div className="qf-event-editor-toggles"><label htmlFor="tienePreventa"><input type="checkbox" id="tienePreventa" checked={Boolean(tienePreventa)} onChange={(event) => setTienePreventa(event.target.checked)} /> ¿Tiene preventa?</label><label htmlFor="tieneRepartidores"><input type="checkbox" id="tieneRepartidores" checked={Boolean(tieneRepartidores)} onChange={(event) => setTieneRepartidores(event.target.checked)} /> ¿Tiene Repartidores?</label><label htmlFor="tieneButacas"><input type="checkbox" id="tieneButacas" checked={Boolean(tieneButacas)} onChange={(event) => setTieneButacas(event.target.checked)} /> ¿Tiene Butacas?</label></div>
              {tienePreventa && <div className="qf-event-presale-settings"><div className="qf-event-configuration-fields"><label htmlFor="fechaInicioPreventa">Fecha inicio preventa<input type="date" id="fechaInicioPreventa" value={fechaInicioPreventa ?? ""} onChange={(event) => setFechaInicioPreventa(event.target.value)} /></label><label htmlFor="fechaFinPreventa">Fecha fin preventa<input type="date" id="fechaFinPreventa" value={fechaFinPreventa ?? ""} onChange={(event) => setFechaFinPreventa(event.target.value)} /></label><label htmlFor="plazoPreventa">Plazo cancelación preventa<input type="number" id="plazoPreventa" value={plazoCancelacionPreventa ?? ""} onChange={(event) => setPlazoCancelacionPreventa(event.target.value)} /></label><label htmlFor="tipoPreventa">Tipo Preventa<select id="tipoPreventa" value={tipoPreventa ?? ""} onChange={(event) => setTipoPreventa(event.target.value)}><option value="">Seleccioná un tipo</option>{[1, 2, 3].map((value) => <option key={value} value={value}>Tipo {value}</option>)}</select></label></div></div>}
              {tieneRepartidores && <div className="qf-event-editor-courier-count"><label htmlFor="cantidadRepartidores">Cantidad repartidores<input type="number" id="cantidadRepartidores" value={cantidadRepartidores ?? ""} onChange={(event) => setCantidadRepartidores(event.target.value)} /></label></div>}
            </section>
            <section className="qf-event-configuration-section"><h2>Restricciones personalizadas</h2><p>Requisitos que deben completar los participantes del evento.</p><div className="qf-event-editor-restriction-fields">
              <label htmlFor="restriction-title">Título<input id="restriction-title" list="restricciones-titulo" value={nuevaColumna.titulo} onChange={(event) => setNuevaColumna({ ...nuevaColumna, titulo: event.target.value })} /><datalist id="restricciones-titulo">{restriccionesdb.map((restriction, index) => <option key={index} value={restriction.titulo} />)}</datalist></label>
              <label htmlFor="restriction-type">Tipo<select id="restriction-type" value={nuevaColumna.tipo} onChange={(event) => setNuevaColumna({ ...nuevaColumna, tipo: event.target.value })}><option value="">Seleccioná un tipo</option>{["PDF", "Cadena de texto", "Numerico", "Imagen", "Opciones"].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
              <label htmlFor="restriction-options">Opciones<input id="restriction-options" list="restricciones-opciones" value={nuevaColumna.opciones} onChange={(event) => setNuevaColumna({ ...nuevaColumna, opciones: event.target.value })} /><datalist id="restricciones-opciones">{restriccionesdb.map((restriction, index) => <option key={index} value={restriction.opciones} />)}</datalist></label>
              <label htmlFor="restriction-user">Usuario<select id="restriction-user" value={nuevaColumna.usuario} onChange={(event) => setNuevaColumna({ ...nuevaColumna, usuario: event.target.value })}><option value="">Seleccioná un usuario</option>{["Ambos", "Repartidor", "Encargado de puesto"].map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
            </div><div className="qf-event-editor-add-restriction"><button type="button" className="qf-event-registration-button" onClick={agregarColumna}><FaPlus aria-hidden="true" /> Agregar Restriccion</button></div><div className="qf-event-editor-restriction-table"><table><thead><tr><th>Título</th><th>Tipo</th><th>Opciones</th><th>Usuario</th><th>Acciones</th></tr></thead><tbody>{restriccionesEvento.length ? restriccionesEvento.map((restriction, index) => <tr key={restriction.id || `new-${index}`}><td>{restriction.titulo}</td><td>{restriction.tipo}</td><td>{restriction.opciones}</td><td>{restriction.usuario}</td><td><button type="button" className="qf-event-registration-button" onClick={() => eliminarfila(index)}><FaTrash aria-hidden="true" /> Eliminar</button></td></tr>) : <tr><td colSpan={5}>Este evento no tiene restricciones cargadas.</td></tr>}</tbody></table></div>
            </section>
          </fieldset>
          <footer className="qf-event-registration-footer"><span>{editMode ? "Revisá los datos antes de guardar los cambios." : "Seleccioná Editar para modificar los datos del evento."}</span><div>{editMode ? <button key="save-event" type="submit" className="qf-event-registration-button qf-event-registration-button--primary" disabled={saving}><FaSave aria-hidden="true" />{saving ? "Guardando…" : "Guardar Cambios"}</button> : <button key="edit-event" type="button" className="qf-event-registration-button qf-event-registration-button--primary" onClick={handleEditModeToggle} disabled={loadingEvent || loadError || !session}><FaPen aria-hidden="true" /> Editar</button>}</div></footer>
        </form>
      </main><Footer />
    </PageLayout>
  );
};
export default ConsultarEvento;
