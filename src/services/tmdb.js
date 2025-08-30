// src/services/tmdb.js
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/';

function buildUrl(path, params = {}) {
  if (!API_KEY) throw new Error('Missing VITE_TMDB_API_KEY in .env');
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set('api_key', API_KEY);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  });
  return url.toString();
}

async function fetchTMDb(path, params = {}) {
  const url = buildUrl(path, params);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDb error ${res.status}`);
  return res.json();
}

export async function getTrendingMovies(timeWindow = 'week', page = 1) {
  return fetchTMDb(`/trending/movie/${timeWindow}`, { page });
}

export async function searchMovies(query, page = 1) {
  if (!query) return { page: 1, results: [], total_pages: 0, total_results: 0 };
  return fetchTMDb('/search/movie', { query, page, include_adult: false });
}

export async function getMovieDetails(id) {
  return fetchTMDb(`/movie/${id}`, { append_to_response: 'credits,videos' });
}

export function getImageUrl(path, size = 'w500') {
  return path ? `${IMAGE_BASE}${size}${path}` : null;
}

export async function getMovieVideos(movieId) {
  const res = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);
  if (!res.ok) throw new Error("Failed to fetch videos");
  return res.json(); // contains results array
}




