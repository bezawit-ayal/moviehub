import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, Compass } from 'lucide-react';

const STYLES = `
.nf-page {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.nf-inner {
  max-width: 520px;
  margin: 0 auto;
}

.nf-code {
  display: block;
  font-size: clamp(64px, 12vw, 112px);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -3px;
  color: var(--surface-light);
  -webkit-text-stroke: 1px var(--border);
}

.nf-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin: calc(-1 * var(--space-md)) 0 var(--space-sm);
  color: var(--primary);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50%;
}

.nf-label {
  margin-bottom: var(--space-xs);
  color: var(--primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.nf-title {
  margin-bottom: var(--space-sm);
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 700;
  letter-spacing: -1px;
}

.nf-text {
  max-width: 440px;
  margin: 0 auto var(--space-lg);
  color: var(--text-secondary);
  line-height: 1.6;
}

.nf-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.nf-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.nf-button svg {
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .nf-actions {
    flex-direction: column;
  }

  .nf-button {
    width: 100%;
    justify-content: center;
  }
}
`;

function NotFound() {
    useEffect(() => {
        document.title = 'Page not found | MovieHub';
    }, []);

    return (
        <main className="nf-page">
            <style>{STYLES}</style>

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

                    <Link
                        to="/discover"
                        className="secondary-button nf-button"
                    >
                        <Compass size={16} />
                        Discover Movies
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default NotFound;
