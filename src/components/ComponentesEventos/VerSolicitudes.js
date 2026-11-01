import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowLeft, FaCheck, FaTimes, FaInfoCircle, FaStore, FaMotorcycle, FaPhone } from "react-icons/fa";
import { Dialog } from "@mui/material";
import "../ComponentesGenerales/ListFilters.css";
import "./SolicitudesEvento.css";
import PageLayout from "../ComponentesGenerales/PageLayout";
import { UserContext } from "../ComponentesGenerales/UserContext";
import Footer from "../ComponentesGenerales/Footer";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import RequisitosSolicitud from "./RequisitosSolicitud";
import ConfirmDialog from "../ComponentesGenerales/ConfirmDialog";

const VerSolicitudesEvento = () => {
  const { evento } = useParams();
  const [eventos, setEventos] = useState([]);
  const [asociaciones, setAsociaciones] = useState([]);
  const { user } = useContext(UserContext);
  const [recargar, setRecargar] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [infoDialogOpen, setInfoDialogOpen] = useState(false);
  const [selectedAsociacion, setSelectedAsociacion] = useState(null);

  const recargarComponente = () => {
    setRecargar((prev) => prev + 1);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env?.REACT_APP_BACK_URL}asociacion/evento/${evento}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAsociaciones(Array.isArray(data.data) ? data.data : []);
      })
      .catch((error) => {
        console.error("Error al obtener las asociaciones:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [evento, recargar]);

  useEffect(() => {
    fetch(`${process.env?.REACT_APP_BACK_URL}evento/${evento}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setEventos(data.data);
      })
      .catch((error) => {
        console.error("Error al obtener el evento:", error);
      });
  }, [evento, recargar]);

  const aceptarSolicitud = (asociacionId) => {
    setPendingAction({
      type: 'aceptar',
      message: '¿Estás seguro de que deseas aceptar esta solicitud?',
      title: 'Aceptar Solicitud',
      asociacionId: asociacionId
    });
    setConfirmOpen(true);
  };

  const executeAceptarSolicitud = () => {
    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/cambiarEstado/${pendingAction.asociacionId}/aceptar`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Asociacion Aceptada con éxito");
      })
      .catch((error) => toast.error("Error al Aceptar Solicitud"))
      .finally(() => {
        recargarComponente();
      });
  };

  const rechazarSolicitud = (asociacionId) => {
    setPendingAction({
      type: 'rechazar',
      message: '¿Estás seguro de que deseas rechazar esta solicitud?',
      title: 'Rechazar Solicitud',
      asociacionId: asociacionId
    });
    setConfirmOpen(true);
  };

  const executeRechazarSolicitud = () => {
    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/cambiarEstado/${pendingAction.asociacionId}/rechazada`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Asociacion Rechazada con éxito");
      })
      .catch((error) => toast.error("Error al Rechazar Solicitud"))
      .finally(() => {
        recargarComponente();
      });
  };

  const cancelarSolicitud = (asociacionId) => {
    setPendingAction({
      type: 'cancelar',
      message: '¿Estás seguro de que deseas cancelar esta solicitud?',
      title: 'Cancelar Solicitud',
      asociacionId: asociacionId
    });
    setConfirmOpen(true);
  };

  const executeCancelarSolicitud = () => {
    fetch(
      `${process.env?.REACT_APP_BACK_URL}asociacion/cambiarEstado/${pendingAction.asociacionId}/cancelar`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      .then(() => {
        toast.success("Asociacion Cancelada con éxito");
      })
      .catch((error) => toast.error("Error al Cancelar Solicitud"))
      .finally(() => {
        recargarComponente();
      });
  };

  // helper group for estados - incluir todos los estados posibles
  const allPossibleEstados = [
    { valor: 'PendienteDeAceptacion', etiqueta: 'Pendiente de Aceptacion' },
    { valor: 'ConObservacion', etiqueta: 'Con Observacion' },
    { valor: 'Aceptada', etiqueta: 'Aceptada' },
    { valor: 'Rechazada', etiqueta: 'Rechazada' },
    { valor: 'Cancelada', etiqueta: 'Cancelada' },
  ];

  // compute filtered list
  const filteredAsociaciones = asociaciones.filter((asociacion) => {
    const matchesSearch = searchTerm
      ? (asociacion?.puesto?.nombreCarro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         asociacion?.repartidor?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         asociacion?.repartidor?.apellido?.toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    const matchesState = filterState
      ? asociacion.estado === filterState
      : true;
    return matchesSearch && matchesState;
  });

  const handleConfirm = () => {
    if (!pendingAction) return;
    
    switch (pendingAction.type) {
      case 'aceptar':
        executeAceptarSolicitud();
        break;
      case 'rechazar':
        executeRechazarSolicitud();
        break;
      case 'cancelar':
        executeCancelarSolicitud();
        break;
      default:
        break;
    }
    
    setConfirmOpen(false);
    setPendingAction(null);
  };

  const handleCancelConfirm = () => {
    setConfirmOpen(false);
    setPendingAction(null);
  };

  const handleOpenInfo = (asociacion) => {
    setSelectedAsociacion(asociacion);
    setInfoDialogOpen(true);
  };

  const handleCloseInfo = () => {
    setInfoDialogOpen(false);
    setSelectedAsociacion(null);
  };

  const formatState = (state) => state === "PendienteDeAceptacion" ? "Pendiente de aceptación" : state === "ConObservacion" ? "Con observación" : state || "Sin estado";
  const applicantName = (association) => association?.puesto?.nombreCarro || [association?.repartidor?.nombre, association?.repartidor?.apellido].filter(Boolean).join(" ") || "Solicitante";
  const phone = (association) => association?.puesto?.telefonoCarro || association?.repartidor?.telefono || "Sin teléfono";
  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <main className="qf-event-requests-page">
        <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Mis eventos", url: "/listado-eventos-productor" }, { title: "Solicitudes", url: `/ver-solicitudes-evento/${evento}` }]} />
        <header className="qf-event-requests-heading"><div><h1>Solicitudes del evento</h1><p>{eventos.nombre || "Revisá las solicitudes de puestos y repartidores."}</p></div><Link className="qf-event-request-button" to={`/evento-detalle/${evento}`}><FaArrowLeft aria-hidden="true" /> Ver evento</Link></header>
        <section className="qf-list-filters qf-event-request-filters" aria-label="Filtros de solicitudes"><label htmlFor="request-search">Buscar solicitante<input id="request-search" type="search" placeholder="Nombre del puesto o repartidor" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} /></label><label htmlFor="request-state">Estado de la solicitud<select id="request-state" value={filterState} onChange={(event) => setFilterState(event.target.value)}><option value="">Todos los estados</option>{allPossibleEstados.map((state) => <option key={state.valor} value={state.valor}>{formatState(state.valor)}</option>)}</select></label></section>
        {loading ? <p className="qf-event-requests-feedback" role="status">Cargando solicitudes…</p> : <><p className="qf-event-requests-count" aria-live="polite">{filteredAsociaciones.length} {filteredAsociaciones.length === 1 ? "solicitud" : "solicitudes"}{searchTerm || filterState ? ` de ${asociaciones.length}` : ""}</p>{filteredAsociaciones.length > 0 ? <div className="qf-event-requests-list">{filteredAsociaciones.map((association) => <article key={association.id} className="qf-event-request-card">
          <div className="qf-event-request-icon" aria-hidden="true">{association.puesto ? <FaStore /> : <FaMotorcycle />}</div>
          <div className="qf-event-request-body"><div className="qf-event-request-title"><div><span>{association.puesto ? "Puesto de comida" : "Repartidor"}</span><h2>{applicantName(association)}</h2></div><span className={`qf-event-request-state qf-event-request-state--${association.estado}`}>{formatState(association.estado)}</span></div>
            <dl className="qf-event-request-data"><div><dt><FaPhone aria-hidden="true" /> Teléfono</dt><dd>{phone(association)}</dd></div>{association.puesto?.tipoNegocio && <div><dt>Tipo de negocio</dt><dd>{association.puesto.tipoNegocio}</dd></div>}</dl>
            <div className="qf-event-request-actions"><button type="button" className="qf-event-request-button" onClick={() => handleOpenInfo(association)}><FaInfoCircle aria-hidden="true" /> Info</button>
              {association.estado !== "Aceptada" && association.estado !== "Cancelada" && association.estado !== "Rechazada" && <button type="button" className="qf-event-request-button qf-event-request-button--primary" onClick={() => aceptarSolicitud(association.id)}><FaCheck aria-hidden="true" /> Aceptar Solicitud</button>}
              {association.estado !== "Rechazada" && association.estado !== "Cancelada" && association.estado !== "Aceptada" && <button type="button" className="qf-event-request-button" onClick={() => rechazarSolicitud(association.id)}><FaTimes aria-hidden="true" /> Rechazar Solicitud</button>}
              {association.estado === "Aceptada" && <button type="button" className="qf-event-request-button" onClick={() => cancelarSolicitud(association.id)}><FaTimes aria-hidden="true" /> Cancelar Solicitud</button>}
            </div>
          </div>
        </article>)}</div> : <div className="qf-event-requests-feedback"><h2>{searchTerm || filterState ? "No encontramos solicitudes con esos filtros" : "Este evento todavía no tiene solicitudes"}</h2><p>{searchTerm || filterState ? "Probá otro nombre o seleccioná un estado diferente." : "Las solicitudes de puestos y repartidores aparecerán acá."}</p>{searchTerm || filterState ? <button type="button" className="qf-event-request-button" onClick={() => { setSearchTerm(""); setFilterState(""); }}>Limpiar filtros</button> : <Link className="qf-event-request-button" to="/listado-eventos-productor">Volver a mis eventos</Link>}</div>}</>}
      </main>
      <ConfirmDialog open={confirmOpen} title={pendingAction?.title || 'Confirmar Acción'} message={pendingAction?.message || '¿Estás seguro de que deseas realizar esta acción?'} onConfirm={handleConfirm} onCancel={handleCancelConfirm} />
      <Dialog open={infoDialogOpen} onClose={handleCloseInfo} fullWidth maxWidth="sm" className="qf-request-info-dialog" aria-labelledby="request-info-title" slotProps={{ paper: { className: "qf-request-info-paper" } }}>
        {selectedAsociacion && <><header><div><span>Detalles de la Solicitud</span><h2 id="request-info-title">{applicantName(selectedAsociacion)}</h2></div><button type="button" className="qf-request-info-close" aria-label="Cerrar información" onClick={handleCloseInfo}><FaTimes aria-hidden="true" /></button></header><div className="qf-request-info-content"><span className={`qf-event-request-state qf-event-request-state--${selectedAsociacion.estado}`}>{formatState(selectedAsociacion.estado)}</span><h3>{selectedAsociacion.puesto ? "Información del Puesto" : "Información del Repartidor"}</h3><dl><div><dt>Teléfono</dt><dd>{phone(selectedAsociacion)}</dd></div>{selectedAsociacion.puesto && <div><dt>Tipo de negocio</dt><dd>{selectedAsociacion.puesto.tipoNegocio || "Sin especificar"}</dd></div>}</dl><RequisitosSolicitud asociacionId={selectedAsociacion.id} consumidorId={user?.consumidorId} /></div><footer><button type="button" className="qf-event-request-button qf-event-request-button--primary" onClick={handleCloseInfo}>Cerrar</button></footer></>}
      </Dialog>
      <Footer />
    </PageLayout>
  );
};
export default VerSolicitudesEvento;
