import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import {
    getTrendingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
} from '../services/tmdbapi';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import SkeletonGrid from '../components/skeletongrid';
import MovieGrid from '../components/moviegrid';
import Hero from '../components/hero';
import './home.css';

const VISIBLE_MOVIES = 10;

const SECTIONS = [
    {
        key: 'trending',
        label: 'THIS WEEK',
        title: 'Trending Movies',
        load: getTrendingMovies,
    },
    {
        key: 'popular',
        label: 'POPULAR',
        title: 'Popular Movies',
        load: getPopularMovies,
    },
    {
        key: 'topRated',
        label: 'TOP RATED',
        title: 'Top Rated Movies',
        load: getTopRatedMovies,
    },
    {
        key: 'upcoming',
        label: 'COMING SOON',
        title: 'Upcoming Movies',
        load: getUpcomingMovies,
    },
];

const emptySection = () => ({
    movies: [],
    loading: true,
    error: '',
});

function MovieSection({ config, data, onRetry }) {
    const { movies, loading, error } = data;

    return (
        <section className="home-section">
            <div className="section-heading">
                <div>
                    <p className="section-label">{config.label}</p>
                    <h2>{config.title}</h2>
                </div>
            </div>

            {loading && <SkeletonGrid count={5} />}

            {!loading && error && (
                <div className="home-inline-error">
                    <span>{error}</span>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onRetry}
                    >
                        <RefreshCw size={14} />
                        Retry
                    </button>
                </div>
            )}

            {!loading && !error && (
                <MovieGrid movies={movies.slice(0, VISIBLE_MOVIES)} />
            )}
        </section>
    );
}

function Home() {
    const [sections, setSections] = useState(() =>
        Object.fromEntries(
            SECTIONS.map((section) => [section.key, emptySection()])
        )
    );

    const [attempt, setAttempt] = useState(0);

    useDocumentTitle();

    useEffect(() => {
        const controller = new AbortController();

        const loadSections = async () => {
            setSections(
                Object.fromEntries(
                    SECTIONS.map((section) => [
                        section.key,
                        emptySection(),
                    ])
                )
            );

            const results = await Promise.allSettled(
                SECTIONS.map((section) =>
                    section.load({ signal: controller.signal })
                )
            );

            if (controller.signal.aborted) {
                return;
            }

            setSections(
                Object.fromEntries(
                    SECTIONS.map((section, index) => {
                        const result = results[index];

                        if (result.status === 'rejected') {
                            return [
                                section.key,
                                {
                                    movies: [],
                                    loading: false,
                                    error:
                                        'Could not load this row.',
                                },
                            ];
                        }

                        return [
                            section.key,
                            {
                                movies: result.value.results || [],
                                loading: false,
                                error: '',
                            },
                        ];
                    })
                )
            );
        };

        loadSections();

        return () => controller.abort();
    }, [attempt]);

    const retry = () => setAttempt((value) => value + 1);

    const everythingFailed = SECTIONS.every(
        (section) =>
            sections[section.key].error && !sections[section.key].loading
    );

    return (
        <main className="home-page">
            <Hero
                movies={sections.trending.movies}
                loading={sections.trending.loading}
            />

            <div className="container">
                {everythingFailed ? (
                    <div className="home-status home-error">
                        <p>Unable to load movies right now.</p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={retry}
                        >
                            <RefreshCw size={16} />
                            Try again
                        </button>
                    </div>
                ) : (
                    SECTIONS.map((config) => (
                        <MovieSection
                            key={config.key}
                            config={config}
                            data={sections[config.key]}
                            onRetry={retry}
                        />
                    ))
                )}
            </div>
        </main>
    );
}

export default Home;
