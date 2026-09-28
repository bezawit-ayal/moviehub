import MovieSkeleton from './movieskeleton';
import './skeletongrid.css';

function SkeletonGrid({ count = 10 }) {
    return (
        <div className="skeleton-grid">
            {Array.from({ length: count }).map((_, index) => (
                <MovieSkeleton key={index} />
            ))}
        </div>
    );
}

export default SkeletonGrid;
