import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import botImageURL from "../bot-img.png";
import { UserContext } from "../ComponentesGenerales/UserContext";
import "./chat.scss";

const suggestions = ["¿Cómo hago un pedido?", "¿Qué eventos hay?", "¿Cómo me registro?"];

const Chatbot = () => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => () => requestRef.current?.abort(), []);
  useEffect(() => {
    const box = chatBoxRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [messages, isSending]);

  const sendMessage = async (text = draft) => {
    const message = text.trim();
    if (!message || requestRef.current) return;
    setMessages((prev) => [...prev, { message, sender: "user" }]);
    setDraft("");
    setIsSending(true);
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_URL}chatbot`, {
        method: "POST",
        body: new URLSearchParams({ userMessage: message }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal: controller.signal,
      });
      if (!response.ok) throw new Error("Chat unavailable");
      const data = await response.json();
      if (typeof data?.data?.chat_response !== "string") throw new Error("Invalid response");
      setMessages((prev) => [...prev, { message: data.data.chat_response, sender: "bot" }]);
    } catch (error) {
      if (error.name !== "AbortError") {
        setMessages((prev) => [...prev, { message: "No pude responder en este momento. Intentá de nuevo en unos minutos.", sender: "bot", error: true }]);
      }
    } finally {
      requestRef.current = null;
      if (!controller.signal.aborted) {
        setIsSending(false);
        inputRef.current?.focus();
      }
    }
  };

  const renderRichText = (text) => {
    if (typeof text !== "string") return text;

    // Captura: [label](url-absoluta-o-relativa)  |  url absoluta suelta
    const pattern =
      /\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)|(https?:\/\/[^\s)]+)/g;
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
      // Las rutas relativas abren en la misma pestaña; las absolutas en una nueva
      const isRelative = href.startsWith("/");
      nodes.push(
        <a
          key={`chat-link-${key++}`}
          href={href}
          target={isRelative ? "_self" : "_blank"}
          rel={isRelative ? undefined : "noopener noreferrer"}
          className="qf-chat__link"
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

  return (
    <div className="qf-chat">
      <header className="qf-chat__header">
        <img src={botImageURL} alt="" />
        <div><h2>Foody</h2><p>Tu ayuda para disfrutar sin filas</p></div>
      </header>
      <div className="qf-chat__messages" ref={chatBoxRef} role="log" aria-label="Conversación con Foody" aria-live="polite" aria-relevant="additions">
        <div className="qf-chat__message qf-chat__message--bot">
          <span className="qf-chat__sender">Foody</span>
          <p>¡Hola{user?.nombre ? `, ${user.nombre}` : ""}! 👋 Soy Foody. Te ayudo con eventos, pedidos y tus primeros pasos en QuickFood. ¿Qué necesitás?</p>
        </div>
        {messages.length === 0 && (
          <div className="qf-chat__suggestions" aria-label="Consultas sugeridas">
            {suggestions.map((text) => <button key={text} type="button" onClick={() => sendMessage(text)}>{text} <span aria-hidden="true">↗</span></button>)}
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className={`qf-chat__message qf-chat__message--${msg.sender}${msg.error ? " qf-chat__message--error" : ""}`}>
            <span className="qf-chat__sender">{msg.sender === "user" ? "Vos" : "Foody"}</span>
            <p>{msg.sender === "bot" ? renderRichText(msg.message) : msg.message}</p>
          </div>
        ))}
        {isSending && <div className="qf-chat__typing" role="status"><span /><span /><span /><small>Foody está escribiendo…</small></div>}
      </div>
      {!user?.nombre && <div className="qf-chat__account"><Link to="/login">Iniciá sesión</Link><span>o</span><Link to="/seleccion-perfil">creá tu cuenta</Link></div>}
      <form className="qf-chat__composer" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
        <label className="qf-chat__sr-only" htmlFor="foody-message">Tu consulta para Foody</label>
        <input id="foody-message" ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Escribí tu consulta…" autoComplete="off" />
        <button type="submit" disabled={!draft.trim() || isSending} aria-label="Enviar mensaje"><FaPaperPlane aria-hidden="true" /></button>
      </form>
      <div className="qf-chat__signature">QUICKFOOD · PEDÍ Y DISFRUTÁ</div>
    </div>
  );
};

export default Chatbot;
