import { Heart, Check } from 'lucide-react';
import { useWatchlist } from '../hooks/usewatchlist';
import './watchlistbutton.css';

function WatchlistButton({ movie, variant = 'icon' }) {
    const { isSaved, toggle } = useWatchlist();

    const saved = isSaved(movie.id);

    const action = saved
        ? `Remove ${movie.title} from watchlist`
        : `Add ${movie.title} to watchlist`;

    if (variant === 'label') {
        return (
            <button
                type="button"
                className="watchlist-button watchlist-button--label"
                onClick={() => toggle(movie)}
                aria-pressed={saved}
            >
                {saved ? (
                    <Check size={16} />
                ) : (
                    <Heart size={16} />
                )}

                {saved ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
        );
    }

    return (
        <button
            type="button"
            className="watchlist-button watchlist-button--icon"
            onClick={() => toggle(movie)}
            aria-pressed={saved}
            aria-label={action}
            title={action}
        >
            <Heart
                size={16}
                fill={saved ? 'currentColor' : 'none'}
            />
        </button>
    );
}

export default WatchlistButton;
