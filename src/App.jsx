import { useEffect } from 'react'
import { NavLink, Link, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import Analyses from './pages/Analyses.jsx'
import Favorite from './pages/Favorite.jsx'
import Summary from './pages/Summary.jsx'
import Reflection from './pages/Reflection.jsx'

const links = [['/', 'Home'], ['/profile', 'Profile'], ['/analyses', 'Analyses'], ['/favorite', 'Favorite'], ['/summary', 'Summary'], ['/reflection', 'Reflection']]

export default function App() {
  const { pathname } = useLocation()
  // Scroll to top and reveal .fade elements on each route change
  useEffect(() => {
    window.scrollTo(0, 0)
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('show')), { threshold: 0.1 })
    document.querySelectorAll('.fade').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

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
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/analyses" element={<Analyses />} />
          <Route path="/favorite" element={<Favorite />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/reflection" element={<Reflection />} />
        </Routes>
      </main>
      <footer>My Literary Journey: A Great Books Digital Portfolio &middot; Images: Wikimedia Commons / own work &middot; Replace highlighted text with your own content.</footer>
    </>
  )
}
