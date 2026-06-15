import React, { useEffect, useState, useContext, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import Footer from "../ComponentesGenerales/Footer";
import PageLayout from "../ComponentesGenerales/PageLayout";
import LoandingComponent from "../ComponentesGenerales/LoandingComponent";
import PuestoUser from "./PuestoUser";
import { useParams } from "react-router-dom";
import { UserContext } from "../ComponentesGenerales/UserContext";
import FiltersPuestosConsumidor from "../Filtros y Buscadores/filtersPuestosConsumidor";
import BuscadorPuestosConsumidor from "../Filtros y Buscadores/BuscadorPuestosConsumidor";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import { useLocation } from "react-router-dom";

const ListadoPuestosUser = () => {
  const { idEvento } = useParams();
  const [loanding, setLoanding] = useState(false);
  const [rows, setRows] = useState([]);
  const [carritos, setCarritos] = useState([]);
  const [filteredCarritos, setFilteredCarritos] = useState([]);
  const { user } = useContext(UserContext);
  const [estrella, setEstrella] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [nombre, setNombre] = useState("");
  const [evento, setEvento] = useState({});
  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Eventos", url: "/Listado-eventos" },
    { title: "Puestos", url: `/listado-puestos/${idEvento}` },
  ];
  const location = useLocation();
  const selectedDay = location.state?.selectedDay || null;
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

  // Obtener datos iniciales
  useEffect(() => {
    setLoanding(false);
    const fetchPuestos = fetch(`${process.env?.REACT_APP_BACK_URL}puesto/evento/${idEvento}`, {
      method: "GET",
    }).then((response) => response.json());

    const fetchEvento = fetch(`${process.env?.REACT_APP_BACK_URL}evento/${idEvento}`, {
      method: "GET",
    }).then((response) => response.json());

    Promise.all([fetchPuestos, fetchEvento])
      .then(([puestosData, eventoData]) => {
        setCarritos(puestosData.data);
        setFilteredCarritos(puestosData.data);
        setEvento(eventoData.data);
        setLoanding(true);
      })
      .catch((error) => {
        console.log("Error al cargar datos.", error);
        setLoanding(true);
      });
  }, [user, idEvento]);

  // Filtrar carritos cuando cambien los filtros
  useEffect(() => {
    const applyFilters = () => {
      let filtered = [...carritos];
      // Filtrar por estrellas
      if (estrella > 0) {
        filtered = filtered.filter(
          (carrito) => carrito.estrella || 4.5 >= estrella
        );
      }
      // Filtrar por tiempo
      if (tiempo > 0) {
        filtered = filtered.filter((carrito) => carrito.tiempo || 30 <= tiempo);
      }
      console.log(filtered);
      // Filtrar por nombre
      if (nombre.trim() !== "") {
        const lowerCaseNombre = nombre.toLowerCase();
        filtered = filtered.filter(
          (carrito) =>
            carrito.nombreCarro?.toLowerCase().includes(lowerCaseNombre) ||
            carrito.tipoNegocio?.toLowerCase().includes(lowerCaseNombre)
        );
      }
      console.log(filtered);
      setFilteredCarritos(filtered);
    };

    applyFilters();
  }, [estrella, tiempo, nombre, carritos]);

  // Generar las filas para los carritos filtrados
  useEffect(() => {
    const totalCarritos = Math.ceil(filteredCarritos.length / 4) * 4;
    const carritosConNulos = [
      ...filteredCarritos,
      ...Array(totalCarritos - filteredCarritos.length).fill(null),
    ];

    const generatedRows = [];
    for (let i = 0; i < carritosConNulos.length; i += 4) {
      const row = carritosConNulos.slice(i, i + 4);
      generatedRows.push(row);
    }
    setRows(generatedRows);
  }, [filteredCarritos]);

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
        {/* Header */}
        <div className="qf-page-header qf-page-header--full" style={{ textAlign: "center" }}>
          <h1 className="qf-page-title" style={{ textAlign: "center", fontSize: "1.75rem" }}>
            {`Puestos de ${evento.nombre}` || "Puestos"}
          </h1>
          <hr className="qf-separator qf-separator--spaced" />
        </div>

        {/* Dos columnas: izquierda (breadcrumb + listado) | derecha (buscador + filtros) */}
        <div ref={contentRef} className={`qf-page-content ${isNarrowLayout ? "qf-page-content--narrow" : ""}`} style={{ flex: 1, minHeight: 0 }}>
          {/* Columna izquierda */}
          <div className="qf-page-content__main">
            <Breadcrumb items={breadcrumbItems} style={{
              margin: '0px auto 8px',
              backgroundColor: 'var(--qf-bg-secondary)',
              width: '98%',
              paddingRight: '16px',
              padding: '8px',
              paddingLeft: '16px',
              borderRadius: '10px',
              border: '1px solid var(--qf-naranja)',
              boxSizing: 'border-box',
            }} />

            {/* En modo angosto: buscador + filtros colapsables antes del listado */}
            {isNarrowLayout && (
              <div className="qf-narrow-filters" style={{ width: "98%", margin: "0 auto 0 auto" }}>
                <div className="qf-search-box" style={{ marginBottom: "8px" }}>
                  <BuscadorPuestosConsumidor setNombre={setNombre} />
                </div>
                <div className="qf-filter-box" style={{ margin: 0 }}>
                  <div
                    className="qf-collapsible-header"
                    onClick={() => setFiltersOpen((prev) => !prev)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setFiltersOpen((prev) => !prev)}
                  >
                    <span className="qf-collapsible-title">FILTROS</span>
                    <FaChevronDown className={`qf-collapsible-icon ${filtersOpen ? "qf-collapsible-icon--open" : ""}`} />
                  </div>
                  {filtersOpen && (
                    <div className="qf-collapsible-body">
                      <FiltersPuestosConsumidor
                        setEstrella={setEstrella}
                        setTiempo={setTiempo}
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="qf-scrollable" style={{ paddingTop: "8px" }}>
              {!loanding ? (
                <LoandingComponent />
              ) : Array.isArray(filteredCarritos) && filteredCarritos.length > 0 ? (
                rows.length > 0 &&
                rows.map((row, rowIndex) => (
                  <div key={rowIndex} style={{ width: "100%" }}>
                    {row.map((carrito, index) => (
                      <div
                        key={index}
                        style={{ marginBottom: "10px", width: "100%" }}
                      >
                        {carrito !== null ? (
                          <PuestoUser carrito={carrito} selectedDay={selectedDay} evento={evento} />
                        ) : null}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <h2 className="qf-no-results">
                  No hay puestos en este momento.
                </h2>
              )}
            </div>
          </div>

          {/* Columna derecha: buscador + filtros */}
          {!isNarrowLayout && (
            <aside className="qf-page-content__aside">
              <div className="qf-search-box">
                <BuscadorPuestosConsumidor setNombre={setNombre} />
              </div>
              <div className="qf-filter-box">
                <FiltersPuestosConsumidor
                  setEstrella={setEstrella}
                  setTiempo={setTiempo}
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

export default ListadoPuestosUser;
