import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ArrowLeft,
    Star,
    CalendarDays,
    Clock,
    Play,
    ExternalLink,
} from 'lucide-react';
import {
    getMovieDetails,
    backdropUrl,
    profileUrl,
    safeExternalUrl,
} from '../services/tmdbapi';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import WatchlistButton from '../components/watchlistbutton';
import MovieGrid from '../components/moviegrid';
import SkeletonGrid from '../components/skeletongrid';
import './movie.css';

const MAX_CAST = 12;
const MAX_VIDEOS = 6;
const MAX_SIMILAR = 10;

const formatRuntime = (minutes) => {
    if (!minutes) {
        return 'N/A';
    }

    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;

    return hours ? `${hours}h ${rest}m` : `${rest}m`;
};

const formatMoney = (amount) => {
    if (!amount) {
        return 'N/A';
    }

    return `$${amount.toLocaleString('en-US')}`;
};

const formatDate = (date) => {
    if (!date) {
        return 'N/A';
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

/**
 * Video keys come from the API and are interpolated into a URL, so they
 * are encoded like the watch links are. Without this a key containing
 * path or query characters could reshape the path.
 */
const youtubeThumbnail = (key) =>
    `https://img.youtube.com/vi/${encodeURIComponent(key)}/hqdefault.jpg`;

function MovieDetailsSkeleton() {
    return (
        <div className="movie-skeleton-page" aria-hidden="true">
            <div className="movie-skeleton-hero" />

            <div className="container movie-skeleton-body">
                <div className="movie-skeleton-line movie-skeleton-line--title" />
                <div className="movie-skeleton-line" />
                <div className="movie-skeleton-line movie-skeleton-line--short" />
            </div>

            <div className="container">
                <SkeletonGrid count={5} />
            </div>
        </div>
    );
}

function Movie() {
    const { movieId } = useParams();

    const [movie, setMovie] = useState(null);

    // A missing id is a render-time fact, not something to push into
    // state from an effect.
    const hasMovieId = Boolean(movieId);

    const [loading, setLoading] = useState(hasMovieId);
    const [error, setError] = useState(
        hasMovieId ? '' : 'This movie does not exist.'
    );
    const [notFound, setNotFound] = useState(!hasMovieId);

    useDocumentTitle(movie?.title);

    useEffect(() => {
        if (!movieId) {
            return undefined;
        }

        const controller = new AbortController();

        const loadMovie = async () => {
            setLoading(true);
            setError('');
            setNotFound(false);
            setMovie(null);

            try {
                const data = await getMovieDetails(movieId, {
                    signal: controller.signal,
                });

                setMovie(data);
            } catch (err) {
                if (controller.signal.aborted) {
                    return;
                }

                setNotFound(err.message === 'Not found');
                setError(
                    'Unable to load this movie. Please try again.'
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadMovie();

        return () => controller.abort();
    }, [movieId]);

    if (loading) {
        return <MovieDetailsSkeleton />;
    }

    if (error) {
        return (
            <main className="movie-page">
                <div className="container">
                    <div className="movie-status">
                        <p className="section-label">
                            {notFound
                                ? 'NOT FOUND'
                                : 'SOMETHING WENT WRONG'}
                        </p>

                        <h1>
                            {notFound
                                ? 'Movie not found'
                                : 'Something went wrong'}
                        </h1>

                        <p>{error}</p>

                        <Link
                            to="/"
                            className="primary-button movie-status-button"
                        >
                            <ArrowLeft size={16} />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    const backdrop = backdropUrl(movie.backdrop_path, 'w1280');

    const videos = (movie.videos?.results || [])
        .filter((video) => video.site === 'YouTube')
        .filter((video) =>
            ['Trailer', 'Teaser'].includes(video.type)
        )
        .slice(0, MAX_VIDEOS);

    const trailer = videos[0];

    const cast = (movie.credits?.cast || [])
        .filter((member) => member.profile_path)
        .slice(0, MAX_CAST);

    const similar = (movie.similar?.results || []).slice(
        0,
        MAX_SIMILAR
    );

    const crew = (movie.credits?.crew || [])
        .filter((member) => member.job === 'Director')
        .slice(0, 3);

    return (
        <main className="movie-page">
            <section
                className="movie-hero"
                style={
                    backdrop
                        ? { backgroundImage: `url(${backdrop})` }
                        : undefined
                }
            >
                <div className="movie-hero-scrim" />

                <div className="container movie-hero-content">
                    <Link
                        to="/"
                        className="movie-back"
                    >
                        <ArrowLeft size={16} />
                        Back
                    </Link>

                    <p className="section-label">FEATURED</p>

                    <h1 className="movie-title">
                        {movie.title}
                    </h1>

                    {movie.tagline && (
                        <p className="movie-tagline">
                            {movie.tagline}
                        </p>
                    )}

                    <div className="movie-meta">
                        {movie.vote_average ? (
                            <span className="movie-hero-rating">
                                <Star
                                    size={15}
                                    fill="currentColor"
                                />
                                {movie.vote_average.toFixed(1)}
                                <span className="movie-vote-count">
                                    ({movie.vote_count} votes)
                                </span>
                            </span>
                        ) : null}

                        <span>
                            <CalendarDays size={14} />
                            {formatDate(movie.release_date)}
                        </span>

                        <span>
                            <Clock size={14} />
                            {formatRuntime(movie.runtime)}
                        </span>
                    </div>

                    <div className="movie-chips">
                        {movie.genres?.map((genre) => (
                            <span key={genre.id} className="movie-chip">
                                {genre.name}
                            </span>
                        ))}
                    </div>

                    <div className="movie-actions">
                        <WatchlistButton
                            movie={movie}
                            variant="label"
                        />

                        {trailer && (
                            <a
                                className="secondary-button movie-button"
                                href={`https://www.youtube.com/watch?v=${encodeURIComponent(
                                    trailer.key
                                )}`}
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                <Play size={16} />
                                Watch trailer
                            </a>
                        )}
                    </div>
                </div>
            </section>

            <div className="container movie-body">
                <div className="movie-main">
                    <section className="movie-section">
                        <h2 className="movie-section-title">
                            Overview
                        </h2>

                        <p className="movie-overview">
                            {movie.overview ||
                                'No overview available for this movie yet.'}
                        </p>
                    </section>

                    {videos.length > 0 && (
                        <section className="movie-section">
                            <h2 className="movie-section-title">
                                Videos
                            </h2>

                            <div className="movie-videos">
                                {videos.map((video) => (
                                    <a
                                        key={video.id}
                                        className="movie-video"
                                        href={`https://www.youtube.com/watch?v=${encodeURIComponent(
                                            video.key
                                        )}`}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                    >
                                        <img
                                            src={youtubeThumbnail(
                                                video.key
                                            )}
                                            alt={video.name}
                                            loading="lazy"
                                        />

                                        <span className="movie-video-play">
                                            <Play
                                                size={18}
                                                fill="currentColor"
                                            />
                                        </span>

                                        <span className="movie-video-name">
                                            {video.name}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </section>
                    )}

                    {cast.length > 0 && (
                        <section className="movie-section">
                            <h2 className="movie-section-title">
                                Cast
                            </h2>

                            <div className="movie-cast">
                                {cast.map((member) => (
                                    <div
                                        key={member.id}
                                        className="movie-cast-card"
                                    >
                                        <div className="movie-cast-photo">
                                            <img
                                                src={profileUrl(
                                                    member.profile_path
                                                )}
                                                alt={member.name}
                                                loading="lazy"
                                            />
                                        </div>

                                        <p className="movie-cast-name">
                                            {member.name}
                                        </p>

                                        <p className="movie-cast-role">
                                            {member.character}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                <aside className="movie-facts">
                    <h2 className="movie-section-title">
                        Details
                    </h2>

                    <dl className="movie-facts-list">
                        <div>
                            <dt>Status</dt>
                            <dd>{movie.status || 'Unknown'}</dd>
                        </div>

                        <div>
                            <dt>Release date</dt>
                            <dd>
                                {formatDate(movie.release_date)}
                            </dd>
                        </div>

                        <div>
                            <dt>Runtime</dt>
                            <dd>
                                {formatRuntime(movie.runtime)}
                            </dd>
                        </div>

                        <div>
                            <dt>Original title</dt>
                            <dd>
                                {movie.original_title ||
                                    movie.title}
                            </dd>
                        </div>

                        <div>
                            <dt>Language</dt>
                            <dd>
                                {(
                                    movie.spoken_languages?.[0]
                                        ?.english_name ||
                                    movie.original_language ||
                                    'N/A'
                                ).toUpperCase()}
                            </dd>
                        </div>

                        <div>
                            <dt>Budget</dt>
                            <dd>{formatMoney(movie.budget)}</dd>
                        </div>

                        <div>
                            <dt>Revenue</dt>
                            <dd>{formatMoney(movie.revenue)}</dd>
                        </div>

                        {crew.length > 0 && (
                            <div>
                                <dt>Director</dt>
                                <dd>
                                    {crew
                                        .map(
                                            (member) =>
                                                member.name
                                        )
                                        .join(', ')}
                                </dd>
                            </div>
                        )}

                        {movie.production_companies?.length > 0 && (
                            <div>
                                <dt>Production</dt>
                                <dd>
                                    {movie.production_companies
                                        .map(
                                            (company) =>
                                                company.name
                                        )
                                        .join(', ')}
                                </dd>
                            </div>
                        )}

                        {safeExternalUrl(movie.homepage) && (
                            <div>
                                <dt>Website</dt>
                                <dd>
                                    <a
                                        href={safeExternalUrl(
                                            movie.homepage
                                        )}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="movie-link"
                                    >
                                        Visit site
                                        <ExternalLink
                                            size={12}
                                        />
                                    </a>
                                </dd>
                            </div>
                        )}
                    </dl>
                </aside>
            </div>

            {similar.length > 0 && (
                <section className="container movie-similar">
                    <p className="section-label">MORE LIKE THIS</p>

                    <h2 className="movie-section-title">
                        Similar movies
                    </h2>

                    <MovieGrid movies={similar} />
                </section>
            )}
        </main>
    );
}

export default Movie;
