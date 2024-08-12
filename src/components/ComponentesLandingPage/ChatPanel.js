import React from 'react';
//import ChildComponent from './ChildComponent';
import styles from './styles.module.css'; 
import Chatbot from './ChatBot';

const Panel = ({ onClose }) => {
  return (
    <div className={styles.panel}>
      <button
        className={styles.closeButton}
        onClick={onClose}
      >
        &times;
      </button>
        <Chatbot/>
    </div>
  );
};

export default Panel;