import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    getTrendingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
} from '../services/tmdbapi';

import SkeletonGrid from '../components/skeletongrid';
import MovieGrid from '../components/moviegrid';
import SearchBar from '../components/searchbar';

import './home.css';


function MovieSection({
    label,
    title,
    movies,
    loading,
}) {
    return (
        <section className="home-section">

            <div className="section-heading">
                <div>
                    <p className="section-label">
                        {label}
                    </p>

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

    const navigate = useNavigate();

    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [upcoming, setUpcoming] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');

    const [recentSearches, setRecentSearches] = useState(() => {
        const savedSearches = localStorage.getItem(
            'moviehub-recent-searches'
        );

        return savedSearches
            ? JSON.parse(savedSearches)
            : [];
    });

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

                setTrending(
                    trendingData.results || []
                );

                setPopular(
                    popularData.results || []
                );

                setTopRated(
                    topRatedData.results || []
                );

                setUpcoming(
                    upcomingData.results || []
                );

            } catch (err) {

                console.error(err);

                setError(
                    'Unable to load movies. Please try again.'
                );

            } finally {

                setLoading(false);

            }
        };

        loadMovies();

    }, []);


    const handleSearch = (event) => {

        event.preventDefault();

        const search = searchQuery.trim();

        if (!search) {
            return;
        }

        const updatedSearches = [
            search,
            ...recentSearches.filter(
                (item) =>
                    item.toLowerCase() !==
                    search.toLowerCase()
            ),
        ].slice(0, 5);

        setRecentSearches(updatedSearches);

        localStorage.setItem(
            'moviehub-recent-searches',
            JSON.stringify(updatedSearches)
        );

        navigate(
            `/search?query=${encodeURIComponent(search)}`
        );
    };


    const handleRecentSearch = (search) => {

        setSearchQuery(search);

        navigate(
            `/search?query=${encodeURIComponent(search)}`
        );
    };


    const clearRecentSearches = () => {

        setRecentSearches([]);

        localStorage.removeItem(
            'moviehub-recent-searches'
        );
    };


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

                <section className="home-search-section">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSubmit={handleSearch}
                    />

                    {recentSearches.length > 0 && (
                        <div className="home-recent-searches">
                            <div className="home-recent-header">
                                <h3>Recent Searches</h3>

                                <button
                                    type="button"
                                    onClick={clearRecentSearches}
                                >
                                    Clear
                                </button>
                            </div>

                            <div className="home-recent-list">
                                {recentSearches.map((search) => (
                                    <button
                                        key={search}
                                        type="button"
                                        onClick={() => handleRecentSearch(search)}
                                    >
                                        {search}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </section>


                {/* Trending */}

                <MovieSection
                    label="THIS WEEK"
                    title="Trending Movies"
                    movies={trending}
                    loading={loading}
                />


                {/* Popular */}

                <MovieSection
                    label="POPULAR"
                    title="Popular Movies"
                    movies={popular}
                    loading={loading}
                />


                {/* Top Rated */}

                <MovieSection
                    label="TOP RATED"
                    title="Top Rated Movies"
                    movies={topRated}
                    loading={loading}
                />


                {/* Upcoming */}

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