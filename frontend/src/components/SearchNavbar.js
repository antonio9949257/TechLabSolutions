import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'react-bootstrap-icons';

const SearchNavbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-background shadow-sm py-3">
      <div className="max-w-7xl mx-auto px-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center justify-center">
          <input
            type="search"
            placeholder="Buscar productos o servicios..."
            className="
              w-full max-w-md px-4 py-2 border rounded-l-md bg-card-bg text-text-primary
              focus:outline-none focus:ring-2 focus:ring-primary
            "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-r-md hover:opacity-90 transition duration-300"
          >
            <Search />
          </button>
        </form>
      </div>
    </nav>
  );
};

export default SearchNavbar;
