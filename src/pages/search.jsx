import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { searchMovies } from '../services/tmdbapi';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import MovieGrid from '../components/moviegrid';
import SearchBar from '../components/searchbar';
import SkeletonGrid from '../components/skeletongrid';
import './search.css';

const MAX_PAGES = 500;

const formatCount = (count) => count.toLocaleString('en-US');

/**
 * Remounted by <Search> whenever the query changes, so the input starts
 * from the URL and stale results never survive a new search.
 */
function SearchView() {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentQuery = searchParams.get('query') || '';
    const currentPage = Math.max(
        1,
        Number(searchParams.get('page')) || 1
    );

    const [inputValue, setInputValue] = useState(currentQuery);

    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const [loading, setLoading] = useState(Boolean(currentQuery));
    const [error, setError] = useState('');

    useDocumentTitle(currentQuery ? `Search: ${currentQuery}` : 'Search');

    useEffect(() => {
        if (!currentQuery) {
            return undefined;
        }

        const controller = new AbortController();

        const loadSearchResults = async () => {
            setLoading(true);
            setError('');

            try {
                const data = await searchMovies(
                    currentQuery,
                    currentPage,
                    { signal: controller.signal }
                );

                setMovies(data.results || []);
                setTotalPages(
                    Math.min(data.total_pages || 1, MAX_PAGES)
                );
                setTotalResults(data.total_results || 0);
            } catch {
                if (controller.signal.aborted) {
                    return;
                }

                setError('Unable to search movies. Please try again.');
                setMovies([]);
                setTotalResults(0);
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadSearchResults();

        return () => controller.abort();
    }, [currentQuery, currentPage]);

    const handleSearch = (event) => {
        event.preventDefault();

        const searchQuery = inputValue.trim();

        if (!searchQuery) {
            return;
        }

        setSearchParams({ query: searchQuery, page: '1' });
    };

    const changePage = (newPage) => {
        if (newPage < 1 || newPage > totalPages || loading) {
            return;
        }

        setSearchParams({
            query: currentQuery,
            page: String(newPage),
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const hasResults = movies.length > 0;

    return (
        <main className="search-page">
            <div className="container">
                <section className="search-header">
                    <p className="section-label">MOVIE SEARCH</p>

                    <h1>Find Your Next Movie</h1>

                    <p className="search-description">
                        Search thousands of movies by title.
                    </p>

                    <SearchBar
                        value={inputValue}
                        onChange={setInputValue}
                        onSubmit={handleSearch}
                    />
                </section>

                <section className="search-results">
                    {loading && <SkeletonGrid count={10} />}

                    {error && (
                        <div className="search-status search-error">
                            {error}
                        </div>
                    )}

                    {!currentQuery && (
                        <div className="search-empty">
                            <p>Type a title above to see results.</p>
                        </div>
                    )}

                    {currentQuery && !loading && !error && !hasResults && (
                        <div className="search-empty">
                            <SearchX size={28} />
                            <p>
                                No movies match &quot;{currentQuery}&quot;.
                            </p>
                        </div>
                    )}

                    {hasResults && !loading && !error && (
                        <>
                            <div className="search-results-heading">
                                <div>
                                    <h2>
                                        Results for &quot;{currentQuery}&quot;
                                    </h2>

                                    <span>
                                        {formatCount(totalResults)}{' '}
                                        {totalResults === 1
                                            ? 'movie'
                                            : 'movies'}
                                    </span>
                                </div>
                            </div>

                            <MovieGrid movies={movies} />

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        type="button"
                                        className="pagination-button"
                                        disabled={
                                            loading ||
                                            currentPage === 1
                                        }
                                        onClick={() =>
                                            changePage(
                                                currentPage - 1
                                            )
                                        }
                                    >
                                        Previous
                                    </button>

                                    <span className="pagination-info">
                                        Page {currentPage} of {totalPages}
                                    </span>

                                    <button
                                        type="button"
                                        className="pagination-button"
                                        disabled={
                                            loading ||
                                            currentPage === totalPages
                                        }
                                        onClick={() =>
                                            changePage(
                                                currentPage + 1
                                            )
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

function Search() {
    const [searchParams] = useSearchParams();

    const query = searchParams.get('query') || '';

    return <SearchView key={query} />;
}

export default Search;
