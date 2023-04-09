import React, { useState, useEffect } from 'react';

function Home() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');
  const [recommendedMovies, setRecommendedMovies] = useState([]);


  useEffect(() => {
    fetch('http://127.0.0.1:5000/movies')
      .then(response => response.json())
      .then(data => setMovies(data));
  }, []);

  const handleChange = event => {
    const term = event.target.value;
    setSearchTerm(term);

    // Filter the object keys by the search term
    const results = Object.keys(movies.title).filter(
      key => movies.title[key].toLowerCase().includes(term.toLowerCase())
    );

    // Update the search results
    setSearchResults(results);
    setSelectedMovie('');
  };

  const handleSelect = event => {
    const movieId = event.target.value;
    setSelectedMovie(movieId);
  };

  console.log(selectedMovie);

  const handleRecommend = () => {
    fetch('http://127.0.0.1:5000/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ movie: selectedMovie })
    })
    .then(response => response.json())
    .then(data => { 
      setRecommendedMovies(data.slice(0, 5)) }); 
  }
  
  console.log(recommendedMovies);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative mt-4">
        <input
          type="text"
          className="w-full px-4 py-2 text-gray-700 placeholder-gray-500 border rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={handleChange}
          placeholder="Search movies"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M13.707 14.293a1 1 0 010 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 16.586V5a1 1 0 112 0v11.586l1.293-1.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      <select
        className="w-full mt-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        defaultValue=""
        value={selectedMovie}
        onChange={handleSelect}
      >
        <option value="" disabled>
          Select a movie
        </option>
        {searchResults.map(key => (
          <option key={key} value={key}>
            {movies.title[key]}
          </option>
        ))}
      </select>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={handleRecommend}>
  Recommend
</button>
      <div className="mt-4">
  {recommendedMovies.length > 0 && (
    <div className="font-bold">Top 5 recommended movies:</div>
  )}
  <ul className="list-disc pl-5">
  {recommendedMovies.map(movieTitle => (
    <li key={movieTitle}>{movieTitle}</li>
  ))}
  </ul>
</div>
    </div>
  );
}

export default Home;
