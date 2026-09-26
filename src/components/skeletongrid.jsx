import MovieSkeleton from './movieskeleton';
import './moviegrid.css';

function SkeletonGrid({ count = 10 }) {
    return (
        <div className="movie-grid">
            {Array.from({ length: count }).map((_, index) => (
                <MovieSkeleton key={index} />
            ))}
        </div>
    );
}

export default SkeletonGrid;