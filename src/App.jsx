import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import ErrorBoundary from './components/errorboundary';
import ScrollToTop from './components/scrolltotop';
import WatchlistProvider from './components/watchlistprovider';
import Home from './pages/home';
import Search from './pages/search';
import Movie from './pages/movie';
import Watchlist from './pages/watchlist';
import NotFound from './pages/notfound';
import './App.css';

function AppShell() {
  return (
    <div className="app-layout">
      <Navbar />

      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <WatchlistProvider>
      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          {/* Outside AppShell on purpose: the 404 takes the full screen
              instead of sitting between the navbar and the footer. */}
          <Route path="*" element={<NotFound />} />

          <Route element={<AppShell />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/watchlist" element={<Watchlist />} />
            <Route path="/movie/:movieId" element={<Movie />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </WatchlistProvider>
  );
}

export default App;
