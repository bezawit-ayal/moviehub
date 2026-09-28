import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { backdropUrl } from '../services/tmdbapi';
import WatchlistButton from './watchlistbutton';
import './hero.css';

const ROTATE_INTERVAL = 7000;

const FEATURED_COUNT = 5;

function Hero({ movies, loading }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    const featured = movies.slice(0, FEATURED_COUNT);
    const count = featured.length;

    // The list can shrink between requests, so keep the index in range
    // during render instead of correcting it in an effect.
    const index = count ? activeIndex % count : 0;

    useEffect(() => {
        if (paused || count < 2) {
            return undefined;
        }

        const timer = setInterval(() => {
            setActiveIndex((current) => current + 1);
        }, ROTATE_INTERVAL);

        return () => clearInterval(timer);
    }, [paused, count]);

    if (loading) {
        return <div className="hero hero--loading" aria-hidden="true" />;
    }

    if (count === 0) {
        return null;
    }

    const active = featured[index];
    const year = active.release_date
        ? active.release_date.substring(0, 4)
        : 'N/A';
    const rating = active.vote_average
        ? active.vote_average.toFixed(1)
        : 'N/A';

    const goTo = (next) => setActiveIndex(next + count);

    return (
        <section
            className="hero"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-roledescription="carousel"
            aria-label="Featured movies"
        >
            {featured.map((movie, slideIndex) => (
                <div
                    key={movie.id}
                    className={`hero-slide ${
                        slideIndex === index ? 'is-active' : ''
                    }`}
                    style={{
                        backgroundImage: movie.backdrop_path
                            ? `url(${backdropUrl(
                                  movie.backdrop_path,
                                  'w1280'
                              )})`
                            : 'none',
                    }}
                    aria-hidden={slideIndex !== index}
                />
            ))}

            <div className="hero-scrim" />

            <div className="hero-content container">
                <p className="section-label">
                    TRENDING THIS WEEK
                </p>

                <h1 className="hero-title">{active.title}</h1>

                <div className="hero-meta">
                    <span className="hero-rating">
                        <Star size={15} fill="currentColor" />
                        {rating}
                    </span>

                    <span>{year}</span>

                    {active.original_language && (
                        <span className="hero-language">
                            {active.original_language.toUpperCase()}
                        </span>
                    )}
                </div>

                {active.overview && (
                    <p className="hero-overview">
                        {active.overview}
                    </p>
                )}

                <div className="hero-actions">
                    <Link
                        to={`/movie/${active.id}`}
                        className="primary-button hero-button"
                    >
                        <Info size={16} />
                        View details
                    </Link>

                    <WatchlistButton
                        movie={active}
                        variant="label"
                    />
                </div>
            </div>

            {count > 1 && (
                <div className="hero-controls container">
                    <button
                        type="button"
                        className="hero-arrow"
                        onClick={() => goTo(index - 1)}
                        aria-label="Previous featured movie"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="hero-dots">
                        {featured.map((movie, dotIndex) => (
                            <button
                                key={movie.id}
                                type="button"
                                className={`hero-dot ${
                                    dotIndex === index ? 'is-active' : ''
                                }`}
                                onClick={() => goTo(dotIndex)}
                                aria-label={`Show ${movie.title}`}
                                aria-current={dotIndex === index}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        className="hero-arrow"
                        onClick={() => goTo(index + 1)}
                        aria-label="Next featured movie"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </section>
    );
}

export default Hero;
