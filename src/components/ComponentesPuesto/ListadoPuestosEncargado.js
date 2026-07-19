import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "../ComponentesGenerales/PageLayout";
import PuestoEncargado from "./PuestoEncargado";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useContext } from "react";
import Footer from "../ComponentesGenerales/Footer";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import Buscador from "../Filtros y Buscadores/Buscador";
import Filtros from "../Filtros y Buscadores/Filtros";
import { CircularProgress } from "@mui/material";
import useBreakpoint from "../../useBreakpoint";

const ListadoPuestosEncargado = () => {
  const { isMobile, width } = useBreakpoint();
  const isVeryNarrow = width < 1100;
  const [puestos, setPuestos] = useState([]);
  const [recargar, setRecargar] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const recargarComponente = () => {
    console.log("Recargando componente");
    setTimeout(() => {
      setRecargar(recargar + 1);
    }, 100);
  };

  useEffect(() => {
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user?.id);
      headers.append("Content-Type", "application/json");

      setIsLoading(true);
      fetch(`${process.env?.REACT_APP_BACK_URL}puesto/creados`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setPuestos(data.data);
        })
        .catch((error) => console.log("No existen puestos.", error))
        .finally(() => setIsLoading(false));
    }
  }, [user, recargar]);

  const agregarNuevo = () => {
    navigate(`/crear-puesto`);
  };

  const estadoGroup = {
    nombre: 'estado',
    opciones: Array.from(
      new Set(puestos.map((p) => p.estado))
    ).map((estado) => ({
      valor: estado,
      etiqueta: estado ? estado.replace(/([A-Z])/g, ' $1').trim() : estado,
    })),
  };

  const filteredPuestos = puestos.filter((puesto) => {
    const matchesSearch = searchTerm
      ? JSON.stringify(puesto).toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesState = filterState
      ? puesto.estado === filterState
      : true;
    return matchesSearch && matchesState;
  });

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Puestos", url: "/listado-puestos-encargado" },
  ];

  const asideContent = (
    <aside className="qf-page-content__aside" style={isVeryNarrow ? { width: "calc(100% - 20px)", margin: "0 20px 10px 20px", minWidth: 0, order: 0 } : undefined}>
      <div className="qf-search-box">
        <Buscador
          placeholder="Buscar puestos..."
          onBuscar={setSearchTerm}
          botonBuscar={false}
        />
      </div>
      <div className="qf-filter-box">
        <Filtros
          gruposFiltros={[estadoGroup]}
          onFiltrar={(f) => setFilterState(f.estado || '')}
          titulo="ESTADOS"
          collapsible
          defaultCollapsed
        />
      </div>
      <button
        onClick={agregarNuevo}
        className="qf-btn qf-btn--primary"
        style={{ width: "100%" }}
      >
        Agregar Puesto
      </button>
    </aside>
  );

  return (
    <PageLayout sidebarProps={{ tipoUsuario: user?.tipoUsuario }}>
      {/* Header full-width */}
      <div className="qf-page-header" style={{ textAlign: "center", paddingLeft: 0 }}>
        <h1 className="qf-page-title" style={{ textAlign: "center", paddingBottom: "20px" }}>Puestos</h1>
      </div>
      <hr className="qf-separator" style={{ margin: "0 0 20px", width: "100vw", marginLeft: "calc(-50vw + 50%)" }} />

      {/* Contenido en dos columnas */}
      <div className="qf-page-content" style={{ padding: isMobile ? "0 12px" : "0 20px 0 0", flex: 1, minHeight: 0, flexDirection: isVeryNarrow ? "column" : "row" }}>
        {/* Columna principal: breadcrumb + aside (si es angosto) + listado */}
        <div className="qf-page-content__main">
          <Breadcrumb items={breadcrumbItems} style={{ width: "calc(100% - 20px)", margin: "0 20px 10px 20px" }} />
          {isVeryNarrow && asideContent}

          <div className="qf-scrollable" style={{ paddingBottom: "60px" }}>
            {isLoading || !user ? (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "3rem", height: "300px" }}>
                <CircularProgress style={{ color: "var(--qf-naranja)" }} />
              </div>
            ) : filteredPuestos.length > 0 ? (
              filteredPuestos.map((puesto, index) => (
                <PuestoEncargado
                  key={index}
                  carrito={puesto}
                  actualizarListado={recargarComponente}
                />
              ))
            ) : (
              <div style={{ textAlign: "center", padding: "40px 20px", margin: "40px" }}>
                <div style={{ fontSize: "1.5rem", color: "var(--qf-naranja)" }}>
                  <h2>Puestos</h2>
                </div>
                <div style={{ marginBottom: "20px", fontSize: "18px", color: "var(--qf-text-primary)" }}>
                  <p>
                    Con Quickfood, crea tus Puestos de Comida para hacerlo mejor.
                    Descubre nuestras increíbles características y ofrece una experiencia
                    única a tus consumidores.
                  </p>
                </div>
                <Link
                  to={`/crear-puesto`}
                  style={{
                    textDecoration: "none",
                    backgroundColor: "var(--qf-naranja)",
                    padding: "10px 20px",
                    color: "var(--qf-text-primary)",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    fontSize: "18px",
                    transition: "background-color 0.3s",
                    display: "inline-block",
                  }}
                >
                  Crear Puesto
                </Link>
              </div>
            )}
          </div>
        </div>

        {!isVeryNarrow && asideContent}
      </div>

      <Footer />
    </PageLayout>
  );
};

export default ListadoPuestosEncargado;
