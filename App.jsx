import { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate, useSearchParams } from 'react-router-dom';
import HotelListPage from './pages/HotelListPage';
import HotelDetailPage from './pages/HotelDetailPage';
import HotelFormPage from './pages/HotelFormPage';

function Header() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [text, setText] = useState('');

  useEffect(() => { setText(params.get('q') || ''); }, [params]);

  const submit = (e) => {
    e.preventDefault();
    const q = text.trim();
    navigate(q ? `/?q=${encodeURIComponent(q)}` : '/');
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo"><span className="logo-dot" /> NEXA<b>STAY</b></Link>

      <form className="search" onSubmit={submit} role="search">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search hotels by title…"
          aria-label="Search hotels by title"
        />
        <button type="submit" aria-label="Search">⌕</button>
      </form>

      <div className="nav-actions">
        <Link to="/hotels/new" className="btn btn-primary">+ Add Hotel</Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <div className="logo"><span className="logo-dot" /> NEXA<b>STAY</b></div>
          <p className="muted">Smart hotel discovery. Search, filter and explore stays on the map.</p>
        </div>
        <div>
          <h5>Explore</h5>
          <Link to="/">All hotels</Link>
          <Link to="/?sort=price_asc">Lowest price</Link>
          <Link to="/?sort=price_desc">Luxury first</Link>
          <Link to="/hotels/new">Add a hotel</Link>
        </div>
        <div>
          <h5>Built with</h5>
          <span>React + Redux Toolkit</span>
          <span>Node.js + Express</span>
          <span>PostgreSQL (native SQL)</span>
          <span>Leaflet maps</span>
        </div>
        <div>
          <h5>Newsletter</h5>
          <p className="muted">Get the latest hotel updates.</p>
          <form className="news" onSubmit={(e) => { e.preventDefault(); e.target.reset(); alert('Subscribed!'); }}>
            <input type="email" placeholder="Email" required aria-label="Email" />
            <button className="btn btn-primary">Join</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">© 2026 NexaStay · Hotel List Page task</div>
    </footer>
  );
}

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <>
      <Header theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <main className="container">
        <Routes>
          <Route path="/" element={<HotelListPage />} />
          <Route path="/hotels/new" element={<HotelFormPage />} />
          <Route path="/hotels/:id" element={<HotelDetailPage />} />
          <Route path="/hotels/:id/edit" element={<HotelFormPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}