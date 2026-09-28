import { useEffect, useState } from 'react';
import MovieGrid from '../components/moviegrid';
import './watchlist.css';

function Watchlist() {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const savedMovies =
            JSON.parse(
                localStorage.getItem('moviehub-watchlist')
            ) || [];

        setMovies(savedMovies);
    }, []);

    return (
        <main className="watchlist-page">
            <div className="container">
                <h1>My Watchlist</h1>

                {movies.length === 0 ? (
                    <div className="watchlist-empty">
                        <h2>Your watchlist is empty</h2>
                        <p>
                            Add movies from the movie details page.
                        </p>
                    </div>
                ) : (
                    <MovieGrid movies={movies} />
                )}
            </div>
        </main>
    );
}

export default Watchlist;