import { useEffect, useState, useRef } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  const [filmes, setFilmes] = useState([]);
  const [filmeCarrossel, setFilmeCarrossel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dotsCount, setDotsCount] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [intervalActive, setIntervalActive] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [mostrarMaisFilmes, setMostrarMaisFlimes] = useState(false);
  const carrosselRef = useRef(null);
  const dots = useRef(null);
  const intervalRef = useRef(null);
  let quantidadeDeFilmesCarrossel = 5;

  useEffect(() => {
    async function loadFilmes() {
      try {
        const response = await api.get("movie/now_playing?append_to_response=videos", {
          params: {
            api_key: "66e91e5eea3b4edf7d1682918c7cdf14",
            language: "pt-BR",
            page: 1,
          },
        });
  
        const results = response.data.results;
        setFilmeCarrossel(
          results.slice(0, quantidadeDeFilmesCarrossel)
        );
        setFilmes(results.slice(5, 20));
        setDotsCount(
          results.slice(0, quantidadeDeFilmesCarrossel).length
        );
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar os filmes:", error);
      } 
      }

    loadFilmes();

    intervalRef.current = setInterval(() => {
      if (intervalActive) {
        const totalSlides = filmeCarrossel.length;
        setCurrentSlide((prevSlide) => (prevSlide + 1) % totalSlides);
      }
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [filmeCarrossel.length, intervalActive, quantidadeDeFilmesCarrossel]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLeftClick = (e) => {
    e.preventDefault();
    const totalSlides = filmeCarrossel.length;
    const newSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    if (newSlide >= 0) {
      setCurrentSlide(newSlide);
    }
    setIntervalActive(false);
    setTimeout(() => setIntervalActive(true), 2000);
  };

  const handleRightClick = (e) => {
    e.preventDefault();
    const totalSlides = filmeCarrossel.length;
    const newSlide = (currentSlide + 1) % totalSlides;
    if (newSlide < totalSlides) {
      setCurrentSlide(newSlide);
    }
    setIntervalActive(false);
    setTimeout(() => setIntervalActive(true), 2000);
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
    setIntervalActive(false);
    setTimeout(() => setIntervalActive(true), 2000);
  };

  const isFilmeOculto = (index) => {
    return windowWidth < 768 && index >= 9;
  };

  const mostrarMais = () => {
    setMostrarMaisFlimes(!mostrarMaisFilmes);
  };

  const carrossel = filmeCarrossel.slice(0, quantidadeDeFilmesCarrossel);

  if (loading) {
    return (
      <div className="loading">
        <h2>Carregando os filmes...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="carrossel">
        <div className="carrossel-container">
          <div ref={carrosselRef} className="carrossel-imagens">
            {carrossel.map((filme, index) => {
              return (
                <article
                  key={filme.id}
                  className={index === currentSlide ? "active" : ""}
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  <div
                    style={{
                      backgroundImage: `url("https://image.tmdb.org/t/p/original/${filme.poster_path}")`,
                    }}
                    className="imagemFundoCarrossel"
                    loading="lazy"
                  ></div>
                  <Link to={`/filme/${filme.id}`} className="btn-img">
                    <img
                      src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`}
                      alt={filme.title}
                      className="imagemFrenteCarrossel"
                      loading="lazy"
                    />
                  </Link>
                  <div className="filme-details">
                    <h3>{filme.title}</h3>
                    <span>
                      {filme.overview.length > 100
                        ? `${filme.overview.substring(0, 100)}...`
                        : filme.overview}
                    </span>
                    <strong>
                      Avaliação: {filme.vote_average.toFixed(1)} / 10
                    </strong>
                    <Link to={`/filme/${filme.id}`} className="btn-access">
                      Acessar
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          <button onClick={handleLeftClick} id="previousSlide">
            ◀
          </button>
          <button onClick={handleRightClick} id="nextSlide">
            ▶
          </button>
          <div className="length-dots" ref={dots}>
            {Array.from({ length: dotsCount }).map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? "current" : ""}`}
                onClick={() => handleDotClick(index)}
              ></span>
            ))}
          </div>
        </div>
      </div>
      <div className="lista-filmes">
        {filmes.map((filme, index) => {
          return (
            <article
              key={filme.id}
              className={
                isFilmeOculto(index) && !mostrarMaisFilmes ? "filmeOculto" : ""
              }
            >
              <strong>{filme.title}</strong>
              <img
                src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`}
                alt={filme.title}
                loading="lazy"
              />
              <Link to={`/filme/${filme.id}`}>Acessar</Link>
            </article>
          );
        })}
        <button onClick={mostrarMais} className="mostrarMais">
          {mostrarMaisFilmes ? "Mostrar Menos" : "Mostrar Mais"}
        </button>
      </div>
    </div>

  );
}

export default Home;
