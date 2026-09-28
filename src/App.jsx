import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import Navbar from './components/navbar';
import Footer from './components/footer';
import ErrorBoundary from './components/errorboundary';
import Home from './pages/home';
import Search from './pages/search';
import Discover from './pages/discover';
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
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
