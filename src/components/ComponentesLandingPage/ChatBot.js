import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import botImageURL from "../bot-img.png";
import { UserContext } from "../ComponentesGenerales/UserContext";
import "./chat.scss";
import { parseChatText } from "./chatRichText";

const suggestions = ["¿Cómo hago un pedido?", "¿Qué eventos hay?", "¿Cómo me registro?"];

// Guests never see the suggestion chips (the composer is disabled for them), so
// "¿Cómo me registro?" would only ever be shown to someone already signed in.
const suggestionsForUser = suggestions.filter((text) => !text.includes("registro"));

const Chatbot = () => {
  const { user } = useContext(UserContext);
  const isGuest = !user?.nombre;
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
    if (isGuest || !message || requestRef.current) return;
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
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data?.msg || "No pude responder en este momento. Intentá de nuevo en unos minutos.");
      if (typeof data?.data?.chat_response !== "string") throw new Error("Invalid response");
      setMessages((prev) => [...prev, { message: data.data.chat_response, sender: "bot" }]);
    } catch (error) {
      if (error.name !== "AbortError") {
        setMessages((prev) => [...prev, { message: error.message || "No pude responder en este momento. Intentá de nuevo en unos minutos.", sender: "bot", error: true }]);
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

    const blocks = parseChatText(text);
    if (!blocks.length) return text;

    const renderSpans = (spans, keyPrefix) =>
      spans.map((span, i) => {
        if (span.type === "bold") {
          return (
            <strong key={`${keyPrefix}-b${i}`} className="qf-chat__bold">
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
              className="qf-chat__footerLink"
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
          <div key={key} className="qf-chat__richHeading">
            {renderSpans(block.spans, key)}
          </div>
        );
      }

      if (block.type === "list") {
        return (
          <ul key={key} className="qf-chat__richList">
            {block.items.map((item, i) => (
              <li key={`${key}-i${i}`} className="qf-chat__richListItem">
                {renderSpans(item, `${key}-i${i}`)}
              </li>
            ))}
          </ul>
        );
      }

      return (
        <p key={key} className="qf-chat__richParagraph">
          {renderSpans(block.spans, key)}
        </p>
      );
    });
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
        {!isGuest && messages.length === 0 && (
          <div className="qf-chat__suggestions" aria-label="Consultas sugeridas">
            {suggestionsForUser.map((text) => <button key={text} type="button" onClick={() => sendMessage(text)}>{text} <span aria-hidden="true">↗</span></button>)}
          </div>
        )}
        {isGuest && <div className="qf-chat__message qf-chat__message--bot"><p>No detecto que estés logueado o registrado. Para consultarme, ingresá con tu cuenta o creá una gratis.</p></div>}
        {messages.map((msg, index) => (
          <div key={index} className={`qf-chat__message qf-chat__message--${msg.sender}${msg.error ? " qf-chat__message--error" : ""}`}>
            <span className="qf-chat__sender">{msg.sender === "user" ? "Vos" : "Foody"}</span>
            <div className="qf-chat__body">{msg.sender === "bot" ? renderRichText(msg.message) : <p>{msg.message}</p>}</div>
          </div>
        ))}
        {isSending && <div className="qf-chat__typing" role="status"><span /><span /><span /><small>Foody está escribiendo…</small></div>}
      </div>
      {!user?.nombre && <div className="qf-chat__account"><Link to="/login">Podés loguearte</Link><span>o</span><Link to="/seleccion-perfil">crearte una cuenta</Link></div>}
      <form className="qf-chat__composer" onSubmit={(event) => { event.preventDefault(); sendMessage(); }}>
        <label className="qf-chat__sr-only" htmlFor="foody-message">Tu consulta para Foody</label>
        <input id="foody-message" ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={isGuest ? "Iniciá sesión para consultarme…" : "Escribí tu consulta…"} disabled={isGuest} autoComplete="off" />
        <button type="submit" disabled={isGuest || !draft.trim() || isSending} aria-label="Enviar mensaje"><FaPaperPlane aria-hidden="true" /></button>
      </form>
      <div className="qf-chat__signature">QUICKFOOD · PEDÍ Y DISFRUTÁ</div>
    </div>
  );
};

export default Chatbot;
