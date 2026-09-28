import { Link } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import './footer.css';

const BROWSE_LINKS = [
    { label: 'Home', to: '/' },
    { label: 'Discover', to: '/discover' },
    { label: 'Search', to: '/search' },
];

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-container">

                <div className="footer-top">
                    <div className="footer-brand">
                        <Link to="/" className="footer-logo">
                            Movie<span>Hub</span>
                        </Link>

                        <p className="footer-tagline">
                            <Clapperboard size={15} />
                            Discover trending, popular and top rated movies
                            all in one place.
                        </p>
                    </div>

                    <div className="footer-column">
                        <h3 className="footer-heading">Browse</h3>

                        <ul className="footer-links">
                            {BROWSE_LINKS.map(({ label, to }) => (
                                <li key={to}>
                                    <Link to={to}>{label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p className="footer-copyright">
                        &copy; {year} MovieHub. All rights reserved.
                    </p>

                    <p className="footer-credit">
                        Built by Mehari &amp; Bezawit
                    </p>
                </div>

            </div>
        </footer>
    );
}

export default Footer;
