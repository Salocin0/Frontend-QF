import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../ComponentesGenerales/Sidebar";
import Footer from "../ComponentesGenerales/Footer";
import PuestoEncargado from "./PuestoEncargado";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useDynamicColors from "../../UseDinamicColors";
import { useNavigate } from "react-router-dom";

const ListadoPuestosEncargado = () => {
  const [rows, setRows] = useState([]);
  const [carritos, setCarritos] = useState([]);
  const { user } = useContext(UserContext);
  const Colors = useDynamicColors();
  const navigate = useNavigate();
  const [actualizar, setActualizar] = useState(0);

  const actualizarListado = () => {
    setActualizar(prev => prev + 1);
    console.log(actualizar);
  }
  
  useEffect(() => {
    console.log(actualizar);
    if (user) {
      const headers = new Headers();
      headers.append("ConsumidorId", user?.id);
      headers.append("Content-Type", "application/json");

      fetch(`${process.env?.REACT_APP_BACK_URL}puesto/creados`, {
        method: "GET",
        headers: headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setCarritos(data.data);
          console.log(data.data);
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
        .catch((error) => console.log("No existen carritos."));
    }
  }, [actualizar,user]);

  const styles = {
    container: {
      margin: 0,
      backgroundColor: Colors.GrisAzuladoOscuro,
      height: "100vh",
      overflowY: "scroll",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
    },
    header:{
      width: "100%",
      paddingBottom: "50px",
    },
    contentContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 0",
      marginLeft: "20%",
    },
    headerContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      padding: "0 2rem",
      position: "relative",
    },
    sectionTitle: {
      color: Colors.Naranja,
      fontSize: "2rem",
      fontWeight: "bold",
    },
    divider: {
      color: Colors.Naranja,
      margin: "1rem 0",
      width: "100%",
    },
    rowContainer: {
      marginBottom: "1rem",
    },
    gridContainer: {
      textAlign: "center",
      padding: "2rem 0",
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
  };
  
  const agregarNuevo = () => {
    navigate(`/crear-puesto`);
  };
  
  return (
    <div style={styles.container}>
      <Sidebar tipoUsuario={user?.tipoUsuario} />
      <div style={styles.contentContainer}>
        <div style={styles.headerContainer}>
          <h1 style={styles.sectionTitle}>Mis Puestos</h1>
          <button onClick={agregarNuevo} style={styles.agregarButton}>
            Agregar Puesto
          </button>
        </div>
        <hr style={styles.divider} />
        <div style={styles.header}>
          {Array.isArray(carritos) && carritos.length > 0 ? (
            <>
              {rows.length > 0 &&
                rows.map((row, rowIndex) => (
                  <div style={styles.rowContainer} key={rowIndex}>
                    {row.map((carrito, index) => (
                      <div key={index}>
                        {carrito !== null ? (
                          <PuestoEncargado carrito={carrito} actualizarListado={actualizarListado} />
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
                  Con Quickfood, crea tus Puestos de Comida para hacerlo mejor.
                  Descubre nuestras increíbles características y ofrece una
                  experiencia única a tus consumidores.
                </p>
              </div>
              <Link to={`/crear-puesto`} style={styles.linkButton}>
                Crear Puesto
              </Link>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};  

export default ListadoPuestosEncargado;
