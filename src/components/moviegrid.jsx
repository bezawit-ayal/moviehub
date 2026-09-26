import MovieCard from './moviecard';
import './moviegrid.css';

function MovieGrid({ movies }) {
    if (!movies || movies.length === 0) {
        return (
            <p className="movie-grid-empty">
                No movies found.
            </p>
        );
    }

    return (
        <div className="movie-grid">
            {movies.map((movie) => (
                <MovieCard
                    key={movie.id}
                    movie={movie}
                />
            ))}
        </div>
    );
}

export default MovieGrid;