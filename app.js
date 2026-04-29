"use strict";

const API_URL = "https://www.omdbapi.com/";
const STORAGE_KEY = "omdb:lastSearch";
const POSTER_FALLBACK =
  "https://via.placeholder.com/400x560?text=Poster+Not+Available";
const MOCK_MOVIES = [
  {
    Title: "Inception",
    Year: "2010",
    Genre: "Action, Adventure, Sci-Fi",
    Director: "Christopher Nolan",
    Country: "USA, UK",
    imdbRating: "8.8",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMmEzNTYyN2QtZmY4Yy00MzVjLWE5MWMtZWE4MDFmY2U4NmQxXkEyXkFqcGc@._V1_SX300.jpg",
  },
  {
    Title: "Interstellar",
    Year: "2014",
    Genre: "Adventure, Drama, Sci-Fi",
    Director: "Christopher Nolan",
    Country: "USA, UK, Canada",
    imdbRating: "8.7",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDAtNzY0NC00ZmMxLWE1YmQtMmQxMjgzZTE0N2QxXkEyXkFqcGc@._V1_SX300.jpg",
  },
  {
    Title: "The Matrix",
    Year: "1999",
    Genre: "Action, Sci-Fi",
    Director: "Lana Wachowski, Lilly Wachowski",
    Country: "USA, Australia",
    imdbRating: "8.7",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3NTAtNDQ0NC00ZjQ1LWFjNGUtYjE3MjAyN2NhYjlhXkEyXkFqcGc@._V1_SX300.jpg",
  },
];

const searchForm = document.getElementById("searchForm");
const movieInput = document.getElementById("movieInput");
const apiKeyInput = document.getElementById("apiKeyInput");
const messageBox = document.getElementById("message");
const resultBox = document.getElementById("result");
const searchButton = document.getElementById("searchButton");

const state = {
  cache: new Map(),
};

function setMessage(text, type = "") {
  messageBox.textContent = text;
  messageBox.className = "message";
  if (type) {
    messageBox.classList.add(type);
  }
}

function saveLastSearch(movie, apiKey) {
  const payload = {
    movie,
    apiKey,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function loadLastSearch() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function renderMovie(movie) {
  const poster = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : POSTER_FALLBACK;

  resultBox.innerHTML = `
    <article class="movie-card">
      <div class="poster-wrap">
        <img src="${poster}" alt="${movie.Title} poster" loading="lazy" />
      </div>
      <div class="movie-info">
        <h2 class="movie-title">${movie.Title}</h2>
        <ul class="movie-list">
          <li><strong>Year:</strong> <span>${movie.Year || "-"}</span></li>
          <li><strong>Genre:</strong> <span>${movie.Genre || "-"}</span></li>
          <li><strong>Director:</strong> <span>${movie.Director || "-"}</span></li>
          <li><strong>Country:</strong> <span>${movie.Country || "-"}</span></li>
          <li><strong>IMDb:</strong> <span>${movie.imdbRating || "-"}</span></li>
        </ul>
      </div>
    </article>
  `;
  resultBox.classList.add("show");
}

function clearMovie() {
  resultBox.classList.remove("show");
  resultBox.innerHTML = "";
}

async function fetchMovie(movieName, apiKey) {
  const cacheKey = `${movieName.toLowerCase()}::${apiKey}`;
  if (state.cache.has(cacheKey)) {
    return state.cache.get(cacheKey);
  }

  const url = new URL(API_URL);
  url.searchParams.set("t", movieName);
  url.searchParams.set("apikey", apiKey);

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("There was a problem connecting to the server.");
  }

  const data = await response.json();
  if (data.Response === "False") {
    throw new Error(data.Error || "Movie not found.");
  }

  state.cache.set(cacheKey, data);
  return data;
}

function fetchMovieFromMock(movieName) {
  const query = movieName.toLowerCase();
  const exactMatch = MOCK_MOVIES.find((movie) => movie.Title.toLowerCase() === query);
  if (exactMatch) {
    return exactMatch;
  }

  const partialMatch = MOCK_MOVIES.find((movie) =>
    movie.Title.toLowerCase().includes(query)
  );
  if (partialMatch) {
    return partialMatch;
  }

  throw new Error("Movie not found in mock data.");
}

async function handleSearch(event) {
  event.preventDefault();

  const movieName = movieInput.value.trim();
  const apiKey = apiKeyInput.value.trim();

  if (!movieName) {
    setMessage("Please enter a movie title.", "error");
    clearMovie();
    return;
  }

  searchButton.disabled = true;
  setMessage("Searching...");

  try {
    const movie = apiKey
      ? await fetchMovie(movieName, apiKey)
      : fetchMovieFromMock(movieName);
    renderMovie(movie);
    saveLastSearch(movieName, apiKey);
    setMessage(
      apiKey
        ? "Movie details loaded."
        : "Movie details loaded from local mock data.",
      "success"
    );
  } catch (error) {
    clearMovie();
    setMessage(error.message || "An unexpected error occurred.", "error");
  } finally {
    searchButton.disabled = false;
  }
}

function restoreLastSearch() {
  const last = loadLastSearch();
  if (!last || !last.movie) {
    setMessage("Enter a movie title to start searching.");
    return;
  }

  movieInput.value = last.movie;
  apiKeyInput.value = last.apiKey || "";
  setMessage("Last search restored. Press search to refresh.");
  searchForm.requestSubmit();
}

searchForm.addEventListener("submit", handleSearch);
restoreLastSearch();
