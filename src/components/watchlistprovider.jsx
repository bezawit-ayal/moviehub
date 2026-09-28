import { useCallback, useEffect, useMemo, useState } from 'react';
import { WatchlistContext } from '../hooks/usewatchlist';

const STORAGE_KEY = 'moviehub:watchlist';

const MAX_ITEMS = 200;

const toSavedMovie = (movie) => ({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path || null,
    release_date: movie.release_date || '',
    vote_average: movie.vote_average || 0,
});

const readStoredMovies = () => {
    try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

function WatchlistProvider({ children }) {
    const [movies, setMovies] = useState(readStoredMovies);

    useEffect(() => {
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(movies)
            );
        } catch {
            // Storage can be unavailable (private mode, quota). The app
            // still works, the list just will not survive a reload.
        }
    }, [movies]);

    const remove = useCallback((movieId) => {
        setMovies((current) =>
            current.filter((movie) => movie.id !== movieId)
        );
    }, []);

    const toggle = useCallback((movie) => {
        setMovies((current) => {
            const isSaved = current.some(
                (item) => item.id === movie.id
            );

            if (isSaved) {
                return current.filter((item) => item.id !== movie.id);
            }

            return [toSavedMovie(movie), ...current].slice(0, MAX_ITEMS);
        });
    }, []);

    const clear = useCallback(() => {
        setMovies([]);
    }, []);

    const value = useMemo(
        () => ({
            movies,
            count: movies.length,
            isSaved: (movieId) =>
                movies.some((movie) => movie.id === movieId),
            toggle,
            remove,
            clear,
        }),
        [movies, toggle, remove, clear]
    );

    return (
        <WatchlistContext.Provider value={value}>
            {children}
        </WatchlistContext.Provider>
    );
}

export default WatchlistProvider;
