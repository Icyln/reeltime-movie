// src/pages/Details.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMovieDetails, getMovieVideos, getImageUrl } from "../services/tmdb.js";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getMovieDetails(id)
      .then((res) => {
        if (mounted) setMovie(res);
        return getMovieVideos(id);
      })
      .then((videoRes) => {
        if (mounted) {
          const trailers = videoRes.results.filter(
            (v) => v.site === "YouTube" && v.type === "Trailer"
          );
          setVideos(trailers);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || "Failed to load");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, [id]);

  if (loading) return <p className="text-center py-10 text-sm sm:text-base">Loading movie details…</p>;
  if (error) return <p className="text-red-400 text-center py-10 text-sm sm:text-base">Error: {error}</p>;
  if (!movie) return null;

  const poster = movie.poster_path ? getImageUrl(movie.poster_path, "w500") : null;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition"
      >
        ← Back
      </button>

      {/* Movie Details Container */}
      <div className="flex flex-col md:flex-row gap-6 bg-gray-900/30 p-4 rounded-lg shadow-lg backdrop-blur-sm">
        
        {/* Poster */}
        {poster ? (
          <div className="relative w-full md:w-64 flex-shrink-0">
            <img
              src={poster}
              alt={movie.title}
              className="w-full h-auto rounded-lg shadow-lg object-cover"
              onError={(e) => { e.currentTarget.src = ""; }}
            />
            <div className="absolute bottom-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded font-semibold text-sm">
              ★ {movie.vote_average}
            </div>
          </div>
        ) : (
          <div className="w-full md:w-64 h-80 flex items-center justify-center bg-gray-700 text-sm opacity-70 rounded-lg">
            No Image
          </div>
        )}

        {/* Movie Info */}
        <div className="flex-1 space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            {movie.title} 
            <span className="text-gray-400 text-lg sm:text-xl md:text-2xl"> ({movie.release_date?.slice(0,4)})</span>
          </h1>
          <p className="text-gray-300 leading-relaxed text-sm sm:text-base">{movie.overview}</p>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map(g => (
                <span key={g.id} className="px-2 py-1 bg-indigo-600 text-white text-xs sm:text-sm rounded-full">
                  {g.name}
                </span>
              ))}
            </div>
          )}

          {/* Trailers */}
          {videos.length > 0 && (
            <div className="space-y-2 mt-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-white/90">Trailers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {videos.map((v) => (
                  <iframe
                    key={v.id}
                    title={v.name}
                    width="100%"
                    height="180"
                    src={`https://www.youtube.com/embed/${v.key}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg shadow-lg hover:scale-105 transition-transform"
                  ></iframe>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
