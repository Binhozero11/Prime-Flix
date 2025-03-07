import { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import "./footer.css";
import imgCinematografia from './image/img-footer-cinematografia.jpg';
import gitHub from './image/icon-github.png';
import linkedIn from './image/icon-linkedin.png';
import email from './image/icon-e-mail.png';


function Footer() {
    const [filmes, setFilmes] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        async function loadFilmes() {
          const response = await api.get("movie/now_playing", {
            params: {
              api_key: "66e91e5eea3b4edf7d1682918c7cdf14",
              language: "pt-BR",
              page: 1,
            },
          });

          setFilmes(response.data.results.slice(5, 20));
        }
    
        loadFilmes();
    },[]);

    const handleLeftClick = (e) => {
        e.preventDefault();
        const divFilmes = e.target.parentNode.childNodes[0].childNodes;
        const totalDeFilmes = divFilmes.length;
        const newMovie = ( currentSlide - 1 + totalDeFilmes ) % totalDeFilmes;
        if (newMovie >= 0) {
            setCurrentSlide(newMovie);
        }
    }

    const handleRightClick = (e) => {
        e.preventDefault();
        const divMovies = e.target.parentNode.childNodes[0].childNodes;
        const totalDeFilmes = divMovies.length;
        const newMovie = ( currentSlide + 1 ) % totalDeFilmes;
        if (newMovie < totalDeFilmes) {
            setCurrentSlide(newMovie);
        }
    }


    return (
        <div className="footer-container">
            <hr />
            <div className="maisPopulares">
                <div className="maisPopulares_texto">
                <h1>Mais populares</h1>
                <div className="botoes">
                    <button onClick={handleLeftClick} id="btn-left">
                        ◀
                    </button>
                    <button onClick={handleRightClick} id="btn-right">
                        ▶
                    </button>
                </div>
                </div>
                <div className="maisPopulares_container">
                    {filmes
                        .sort((a, b) => b.popularity - a.popularity)
                        .slice(0, 8)
                        .map((filme) => (
                        <Link
                            to={`/filme/${filme.id}`}
                            className="btn-img"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            <article
                            key={filme.id}
                            >
                            <img
                                src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                                alt={`Foto do filme ${filme.title}`}
                            />
                            <strong>{filme.title}</strong>
                            </article>
                        </Link>
                    ))}      
                </div>
            </div>
            <footer>
                <div className="footer-content">
                    <section className="footer-content__home">
                        <Link to='/'>🏠 Home</Link>
                    </section>
                    <section className="footer-content__section-sobreNos">
                        <h3>Sobre nós</h3>
                        <div>
                            <p>Bem-vindo à Prime-Flix, sua fonte confiável para descobrir os mais recentes lançamentos cinematográficos. Nosso compromisso é mantê-lo atualizado com trailers e informações essenciais sobre os filmes mais quentes do momento. De clássicos reimaginados a produções inovadoras, estamos aqui para informar e inspirar seu amor pelo cinema. Explore conosco e fique por dentro do que está por vir na tela grande.</p>
                            <img src={imgCinematografia} alt="Imagem cinematográfica de uma câmera" />
                        </div>
                    </section>
                    <section className="footer-content__section-redesSociais">
                        <h3>Redes sociais</h3>
                        <ul>
                            <li>
                                <Link target="blank" to='https://br.linkedin.com/in/f%C3%A1bio-de-jesus-xavier'>
                                    <img src={linkedIn} alt="icon linkedIn"/>
                                    <span>LinkedIn</span>
                                </Link>
                            </li>
                            <li>
                                <Link target="blank" to='https://github.com/Binhozero11'>
                                    <img src={gitHub} alt="icon GitHub"/>
                                    <span>GitHub</span>
                                </Link>
                            </li>
                            <li>
                                <Link target="blank" to='mailto:fabiodejesusxavier64@gmail.com'>
                                    <img src={email} alt="icon E-mail"/>
                                    <span>E-mail</span>
                                </Link>
                            </li>
                        </ul>
                    </section>
                    <section className="footer-direitosProprios">
                        <span className="direitosAutorais"><strong>Direitos autorais:</strong> LinkedIn ícone por Icons8, GitHub ícone por Icons8, e-mail ícone por Icons8.</span>
                        <p>&copy; 2024 Prime-flix - Todos os direitos reservados</p>
                    </section>
                </div>
            </footer>
        </div>
    )
}

export default Footer;