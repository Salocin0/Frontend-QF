import React, { useEffect, useState, useContext } from "react";
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
import useBreakpoint from "../../useBreakpoint";

const ListadoPuestosUser = () => {
  const { isMobile, isTablet } = useBreakpoint();
  const { idEvento } = useParams();
  const [loanding, setLoanding] = useState(false);
  const [rows, setRows] = useState([]);
  const [carritos, setCarritos] = useState([]);
  const [filteredCarritos, setFilteredCarritos] = useState([]); // Estado para los carritos filtrados
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
        width: isMobile ? "100%" : "80%",
        height: "100%",
        padding: 0,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        flex: 1,
      }}>
        {/* Header */}
        <div className="qf-page-header">
          <h1 className="qf-page-title" style={{ fontSize: "1.75rem" }}>
            {`Puestos de ${evento.nombre}` || "Puestos"}
          </h1>
          <hr className="qf-separator" />
        </div>

        {/* Contenido scrollable con dos columnas */}
        <div style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "20px",
            alignItems: isMobile ? "stretch" : "flex-start",
            height: isMobile ? "auto" : "100%",
            overflow: isMobile ? "visible" : "hidden",
          }}>
            {/* Columna izquierda: breadcrumb + listado */}
            <div style={{
              width: isMobile ? "100%" : isTablet ? "65%" : "70%",
              boxSizing: "border-box",
            }}>
              <div style={{ paddingLeft: "16px" }}>
                <Breadcrumb items={breadcrumbItems} />
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: "100%",
                overflowY: "auto",
                overflowX: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "10px",
                  boxSizing: "border-box",
                  overflowY: "scroll",
                  overflowX: "hidden",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}>
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
            </div>

            {/* Columna derecha: buscador + filtros */}
            <div style={{
              width: isMobile ? "100%" : isTablet ? "35%" : "30%",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              alignItems: "center",
              order: isMobile ? -1 : 0,
            }}>
              <div className="qf-search-box">
                <BuscadorPuestosConsumidor setNombre={setNombre} />
              </div>
              <div className="qf-filter-box">
                <FiltersPuestosConsumidor
                  setEstrella={setEstrella}
                  setTiempo={setTiempo}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </PageLayout>
  );
};

export default ListadoPuestosUser;
