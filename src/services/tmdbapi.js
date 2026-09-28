const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE_URL = 'https://api.themoviedb.org/3';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const hasApiKey = () => Boolean(API_KEY);

/**
 * Builds an absolute TMDB image URL.
 * Returns null when the movie has no image for that path, so callers can
 * render a placeholder instead of a broken <img>.
 */
const imageUrl = (path, size) =>
    path ? `${IMAGE_BASE_URL}/${size}${path}` : null;

export const posterUrl = (path, size = 'w342') => imageUrl(path, size);

export const backdropUrl = (path, size = 'w1280') => imageUrl(path, size);

export const profileUrl = (path, size = 'w185') => imageUrl(path, size);

/**
 * Gate for third-party URLs we render as links. `homepage` comes from
 * TMDB user submissions, so it is attacker-influenceable. React already
 * blocks `javascript:` hrefs; this also rejects `data:`, `blob:` and any
 * other scheme, so only real web links survive.
 */
export const safeExternalUrl = (url) => {
    if (typeof url !== 'string' || url === '') {
        return null;
    }

    try {
        const parsed = new URL(url);

        return parsed.protocol === 'http:' || parsed.protocol === 'https:'
            ? parsed.href
            : null;
    } catch {
        return null;
    }
};

const fetchFromTMDB = async (endpoint, { signal } = {}) => {
    if (!API_KEY) {
        throw new Error(
            'Missing VITE_TMDB_API_KEY. Copy .env.example to .env ' +
            'and add your TMDB API key.'
        );
    }

    const separator = endpoint.includes('?') ? '&' : '?';

    const response = await fetch(
        `${BASE_URL}${endpoint}${separator}api_key=${encodeURIComponent(API_KEY)}`,
        { signal }
    );

    if (response.status === 404) {
        throw new Error('Not found');
    }

    if (!response.ok) {
        throw new Error(`TMDB request failed: ${response.status}`);
    }

    return response.json();
};

export const getTrendingMovies = ({ signal } = {}) =>
    fetchFromTMDB('/trending/movie/week', { signal });

export const getPopularMovies = ({ signal } = {}) =>
    fetchFromTMDB('/movie/popular', { signal });

export const getTopRatedMovies = ({ signal } = {}) =>
    fetchFromTMDB('/movie/top_rated', { signal });

export const getUpcomingMovies = ({ signal } = {}) =>
    fetchFromTMDB('/movie/upcoming', { signal });

export const searchMovies = (query, page = 1, { signal } = {}) =>
    fetchFromTMDB(
        `/search/movie?query=${encodeURIComponent(query)}` +
        `&page=${encodeURIComponent(page)}&include_adult=false`,
        { signal }
    );

/**
 * One request for the detail page: metadata, credits, videos and similar
 * movies all come back on the same payload via append_to_response.
 */
export const getMovieDetails = (movieId, { signal } = {}) =>
    fetchFromTMDB(
        `/movie/${encodeURIComponent(movieId)}` +
        '?append_to_response=credits,videos,images,similar',
        { signal }
    );
