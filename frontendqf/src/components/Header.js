import NavBar from "./NavBarold"
import { Link } from "react-router-dom"

const Header = () => {
    const isHeader = true

    return (
        <header className="barraNav">
            <Link to="/">
                <h1 className="titulo">Tienda De Articulos</h1>
            </Link>
            <NavBar isHeader={isHeader} />
        </header>
    )
}

export default Header