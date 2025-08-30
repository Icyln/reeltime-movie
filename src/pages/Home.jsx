// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getTrendingMovies, searchMovies } from "../services/tmdb.js";
import MovieCard from "../components/MovieCard.jsx";

export default function Home() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    const fetchMovies = async () => {
      try {
        let data;
        if (q) {
          data = await searchMovies(q);
          if (mounted) setMovies(data.results || []);
        } else {
          data = await getTrendingMovies("week", 1);
          if (mounted) setMovies(data.results || []);
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMovies();

    return () => {
      mounted = false;
    };
  }, [q]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center sm:text-left">
        {q ? `Search: “${q}”` : "Trending Movies"}
      </h1>

      {loading && (
        <div className="text-sm sm:text-base opacity-70 text-center">
          Loading movies…
        </div>
      )}
      {error && (
        <div className="text-sm sm:text-base text-red-400 text-center">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {!loading && !error && (
          movies.length === 0 ? (
            <div className="col-span-full text-sm sm:text-base opacity-70 text-center">
              {q ? "No results found." : "Trending movies will appear here."}
            </div>
          ) : (
            movies.map((m) => <MovieCard key={m.id} movie={m} />)
          )
        )}
      </div>
    </div>
  );
}
