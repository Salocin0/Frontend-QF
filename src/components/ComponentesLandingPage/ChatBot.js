import React, { useState, useRef, useEffect, useCallback } from "react";
import userImageURL from "../user-img.png";
import botImageURL from "../bot-img.png";
import "./../ComponenteRegister/placeholder.css";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useBreakpoint from "../../useBreakpoint";
import useTheme from "../../useTheme";
import { parseChatText } from "./chatRichText";

const Chatbot = () => {
  const { user } = useContext(UserContext);
  const { isMobile } = useBreakpoint();
  const { isDark, toggleTheme } = useTheme();
  const [messages, setMessages] = useState([]);
  // Sin sesión el chat abre igual (para que se vea que funciona), pero no consulta.
  const isGuest = !user?.nombre;
  const styles = {
    global: {
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "var(--qf-bg-main)",
      color: "var(--qf-text-primary)",
      borderRadius: "20px",
      margin: 0,
      padding: 0,
    },
    header: {
      position: "relative",
      backgroundColor: "var(--qf-bg-dark)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      justifyContent: "flex-start",
      padding: "14px 52px 14px 16px",
      borderBottom: `3px solid var(--qf-naranja)`,
      borderRadius: "20px 20px 0 0",
    },
    headerAvatar: {
      width: "34px",
      height: "34px",
      borderRadius: "50%",
      objectFit: "cover",
      border: `2px solid var(--qf-naranja)`,
      flexShrink: 0,
    },
    headerTextWrap: {
      display: "flex",
      flexDirection: "column",
      minWidth: 0,
    },
    headerTitle: {
      margin: 0,
      color: "var(--qf-naranja)",
      fontSize: isMobile ? "1em" : "1.1em",
      fontWeight: 700,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    headerSubtitle: {
      margin: 0,
      color: "var(--qf-blanco-puro)",
      opacity: 0.75,
      fontSize: "0.75em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    themeSwitch: {
      position: "absolute",
      right: "52px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "44px",
      height: "24px",
      padding: 0,
      borderRadius: "20px",
      border: `1px solid var(--qf-naranja)`,
      backgroundColor: "var(--qf-bg-main)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      transition: "background-color 0.3s ease",
    },
    themeSwitchThumb: {
      position: "absolute",
      top: "50%",
      left: isDark ? "22px" : "2px",
      transform: "translateY(-50%)",
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      backgroundColor: "var(--qf-naranja)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "10px",
      lineHeight: 1,
      transition: "left 0.3s ease",
    },
    chatContainer: {
      width: "100%",
      margin: 0,
      padding: "12px",
      backgroundColor: "var(--qf-bg-main)",
      borderRadius: "0 0 20px 20px",
      boxSizing: "border-box",
    },
    chatBox: {
      height: isMobile ? "260px" : "320px",
      overflowY: "auto",
      border: `1px solid rgba(197, 161, 69, 0.35)`,
      padding: "12px",
      marginBottom: "12px",
      backgroundColor: "var(--qf-bg-dark)",
      borderRadius: "14px",
      scrollBehavior: "smooth",
    },
    chatMessage: {
      display: "flex",
      alignItems: "flex-start",
      marginBottom: "12px",
      flexDirection: "row",
      gap: "8px",
    },
    messageText: {
      borderRadius: "14px",
      padding: "10px 14px",
      maxWidth: "78%",
      fontSize: "0.92em",
      backgroundColor: "var(--qf-bg-secondary)",
      color: "var(--qf-blanco-puro)",
      boxSizing: "border-box",
      overflowWrap: "anywhere",
    },
    userImage: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      objectFit: "cover",
      flexShrink: 0,
    },
    botImage: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      objectFit: "cover",
      flexShrink: 0,
    },
    userMessageText: {
      color: "var(--qf-negro-puro)",
      backgroundColor: "var(--qf-naranja)",
      borderBottomRightRadius: "4px",
    },
    botMessageText: {
      color: "var(--qf-blanco-puro)",
      backgroundColor: "var(--qf-bg-secondary)",
      borderBottomLeftRadius: "4px",
    },
    chatInputContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    chatInput: {
      flex: 1,
      minWidth: 0,
      padding: "10px 14px",
      border: `1px solid rgba(197, 161, 69, 0.5)`,
      borderRadius: "20px",
      backgroundColor: "var(--qf-bg-dark)",
      color: "var(--qf-blanco-puro)",
      fontSize: "0.9em",
      outline: "none",
      transition: "border 0.3s ease, box-shadow 0.3s ease",
    },
    sendBtn: {
      padding: isMobile ? "10px 12px" : "10px 20px",
      fontSize: isMobile ? "0.85em" : "1em",
      backgroundColor: "var(--qf-naranja)",
      color: "var(--qf-negro-puro)",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      whiteSpace: "nowrap",
      transition: "background-color 0.3s ease",
    },
    chatInputDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
    sendBtnDisabled: {
      opacity: 0.5,
      cursor: "not-allowed",
    },
    footer: {
      textAlign: "center",
      padding: "8px 0 10px",
      backgroundColor: "var(--qf-bg-main)",
      fontSize: "0.7em",
      borderTop: `1px solid rgba(197, 161, 69, 0.25)`,
      borderRadius: "0 0 20px 20px",
      color: "var(--qf-blanco-puro)",
      opacity: 0.7,
    },
    footerLink: {
      color: "var(--qf-naranja)",
      textDecoration: "underline",
      cursor: "pointer",
      fontWeight: 600,
    },
    bold: {
      color: "var(--qf-naranja)",
      fontWeight: 700,
    },
    richHeading: {
      color: "var(--qf-blanco-puro)",
      fontWeight: 700,
      fontSize: "1.05em",
      margin: "0 0 6px 0",
    },
    richParagraph: {
      // El color va explícito: _inicio.scss define `h2, p { color: black }` a nivel
      // global y, al ser una regla directa sobre <p>, gana sobre el color heredado
      // del contenedor. Sin esto el texto quedaba negro sobre fondo negro.
      color: "var(--qf-blanco-puro)",
      margin: "0 0 8px 0",
      lineHeight: 1.45,
    },
    richList: {
      margin: "0 0 8px 0",
      paddingLeft: "20px",
      listStyleType: "disc",
      color: "var(--qf-blanco-puro)",
    },
    richListItem: {
      color: "var(--qf-blanco-puro)",
      marginBottom: "4px",
      lineHeight: 1.45,
    },
    footerLink2: {
      color: "var(--qf-naranja)",
      textDecoration: "underline",
      cursor: "pointer",
    },
    text: {
      color: "var(--qf-text-primary)",
    },
  };
  const MenssageLogin = `Puedes loguearte haciendo click aquí.`;

  const MenssageRegister = `Tambien podes crearte una cuenta haciendo click aquí.`;

  // Saludo para visitantes sin sesión: explica quién es Foody y por qué necesita
  // que se registren. El chat abre igual, pero no deja consultar.
  const GuestGreeting = `Hola! Soy Foody 🤖, el asistente de QuickFood. Te ayudo a encontrar eventos, puestos y precios.

No detecto que estés logueado o registrado. Para consultarme, ingresá con tu cuenta o creá una gratis.`;

  const chatInputRef = useRef(null);
  const chatBoxRef = useRef(null);

  const addMessageToChat = useCallback((message, sender) => {
    setMessages((prevMessages) => [...prevMessages, { message, sender }]);

    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, 100);
  }, []);

  const sendMessage = useCallback(() => {
    const chatInput = chatInputRef.current;
    const message = chatInput.value.trim();
    if (!message) return;

    // Sin sesión no se consulta al backend: el LLM es pago y la API no autentica.
    if (!user?.nombre) {
      addMessageToChat(
        "Para consultarme necesitás iniciar sesión. Usá los links de arriba 👆",
        "bot"
      );
      return;
    }

    addMessageToChat(message, "user");
    chatInput.value = "";

    // URLSearchParams se encarga del encoding: pasar el string crudo a su constructor
    // hacía que "&" cortara el mensaje y "+" se volviera espacio.
    const body = new URLSearchParams();
    body.append("userMessage", message);

    fetch(`${process.env?.REACT_APP_BACK_URL}chatbot`, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.msg || "No pudimos obtener una respuesta.");
        }
        return data;
      })
      .then((data) => {
        addMessageToChat(data.data.chat_response, "bot");
      })
      .catch((error) => {
        console.error("Error:", error);
        addMessageToChat(
          error.message ||
            "No pudimos obtener una respuesta. Probá de nuevo en unos segundos.",
          "bot"
        );
      });
  }, [addMessageToChat, user]);

  useEffect(() => {
    const nombre = user?.nombre;
    const greetingMessage = nombre
      ? `Hola ${nombre} 👋 👋, \nespero que estés bien! Acá Foody 🤖.  \nDecime, ¿en qué puedo ayudarte?`
      : GuestGreeting;

    if (nombre) {
      setMessages([
        {
          message: greetingMessage,
          sender: "bot",
        },
      ]);
    } else {
      setMessages([
        {
          message: greetingMessage,
          sender: "bot",
        },
        {
          message: MenssageLogin,
          sender: "bot",
        },
        {
          message: MenssageRegister,
          sender: "bot",
        },
      ]);
    }
  }, [user, GuestGreeting, MenssageLogin, MenssageRegister]);

  useEffect(() => {
    const chatInput = chatInputRef.current;
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
      }
    };

    chatInput.addEventListener("keypress", handleKeyPress);
    return () => {
      chatInput.removeEventListener("keypress", handleKeyPress);
    };
  }, [sendMessage]);



  // Convierte la respuesta del bot en bloques con estilo: negrita, viñetas y links
  // clickeables. El parseo vive en chatRichText.js para poder testearlo aparte.
  const renderRichText = (text) => {
    if (typeof text !== "string") return text;

    const blocks = parseChatText(text);
    if (!blocks.length) return text;

    const renderSpans = (spans, keyPrefix) =>
      spans.map((span, i) => {
        if (span.type === "bold") {
          return (
            <strong key={`${keyPrefix}-b${i}`} style={styles.bold}>
              {span.value}
            </strong>
          );
        }
        if (span.type === "link") {
          // Las rutas relativas abren en la misma pestaña; las absolutas en una nueva
          const isRelative = span.href.startsWith("/");
          return (
            <a
              key={`${keyPrefix}-l${i}`}
              href={span.href}
              target={isRelative ? "_self" : "_blank"}
              rel={isRelative ? undefined : "noopener noreferrer"}
              style={styles.footerLink}
            >
              {span.label}
            </a>
          );
        }
        return <React.Fragment key={`${keyPrefix}-t${i}`}>{span.value}</React.Fragment>;
      });

    return blocks.map((block, index) => {
      const key = `blk-${index}`;

      if (block.type === "heading") {
        return (
          <div key={key} style={styles.richHeading}>
            {renderSpans(block.spans, key)}
          </div>
        );
      }

      if (block.type === "list") {
        return (
          <ul key={key} style={styles.richList}>
            {block.items.map((item, i) => (
              <li key={`${key}-i${i}`} style={styles.richListItem}>
                {renderSpans(item, `${key}-i${i}`)}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={key} style={styles.richParagraph}>
          {renderSpans(block.spans, key)}
        </p>
      );
    });
  };

  const renderMessageContent = (msg) => {
    if (msg === MenssageLogin) {
      return (
        <a href="/login" style={styles.footerLink2}>
          Puedes loguearte haciendo click aquí.
        </a>
      );
    }

    if (msg === MenssageRegister) {
      return (
        <a href="/seleccion-perfil" style={styles.footerLink2}>
          También podes crearte una cuenta haciendo click aquí.
        </a>
      );
    }

    return renderRichText(msg);
  };

  return (
    <div style={styles.global}>
      <header style={styles.header}>
        <img src={botImageURL} alt="Foody" style={styles.headerAvatar} />
        <div style={styles.headerTextWrap}>
          <h1 style={styles.headerTitle}>Foody</h1>
          <p style={styles.headerSubtitle}>
            {isGuest ? "Asistente de QuickFood" : "Asistente de QuickFood · En línea"}
          </p>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          style={styles.themeSwitch}
          aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          title={isDark ? "Modo claro" : "Modo oscuro"}
        >
          <span style={styles.themeSwitchThumb}>{isDark ? "🌙" : "☀️"}</span>
        </button>
      </header>
      <div style={styles.chatContainer}>
        <div style={styles.chatBox} ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.chatMessage,
                justifyContent:
                  msg.sender === "user" ? "flex-end" : "flex-start",
                textAlign: msg.sender === "user" ? "right" : "left",
              }}
            >
              {msg.sender === "user" ? (
                <>
                  <div
                    style={{ ...styles.messageText, ...styles.userMessageText }}
                  >
                    {msg.message}
                  </div>
                  <img src={userImageURL} alt="user" style={styles.userImage} />
                </>
              ) : (
                <>
                  <img src={botImageURL} alt="bot" style={styles.botImage} />
                  <div
                    style={{ ...styles.messageText, ...styles.botMessageText }}
                  >
                    {renderMessageContent(msg.message)}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div style={styles.chatInputContainer}>
          <input
            type="text"
            ref={chatInputRef}
            style={{
              ...styles.chatInput,
              ...(isGuest ? styles.chatInputDisabled : null),
            }}
            placeholder={
              isGuest
                ? "Iniciá sesión para consultarme..."
                : "Escribí tu consulta aquí..."
            }
            disabled={isGuest}
          />
          <button
            onClick={sendMessage}
            style={{
              ...styles.sendBtn,
              ...(isGuest ? styles.sendBtnDisabled : null),
            }}
            disabled={isGuest}
          >
            Enviar
          </button>
        </div>
      </div>
      <footer style={styles.footer}>
        <p style={styles.text}>&copy; {new Date().getFullYear()} QuickFood. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Chatbot;

