import React, { useState } from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { UserProvider } from './UserContext';
import Main from "./Main";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Main />
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
        theme="colored"
      />
    </UserProvider>
  );
};

export default App;
