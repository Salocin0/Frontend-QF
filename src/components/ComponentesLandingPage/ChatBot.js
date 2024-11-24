import React, { useState, useRef, useEffect } from "react";
import userImageURL from "../user-img.png";
import botImageURL from "../bot-img.png";
import logoURL from "../quickfood-logo.png";
import useDynamicColors from "../../UseDinamicColors";
import "./../ComponenteRegister/placeholder.css";
import { useContext } from "react";
import { UserContext } from "../ComponentesGenerales/UserContext";

const Chatbot = () => {
  const Colors = useDynamicColors();
  const { user, updateUser } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  console.log(user);
  const styles = {
    global: {
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: Colors.GrisAzuladoOscuro,
      color: Colors.Blanco,
      borderRadius: "20px",
      margin: 0,
      padding: 0,
    },
    header: {
      backgroundColor: Colors.GrisAzulado,
      textAlign: "center",
      padding: "20px 0",
      borderBottom: `5px solid ${Colors.Rosa}`,
      borderRadius: "20px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    },
    headerTitle: {
      margin: 0,
      color: Colors.Rosa,
      fontSize: "1.5em",
    },
    chatContainer: {
      width: "100%",
      margin: "20px auto",
      padding: "10px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
      backgroundColor: Colors.GrisAzulado,
      borderRadius: "20px",
    },
    chatBox: {
      height: "250px",
      overflowY: "auto",
      border: `2px solid ${Colors.Rosa}`,
      padding: "10px",
      marginBottom: "20px",
      backgroundColor: Colors.GrisAzuladoOscuro,
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
      backgroundColor: Colors.GrisAzulado,
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
      color: Colors.BlancoEnBlanco,
      marginLeft: "15px",
    },
    botMessageText: {
      color: Colors.BlancoEnBlanco,
      marginRight: "15px",
    },
    chatInputContainer: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    chatInput: {
      flex: 1,
      padding: "10px",
      border: `2px solid ${Colors.Rosa}`,
      borderRadius: "20px",
      backgroundColor: Colors.GrisAzuladoOscuro,
      color: Colors.BlancoEnBlanco,
      transition: "border 0.3s ease, box-shadow 0.3s ease",
    },
    sendBtn: {
      padding: "10px 20px",
      backgroundColor: Colors.Rosa,
      color: "white",
      border: "none",
      borderRadius: "20px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    footer: {
      textAlign: "center",
      padding: "15px 0",
      backgroundColor: Colors.GrisAzuladoOscuro,
      fontSize: "1em",
      borderTop: `5px solid ${Colors.Rosa}`,
      borderRadius: "20px",
      boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
      colors: Colors.BlancoEnBlanco,
    },
    footerLink: {
      color: Colors.Rosa,
      textDecoration: "none",
      cursor: "pointer",
    },
    footerLink2: {
      color: Colors.Blanco,
      textDecoration: "none",
      cursor: "pointer",
    },
    text: {
      color: Colors.BlancoEnBlanco,
    },
  };
  const MenssageLogin = `Puedes loguearte haciendo click aquí.`;

  const MenssageRegister = `Tambien podes crearte una cuenta haciendo click aquí.`;

  useEffect(() => {
    const greetingMessage = user.nombre
      ? `Hola ${user.nombre} 👋 👋, \nespero que estés bien! Acá Foody 🤖.  \nDecime, ¿en qué puedo ayudarte?`
      : `Hola Usuario 👋 👋,  \nespero que estés bien! Acá Foody 🤖.  \nDecime, ¿en qué puedo ayudarte?`;

    

    if (user.nombre) {
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
  }, [user, user.nombre]); // Run when `isLoggedIn` or `user.nombre` changes
  const chatInputRef = useRef(null);
  const chatBoxRef = useRef(null);

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
  }, []);

  const sendMessage = () => {
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
  };

  const addMessageToChat = (message, sender) => {
    setMessages((prevMessages) => [...prevMessages, { message, sender }]);

    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, 100);
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

    return msg;
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
          <a href="#" style={styles.footerLink}>
            Privacy Policy
          </a>{" "}
          |{" "}
          <a href="#" style={styles.footerLink}>
            Terms of Service
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Chatbot;

