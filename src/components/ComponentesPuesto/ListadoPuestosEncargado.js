import { useContext, useEffect, useState, useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Footer from "../ComponentesGenerales/Footer";
import PuestoEncargado from "./PuestoEncargado";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../ComponentesGenerales/Breadcrumb";
import Buscador from "../Filtros y Buscadores/Buscador";
import Filtros from "../Filtros y Buscadores/Filtros";

const ListadoPuestosEncargado = () => {
  const [rows, setRows] = useState([]);
  const [carritos, setCarritos] = useState([]);
  const [carritosOriginales, setCarritosOriginales] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtrosAplicados, setFiltrosAplicados] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();
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

  const styles = {
    container: {
      margin: 0,
      backgroundColor: Colors.GrisAzuladoOscuro,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    mainContent: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      marginLeft: "20%",
    },
    contentContainer: {
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      padding: "0",
      gap: "20px",
      paddingLeft: "20px",
      paddingRight: "20px",
    },
    cardsContainer: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      width: "70%",
      minWidth: "60%",
    },
    filtersContainer: {
      width: "30%",
      minWidth: "260px",
      borderRadius: "8px",
      padding: "20px",
      top: "20px",
      backgroundColor: Colors.GrisAzuladoClaro,
      border: `1px solid ${Colors.Naranja}`,
    },
    headerContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      position: "relative",
      marginTop: "1rem",
    },
    sectionTitle: {
      color: Colors.Naranja,
      fontSize: "2rem",
      fontWeight: "bold",
    },
    divider: {
      border: `1px solid ${Colors.Naranja}`,
      width: "100%",
    },
    rowContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      width: "100%",
      gap: "10px",
      padding: "5px 0",
    },
    gridContainer: {
      textAlign: "center",
      width: "100%",
    },
    gridTitle: {
      fontSize: "2rem",
      color: Colors.Naranja,
      marginBottom: "1rem",
    },
    description: {
      fontSize: "1rem",
      color: Colors.BlancoEnBlanco,
      marginBottom: "1.5rem",
    },
    linkButton: {
      textDecoration: "none",
      padding: "0.75rem 1.5rem",
      backgroundColor: Colors.Naranja,
      color: Colors.Negro,
      borderRadius: "5px",
      fontWeight: "bold",
      display: "inline-block",
    },
    agregarButton: {
      padding: "0.5rem 1rem",
      backgroundColor: Colors.Verde,
      color: "white",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      fontWeight: "bold",
      position: "absolute",
      top: "0",
      right: "20px",
    },
    breadcrumbWrapper: {
      width: "100%",
      padding: "0px 0px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    searchFilterContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
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
    <div style={styles.container}>
      <Sidebar tipoUsuario={user?.tipoUsuario} />

      <div style={styles.mainContent}>
        <div style={styles.headerContainer}>
          <h1 style={styles.sectionTitle}>Mis Puestos</h1>
        </div>
        <hr style={styles.divider} />
        <div style={styles.contentContainer}>
          <div style={styles.cardsContainer}>
            <div style={styles.breadcrumbWrapper}>
              <Breadcrumb
                items={breadcrumbItems}
                style={{ width: "Calc(100% - 20px)", marginLeft: "20px" }}
              />
            </div>
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: "2rem",
                }}
              >
                <CircularProgress
                  style={{ color: Colors.Naranja }}
                  size={40}
                />
              </div>
            ) : Array.isArray(carritos) && carritos.length > 0 ? (
              <>
                {rows.length > 0 &&
                  rows.map((row, rowIndex) => (
                    <div style={styles.rowContainer} key={rowIndex}>
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
              <div style={styles.gridContainer}>
                <div style={styles.gridTitle}>
                  <h2>Puestos</h2>
                </div>
                <div style={styles.description}>
                  <p>
                    Con Quickfood, crea tus Puestos de Comida para hacerlo
                    mejor. Descubre nuestras increíbles características y ofrece
                    una experiencia única a tus consumidores.
                  </p>
                </div>
                <Link to={`/crear-puesto`} style={styles.linkButton}>
                  Crear Puesto
                </Link>
              </div>
            )}
          </div>

          {/* Panel de filtros al lado de las cards */}
          <div style={styles.filtersContainer}>
            <div style={styles.searchFilterContainer}>
              <Buscador
                placeholder="Buscar puestos..."
                onBuscar={handleBuscar}
              />
              <Filtros
                gruposFiltros={gruposEjemplo}
                onFiltrar={handleFiltrar}
                titulo="FILTRAR PUESTOS"
              />
            </div>
            <button
              onClick={agregarNuevo}
              style={{
                ...styles.agregarButton,
                position: "relative",
                top: "auto",
                right: "auto",
                marginTop: "1rem",
                width: "100%",
              }}
            >
              Agregar Puesto
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ListadoPuestosEncargado;
