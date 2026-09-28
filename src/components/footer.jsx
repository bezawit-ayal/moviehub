import { Link } from 'react-router-dom';
import { Clapperboard, ArrowUp } from 'lucide-react';
import { useWatchlist } from '../hooks/usewatchlist';
import './footer.css';

const BROWSE_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Search', to: '/search' },
];

function Footer() {
    const year = new Date().getFullYear();

    const { count } = useWatchlist();

    const scrollToTop = () =>
        window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer className="footer">
            <div className="footer-container container">
                <div className="footer-top">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            Movie<span>Hub</span>
                        </Link>

                        <p className="footer-tagline">
                            <Clapperboard size={15} />
                            Discover trending, popular and top rated
                            movies all in one place.
                        </p>

                        <button
                            type="button"
                            className="footer-top-button"
                            onClick={scrollToTop}
                        >
                            <ArrowUp size={14} />
                            Back to top
                        </button>
                    </div>

                    <div className="footer-column">
                        <h3 className="footer-heading">Browse</h3>

                        <ul className="footer-links">
                            {BROWSE_LINKS.map(({ label, to }) => (
                                <li key={to}>
                                    <Link to={to}>{label}</Link>
                                </li>
                            ))}

                            <li>
                                <Link to="/watchlist">
                                    Watchlist
                                    {count > 0 && (
                                        <span className="footer-count">
                                            {count}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3 className="footer-heading">MovieHub</h3>

                        <ul className="footer-links footer-links--static">
                            <li>Built with React and Vite</li>
                            <li>Data provided by TMDB</li>
                            <li>No account needed</li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        &copy; {year} MovieHub. All rights reserved.
                    </p>

                    <p className="footer-credit">
                        This product uses the TMDB API but is not
                        endorsed or certified by TMDB.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
