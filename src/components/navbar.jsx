import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { useWatchlist } from '../hooks/usewatchlist';
import './navbar.css';

const NAV_LINKS = [
    { to: '/', label: 'Home', end: true },
    { to: '/watchlist', label: 'Watchlist' },
];

/**
 * Owns the input value. The parent remounts it on every navigation by
 * changing its key, so the field always starts from the current URL.
 */
function NavbarSearchField({ initialQuery, onSearch }) {
    const [query, setQuery] = useState(initialQuery);

    const handleSubmit = (event) => {
        event.preventDefault();

        onSearch(query);
    };

    return (
        <form
            className="navbar-search"
            onSubmit={handleSubmit}
            role="search"
        >
            <Search size={18} />

            <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search movies..."
                aria-label="Search movies"
                autoFocus
            />

            <button type="submit">Search</button>
        </form>
    );
}

function Navbar() {
    // Storing the location key the menu was opened at keeps the open state
    // derived: any navigation closes the menu without an effect.
    const [menuKey, setMenuKey] = useState(null);
    const [searchKey, setSearchKey] = useState(null);

    const { count } = useWatchlist();

    const navigate = useNavigate();
    const location = useLocation();

    const menuOpen = menuKey === location.key;
    const searchOpen = searchKey === location.key;

    const currentQuery =
        location.pathname === '/search'
            ? new URLSearchParams(location.search).get('query') || ''
            : '';

    useEffect(() => {
        if (!searchOpen && !menuOpen) {
            return undefined;
        }

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                setSearchKey(null);
                setMenuKey(null);
            }
        };

        window.addEventListener('keydown', closeOnEscape);

        return () =>
            window.removeEventListener('keydown', closeOnEscape);
    }, [searchOpen, menuOpen]);

    const closeAll = () => {
        setSearchKey(null);
        setMenuKey(null);
    };

    const handleSearch = (value) => {
        const searchQuery = value.trim();

        if (!searchQuery) {
            return;
        }

        closeAll();

        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    };

    return (
        <header className="navbar">
            <div className="navbar-container container">
                <Link to="/" className="navbar-logo">
                    Movie<span>Hub</span>
                </Link>

                <nav
                    className={`navbar-links ${
                        menuOpen ? 'active' : ''
                    }`}
                >
                    {NAV_LINKS.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={closeAll}
                        >
                            {label}

                            {label === 'Watchlist' && count > 0 && (
                                <span className="navbar-badge">
                                    {count}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="navbar-actions">
                    {searchOpen && (
                        <NavbarSearchField
                            key={location.key}
                            initialQuery={currentQuery}
                            onSearch={handleSearch}
                        />
                    )}

                    <button
                        type="button"
                        className="search-icon-button"
                        onClick={() => {
                            setMenuKey(null);
                            setSearchKey(
                                searchOpen ? null : location.key
                            );
                        }}
                        aria-label="Search movies"
                        aria-expanded={searchOpen}
                    >
                        {searchOpen ? (
                            <X size={20} />
                        ) : (
                            <Search size={20} />
                        )}
                    </button>

                    <button
                        type="button"
                        className="menu-button"
                        onClick={() => {
                            setSearchKey(null);
                            setMenuKey(
                                menuOpen ? null : location.key
                            );
                        }}
                        aria-label="Menu"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
