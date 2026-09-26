const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE_URL = 'https://api.themoviedb.org/3';

const fetchFromTMDB = async (endpoint) => {
    const separator = endpoint.includes('?') ? '&' : '?';

    const response = await fetch(
        `${BASE_URL}${endpoint}${separator}api_key=${API_KEY}`
    );

    if (!response.ok) {
        throw new Error(`TMDB request failed: ${response.status}`);
    }

    return response.json();
};

export const getTrendingMovies = () =>
    fetchFromTMDB('/trending/movie/week');

export const getPopularMovies = () =>
    fetchFromTMDB('/movie/popular');

export const getTopRatedMovies = () =>
    fetchFromTMDB('/movie/top_rated');

export const getUpcomingMovies = () =>
    fetchFromTMDB('/movie/upcoming');

export const searchMovies = (query, page = 1) =>
    fetchFromTMDB(
        `/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
    );

export const getMovieGenres = () =>
    fetchFromTMDB('/genre/movie/list');

export const getMoviesByGenre = (
    genreId,
    page = 1,
    year = '',
    rating = ''
) => {
    let endpoint =
        `/discover/movie?page=${page}` +
        `&sort_by=popularity.desc`;

    if (genreId) {
        endpoint += `&with_genres=${genreId}`;
    }

    if (year) {
        endpoint += `&primary_release_year=${year}`;
    }

    if (rating) {
        endpoint += `&vote_average.gte=${rating}`;
    }

    return fetchFromTMDB(endpoint);
};