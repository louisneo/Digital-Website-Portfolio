import { works } from '../data/works.js'

export default function Analyses() {
  return (
    <>
      <h1>Seven Literary Analyses</h1>
      <p className="quote" style={{ marginTop: '1rem' }}>Edit authors and lenses in src/data/works.js, and paste your analyses below.</p>
      <div className="grid" id="index">
        {works.map((w, i) => (
          <a key={w.title} className="card" href={`#a${i + 1}`} onClick={e => { e.preventDefault(); document.getElementById(`a${i + 1}`)?.scrollIntoView({ behavior: 'smooth' }) }}>
            <span className="num">ANALYSIS {String(i + 1).padStart(2, '0')}</span>
            <h3>{w.title}</h3><p>{w.author}</p><span className="tag">{w.lens}</span>
          </a>
        ))}
      </div>
      {works.map((w, i) => (
        <article key={w.title} id={`a${i + 1}`} className="fade">
          <p className="eyebrow">Analysis {i + 1}</p>
          <h2>{w.title}</h2>
          <p className="meta">Author: <span>{w.author}</span> &middot; Lens: <span>{w.lens}</span></p>
          <img src={`analysis-${i + 1}.jpg`} alt={`Visual representation of ${w.title}`} onError={e => e.currentTarget.remove()} />
          <p className="todo">[Paste your complete literary analysis of {w.title} here. You may improve grammar and organization without changing the substance.]</p>
          <a href="#index" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>&uarr; Back to top</a>
        </article>
      ))}
    </>
  )
}
