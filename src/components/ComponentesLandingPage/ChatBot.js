import React, { useState, useRef, useEffect } from 'react';
import styles from './style.module.css';
import userImageURL from '../user-img.png'; // Actualiza esta ruta
import botImageURL from '../bot-img.png'; // Actualiza esta ruta
import logoURL from '../quickfood-logo.png'; // Actualiza esta ruta

const Chatbot = () => {
    const [messages, setMessages] = useState([
        {
          message: 'Hola Agostina! 👋 👋 \nEspero estés bien!\nAcá Foody 🤖  !\n\nDecime, en que puedo ayudarte?',
          sender: 'bot'
        }
      ]);
      const chatInputRef = useRef(null);
      const chatBoxRef = useRef(null);
    
  
    useEffect(() => {
      const chatInput = chatInputRef.current;
      const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          sendMessage();
        }
      };
  
      chatInput.addEventListener('keypress', handleKeyPress);
      return () => {
        chatInput.removeEventListener('keypress', handleKeyPress);
      };
    }, []);
  
    const sendMessage = () => {
      const chatInput = chatInputRef.current;
      const message = chatInput.value.trim();
      if (message) {
        addMessageToChat(message, 'user');
        chatInput.value = '';
  
        fetch('/chat', {
          method: 'POST',
          body: new URLSearchParams('message=' + message),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(response => response.json())
        .then(data => {
          addMessageToChat(data.response, 'bot');
        })
        .catch(error => console.error('Error:', error));
      }
    };
  
    const addMessageToChat = (message, sender) => {
      setMessages(prevMessages => [
        ...prevMessages,
        { message, sender }
      ]);
  
      setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }, 100);
    };
  
    return (
      <div>
        <header className={styles.header}>
          <img src={logoURL} alt="QuickFood Logo" className={styles.logo} />
          <h1>Bienvenido al ChatFood!</h1>
        </header>
        <div className={styles.chatContainer}>
          <div className={styles.chatBox} ref={chatBoxRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`${styles.chatMessage} ${msg.sender === 'user' ? styles.userMessage : styles.botMessage}`}>
                <img src={msg.sender === 'user' ? userImageURL : botImageURL} alt={msg.sender} className={msg.sender === 'user' ? styles.userImage : styles.botImage} />
                <div className={styles.messageText}>{msg.message}</div>
              </div>
            ))}
          </div>
          <input type="text" ref={chatInputRef} className={styles.chatInput} placeholder="Escribí tu consulta aquí..." />
          <button onClick={sendMessage} className={styles.sendBtn}>Enviar</button>
        </div>
        <footer className={styles.footer}>
          <p>&copy; 2024 QuickFood. All rights reserved.</p>
          <p><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a></p>
        </footer>
      </div>
    );
  };
  
  export default Chatbot;