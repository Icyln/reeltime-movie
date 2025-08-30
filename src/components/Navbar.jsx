import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa"; // optional for favorites icon

export default function Navbar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initial = searchParams.get("q") || "";
  const [q, setQ] = useState(initial);

  useEffect(() => setQ(initial), [initial]);

  const onSubmit = (e) => {
    e.preventDefault();
    const query = q.trim();
    navigate(query ? `/?q=${encodeURIComponent(query)}` : "/");
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-900 via-black to-purple-900/90 backdrop-blur-md shadow-md border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
        <Link to="/" className="text-2xl font-bold text-white hover:text-purple-400 transition">
          🎬 ReelTime
        </Link>

        {/* Search bar */}
        <form onSubmit={onSubmit} className="flex items-center gap-2 flex-1 max-w-lg">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search movies, series…"
            className="w-full px-4 py-2 rounded-2xl bg-black/20 text-white placeholder-gray-400 shadow-inner focus:ring-2 focus:ring-purple-500 outline-none transition"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-medium transition"
          >
            Search
          </button>
        </form>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link
            to="/favorites"
            className="flex items-center gap-1 px-3 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition"
          >
            <FaHeart /> Favorites
          </Link>
        </nav>
      </div>
    </header>
  );
}
