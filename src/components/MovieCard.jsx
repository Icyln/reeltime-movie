// src/components/MovieCard.jsx
import { useState, useEffect } from "react"; 
import { getImageUrl } from "../services/tmdb.js";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const poster = movie.poster_path ? getImageUrl(movie.poster_path, "w342") : null;

  // Favorite state
  const [isFavorite, setIsFavorite] = useState(() => {
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    return stored.some(fav => fav.id === movie.id);
  });

  // Star rating state
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const storedRatings = JSON.parse(localStorage.getItem("ratings") || "{}");
    if (storedRatings[movie.id]) setRating(storedRatings[movie.id]);
  }, [movie.id]);

  // Toggle favorite
  const toggleFavorite = (e) => {
    e.preventDefault();
    const stored = JSON.parse(localStorage.getItem("favorites") || "[]");
    const updated = isFavorite
      ? stored.filter(fav => fav.id !== movie.id)
      : [...stored, movie];

    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  // Handle rating
  const handleRate = (value) => {
    setRating(value);
    const storedRatings = JSON.parse(localStorage.getItem("ratings") || "{}");
    storedRatings[movie.id] = value;
    localStorage.setItem("ratings", JSON.stringify(storedRatings));
  };

  return (
    <div className="relative block rounded-lg overflow-hidden bg-gray-800 hover:scale-105 transition-transform">
      <Link to={`/movie/${movie.id}`}>
        {poster ? (
          <img
            src={poster}
            alt={movie.title}
            className="w-full h-56 object-cover"
            onError={(e) => { e.currentTarget.src = ""; }}
          />
        ) : (
          <div className="w-full h-56 flex items-center justify-center bg-gray-700 text-sm opacity-60">
            No Image
          </div>
        )}

        <div className="p-2">
          <h2 className="text-sm sm:text-base font-semibold truncate">{movie.title}</h2>
          <p className="text-xs sm:text-sm opacity-70">{movie.release_date?.slice(0, 4)}</p>

          {/* Star Rating */}
          <div className="flex mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`cursor-pointer text-lg sm:text-xl ${
                  star <= rating ? "text-yellow-400" : "text-gray-500"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleRate(star);
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* Favorite button */}
      <button
        onClick={toggleFavorite}
        className={`absolute top-2 right-2 px-2 py-1 text-xs sm:text-sm rounded ${
          isFavorite ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
        }`}
      >
        {isFavorite ? "♥" : "♡"}
      </button>
    </div>
  );
}
