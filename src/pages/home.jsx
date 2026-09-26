import { useEffect, useState } from 'react';
import {
    getTrendingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
} from '../services/tmdbapi';
import SkeletonGrid from '../components/skeletongrid';
import MovieGrid from '../components/moviegrid';
import './home.css';

function MovieSection({ label, title, movies, loading }) {
    return (
        <section className="home-section">
            <div className="section-heading">
                <div>
                    <p className="section-label">{label}</p>
                    <h2>{title}</h2>
                </div>
            </div>

            {loading ? (
                <SkeletonGrid count={5} />
            ) : (
                <MovieGrid movies={movies} />
            )}
        </section>
    );
}

function Home() {
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [upcoming, setUpcoming] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadMovies = async () => {
            try {
                setLoading(true);
                setError('');

                const [
                    trendingData,
                    popularData,
                    topRatedData,
                    upcomingData,
                ] = await Promise.all([
                    getTrendingMovies(),
                    getPopularMovies(),
                    getTopRatedMovies(),
                    getUpcomingMovies(),
                ]);

                setTrending(trendingData.results || []);
                setPopular(popularData.results || []);
                setTopRated(topRatedData.results || []);
                setUpcoming(upcomingData.results || []);
            } catch (err) {
                console.error(err);
                setError('Unable to load movies. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadMovies();
    }, []);

    if (error) {
        return (
            <main className="home-page">
                <div className="container">
                    <div className="home-status home-error">
                        {error}
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="home-page">
            <div className="container">
                <MovieSection
                    label="THIS WEEK"
                    title="Trending Movies"
                    movies={trending}
                    loading={loading}
                />

                <MovieSection
                    label="POPULAR"
                    title="Popular Movies"
                    movies={popular}
                    loading={loading}
                />

                <MovieSection
                    label="TOP RATED"
                    title="Top Rated Movies"
                    movies={topRated}
                    loading={loading}
                />

                <MovieSection
                    label="COMING SOON"
                    title="Upcoming Movies"
                    movies={upcoming}
                    loading={loading}
                />
            </div>
        </main>
    );
}

export default Home;