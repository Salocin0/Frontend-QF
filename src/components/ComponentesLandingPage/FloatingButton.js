import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Panel from "./ChatPanel";
import logoBot from "../bot-img.png";
import "./foody.scss";

const FloatingButton = ({ showWelcome = true }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [showGreeting, setShowGreeting] = useState(true);
  const launcherRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (isPanelOpen) popupRef.current?.querySelector("button")?.focus();
  }, [isPanelOpen]);

  const openChat = () => {
    setHasOpened(true);
    setShowGreeting(false);
    setIsPanelOpen(true);
  };

  const minimizeChat = () => {
    setIsPanelOpen(false);
    launcherRef.current?.focus();
  };

  const closeChat = () => {
    setHasOpened(false);
    setIsPanelOpen(false);
    launcherRef.current?.focus();
  };

  return (
    <div className="qf-foody">
      {showWelcome && !isPanelOpen && showGreeting && (
        <div className="qf-foody__greeting">
          <button className="qf-foody__dismiss" aria-label="Ocultar saludo de Foody" onClick={() => setShowGreeting(false)}><FaTimes aria-hidden="true" /></button>
          <strong>¡Hola! Soy Foody 👋</strong>
          <p>¿Tenés hambre de respuestas?</p>
          <button className="qf-foody__start" onClick={openChat}>Charlemos <span aria-hidden="true">↗</span></button>
        </div>
      )}
      {hasOpened && (
        <div ref={popupRef} id="foody-chat" hidden={!isPanelOpen} className="qf-foody__popup" role="dialog" aria-label="Chat con Foody" onKeyDown={(event) => {
          if (event.key === "Escape") { event.stopPropagation(); minimizeChat(); }
        }}>
          <Panel onClose={closeChat} onMinimize={minimizeChat} position="relative" bottom="0px" right="0px" />
        </div>
      )}
      <button ref={launcherRef} type="button" className="qf-foody__launcher" aria-label={isPanelOpen ? "Minimizar chat con Foody" : "Abrir chat con Foody"} aria-expanded={isPanelOpen} aria-controls={isPanelOpen ? "foody-chat" : undefined} onClick={() => isPanelOpen ? minimizeChat() : openChat()}>
        <span className="qf-foody__avatar"><img src={logoBot} alt="" /></span>
      </button>
    </div>
  );
};

export default FloatingButton;
