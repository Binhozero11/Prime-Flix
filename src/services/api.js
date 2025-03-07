import axios from "axios";

// Base da URL: https://api.themoviedb.org/3/
// URL da API https://api.themoviedb.org/3/movie/now_playing?api_key=66e91e5eea3b4edf7d1682918c7cdf14&language=pt-BR

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/'
})

export default api;  