import './movieskeleton.css';

function MovieSkeleton() {
    return (
        <div className="movie-skeleton">
            <div className="skeleton-poster"></div>

            <div className="skeleton-content">
                <div className="skeleton-title"></div>

                <div className="skeleton-meta">
                    <div className="skeleton-small"></div>
                    <div className="skeleton-small"></div>
                </div>
            </div>
        </div>
    );
}

export default MovieSkeleton;