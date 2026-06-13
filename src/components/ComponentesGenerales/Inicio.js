import CardInicio from "./CardInicio";
import PageLayout from "./PageLayout";
import { useState, useEffect, useContext } from "react";
import pedidoimg from "../img/comida-rapida-casera.jpg";
import eventosimg2 from "../img/eventosimg2.png";
import encargado from "../img/foodtruck.jpg";
import productor from "../img/productor.jpg";
import repartidor from "../img/repartidor.jpg";
import ActionButton from "./ActionButton";
import { FaUser, FaSignOutAlt, FaShoppingCart } from 'react-icons/fa'
import Panel from "../ComponentesLandingPage/ChatPanel";
import Footer from "./Footer";
import asociarEvento from "../img/asociarevento.png";
import estadisticas from "../img/Estadísticas.jpg";
import { useNavigate } from "react-router-dom";
import useBreakpoint from "../../useBreakpoint";
import { UserContext } from "./UserContext";

const Inicio = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();
  const { clearUser } = useContext(UserContext);

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
            clearUser();
            navigate("/login", { replace: true });
            return;
          }
          return response.json();
        })
        .then((data) => {
          if (data) {
            if (data.status !== "success") {
              clearUser();
              navigate("/login", { replace: true });
              return;
            }
            setSession(data.data);
          }
        })
        .catch((error) => console.error("Error fetching session:", error));
    }
  }, []);

  const handleLogout = () => {
    // Llamar al backend para cerrar sesión si existe session
    if (session?.id) {
      const base = process.env?.REACT_APP_BACK_URL || "";
      const normalizedBase = base.startsWith("http") ? base : `https://${base}`;
      const url = normalizedBase.endsWith("/") ? `${normalizedBase}user/cerrarWeb` : `${normalizedBase}/user/cerrarWeb`;
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: session.id }),
      }).catch((err) => console.error("Error cerrando sesión en backend:", err));
    }
    clearUser();
    sessionStorage.removeItem("sessionId");
    navigate("/login", { replace: true });
  };

  const handleProfile = () => {
    navigate("/perfil");
  };

  const handleCart = () => {
    navigate("/carrito");
  };

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen((prevState) => !prevState);
  };

  const cardsData = [
    {
      to: "/Listado-eventos",
      imgSrc: eventosimg2,
      title: "Eventos",
      subtitle: "Busca tus eventos favoritos",
    },
    {
      to: "/pedidos",
      imgSrc: pedidoimg,
      title: "Pedidos",
      subtitle: "¿Quieres ver tus pedidos?",
    },
  ];

  if (session?.tipoUsuario === "consumidor") {
    cardsData.push(
      {
        to: "/adquirir-nuevo-rolPE",
        imgSrc: productor,
        title: "Productores",
        subtitle: "Quickfood para tus eventos",
      },
      {
        to: "/adquirir-nuevo-rolEPC",
        imgSrc: encargado,
        title: "Puestos",
        subtitle: "Quickfood para tus puestos",
      },
      {
        to: "/adquirir-nuevo-rolR",
        imgSrc: repartidor,
        title: "Repartidores",
        subtitle: "Quickfood para repartidores",
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
      },
      {
        to: "/pedidos-asignados",
        imgSrc: repartidor,
        title: "Pedidos asignados",
        subtitle: "Ver tus pedidos asignados",
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
      },
      {
        to: "/grafica-productor",
        imgSrc: estadisticas,
        title: "Estadisticas",
        subtitle: "Ver tus estadisticas",
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
      },
      {
        to: "/misAsociacionesEPC",
        imgSrc: asociarEvento,
        title: "Mis asociaciones",
        subtitle: "Ver tus asociaciones",
      },
      {
        to: "/grafica-encargado",
        imgSrc: estadisticas,
        title: "Estadisticas",
        subtitle: "Ver tus estadisticas",
      }
    );
  }

  const actionButtonsData = [
    {
      title: "Mi Perfil",
      icon: <FaUser />,
      onClick: handleProfile,
      className: "qf-dashboard-action",
      style: {
        backgroundColor: "var(--qf-naranja)",
        padding: "10px",
        borderRadius: "10px",
        cursor: "pointer",
      },
    },
    {
      title: "Cerrar Sesión",
      icon: <FaSignOutAlt />,
      onClick: handleLogout,
      className: "qf-dashboard-action",
      style: {
        backgroundColor: "var(--qf-rojo)",
        padding: "10px",
        borderRadius: "10px",
        cursor: "pointer",
      },
    },
    {
      title: "Carrito",
      icon: <FaShoppingCart />,
      onClick: handleCart,
      className: "qf-dashboard-action",
      style: {
        backgroundColor: "var(--qf-naranja)",
        padding: "10px",
        borderRadius: "10px",
        cursor: "pointer",
      },
    },
  ];

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

  return (
    <PageLayout sidebarProps={{ tipoUsuario: session?.tipoUsuario }}>
      <div className="qf-dashboard-container">
        <div className="qf-dashboard-grid">
          {cardsData.map((card, index) => (
            <SafeCardInicio key={index} data={card} />
          ))}
        </div>
        {/* Action buttons en fila propia, no overlapping con el footer */}
        <div className="qf-dashboard-actions">
          {actionButtonsData.map((btn, index) => (
            <div key={index} className="qf-dashboard-action-item">
              <SafeActionButton
                title={btn.title}
                icon={btn.icon}
                onClick={btn.onClick}
                style={btn.style}
              />
            </div>
          ))}
        </div>
      </div>
      {isPanelOpen && <SafePanel onClose={togglePanel} />}
      <SafeFooter />
    </PageLayout>
  );
};

export default Inicio;
