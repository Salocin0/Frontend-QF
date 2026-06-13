import { useContext, useEffect, useState, useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import PageLayout from "../ComponentesGenerales/PageLayout";
import Footer from "../ComponentesGenerales/Footer";
import PuestoEncargado from "./PuestoEncargado";
import { UserContext } from "../ComponentesGenerales/UserContext";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import Buscador from "../Filtros y Buscadores/Buscador";
import Filtros from "../Filtros y Buscadores/Filtros";
import useBreakpoint from "../../useBreakpoint";

const ListadoPuestosEncargado = () => {
  const { isMobile, isTablet } = useBreakpoint();
  const [rows, setRows] = useState([]);
  const [carritos, setCarritos] = useState([]);
  const [carritosOriginales, setCarritosOriginales] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtrosAplicados, setFiltrosAplicados] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [actualizar, setActualizar] = useState(0);

  const actualizarListado = () => {
    setActualizar((prev) => prev + 1);
  };

  const gruposEjemplo = [
    {
      nombre: "estado",
      opciones: [
        { valor: "Creado", etiqueta: "Creado" },
        { valor: "Deshabilitado", etiqueta: "Deshabilitado" },
      ],
    },
    {
      nombre: "tipo",
      opciones: [
        { valor: "comida_rapida", etiqueta: "Comida Rápida" },
        { valor: "restaurante", etiqueta: "Restaurante" },
      ],
    },
  ];

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
          setCarritos(data.data);
          setCarritosOriginales(data.data);
          const totalCarritos = Math.ceil(data.data.length / 4) * 4;
          const carritosConNulos = [
            ...data.data,
            ...Array(totalCarritos - data.data.length).fill(null),
          ];

          const generatedRows = [];
          for (let i = 0; i < carritosConNulos.length; i += 4) {
            const row = carritosConNulos.slice(i, i + 4);
            generatedRows.push(row);
          }
          setRows(generatedRows);
        })
        .catch((error) => console.log("No existen carritos."))
        .finally(() => setIsLoading(false));

    }
  }, [actualizar, user]);

  const handleBuscar = (texto) => {
    setBusqueda(texto);
  };

  const handleFiltrar = (filtros) => {
    setFiltrosAplicados(filtros);
  };

  const carritosFiltrados = useMemo(() => {
    return carritosOriginales.filter((carrito) => {
      const coincideBusqueda =
        !busqueda ||
        JSON.stringify(carrito).toLowerCase().includes(busqueda.toLowerCase());

      const coincideFiltros = Object.entries(filtrosAplicados).every(
        ([campo, valor]) => {
          if (!valor) return true;
          return carrito[campo] === valor;
        }
      );

      return coincideBusqueda && coincideFiltros;
    });
  }, [busqueda, filtrosAplicados, carritosOriginales]);

  useEffect(() => {
    setCarritos(carritosFiltrados);
    const totalCarritos = Math.ceil(carritosFiltrados.length / 4) * 4;
    const carritosConNulos = [
      ...carritosFiltrados,
      ...Array(totalCarritos - carritosFiltrados.length).fill(null),
    ];

    const generatedRows = [];
    for (let i = 0; i < carritosConNulos.length; i += 4) {
      const row = carritosConNulos.slice(i, i + 4);
      generatedRows.push(row);
    }
    setRows(generatedRows);
  }, [carritosFiltrados]);

  const agregarNuevo = () => {
    navigate(`/crear-puesto`);
  };

  const breadcrumbItems = [
    { title: "Inicio", url: "/inicio" },
    { title: "Mis Puestos", url: "/listado-puestos-encargado" },
  ];

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
            Mis Puestos
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
            paddingLeft: isMobile ? "0" : "20px",
            paddingRight: isMobile ? "0" : "20px",
          }}>
            {/* Columna izquierda: breadcrumb + cards */}
            <div style={{
              width: isMobile ? "100%" : isTablet ? "65%" : "70%",
              boxSizing: "border-box",
            }}>
              <Breadcrumb items={breadcrumbItems} />

              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "2rem",
                  }}
                >
                  <CircularProgress
                    style={{ color: "var(--qf-naranja)" }}
                    size={40}
                  />
                </div>
              ) : Array.isArray(carritos) && carritos.length > 0 ? (
                <>
                  {rows.length > 0 &&
                    rows.map((row, rowIndex) => (
                      <div key={rowIndex} style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", width: "100%", gap: "10px", padding: "5px 0" }}>
                        {row.map((carrito, index) => (
                          <div key={index}>
                            {carrito !== null ? (
                              <PuestoEncargado
                                carrito={carrito}
                                actualizarListado={actualizarListado}
                              />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ))}
                </>
              ) : (
                <div style={{ textAlign: "center", width: "100%" }}>
                  <h2 style={{ fontSize: "2rem", color: "var(--qf-naranja)", marginBottom: "1rem" }}>
                    Puestos
                  </h2>
                  <p style={{ fontSize: "1rem", color: "var(--qf-blanco-puro)", marginBottom: "1.5rem" }}>
                    Con Quickfood, crea tus Puestos de Comida para hacerlo mejor.
                    Descubre nuestras increíbles características y ofrece una experiencia
                    única a tus consumidores.
                  </p>
                  <Link
                    to={`/crear-puesto`}
                    className="qf-btn qf-btn--primary"
                    style={{ textDecoration: "none", display: "inline-block" }}
                  >
                    Crear Puesto
                  </Link>
                </div>
              )}
            </div>

            {/* Columna derecha: filtros + buscador + agregar */}
            <div style={{
              width: isMobile ? "100%" : isTablet ? "35%" : "30%",
              minWidth: isMobile ? "auto" : "260px",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              order: isMobile ? -1 : 0,
            }}>
              <Buscador
                placeholder="Buscar puestos..."
                onBuscar={handleBuscar}
              />
              <Filtros
                gruposFiltros={gruposEjemplo}
                onFiltrar={handleFiltrar}
                titulo="FILTRAR PUESTOS"
              />
              <button
                onClick={agregarNuevo}
                className="qf-btn qf-btn--success"
                style={{ width: "100%" }}
              >
                Agregar Puesto
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </PageLayout>
  );
};

export default ListadoPuestosEncargado;
