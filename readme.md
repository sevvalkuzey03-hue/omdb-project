# OMDB Movie Finder

This project is a responsive Single Page Application that displays movie details using the OMDB API.

## Features

- Search by movie title (`Title`, `Year`, `Genre`, `Director`, `Poster`)
- Clear handling of API errors and "movie not found" cases
- Restores the last search after refresh using `localStorage`
- Reduces repeated API calls with a simple cache mechanism
- Fully responsive layout for mobile and desktop

## Usage

1. Open the project.
2. Run `index.html` in your browser.
3. Enter an OMDB API key (optional if you use mock data).
4. Enter a movie title and click `Search`.

> Get an OMDB API key here: [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)

## GitHub Pages Deploy

1. Push this project to your own GitHub repository.
2. Go to repository settings: `Settings -> Pages`.
3. Choose `Deploy from a branch` as the source.
4. Select the `main` branch and `/root` folder, then save.
5. After a few minutes, open the published URL.
