import { Link } from 'react-router-dom';
import { Film, Home } from 'lucide-react';
import { useDocumentTitle } from '../hooks/usedocumenttitle';
import './notfound.css';

function NotFound() {
    useDocumentTitle('Page not found');

    return (
        <main className="nf-page">
            <div className="nf-inner">
                <span className="nf-code" aria-hidden="true">
                    404
                </span>

                <span className="nf-badge" aria-hidden="true">
                    <Film size={28} />
                </span>

                <p className="nf-label">PAGE NOT FOUND</p>

                <h1 className="nf-title">This reel is empty</h1>

                <p className="nf-text">
                    The page you are looking for does not exist, or was
                    moved to a different address.
                </p>

                <div className="nf-actions">
                    <Link to="/" className="primary-button nf-button">
                        <Home size={16} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default NotFound;
