import React, { useEffect, useState, useContext, useRef } from "react";
import PageLayout from "../../ComponentesGenerales/PageLayout";
import Footer from "../../ComponentesGenerales/Footer";
import GraficaLineas from "../GraficaLineas";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import TopProductos from "./TopProductos";
import TiempoPromedioEntrega from "./TiempoPromedioEntrega";
import ValoracionPromedio from "./ValoracionPromedio";
import TotalRecaudadoEvento from "./TotalRecaudado";
import Breadcrumb from "../../ComponentesGenerales/Breadcrumb";
import "../../ComponentesGenerales/ListFilters.css";
import "./PanelEncargado.css";
import BotonDescargaPDF from "../BotonDescargaPDF";

const PanelEncargado = () => {
  const { user } = useContext(UserContext);

  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [puestos, setPuestos] = useState([]);
  const [puestoSeleccionado, setPuestoSeleccionado] = useState(null);

  const dashboardRef = useRef(null);
  const handleEventoChange = (e) => {
    if (e.target.value === "Todos") {
      setEventoSeleccionado({ nombre: "Todos", id: "Todos" });
      return;
    }
    const evento = eventos.find(
      (ev) => String(ev.id) === e.target.value
    );
    if (evento) {
      setEventoSeleccionado({ nombre: evento.nombre, id: evento.id });
    }
  };

  const handlePuestoChange = (e) => {
    if (e.target.value === "Todos") {
      setPuestoSeleccionado({ nombre: "Todos", id: "Todos" });
      return;
    }
    const puesto = puestos.find(
      (p) => String(p.id) === e.target.value
    );
    if (puesto) {
      setPuestoSeleccionado({
        nombre: puesto.nombreCarro,
        id: puesto.id,
      });
    }
  };

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACK_URL}estadisticas/eventos-con-pedidos/${user.consumidorId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const eventosConPedidos = Array.isArray(data?.data) ? data.data : [];
          setEventos([
            { nombre: "Todos", id: "Todos" },
            ...eventosConPedidos,
          ]);
        } else {
          throw new Error("New endpoint failed");
        }
      } catch (error) {
        console.warn("Falling back to old endpoint for eventos", error);
        try {
          const fallbackResponse = await fetch(
            `${process.env.REACT_APP_BACK_URL}evento/all`,
            { headers: { "Content-Type": "application/json" } }
          );
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            const allEventos = Array.isArray(fallbackData?.data) ? fallbackData.data : [];
            setEventos([
              { nombre: "Todos", id: "Todos" },
              ...allEventos,
            ]);
          } else {
            setEventos([{ nombre: "Todos", id: "Todos" }]);
          }
        } catch (fallbackError) {
          console.error("Fallback for eventos also failed", fallbackError);
          setEventos([{ nombre: "Todos", id: "Todos" }]);
        }
      }
      setEventoSeleccionado({ nombre: "Todos", id: "Todos" });
    };

    if (user?.consumidorId) {
      fetchEventos();
    }
  }, [user]);

  useEffect(() => {
    const fetchPuestos = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACK_URL}estadisticas/puestos-con-pedidos/${user.consumidorId}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const puestosConPedidos = Array.isArray(data?.data) ? data.data : [];
          setPuestos([
            { nombreCarro: "Todos", id: "Todos" },
            ...puestosConPedidos,
          ]);
        } else {
          throw new Error("New endpoint failed");
        }
      } catch (error) {
        console.warn("Falling back to old endpoint for puestos", error);
        try {
          const fallbackResponse = await fetch(
            `${process.env.REACT_APP_BACK_URL}puesto/creados`,
            {
              headers: {
                "Content-Type": "application/json",
                consumidorid: user.consumidorId,
              },
            }
          );
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            const allPuestos = Array.isArray(fallbackData?.data) ? fallbackData.data : [];
            setPuestos([
              { nombreCarro: "Todos", id: "Todos" },
              ...allPuestos,
            ]);
          } else {
            setPuestos([{ nombreCarro: "Todos", id: "Todos" }]);
          }
        } catch (fallbackError) {
          console.error("Fallback for puestos also failed", fallbackError);
          setPuestos([{ nombreCarro: "Todos", id: "Todos" }]);
        }
      }
      setPuestoSeleccionado({ nombre: "Todos", id: "Todos" });
    };

    if (user?.consumidorId) {
      fetchPuestos();
    }
  }, [user]);

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <main className="qf-manager-dashboard">
        <Breadcrumb items={[{ title: "Inicio", url: "/inicio" }, { title: "Estadísticas", url: "/grafica-encargado" }]} />
        <header className="qf-manager-dashboard-heading"><h1>Estadísticas de mis puestos</h1><p>Consultá la recaudación, la atención y los productos que más se venden.</p></header>
        <div className="qf-manager-dashboard-toolbar">
          <section className="qf-list-filters qf-manager-dashboard-filters" aria-label="Filtros de estadísticas">
            <label htmlFor="dashboard-event">Evento<select id="dashboard-event" value={eventoSeleccionado?.id || "Todos"} onChange={handleEventoChange}>{!eventos.length && <option value="Todos">Todos los eventos</option>}{eventos.map((event) => <option key={event.id} value={event.id}>{event.id === "Todos" ? "Todos los eventos" : event.nombre}</option>)}</select></label>
            <label htmlFor="dashboard-stand">Puesto<select id="dashboard-stand" value={puestoSeleccionado?.id || "Todos"} onChange={handlePuestoChange}>{!puestos.length && <option value="Todos">Todos los puestos</option>}{puestos.map((stand) => <option key={stand.id} value={stand.id}>{stand.id === "Todos" ? "Todos los puestos" : stand.nombreCarro}</option>)}</select></label>
          </section>
          <BotonDescargaPDF dashboardRef={dashboardRef} tipo="encargado" idConsumidor={user?.consumidorId} idEvento={eventoSeleccionado?.id || "Todos"} idPuesto={puestoSeleccionado?.id || "Todos"} nombreEvento={eventoSeleccionado?.id === "Todos" ? "Todos los eventos" : eventoSeleccionado?.nombre} nombrePuesto={puestoSeleccionado?.id === "Todos" ? "Todos los puestos" : puestoSeleccionado?.nombre} />
        </div>
        <div ref={dashboardRef} className="qf-manager-dashboard-content">
          <section className="qf-manager-metrics" aria-label="Indicadores del puesto">
            <TotalRecaudadoEvento puestoId={puestoSeleccionado?.id} eventoId={eventoSeleccionado?.id} />
            <ValoracionPromedio puestoId={puestoSeleccionado?.id} eventoId={eventoSeleccionado?.id} />
            <TiempoPromedioEntrega puestoId={puestoSeleccionado?.id} eventoId={eventoSeleccionado?.id} />
          </section>
          <div className="qf-manager-charts">
            <section className="qf-manager-chart-card"><h2>Evolución de la recaudación</h2><p>Seleccioná una barra para explorar el detalle del día.</p><div className="qf-manager-revenue-chart"><GraficaLineas puestoId={puestoSeleccionado?.id} eventId={eventoSeleccionado?.id} /></div></section>
            <TopProductos puestoId={puestoSeleccionado?.id} eventoId={eventoSeleccionado?.id} />
          </div>
        </div>
      </main><Footer />
    </PageLayout>
  );
};
export default PanelEncargado;
