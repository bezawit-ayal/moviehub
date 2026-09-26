import { useEffect, useState } from 'react';

import {
    getMovieGenres,
    getMoviesByGenre,
} from '../services/tmdbapi';

import MovieGrid from '../components/moviegrid';
import SkeletonGrid from '../components/skeletongrid';

import './discover.css';

function Discover() {
    const [genres, setGenres] = useState([]);

    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedRating, setSelectedRating] = useState('');

    const [movies, setMovies] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loadingGenres, setLoadingGenres] = useState(true);
    const [loadingMovies, setLoadingMovies] = useState(false);

    const [error, setError] = useState('');

    useEffect(() => {
        const loadGenres = async () => {
            try {
                setLoadingGenres(true);
                setError('');

                const data = await getMovieGenres();

                setGenres(data.genres || []);
            } catch (error) {
                console.error(error);
                setError('Unable to load genres.');
            } finally {
                setLoadingGenres(false);
            }
        };

        loadGenres();
    }, []);

    const loadMovies = async (currentPage = 1) => {
        try {
            setLoadingMovies(true);
            setError('');

            const data = await getMoviesByGenre(
                selectedGenre,
                currentPage,
                selectedYear,
                selectedRating
            );

            setMovies(data.results || []);

            setTotalPages(
                Math.min(data.total_pages || 1, 500)
            );
        } catch (error) {
            console.error(error);

            setError(
                'Unable to load movies. Please try again.'
            );

            setMovies([]);
        } finally {
            setLoadingMovies(false);
        }
    };

    const handleApplyFilters = () => {
        setPage(1);

        loadMovies(1);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const handleResetFilters = () => {
        setSelectedGenre('');
        setSelectedYear('');
        setSelectedRating('');

        setPage(1);
        setMovies([]);
        setTotalPages(1);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const changePage = (newPage) => {
        if (
            newPage < 1 ||
            newPage > totalPages ||
            loadingMovies
        ) {
            return;
        }

        setPage(newPage);

        loadMovies(newPage);

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const selectedGenreName =
        genres.find(
            (genre) =>
                String(genre.id) === String(selectedGenre)
        )?.name || '';

    return (
        <main className="discover-page">
            <div className="container">

                <section className="discover-header">

                    <p className="section-label">
                        DISCOVER
                    </p>

                    <h1>Discover Movies</h1>

                    <p className="discover-description">
                        Find movies using genre, year, and rating.
                    </p>

                    <div className="discover-filters">

                        <div className="filter-group">
                            <label htmlFor="genre">
                                Genre
                            </label>

                            <select
                                id="genre"
                                value={selectedGenre}
                                onChange={(event) =>
                                    setSelectedGenre(event.target.value)
                                }
                                disabled={loadingGenres}
                            >
                                <option value="">
                                    {loadingGenres
                                        ? 'Loading genres...'
                                        : 'All Genres'}
                                </option>

                                {genres.map((genre) => (
                                    <option
                                        key={genre.id}
                                        value={genre.id}
                                    >
                                        {genre.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="year">
                                Release Year
                            </label>

                            <select
                                id="year"
                                value={selectedYear}
                                onChange={(event) =>
                                    setSelectedYear(event.target.value)
                                }
                            >
                                <option value="">
                                    Any Year
                                </option>

                                {Array.from(
                                    { length: 30 },
                                    (_, index) => {
                                        const year =
                                            new Date().getFullYear() -
                                            index;

                                        return (
                                            <option
                                                key={year}
                                                value={year}
                                            >
                                                {year}
                                            </option>
                                        );
                                    }
                                )}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="rating">
                                Minimum Rating
                            </label>

                            <select
                                id="rating"
                                value={selectedRating}
                                onChange={(event) =>
                                    setSelectedRating(event.target.value)
                                }
                            >
                                <option value="">
                                    Any Rating
                                </option>

                                <option value="9">
                                    9+
                                </option>

                                <option value="8">
                                    8+
                                </option>

                                <option value="7">
                                    7+
                                </option>

                                <option value="6">
                                    6+
                                </option>

                                <option value="5">
                                    5+
                                </option>
                            </select>
                        </div>

                        <div className="filter-actions">

                            <button
                                type="button"
                                className="primary-button"
                                onClick={handleApplyFilters}
                                disabled={loadingMovies}
                            >
                                Apply Filters
                            </button>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={handleResetFilters}
                            >
                                Reset
                            </button>

                        </div>

                    </div>
                </section>

                <section className="discover-results">

                    {error && (
                        <div className="discover-status discover-error">
                            {error}
                        </div>
                    )}

                    {!error && loadingMovies && (
                        <SkeletonGrid count={10} />
                    )}

                    {!error &&
                        !loadingMovies &&
                        movies.length === 0 && (
                            <div className="discover-status">
                                <p>
                                    Choose your filters and click
                                    "Apply Filters".
                                </p>
                            </div>
                        )}

                    {!error &&
                        !loadingMovies &&
                        movies.length > 0 && (
                            <>
                                <div className="discover-heading">

                                    <div>
                                        <h2>
                                            {selectedGenreName ||
                                                'Discover Movies'}
                                        </h2>

                                        <span>
                                            Page {page} of {totalPages}
                                        </span>
                                    </div>

                                </div>

                                <MovieGrid movies={movies} />

                                {totalPages > 1 && (
                                    <div className="pagination">

                                        <button
                                            type="button"
                                            className="pagination-button"
                                            disabled={page === 1}
                                            onClick={() =>
                                                changePage(page - 1)
                                            }
                                        >
                                            Previous
                                        </button>

                                        <span className="pagination-info">
                                            Page {page} of {totalPages}
                                        </span>

                                        <button
                                            type="button"
                                            className="pagination-button"
                                            disabled={
                                                page === totalPages
                                            }
                                            onClick={() =>
                                                changePage(page + 1)
                                            }
                                        >
                                            Next
                                        </button>

                                    </div>
                                )}

                            </>
                        )}

                </section>

            </div>
        </main>
    );
}

export default Discover;