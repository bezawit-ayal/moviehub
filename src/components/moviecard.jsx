import { Star } from 'lucide-react';
import './moviecard.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function MovieCard({ movie }) {
    const poster = movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : null;

    const releaseYear = movie.release_date
        ? movie.release_date.substring(0, 4)
        : 'N/A';

    const rating = movie.vote_average
        ? movie.vote_average.toFixed(1)
        : 'N/A';

    return (
        <article className="movie-card">
            <div className="movie-card-poster">
                {poster ? (
                    <img
                        src={poster}
                        alt={movie.title}
                        loading="lazy"
                    />
                ) : (
                    <div className="movie-card-placeholder">
                        No Image
                    </div>
                )}
            </div>

            <div className="movie-card-content">
                <h3 className="movie-card-title">
                    {movie.title}
                </h3>

                <div className="movie-card-meta">
                    <span className="movie-rating">
                        <Star size={14} fill="currentColor" />
                        {rating}
                    </span>

                    <span>{releaseYear}</span>
                </div>
            </div>
        </article>
    );
}

export default MovieCard;