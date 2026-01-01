import React, { useState, useEffect, useRef, useCallback } from 'react'; // Add useEffect, useRef, useCallback
import { useNavigate } from 'react-router-dom';
import { Search } from 'react-bootstrap-icons';
import { publicFetch } from '../utils/api'; // Import publicFetch

const SearchNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const debounceTimeoutRef = useRef(null); // Ref for debounce timeout

  const fetchSuggestions = useCallback(async (query) => {
    if (query.length < 2) { // Only fetch suggestions for queries longer than 1 character
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const response = await publicFetch(`/search/autocomplete?q=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching autocomplete suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300); // Debounce for 300ms
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
    if (suggestion.type === 'product') {
      navigate(`/products/${suggestion._id}`);
    } else if (suggestion.type === 'service') {
      navigate(`/services/${suggestion._id}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(suggestion.name)}`);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.closest('.search-container') === null) { // Assuming a container with class 'search-container'
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-background shadow-sm py-3 fixed-search-navbar">
      <div className="max-w-7xl mx-auto px-4 relative search-container"> {/* Added relative and search-container */}
        <form onSubmit={handleSearchSubmit} className="flex items-center justify-center">
          <input
            type="search"
            placeholder="Buscar productos o servicios..."
            className="
              w-full max-w-md px-4 py-2 border rounded-l-md bg-card-bg text-text-primary
              focus:outline-none focus:ring-2 focus:ring-primary
            "
            value={searchQuery}
            onChange={handleSearchChange} // Use new handleChange
            onFocus={() => searchQuery.length > 1 && setShowSuggestions(true)} // Show suggestions on focus if query exists
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-r-md hover:opacity-90 transition duration-300"
          >
            <Search />
          </button>
        </form>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full max-w-md bg-card-bg border border-gray-300 rounded-md mt-1 shadow-lg left-1/2 transform -translate-x-1/2">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion._id}
                className="px-4 py-2 hover:bg-background cursor-pointer text-text-primary"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.name} ({suggestion.type === 'product' ? 'Producto' : 'Servicio'})
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default SearchNavbar;
