import CardInicio from "./CardInicio";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import pedidoimg from "../img/comida-rapida-casera.jpg";
import eventosimg2 from "../img/eventosimg2.png";
import encargado from "../img/foodtruck.jpg";
import productor from "../img/productor.jpg";
import repartidor from "../img/repartidor.jpg";
import useDynamicColors from "../../UseDinamicColors";
import ActionButton from "./ActionButton";
import chatboticon from "../bot-img.png";
import Panel from "../ComponentesLandingPage/ChatPanel";
import Footer from "./Footer";
import asociarEvento from "../img/asociarevento.png";
import estadisticas from "../img/Estadísticas.jpg";
import { useNavigate } from "react-router-dom";

const Inicio = () => {
  const [session, setSession] = useState(null);
  const Colors = useDynamicColors();
  const navigate = useNavigate();


  useEffect(() => {
    const sessionId = sessionStorage.getItem("sessionId");
    if (sessionId) {
      const base = process.env?.REACT_APP_BACK_URL || "";
      const normalizedBase = base.startsWith("http") ? base : `https://${base}`;
      const url = normalizedBase.endsWith("/") ? `${normalizedBase}user/session` : `${normalizedBase}/user/session`;

      console.log('Inicio - session fetch url:', url);
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionID: sessionId }),
      })
        .then(async (response) => {
          if (!response.ok) {
            const text = await response.text().catch(() => "<no body>");
            console.error("Error fetching session - non-OK response:", response.status, text);
            return;
          }
          return response.json();
        })
        .then((data) => {
          if (data) setSession(data.data);
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  }, []);

  const handleLogout = () => {
    //TODO: Implementar funcionalidad de logout
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/perfil");
  };

  const handleCart = () => {
    navigate("/carrito");
  };

  const getContentStyles = (tipoUsuario) => {
    switch (tipoUsuario) {
      case "repartidor":
        return {
          flex: 1,
          padding: "20px",
          marginBottom: "50px",
          display: "grid",
          gridTemplateColumns: "repeat(16, 1fr)",
          gridTemplateRows: "repeat(10, 1fr)",
          gap: "10px",
          gridTemplateAreas: `
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos misasociaciones misasociaciones misasociaciones misasociaciones pedidosasignados pedidosasignados pedidosasignados pedidosasignados"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos misasociaciones misasociaciones misasociaciones misasociaciones pedidosasignados pedidosasignados pedidosasignados pedidosasignados"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos misasociaciones misasociaciones misasociaciones misasociaciones pedidosasignados pedidosasignados pedidosasignados pedidosasignados"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos misasociaciones misasociaciones misasociaciones misasociaciones pedidosasignados pedidosasignados pedidosasignados pedidosasignados"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos misasociaciones misasociaciones misasociaciones misasociaciones pedidosasignados pedidosasignados pedidosasignados pedidosasignados"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos misasociaciones misasociaciones misasociaciones misasociaciones pedidosasignados pedidosasignados pedidosasignados pedidosasignados"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos misasociaciones misasociaciones misasociaciones misasociaciones pedidosasignados pedidosasignados pedidosasignados pedidosasignados"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos misasociaciones misasociaciones misasociaciones misasociaciones pedidosasignados pedidosasignados pedidosasignados pedidosasignados"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos carrito carrito carrito perfil perfil perfil perfil perfil"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos carrito carrito carrito cerrarSesion cerrarSesion cerrarSesion cerrarSesion cerrarSesion"
          `,
        };
      case "productor":
        return {
          flex: 1,
          padding: "20px",
          marginBottom: "50px",
          display: "grid",
          gridTemplateColumns: "repeat(16, 1fr)",
          gridTemplateRows: "repeat(10, 1fr)",
          gap: "10px",
          gridTemplateAreas: `
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos miseventos miseventos miseventos miseventos estadisticas estadisticas estadisticas estadisticas"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos miseventos miseventos miseventos miseventos estadisticas estadisticas estadisticas estadisticas"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos miseventos miseventos miseventos miseventos estadisticas estadisticas estadisticas estadisticas"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos miseventos miseventos miseventos miseventos estadisticas estadisticas estadisticas estadisticas"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos miseventos miseventos miseventos miseventos estadisticas estadisticas estadisticas estadisticas"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos miseventos miseventos miseventos miseventos estadisticas estadisticas estadisticas estadisticas"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos miseventos miseventos miseventos miseventos estadisticas estadisticas estadisticas estadisticas"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos miseventos miseventos miseventos miseventos estadisticas estadisticas estadisticas estadisticas"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos carrito carrito carrito perfil perfil perfil perfil perfil"
            "eventos eventos eventos eventos pedidos pedidos pedidos pedidos carrito carrito carrito cerrarSesion cerrarSesion cerrarSesion cerrarSesion cerrarSesion"
          `,
        };
      case "encargado":
        return {
          flex: 1,
          padding: "20px",
          marginBottom: "50px",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "repeat(10, 1fr)",
          gap: "10px",
          gridTemplateAreas: `
            "eventos pedidos misasociaciones mispuestos estadisticas"
            "eventos pedidos misasociaciones mispuestos estadisticas"
            "eventos pedidos misasociaciones mispuestos estadisticas"
            "eventos pedidos misasociaciones mispuestos estadisticas"
            "eventos pedidos misasociaciones mispuestos estadisticas"
            "eventos pedidos misasociaciones mispuestos estadisticas"
            "eventos pedidos misasociaciones mispuestos estadisticas"
            "eventos pedidos misasociaciones mispuestos estadisticas"
            "eventos pedidos carrito perfil perfil"
            "eventos pedidos carrito cerrarSesion cerrarSesion"
          `,
        };
      default:
        return {
          flex: 1,
          padding: "20px",
          marginBottom: "50px",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "repeat(10, 1fr)",
          gap: "10px",
          gridTemplateAreas: `
            "eventos pedidos productores puestos repartidores"
            "eventos pedidos productores puestos repartidores"
            "eventos pedidos productores puestos repartidores"
            "eventos pedidos productores puestos repartidores"
            "eventos pedidos productores puestos repartidores"
            "eventos pedidos productores puestos repartidores"
            "eventos pedidos productores puestos repartidores"
            "eventos pedidos productores puestos repartidores"
            "eventos pedidos carrito perfil perfil"
            "eventos pedidos carrito cerrarSesion cerrarSesion"
          `,
        };
    }
  };

  // Usar el tipo de usuario para obtener estilos
  const contentStyles = getContentStyles(session?.tipoUsuario);

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen((prevState) => !prevState);
  };

  // Verificación de seguridad para evitar renderizar componentes undefined
  const SafeCardInicio = (props) => {
    if (typeof CardInicio === 'function') {
      return <CardInicio {...props} />;
    } else {
      return <div>Error: CardInicio no cargó</div>;
    }
  };
  const SafeActionButton = (props) => {
    if (typeof ActionButton === 'function') {
      return <ActionButton {...props} />;
    } else {
      return <div>Error: ActionButton no cargó</div>;
    }
  };
  const SafeSidebar = (props) => {
    if (typeof Sidebar === 'function') {
      return <Sidebar {...props} />;
    } else {
      return <div>Error: Sidebar no cargó</div>;
    }
  };
  const SafePanel = (props) => {
    if (typeof Panel === 'function') {
      return <Panel {...props} />;
    } else {
      return <div>Error: Panel no cargó</div>;
    }
  };
  const SafeFooter = (props) => {
    if (typeof Footer === 'function') {
      return <Footer {...props} />;
    } else {
      return <div>Error: Footer no cargó</div>;
    }
  };


  const cardsData = [
    {
      to: "/Listado-eventos",
      imgSrc: eventosimg2,
      title: "Eventos",
      subtitle: "Busca tus eventos favoritos",
      gridArea: "eventos",
    },
    {
      to: "/pedidos",
      imgSrc: pedidoimg,
      title: "Pedidos",
      subtitle: "¿Quieres ver tus pedidos?",
      gridArea: "pedidos",
    },
  ];

  if (session?.tipoUsuario === "consumidor") {
    cardsData.push(
      {
        to: "/adquirir-nuevo-rolPE",
        imgSrc: productor,
        title: "Productores",
        subtitle: "Quickfood para tus eventos",
        gridArea: "productores",
      },
      {
        to: "/adquirir-nuevo-rolEPC",
        imgSrc: encargado,
        title: "Puestos",
        subtitle: "Quickfood para tus puestos",
        gridArea: "puestos",
      },
      {
        to: "/adquirir-nuevo-rolR",
        imgSrc: repartidor,
        title: "Repartidores",
        subtitle: "Quickfood para repartidores",
        gridArea: "repartidores",
      }
    );
  }

  if (session?.tipoUsuario === "repartidor") {
    cardsData.push(
      {
        to: "/asociarRepartidorAEvento",
        imgSrc: asociarEvento,
        title: "Asociarse a un evento",
        subtitle: "¿Quieres asociarte a un evento?",
        gridArea: "misasociaciones",
      },
      {
        to: "/pedidos-asignados",
        imgSrc: repartidor,
        title: "Pedidos asignados",
        subtitle: "Ver tus pedidos asignados",
        gridArea: "pedidosasignados",
      }
    );
  }

  if (session?.tipoUsuario === "productor") {
    cardsData.push(
      {
        to: "/listado-eventos-productor",
        imgSrc: asociarEvento,
        title: "Mis Eventos",
        subtitle: "ver mis eventos",
        gridArea: "miseventos",
      },
      {
        to: "/grafica-productor",
        imgSrc: estadisticas,
        title: "Estadisticas",
        subtitle: "Ver tus estadisticas",
        gridArea: "estadisticas",
      }
    );
  }

  if (session?.tipoUsuario === "encargado") {
    cardsData.push(
      {
        to: "/listado-puestos-encargado",
        imgSrc: encargado,
        title: "Mis puestos",
        subtitle: "ver mis puestos",
        gridArea: "mispuestos",
      },
      {
        to: "/misAsociacionesEPC",
        imgSrc: asociarEvento,
        title: "Mis asociaciones",
        subtitle: "Ver tus asociaciones",
        gridArea: "misasociaciones",
      },
      {
        to: "/grafica-encargado",
        imgSrc: estadisticas,
        title: "Estadisticas",
        subtitle: "Ver tus estadisticas",
        gridArea: "estadisticas",
      }
    );
  }

  const actionButtonsData = [
    {
      title: "Mi Perfil",
      onClick: handleProfile,
      style: {
        gridArea: "perfil",
        backgroundColor: Colors.Naranja,
        padding: "10px",
        borderRadius: "10px",
        cursor: "pointer",
      },
    },
    {
      title: "Cerrar Sesión",
      onClick: handleLogout,
      style: {
        gridArea: "cerrarSesion",
        backgroundColor: Colors.Rojo,
        padding: "10px",
        borderRadius: "10px",
        cursor: "pointer",
      },
    },
    {
      title: "Carrito",
      onClick: handleCart,
      style: {
        gridArea: "carrito",
        backgroundColor: Colors.Naranja,
        padding: "10px",
        borderRadius: "10px",
        cursor: "pointer",
      },
    },
  ];

  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      backgroundColor: Colors.GrisAzuladoOscuro,
    },
    sidebar: {
      width: "20%",
    },
    profileButton: {
      gridArea: "perfil",
      backgroundColor: Colors.Naranja,
      padding: "10px",
      textAlign: "center",
      borderRadius: "5px",
      cursor: "pointer",
    },
    logoutButton: {
      gridArea: "cerrarSesion",
      backgroundColor: Colors.Rojo,
      padding: "10px",
      textAlign: "center",
      borderRadius: "5px",
      cursor: "pointer",
    },
    chatbotButton: {
      gridArea: "chatbot",
      backgroundColor: Colors.Rosa,
      padding: "10px",
      textAlign: "center",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <SafeSidebar tipoUsuario={session?.tipoUsuario} />
      </div>
      <div style={contentStyles}>
        {cardsData.map((card, index) => (
          <SafeCardInicio key={index} data={card} />
        ))}
        {actionButtonsData.map((button, index) => (
          <SafeActionButton key={index} {...button} />
        ))}
      </div>
      {isPanelOpen && <SafePanel onClose={togglePanel} />}
      <SafeFooter />
    </div>
  );
};

export default Inicio;
