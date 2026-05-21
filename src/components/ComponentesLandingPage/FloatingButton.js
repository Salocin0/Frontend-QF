import React, { useState } from 'react';
import Panel from './ChatPanel';
import logoBot from '../bot-img.png';

const FloatingButton = () => {
  const styles = {
    button: {
      width: '200px',
      height: '50px',
      fontSize: '16px',
      overflow: 'hidden',
      position: 'fixed',
      bottom: '70px',
      right: '20px',
      borderRadius: '50px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      backgroundColor: "var(--qf-naranja)",
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      color: "var(--qf-blanco-puro)",
    },
    buttonText: {
      flex: 1,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    botImage: {
      height: '100%',
      borderRadius: '50%',
      border: `2px solid var(--qf-text-white)`,
    },
  };
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen(prevState => !prevState);
  };

  return (
    <div>
      <button
        style={styles.button}
        onClick={togglePanel}
      >
        <span style={styles.buttonText}>Consultas Foody</span>
        <img src={logoBot} alt="Bot" style={styles.botImage} />
      </button>

      {isPanelOpen && <Panel onClose={togglePanel} />}
    </div>
  );
};

export default FloatingButton;
