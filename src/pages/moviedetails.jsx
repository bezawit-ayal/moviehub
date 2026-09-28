import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Heart, ArrowLeft } from 'lucide-react';

import { getMovieDetails } from '../services/tmdbapi';

import './moviedetails.css';

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

function MovieDetails() {
    const { id } = useParams();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isWatchlisted, setIsWatchlisted] = useState(false);

    useEffect(() => {
        const loadMovie = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await getMovieDetails(id);

                setMovie(data);

                const recentMovies =
                    JSON.parse(
                        localStorage.getItem('moviehub-recently-viewed')
                    ) || [];

                const filteredMovies = recentMovies.filter(
                    (recentMovie) => recentMovie.id !== data.id
                );

                const updatedRecentMovies = [
                    data,
                    ...filteredMovies
                ].slice(0, 6);

                localStorage.setItem(
                    'moviehub-recently-viewed',
                    JSON.stringify(updatedRecentMovies)
                );

                const savedMovies =
                    JSON.parse(
                        localStorage.getItem('moviehub-watchlist')
                    ) || [];

                const alreadySaved = savedMovies.some(
                    (savedMovie) => savedMovie.id === data.id
                );

                setIsWatchlisted(alreadySaved);
            } catch (error) {
                console.error(error);
                setError('Unable to load movie details.');
            } finally {
                setLoading(false);
            }
        };

        loadMovie();
    }, [id]);

    const handleWatchlist = () => {
        if (!movie) return;

        const savedMovies =
            JSON.parse(
                localStorage.getItem('moviehub-watchlist')
            ) || [];

        const alreadySaved = savedMovies.some(
            (savedMovie) => savedMovie.id === movie.id
        );

        if (alreadySaved) {
            const updatedMovies = savedMovies.filter(
                (savedMovie) => savedMovie.id !== movie.id
            );

            localStorage.setItem(
                'moviehub-watchlist',
                JSON.stringify(updatedMovies)
            );

            setIsWatchlisted(false);
        } else {
            const updatedMovies = [...savedMovies, movie];

            localStorage.setItem(
                'moviehub-watchlist',
                JSON.stringify(updatedMovies)
            );

            setIsWatchlisted(true);
        }
    };

    if (loading) {
        return (
            <main className="movie-details-page">
                <div className="container">
                    <div className="movie-details-status">
                        Loading movie details...
                    </div>
                </div>
            </main>
        );
    }

    if (error || !movie) {
        return (
            <main className="movie-details-page">
                <div className="container">
                    <div className="movie-details-status">
                        <p>{error || 'Movie not found.'}</p>

                        <Link
                            to="/discover"
                            className="back-button"
                        >
                            <ArrowLeft size={18} />
                            Back to Discover
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const poster = movie.poster_path
        ? `${IMAGE_BASE_URL}${movie.poster_path}`
        : null;

    const backdrop = movie.backdrop_path
        ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
        : null;

    const releaseYear = movie.release_date
        ? movie.release_date.substring(0, 4)
        : 'N/A';

    const rating =
        movie.vote_average !== undefined &&
            movie.vote_average !== null
            ? movie.vote_average.toFixed(1)
            : 'N/A';

    const genres = movie.genres || [];
    const trailer = movie.videos?.results?.find(
        (video) =>
            video.site === 'YouTube' &&
            video.type === 'Trailer' &&
            video.official === true
    );

    return (
        <main className="movie-details-page">
            {backdrop && (
                <div
                    className="movie-details-backdrop"
                    style={{
                        backgroundImage: `url(${backdrop})`,
                    }}
                />
            )}

            <div className="movie-details-overlay" />

            <div className="container movie-details-container">
                <Link
                    to="/discover"
                    className="back-button"
                >
                    <ArrowLeft size={18} />
                    Back to Discover
                </Link>

                <section className="movie-details">
                    <div className="movie-details-poster">
                        {poster ? (
                            <img
                                src={poster}
                                alt={movie.title}
                            />
                        ) : (
                            <div className="movie-details-placeholder">
                                No Image
                            </div>
                        )}
                    </div>

                    <div className="movie-details-content">
                        <p className="section-label">
                            MOVIE DETAILS
                        </p>

                        <h1>{movie.title}</h1>

                        {movie.tagline && (
                            <p className="movie-tagline">
                                {movie.tagline}
                            </p>
                        )}

                        <div className="movie-details-meta">
                            <span className="movie-detail-rating">
                                <Star
                                    size={18}
                                    fill="currentColor"
                                />
                                {rating}
                            </span>

                            <span>{releaseYear}</span>

                            {movie.runtime > 0 && (
                                <span>
                                    {movie.runtime} min
                                </span>
                            )}
                        </div>

                        {genres.length > 0 && (
                            <div className="movie-genres">
                                {genres.map((genre) => (
                                    <span key={genre.id}>
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        <p className="movie-overview">
                            {movie.overview ||
                                'No description available for this movie.'}
                        </p>

                        <div className="movie-details-actions">
                            <button
                                type="button"
                                className="primary-button"
                                onClick={handleWatchlist}
                            >
                                <Heart
                                    size={18}
                                    fill={isWatchlisted ? 'currentColor' : 'none'}
                                />

                                {isWatchlisted
                                    ? 'Remove from Watchlist'
                                    : 'Add to Watchlist'}
                            </button>

                            {movie.videos?.results?.length > 0 && (
                                <a
                                    href={`https://www.youtube.com/watch?v=${movie.videos.results.find(
                                        (video) =>
                                            video.site === 'YouTube' &&
                                            video.type === 'Trailer'
                                    )?.key
                                        }`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="secondary-button"
                                >
                                    Watch Trailer
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
export default MovieDetails;