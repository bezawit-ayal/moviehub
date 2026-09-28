import { Link } from 'react-router-dom';
import { Bookmark, Trash2 } from 'lucide-react';
import { useWatchlist } from '../hooks/usewatchlist';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import MovieGrid from '../components/moviegrid';
import './watchlist.css';

function Watchlist() {
    const { movies, count, clear } = useWatchlist();

    useDocumentTitle('Watchlist');

    return (
        <main className="watchlist-page">
            <div className="container">
                <section className="watchlist-header">
                    <div>
                        <p className="section-label">
                            SAVED
                        </p>

                        <h1>My Watchlist</h1>

                        <p className="watchlist-description">
                            {count > 0
                                ? `${count} ${
                                      count === 1 ? 'movie' : 'movies'
                                  } saved on this device.`
                                : 'Movies you save are stored locally in this browser.'}
                        </p>
                    </div>

                    {count > 0 && (
                        <button
                            type="button"
                            className="secondary-button watchlist-clear"
                            onClick={clear}
                        >
                            <Trash2 size={16} />
                            Clear all
                        </button>
                    )}
                </section>

                {count === 0 ? (
                    <section className="watchlist-empty">
                        <span className="watchlist-empty-icon">
                            <Bookmark size={30} />
                        </span>

                        <h2>Your watchlist is empty</h2>

                        <p>
                            Tap the heart on any movie to keep it here for
                            later.
                        </p>

                        <div className="watchlist-empty-actions">
                            <Link
                                to="/"
                                className="primary-button"
                            >
                                Browse movies
                            </Link>
                        </div>
                    </section>
                ) : (
                    <section className="watchlist-grid">
                        <MovieGrid movies={movies} />
                    </section>
                )}
            </div>
        </main>
    );
}

export default Watchlist;
