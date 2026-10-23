import { Link } from 'react-router-dom'

const sections = [
  ['/profile', '01', 'Student Profile', 'Who I am as a reader.'],
  ['/analyses', '02', 'Seven Literary Analyses', 'Masterpieces, lenses, and interpretations.'],
  ['/favorite', '03', 'Favorite Masterpiece', 'The work that moved me most.'],
  ['/summary', '04', 'Summary of Learning', 'Knowledge, concepts, and skills gained.'],
  ['/reflection', '05', 'Personal Reflection', 'My growth as a reader and thinker.'],
]

export default function Home() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Great Books &middot; Final Project</p>
        <h1>My Literary Journey</h1>
        <p className="quote">&ldquo;A reader lives a thousand lives before he dies.&rdquo; &mdash; George R. R. Martin</p>
        <p>A Great Books Digital Portfolio by <span className="todo">[Your Full Name]</span></p>
        <Link className="btn" to="/analyses">Explore the Analyses</Link>
      </section>
      <section className="fade">
        <h2>Portfolio Sections</h2>
        <div className="grid">
          {sections.map(([to, n, t, d]) => (
            <Link key={to} className="card" to={to}><span className="num">{n}</span><h3>{t}</h3><p>{d}</p></Link>
          ))}
        </div>
      </section>
    </>
  )
}
