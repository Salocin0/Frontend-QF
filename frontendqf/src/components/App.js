import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Main from "./Main"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div>
      <Router>
        <Main/>
      </Router>
      <ToastContainer position='bottom-right' autoClose={2000} hideProgressBar={true} 
      closeOnClick rtl={false} draggable pauseOnHover theme='colored'/>
    </div>
  );
};

export default App;