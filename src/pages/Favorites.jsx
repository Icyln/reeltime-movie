import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard.jsx";

export default function Favorites() {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    setMovies(stored);
  }, []);

  // If no favorite movies, show message and Back button
  if (movies.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-4 space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
        >
          ← Back
        </button>
        <p className="text-sm opacity-70">No favorite movies yet.</p>
      </div>
    );
  }

  // Render Back button and movie grid
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
      >
        ← Back
      </button>

      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </section>
    </div>
  );
}
