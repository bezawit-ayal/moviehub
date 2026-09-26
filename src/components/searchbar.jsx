import { Search } from 'lucide-react';
import './searchbar.css';

function SearchBar({ value, onChange, onSubmit }) {
    return (
        <form className="search-bar" onSubmit={onSubmit}>
            <Search size={20} className="search-bar-icon" />

            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search for a movie..."
                aria-label="Search for a movie"
            />

            <button type="submit">
                Search
            </button>
        </form>
    );
}

export default SearchBar;