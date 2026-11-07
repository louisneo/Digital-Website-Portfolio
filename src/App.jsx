import { useEffect } from 'react'
import { NavLink, Link, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import Analyses from './pages/Analyses.jsx'
import Favorite from './pages/Favorite.jsx'
import Summary from './pages/Summary.jsx'
import Reflection from './pages/Reflection.jsx'
import MuseumPage from './pages/MuseumPage.jsx'

const I = d => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
)

const links = [
  ['/', 'Home', I(<path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" />)],
  ['/analyses', 'Analyses', I(<><path d="M4 4h6a2 2 0 012 2v14a2 2 0 00-2-2H4z" /><path d="M20 4h-6a2 2 0 00-2 2v14a2 2 0 012-2h6z" /></>)],
  ['/favorite', 'Masterpiece', I(<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" />)],
  ['/summary', 'Learning', I(<><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" /></>)],
  ['/reflection', 'Reflection', I(<><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>)],
  ['/profile', 'Profile', I(<><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>)],
]

export default function App() {
  const { pathname } = useLocation()

  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  useEffect(() => { document.title = 'Myth & Mind | A Great Books Digital Portfolio' }, [])

  if (pathname === '/museum') return <MuseumPage />

  return (
    <div className="app">
      <a className="skip" href="#main">Skip to content</a>
      <nav className="rail" aria-label="Main">
        <Link to="/" className="rail-logo" aria-label="Myth & Mind home">
          <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 26V8l11 11L27 8v18" /><circle cx="16" cy="6" r="2" /></svg>
        </Link>
        <ul className="rail-nav">
          {links.map(([to, label, icon]) => (
            <li key={to}>
              <NavLink to={to} end={to === '/'} aria-label={label}>
                {icon}<span className="rail-tip">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        <Link to="/museum" className="rail-museum" aria-label="3D Museum">
          {I(<path d="M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7M2 10l10-6 10 6z" />)}
          <span className="rail-tip">3D Museum</span>
        </Link>
      </nav>

      <main id="main" className="content" key={pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyses" element={<Analyses />} />
          <Route path="/favorite" element={<div className="page"><Favorite /></div>} />
          <Route path="/masterpiece" element={<div className="page"><Favorite /></div>} />
          <Route path="/summary" element={<div className="page"><Summary /></div>} />
          <Route path="/learning" element={<div className="page"><Summary /></div>} />
          <Route path="/reflection" element={<div className="page"><Reflection /></div>} />
          <Route path="/profile" element={<div className="page"><Profile /></div>} />
          <Route path="*" element={<div className="page"><h1>Page not found</h1><p><Link to="/">Back to home</Link></p></div>} />
        </Routes>

        <footer className="foot">
          <p className="foot-brand">Myth &amp; Mind</p>
          <p>A Great Books Digital Portfolio by Louis Neo M. Lok · BS Information Technology · University of Nueva Caceres</p>
          <p className="foot-small">Artwork is credited where known and used for educational purposes.</p>
        </footer>
      </main>
    </div>
  )
}
