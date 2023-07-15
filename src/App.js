import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  // fetching movies
  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setIsLoading(true);
      const response = await fetch(
        "https://fetch-movies-74fbf-default-rtdb.firebaseio.com/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong...Retrying");
      }
      // converting movies of obj into array
      const data = await response.json();
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedMovies);
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setError(false);
      const id = setTimeout(fetchMoviesHandler, 5000);
      setTimeoutId(id);
    }
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  // adding new movie
  async function addMovieHandler(movie) {
    setError(null);
    try {
      const response = await fetch(
        "https://fetch-movies-74fbf-default-rtdb.firebaseio.com/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: {
            "Content-Type": "aplication/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong while adding the Movie");
      }
      fetchMoviesHandler();
    } catch (error) {
      setError(error.message);
    }
  }
  // deleting the movie
  async function deleteMovieHandler(id) {
    setError(null);
    try {
      const response = await fetch(
        `https://fetch-movies-74fbf-default-rtdb.firebaseio.com/movies/${id}.json`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Something went wrong while deleting the movie");
      }
      fetchMoviesHandler();
    } catch (error) {
      setError(error.message);
    }
  }
  // cancel button handler
  function cancelHandler() {
    setError(null);
    setIsLoading(false);
    clearTimeout(timeoutId);
  }
  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} ondelete={deleteMovieHandler} />;
  }
  if (error) {
    content = (
      <p>
        {error}
        <br />
        <br />
        <button onClick={cancelHandler}>Cancel</button>
      </p>
    );
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }
  return (
    <React.Fragment>
      <section>
        <AddMovie movies={movies} onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;

// What do 5XX responses mean? Explain a few of them.

// How does try catch work?

// What happens when we throw an error?
