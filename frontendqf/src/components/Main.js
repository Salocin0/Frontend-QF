import { Route, Routes } from 'react-router-dom';
import Footer from './Footer';

const Main = () => {
    return (
        <main className='main'>
            <p>main</p>
            <Routes>
                <Route path='/' element={<Footer/>}/>
            </Routes>
        </main>
    )
}

export default Main