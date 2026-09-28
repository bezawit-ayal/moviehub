import { Component } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import './errorboundary.css';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error('Unhandled UI error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <main className="errorboundary-page">
                    <div className="errorboundary-content">
                        <span
                            className="errorboundary-badge"
                            aria-hidden="true"
                        >
                            <AlertTriangle size={28} />
                        </span>

                        <p className="section-label">
                            SOMETHING WENT WRONG
                        </p>


                        <p className="errorboundary-description">
                            The page crashed while rendering. please Reload and try it again.
                        </p>

                        <div className="errorboundary-actions">
                            <button
                                type="button"
                                className="primary-button"
                                onClick={() => window.location.reload()}
                            >
                                <RefreshCw size={16} />
                                Reload
                            </button>

                            <Link
                                to="/"
                                className="secondary-button"
                            >
                                <Home size={16} />
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </main>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
