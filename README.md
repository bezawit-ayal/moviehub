# MovieHub

MovieHub is a responsive movie discovery web application built with React and the TMDB API.

It allows users to discover movies, search for specific titles, explore movie details, manage a personal watchlist, and watch available movie trailers.

## Features

- Browse trending movies
- Explore popular movies
- View top-rated movies
- Discover upcoming movies
- Search for movies
- Filter movies by genre
- Filter movies by release year
- Filter movies by rating
- View detailed movie information
- View movie ratings, genres, runtime, and overview
- Watch available movie trailers
- Add movies to a personal watchlist
- Remove movies from the watchlist
- Recent search history
- Responsive design for desktop, tablet, and mobile
- Loading states and error handling

## Tech Stack

- React
- JavaScript
- React Router
- Vite
- TMDB API
- CSS
- Lucide React
- LocalStorage

## Project Structure

```text
MovieHub/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── moviecard.jsx
│   │   ├── moviegrid.jsx
│   │   ├── searchbar.jsx
│   │   └── skeletongrid.jsx
│   │
│   ├── pages/
│   │   ├── home.jsx
│   │   ├── search.jsx
│   │   ├── discover.jsx
│   │   ├── moviedetails.jsx
│   │   └── watchlist.jsx
│   │
│   ├── services/
│   │   └── tmdbapi.js
│   │
│   ├── app.jsx
│   ├── app.css
│   └── main.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
└── README.md