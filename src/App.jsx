import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Footer from './components/footer';

import Home from './pages/home';
import Search from './pages/search';
import Discover from './pages/discover';
import MovieDetails from './pages/moviedetails';
import Watchlist from './pages/watchlist';
import './app.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route
            path="/movie/:id"
            element={<MovieDetails />}
          />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;