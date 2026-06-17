import React, { useState, useRef, useEffect, useCallback } from "react";
import userImageURL from "../user-img.png";
import botImageURL from "../bot-img.png";
import "./../ComponenteRegister/placeholder.css";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";
import useBreakpoint from "../../useBreakpoint";
import useTheme from "../../useTheme";

const Chatbot = () => {
  const { user } = useContext(UserContext);
  const { isMobile } = useBreakpoint();
  const { isDark, toggleTheme } = useTheme();
  const [messages, setMessages] = useState([]);
  console.log(user);
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
      justifyContent: "center",
      padding: "16px 50px",
      borderBottom: `5px solid var(--qf-naranja)`,
      borderRadius: "20px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    },
    headerTitle: {
      margin: 0,
      color: "var(--qf-naranja)",
      fontSize: isMobile ? "1em" : "1.5em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    themeSwitch: {
      position: "absolute",
      left: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      width: "52px",
      height: "28px",
      padding: 0,
      borderRadius: "20px",
      border: `2px solid var(--qf-naranja)`,
      backgroundColor: "var(--qf-bg-main)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      transition: "background-color 0.3s ease",
    },
    themeSwitchThumb: {
      position: "absolute",
      top: "50%",
      left: isDark ? "26px" : "2px",
      transform: "translateY(-50%)",
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      backgroundColor: "var(--qf-naranja)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "11px",
      lineHeight: 1,
      transition: "left 0.3s ease",
    },
    chatContainer: {
      width: "100%",
      margin: "20px auto",
      padding: "10px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
      backgroundColor: "var(--qf-bg-dark)",
      borderRadius: "20px",
    },
    chatBox: {
      height: "250px",
      overflowY: "auto",
      border: `2px solid var(--qf-naranja)`,
      padding: "10px",
      marginBottom: "20px",
      backgroundColor: "var(--qf-bg-main)",
      borderRadius: "15px",
    },
    chatMessage: {
      display: "flex",
      alignItems: "flex-start",
      marginBottom: "15px",
      flexDirection: "row",
    },
    messageText: {
      borderRadius: "20px",
      padding: "15px",
      maxWidth: "70%",
      fontSize: "1em",
      backgroundColor: "var(--qf-bg-dark)",
    },
    userImage: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      objectFit: "cover",
      marginLeft: "10px",
    },
    botImage: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      objectFit: "cover",
      marginRight: "10px",
    },
    userMessageText: {
      color: "var(--qf-blanco-puro)",
      marginLeft: "15px",
    },
    botMessageText: {
      color: "var(--qf-blanco-puro)",
      marginRight: "15px",
    },
    chatInputContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    chatInput: {
      flex: 1,
      minWidth: 0,
      padding: "10px",
      border: `2px solid var(--qf-naranja)`,
      borderRadius: "20px",
      backgroundColor: "var(--qf-bg-main)",
      color: "var(--qf-text-primary)",
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
    footer: {
      textAlign: "center",
      padding: "15px 0",
      backgroundColor: "var(--qf-bg-main)",
      fontSize: "1em",
      borderTop: `5px solid var(--qf-naranja)`,
      borderRadius: "20px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
      colors: "var(--qf-blanco-puro)",
    },
    footerLink: {
      color: "var(--qf-naranja)",
      textDecoration: "none",
      cursor: "pointer",
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
    if (message) {
      addMessageToChat(message, "user");
      chatInput.value = "";

      fetch(`${process.env?.REACT_APP_BACK_URL}chatbot`, {
        method: "POST",
        body: new URLSearchParams("userMessage=" + message),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          addMessageToChat(data.data.chat_response, "bot");
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [addMessageToChat]);

  useEffect(() => {
    const nombre = user?.nombre;
    const greetingMessage = nombre
      ? `Hola ${nombre} 👋 👋, \nespero que estés bien! Acá Foody 🤖.  \nDecime, ¿en qué puedo ayudarte?`
      : `Hola Usuario 👋 👋,  \nespero que estés bien! Acá Foody 🤖.  \nDecime, ¿en qué puedo ayudarte?`;

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
  }, [user, MenssageLogin, MenssageRegister]);

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



  // Convierte un texto plano que puede contener links Markdown [texto](url) o URLs
  // sueltas (http/https) en nodos de React, renderizando los links como <a> clickeables.
  const renderRichText = (text) => {
    if (typeof text !== "string") return text;

    const pattern =
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s)]+)/g;
    const nodes = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        nodes.push(text.slice(lastIndex, match.index));
      }
      const href = match[2] || match[3];
      const label = match[1] || match[3];
      nodes.push(
        <a
          key={`chat-link-${key++}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.footerLink}
        >
          {label}
        </a>
      );
      lastIndex = pattern.lastIndex;
    }

    if (lastIndex < text.length) {
      nodes.push(text.slice(lastIndex));
    }

    return nodes.length ? nodes : text;
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
        <h1 style={styles.headerTitle}>Bienvenido al ChatFood!</h1>
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
            style={styles.chatInput}
            placeholder="Escribí tu consulta aquí..."
          />
          <button onClick={sendMessage} style={styles.sendBtn}>
            Enviar
          </button>
        </div>
      </div>
      <footer style={styles.footer}>
        <p style={styles.text}>&copy; 2024 QuickFood. All rights reserved.</p>
        <p>
          <a href="www.google.com" target="_blank" style={styles.footerLink}>
            Privacy Policy
          </a>{" "}
          |{" "}
          <a href="www.google.com" target="_blank" style={styles.footerLink}>
            Terms of Service
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Chatbot;

