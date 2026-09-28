import './searchbar.css';

function SearchBar({
    value,
    onChange,
    onSubmit,
    suggestions = [],
    onSuggestionClick,
}) {
    return (
        <div className="search-bar-wrapper">
            <form className="search-bar" onSubmit={onSubmit}>
                <input
                    type="text"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Search for your favorite movie..."
                    aria-label="Search for your favorite movie"
                />

                <button type="submit">
                    Search
                </button>
            </form>

            {suggestions.length > 0 && (
                <div className="search-suggestions">
                    {suggestions.map((movie) => (
                        <button
                            key={movie.id}
                            type="button"
                            className="search-suggestion"
                            onClick={() => onSuggestionClick(movie)}
                        >
                            <span className="suggestion-title">
                                {movie.title}
                            </span>

                            <span className="suggestion-year">
                                {movie.release_date
                                    ? movie.release_date.substring(0, 4)
                                    : 'N/A'}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SearchBar;