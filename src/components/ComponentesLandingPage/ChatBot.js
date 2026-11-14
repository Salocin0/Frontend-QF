import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import botImageURL from "../bot-img.png";
import { UserContext } from "../ComponentesGenerales/UserContext";
import "./chat.scss";
import { parseChatText } from "./chatRichText";
import useTextoSuave from "./useTextoSuave";

// Bot text revealed smoothly while it streams (render prop keeps the hook per message).
// While Foody is still writing (or part of the text is not shown yet) the bubble ends
// with the typing dots, so pauses between chunks never look frozen.
const TextoBot = ({ texto, animar, escribiendo, render }) => {
  const visible = useTextoSuave(texto, animar);
  const pendiente = Boolean(escribiendo) || visible.length < (texto || "").length;
  return (
    <>
      {render(visible)}
      {pendiente && (
        <span className="qf-chat__typing qf-chat__typing--inline" aria-hidden="true">
          <span /><span /><span />
        </span>
      )}
    </>
  );
};

const suggestions = ["¿Cómo hago un pedido?", "¿Qué eventos hay?", "¿Cómo me registro?"];

// Guests never see the suggestion chips (the composer is disabled for them), so
// "¿Cómo me registro?" would only ever be shown to someone already signed in.
const suggestionsForUser = suggestions.filter((text) => !text.includes("registro"));

const Chatbot = () => {
  const { user } = useContext(UserContext);
  const isGuest = !user?.id;
  const displayName = [user?.nombre, user?.apellido].filter(Boolean).join(" ") || user?.usuario;
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatBoxRef = useRef(null);
  const inputRef = useRef(null);
  const requestRef = useRef(null);

  useEffect(() => () => requestRef.current?.abort(), []);
  // Scroll only when a new message (or the typing indicator) appears, never while an
  // answer is being written, so the user can read at their own pace and scroll down.
  const visibleCount = messages.filter((msg) => msg.sender !== "bot" || msg.message !== "").length;
  useEffect(() => {
    const box = chatBoxRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [visibleCount]);

  const sendMessage = async (text = draft) => {
    const message = text.trim();
    // Short memory: the last 3 exchanges travel with the question (the server re-validates them).
    const historial = messages
      .filter((m) => !m.error && typeof m.message === "string" && m.message.trim())
      .map((m) => ({ rol: m.sender === "user" ? "usuario" : "foody", texto: m.message }))
      .slice(-6);
    if (isGuest || !message || requestRef.current) return;
    setMessages((prev) => [...prev, { message, sender: "user" }]);
    setDraft("");
    setIsSending(true);
    const controller = new AbortController();
    requestRef.current = controller;
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 45000);
    try {
      const options = {
        method: "POST",
        body: new URLSearchParams(historial.length ? { userMessage: message, historial: JSON.stringify(historial) } : { userMessage: message }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal: controller.signal,
      };
      let response = await fetch(`${process.env.REACT_APP_BACK_URL}chatbot/stream`, options);
      // Backends without the streaming route answer 404: use the classic endpoint.
      if (response.status === 404) response = await fetch(`${process.env.REACT_APP_BACK_URL}chatbot`, options);
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        // Server texts only for 4xx (e.g. rate limit); 5xx always get our own Spanish message.
        throw new Error(response.status < 500 && data?.msg ? data.msg : "No pude responder en este momento. Intentá de nuevo en unos minutos.");
      }

      const reader = response.body?.getReader?.();
      if (!reader) {
        const data = await response.json().catch(() => ({}));
        if (typeof data?.data?.chat_response !== "string") throw new Error("No pude responder en este momento. Intentá de nuevo en unos minutos.");
        setMessages((prev) => [...prev, { message: data.data.chat_response, sender: "bot", animar: true }]);
      } else {
        // Show the answer while Foody writes it instead of all at once at the end.
        const id = `bot-${Date.now()}`;
        const decoder = new TextDecoder();
        let text = "";
        setMessages((prev) => [...prev, { id, message: "", sender: "bot", animar: true, streaming: true }]);
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          clearTimeout(timeoutId);
          text += decoder.decode(value, { stream: true });
          const snapshot = text;
          setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, message: snapshot } : m)));
        }
        text += decoder.decode();
        if (!text.trim()) throw new Error("No pude responder en este momento. Intentá de nuevo en unos minutos.");
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, message: text } : m)));
      }
    } catch (error) {
      if (timedOut) {
        setMessages((prev) => [...prev, { message: "Foody tardó demasiado en responder. Revisá tu conexión e intentá de nuevo.", sender: "bot", error: true }]);
      } else if (error.name !== "AbortError") {
        setMessages((prev) => [...prev, { message: error.message || "No pude responder en este momento. Intentá de nuevo en unos minutos.", sender: "bot", error: true }]);
      }
    } finally {
      clearTimeout(timeoutId);
      requestRef.current = null;
      setMessages((prev) => (prev.some((m) => m.streaming) ? prev.map((m) => (m.streaming ? { ...m, streaming: false } : m)) : prev));
      if (!controller.signal.aborted || timedOut) {
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
            {block.items.map((item, i) => {
              const level = block.levels?.[i] || 0;
              return (
                <li key={`${key}-i${i}`} className={`qf-chat__richListItem${level ? ` qf-chat__richListItem--l${level}` : ""}`}>
                  {renderSpans(item, `${key}-i${i}`)}
                </li>
              );
            })}
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
          <p>¡Hola{displayName ? `, ${displayName}` : ""}! 👋 Soy Foody. Te ayudo con eventos, pedidos y tus primeros pasos en QuickFood. ¿Qué necesitás?</p>
        </div>
        {!isGuest && messages.length === 0 && (
          <div className="qf-chat__suggestions" aria-label="Consultas sugeridas">
            {suggestionsForUser.map((text) => <button key={text} type="button" onClick={() => sendMessage(text)}>{text} <span aria-hidden="true">↗</span></button>)}
          </div>
        )}
        {isGuest && <div className="qf-chat__message qf-chat__message--bot"><p>No detecto que estés logueado o registrado. Para consultarme, ingresá con tu cuenta o creá una gratis.</p></div>}
        {messages.filter((msg) => msg.sender !== "bot" || msg.message !== "").map((msg, index) => (
          <div key={msg.id || index} className={`qf-chat__message qf-chat__message--${msg.sender}${msg.error ? " qf-chat__message--error" : ""}`}>
            <span className="qf-chat__sender">{msg.sender === "user" ? "Vos" : "Foody"}</span>
            <div className="qf-chat__body">{msg.sender === "bot" ? <TextoBot texto={msg.message} animar={Boolean(msg.animar)} escribiendo={msg.streaming} render={renderRichText} /> : <p>{msg.message}</p>}</div>
          </div>
        ))}
        {isSending && !messages.some((m) => m.streaming && m.message) && <div className="qf-chat__typing" role="status"><span /><span /><span /><small>Foody está escribiendo…</small></div>}
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
