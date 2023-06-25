import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';

function App() {
  return (
    <div>
      <BrowserRouter>    
        <Header/>          
        <Main />
        <Footer/>
      </BrowserRouter>
      <ToastContainer position='bottom-right' autoClose={2000} hideProgressBar={true} 
                      closeOnClick rtl={false} draggable pauseOnHover theme='colored'/>
    </div>
  );
}

export default App;
