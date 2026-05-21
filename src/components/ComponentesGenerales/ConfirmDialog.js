import React from 'react';

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {

  if (!open) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1099,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          background: "var(--qf-bg-main)",
          color: '#FFFFFF',
          padding: '20px',
          zIndex: 1100,
          borderRadius: '8px',
          width: '90%',
          maxWidth: '400px',
          textAlign: 'center',
        }}
      >
        <h3 style={{ marginTop: 0, color: '#FFFFFF' }}>{title}</h3>
        <p style={{ color: '#FFFFFF' }}>{message}</p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-around' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: "var(--qf-bg-secondary)",
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '10px',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              backgroundColor: "var(--qf-naranja)",
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '10px',
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;