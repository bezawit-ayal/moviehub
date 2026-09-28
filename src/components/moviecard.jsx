import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ImageOff } from 'lucide-react';
import { posterUrl } from '../services/tmdbapi';
import WatchlistButton from './watchlistbutton';
import './moviecard.css';

const getYear = (releaseDate) =>
    releaseDate ? releaseDate.substring(0, 4) : 'N/A';

const getRating = (voteAverage) =>
    voteAverage ? voteAverage.toFixed(1) : 'N/A';

function MovieCard({ movie }) {
    const [imageFailed, setImageFailed] = useState(false);

    const poster = posterUrl(movie.poster_path, 'w342');

    const showImage = poster && !imageFailed;

    return (
        <article className="movie-card">
            <div className="movie-card-poster">
                <Link
                    to={`/movie/${movie.id}`}
                    className="movie-card-link"
                    aria-label={movie.title}
                >
                    {showImage ? (
                        <img
                            src={poster}
                            alt={movie.title}
                            loading="lazy"
                            decoding="async"
                            onError={() => setImageFailed(true)}
                        />
                    ) : (
                        <div className="movie-card-placeholder">
                            <ImageOff size={22} />
                            <span>No poster</span>
                        </div>
                    )}

                    <span className="movie-card-overlay">
                        View details
                    </span>
                </Link>

                <div className="movie-card-save">
                    <WatchlistButton movie={movie} />
                </div>
            </div>

            <div className="movie-card-content">
                <h3 className="movie-card-title">
                    <Link to={`/movie/${movie.id}`}>
                        {movie.title}
                    </Link>
                </h3>

                <div className="movie-card-meta">
                    <span className="movie-rating">
                        <Star size={14} fill="currentColor" />
                        {getRating(movie.vote_average)}
                    </span>

                    <span>{getYear(movie.release_date)}</span>
                </div>
            </div>
        </article>
    );
}

export default MovieCard;
