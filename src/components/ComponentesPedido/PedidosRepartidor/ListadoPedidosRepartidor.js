import React, { useEffect, useState, useContext, useRef } from "react";
import { CircularProgress } from "@mui/material";
import { FaChevronDown } from "react-icons/fa";
import PageLayout from "../../ComponentesGenerales/PageLayout";
import PedidoRepartidor from "./PedidoRepartidor";
import { UserContext } from "../../ComponentesGenerales/UserContext";
import Breadcrumb from "../../ComponentesGenerales/Breadcrumb";
import Footer from "../../ComponentesGenerales/Footer";
import Buscador from "../../Filtros y Buscadores/Buscador";
import Filtros from "../../Filtros y Buscadores/Filtros";

const ListadoPedidosRepartidor = () => {
  const [pedidos, setPedidos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const { user } = useContext(UserContext);

  const contentRef = useRef(null);
  const [contentWidth, setContentWidth] = useState(999);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const isNarrowLayout = contentWidth <= 780;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContentWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const recargarComponente = () => {
    setRecargar((prevRecargar) => prevRecargar + 1);
  };

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user.consumidorId);

      setIsLoading(true);
      fetch(`${process.env?.REACT_APP_BACK_URL}pedido/repartidor`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setPedidos(Array.isArray(data.data) ? data.data : []);
        })
        .catch((error) => console.log("No existen pedidos.", error))
        .finally(() => setIsLoading(false));
    }
  }, [user, recargar]);

  const estadoGroup = {
    nombre: "estado",
    opciones: Array.from(new Set(pedidos.map((p) => p.estado))).map((estado) => ({
      valor: estado,
      etiqueta: estado ? estado.replace(/([a-z])([A-Z])/g, "$1 $2") : estado,
    })),
  };

  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesSearch = searchTerm
      ? pedido.puesto?.nombreCarro?.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesState = filterState ? pedido.estado === filterState : true;
    return matchesSearch && matchesState;
  });

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Pedidos Asignados", url: "/pedidos-asignados" },
  ];

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        flex: 1,
        minHeight: 0,
        boxSizing: "border-box",
      }}>
        <div className="qf-page-header qf-page-header--full" style={{ textAlign: "center" }}>
          <h1 className="qf-page-title" style={{ textAlign: "center", fontSize: "1.75rem" }}>
            Pedidos asignados
          </h1>
          <hr className="qf-separator qf-separator--spaced" />
        </div>

        <div
          ref={contentRef}
          className={`qf-page-content ${isNarrowLayout ? "qf-page-content--narrow" : ""}`}
          style={{ flex: 1, minHeight: 0 }}
        >
          <div className="qf-page-content__main">
            <Breadcrumb items={breadcrumbItems} style={{
              margin: 0,
              backgroundColor: "var(--qf-bg-secondary)",
              width: "100%",
              padding: "8px 16px",
              borderRadius: "10px",
              border: "1px solid var(--qf-naranja)",
              boxSizing: "border-box",
            }} />

            {isNarrowLayout && (
              <div className="qf-narrow-filters" style={{ marginBottom: "8px" }}>
                <div className="qf-search-box" style={{ marginBottom: "8px" }}>
                  <Buscador
                    placeholder="Buscar por puesto..."
                    onBuscar={setSearchTerm}
                    botonBuscar={false}
                  />
                </div>
                <div className="qf-filter-box" style={{ margin: 0 }}>
                  <div
                    className="qf-collapsible-header"
                    onClick={() => setFiltersOpen((prev) => !prev)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setFiltersOpen((prev) => !prev)}
                  >
                    <span className="qf-collapsible-title">ESTADOS</span>
                    <FaChevronDown className={`qf-collapsible-icon ${filtersOpen ? "qf-collapsible-icon--open" : ""}`} />
                  </div>
                  {filtersOpen && (
                    <div className="qf-collapsible-body">
                      <Filtros
                        gruposFiltros={[estadoGroup]}
                        onFiltrar={(f) => setFilterState(f.estado || "")}
                        titulo="ESTADOS"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="qf-scrollable" style={{ paddingTop: "8px", paddingBottom: "60px" }}>
              {isLoading ? (
                <div style={{ display: "flex", justifyContent: "center", marginTop: "3rem" }}>
                  <CircularProgress style={{ color: "var(--qf-naranja)" }} />
                </div>
              ) : filteredPedidos.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {filteredPedidos.map((pedido) => (
                    <PedidoRepartidor
                      key={pedido.id}
                      pedido={pedido}
                      recargar={recargarComponente}
                    />
                  ))}
                </div>
              ) : (
                <h2 style={{ color: "var(--qf-naranja)", textAlign: "center" }}>
                  No hay Pedidos asignados
                </h2>
              )}
            </div>
          </div>

          {!isNarrowLayout && (
            <aside className="qf-page-content__aside">
              <div className="qf-search-box">
                <Buscador
                  placeholder="Buscar por puesto..."
                  onBuscar={setSearchTerm}
                  botonBuscar={false}
                />
              </div>
              <div className="qf-filter-box">
                <Filtros
                  gruposFiltros={[estadoGroup]}
                  onFiltrar={(f) => setFilterState(f.estado || "")}
                  titulo="ESTADOS"
                />
              </div>
            </aside>
          )}
        </div>
      </div>
      <Footer />
    </PageLayout>
  );
};

export default ListadoPedidosRepartidor;
