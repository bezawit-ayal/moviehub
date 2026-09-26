import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/tmdbapi';
import MovieGrid from '../components/moviegrid';
import SearchBar from '../components/searchbar';
import './search.css';
import SkeletonGrid from '../components/skeletongrid';
function Search() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [query, setQuery] = useState(
        searchParams.get('query') || ''
    );

    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(
        Number(searchParams.get('page')) || 1
    );

    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const currentQuery = searchParams.get('query');

    useEffect(() => {
        const loadSearchResults = async () => {
            if (!currentQuery) {
                setMovies([]);
                setTotalPages(1);
                return;
            }

            try {
                setLoading(true);
                setError('');

                const data = await searchMovies(
                    currentQuery,
                    page
                );

                setMovies(data.results || []);
                setTotalPages(
                    Math.min(data.total_pages || 1, 500)
                );
            } catch (error) {
                console.error(error);

                setError(
                    'Unable to search movies. Please try again.'
                );

                setMovies([]);
            } finally {
                setLoading(false);
            }
        };

        loadSearchResults();
    }, [currentQuery, page]);

    const handleSearch = (event) => {
        event.preventDefault();

        const searchQuery = query.trim();

        if (!searchQuery) {
            return;
        }

        setPage(1);

        setSearchParams({
            query: searchQuery,
            page: '1',
        });
    };

    const changePage = (newPage) => {
        if (
            newPage < 1 ||
            newPage > totalPages ||
            loading
        ) {
            return;
        }

        setPage(newPage);

        setSearchParams({
            query: currentQuery,
            page: String(newPage),
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <main className="search-page">
            <div className="container">

                <section className="search-header">
                    <p className="section-label">
                        MOVIE SEARCH
                    </p>

                    <h1>Find Your Next Movie</h1>

                    <p className="search-description">
                        Search for your favorite movies.
                    </p>

                    <SearchBar
                        value={query}
                        onChange={setQuery}
                        onSubmit={handleSearch}
                    />
                </section>

                <section className="search-results">

                    {loading && (
                        <SkeletonGrid count={10} />
                    )}

                    {error && (
                        <div className="search-status search-error">
                            {error}
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        currentQuery && (
                            <>
                                <div className="search-results-heading">
                                    <div>
                                        <h2>
                                            Results for "{currentQuery}"
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
                                            disabled={page === totalPages}
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

                    {!loading &&
                        !error &&
                        !currentQuery && (
                            <div className="search-empty">
                                <p>
                                    Search for a movie to see results.
                                </p>
                            </div>
                        )}

                </section>
            </div>
        </main>
    );
}

export default Search;