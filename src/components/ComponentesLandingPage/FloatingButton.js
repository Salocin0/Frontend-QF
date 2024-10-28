import React, { useState } from 'react';
import Panel from './ChatPanel';
import logoBot from '../bot-img.png';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa Bootstrap CSS


const FloatingButton = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const togglePanel = () => {
    setIsPanelOpen(prevState => !prevState);
  };

  return (
    <div>
      <button
        className="btn btn-primary position-fixed d-flex align-items-center justify-content-between"
        style={{ width: '300px', height: '80px', fontSize: '24px', padding: '0 20px', overflow: 'hidden', bottom: '70px', right: '20px', borderRadius: '50px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', backgroundColor: '#D204D6', borderColor: '#D204D9'}}
        onClick={togglePanel}
      > 
        <span style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>Consultas Foody</span>
        <img src={logoBot} alt="Bot" className="bot-image" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
      </button>

      {isPanelOpen && <Panel onClose={togglePanel} />}
    
    </div>
  );
  
};

export default FloatingButton;
