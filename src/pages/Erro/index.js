import { Link } from "react-router-dom";
import "./erro.css"

function Erro() {
    return(
        <div className="not-found">
            <div>
                <h1>404</h1>
                <h2>Page not found.</h2>
            </div>
            <p>We didn't find what you were looking for.</p>
            <Link to="/">Veja todos os filmes</Link>
        </div>
    )
}

export default Erro;