import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './navbar.css';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    const handleSearch = (event) => {
        event.preventDefault();

        const searchQuery = query.trim();

        if (!searchQuery) {
            return;
        }

        setSearchOpen(false);
        setMenuOpen(false);

        navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <header className="navbar">
            <div className="navbar-container">

                <Link
                    to="/"
                    className="navbar-logo"
                    onClick={closeMenu}
                >
                    Movie<span>Hub</span>
                </Link>

                <nav className={`navbar-links ${menuOpen ? 'active' : ''}`}>
                    <NavLink to="/" onClick={closeMenu}>
                        Home
                    </NavLink>

                    <NavLink to="/discover" onClick={closeMenu}>
                        Discover
                    </NavLink>

                    <NavLink to="/watchlist" onClick={closeMenu}>
                        Watchlist
                    </NavLink>
                </nav>

                <div className="navbar-actions">

                    <button
                        type="button"
                        className="menu-button"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Menu"
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                </div>
            </div>
        </header>
    );
}

export default Navbar;