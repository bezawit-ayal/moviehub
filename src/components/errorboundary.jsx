import { Component } from 'react';
import { Link } from 'react-router-dom';
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
                        <p className="section-label">
                            SOMETHING WENT WRONG
                        </p>

                        <h1>Unexpected error</h1>

                        <p className="errorboundary-description">
                            The page crashed while rendering. Reloading
                            usually fixes it.
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={() => window.location.reload()}
                        >
                            Reload
                        </button>

                        <Link
                            to="/"
                            className="errorboundary-link"
                        >
                            or go back home
                        </Link>
                    </div>
                </main>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
