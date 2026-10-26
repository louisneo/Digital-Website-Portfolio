import { useEffect } from 'react'
import { NavLink, Link, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import Analyses from './pages/Analyses.jsx'
import Favorite from './pages/Favorite.jsx'
import Summary from './pages/Summary.jsx'
import Reflection from './pages/Reflection.jsx'

const links = [['/', 'Home'], ['/profile', 'Profile'], ['/analyses', 'Analyses'], ['/favorite', 'Favorite'], ['/summary', 'Summary'], ['/reflection', 'Reflection']]

const icon = d => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)
const icons = {
  home: icon(<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10" />),
  works: icon(<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5M9 7h6" />),
  analyses: icon(<path d="M12 2l9 5v10l-9 5-9-5V7zM12 12l9-5M12 12v10M12 12L3 7" />),
  about: icon(<path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" />),
}

const Credit = () => (
  <>My Literary Journey: A Great Books Digital Portfolio &middot; Images: Wikimedia Commons / own work</>
)

function Dock({ pathname, search }) {
  const works = pathname === '/' && search.includes('s=works')
  const items = [
    ['/', 'Home', icons.home, pathname === '/' && !works],
    ['/?s=works', 'Works', icons.works, works],
    ['/analyses', 'Analyses', icons.analyses, false],
    ['/profile', 'About', icons.about, pathname === '/profile'],
  ]
  return (
    <div className="g-dock glass" role="navigation" aria-label="Main">
      {items.map(([to, label, ic, on]) => (
        <Link key={label} to={to} className={`g-dock-item${on ? ' active' : ''}`} aria-current={on ? 'page' : undefined}>
          {ic}
          <span>{label}</span>
        </Link>
      ))}
    </div>
  )
}

export default function App() {
  const { pathname, search } = useLocation()
  const isAnalyses = pathname === '/analyses'

  // Scroll to top (or to the works section) and reveal elements on each route change
  useEffect(() => {
    if (pathname === '/' && search.includes('s=works')) {
      const t = setTimeout(() => document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' }), 60)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, search])

  useEffect(() => {
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('show')), { threshold: 0.1 })
    document.querySelectorAll('.fade, .reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  // The Analyses page keeps its original layout and styles.
  if (isAnalyses) {
    return (
      <>
        <nav>
          <Link className="brand" to="/">My Literary Journey</Link>
          <ul>
            {links.map(([to, t]) => (
              <li key={to}><NavLink to={to} end className={({ isActive }) => (isActive ? 'active' : '')}>{t}</NavLink></li>
            ))}
          </ul>
        </nav>
        <main>
          <Routes>
            <Route path="/analyses" element={<Analyses />} />
          </Routes>
        </main>
        <footer><Credit /></footer>
      </>
    )
  }

  return (
    <div className="glass-site">
      <div className="g-bg" aria-hidden="true">
        <div className="g-bg-img" />
        <div className="g-bg-shade" />
        <i className="blob b1" />
        <i className="blob b2" />
        <i className="blob b3" />
      </div>
      <Link className="g-brand glass" to="/">
        <span className="g-brand-dot" aria-hidden="true" />
        My Literary Journey
      </Link>
      <main>
        <div className="g-page" key={pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorite" element={<Favorite />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="/reflection" element={<Reflection />} />
          </Routes>
        </div>
      </main>
      <footer>
        <p className="g-foot-links">
          <Link to="/favorite">Favorite</Link>
          <Link to="/summary">Summary</Link>
          <Link to="/reflection">Reflection</Link>
        </p>
        <p><Credit /></p>
        <p>
          Background: J. M. W. Turner, <i>Ulysses Deriding Polyphemus</i> (1829), National Gallery, London, via Wikimedia Commons (public domain).
        </p>
      </footer>
      <Dock pathname={pathname} search={search} />
    </div>
  )
}
