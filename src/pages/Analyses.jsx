import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Museum from '../components/Museum.jsx'
import { works } from '../data/works.js'
import { drawCover, onCoverImageLoad } from '../lib/cover.js'

const P = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  home: <path d="M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  gallery: <><rect x="3" y="5" width="18" height="14" rx="2" /><circle cx="9" cy="10" r="1.6" /><path d="m21 16-5-5-8 8" /></>,
  bookmark: <path d="M6 3h12v18l-6-4-6 4z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></>,
  out: <><path d="M14 4h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-5" /><path d="M4 12h10M8 8l-4 4 4 4" /></>,
  sound: <><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M16.5 8.5a5 5 0 0 1 0 7" /></>,
  expand: <path d="M12 3v18M3 12h18M12 3l-3 3M12 3l3 3M12 21l-3-3M12 21l3-3M3 12l3-3M3 12l3 3M21 12l-3-3M21 12l-3 3" />,
  collapse: <><path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6" /><path d="m3 9 6-6M21 9l-6-6M3 15l6 6M21 15l-6 6" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  help: <><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7" /><circle cx="12" cy="17" r=".6" /></>,
  person: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3-5.5 7-5.5s7 2 7 5.5" /></>,
  left: <path d="m14 6-6 6 6 6" />,
  right: <path d="m10 6 6 6-6 6" />,
}
const Icon = ({ n, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[n]}</svg>
)

const analysisTabs = [
  ['summary', 'Summary'], ['formalist', 'Formalist Lens'], ['characters', 'Characters'],
  ['themes', 'Themes'], ['elements', 'Literary Elements'], ['context', 'Context'],
]

function AnalysisDetails({ work, tab, setTab }) {
  return <>
    <div className="analysis-tabs" role="tablist" aria-label={`${work.title} analysis sections`}>
      {analysisTabs.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>)}
    </div>
    <div className="analysis-content" role="tabpanel">
      {tab === 'summary' && <p className="dropcap">{work.summary}</p>}
      {tab === 'formalist' && <p className="dropcap">{work.formalist}</p>}
      {tab === 'characters' && <div className="analysis-grid">{work.characters.map(item => <section key={item.name}><h3>{item.name}</h3><p>{item.text}</p></section>)}</div>}
      {tab === 'themes' && <div className="analysis-grid">{work.themes.map(item => <section key={item.name}><h3>{item.name}</h3><p>{item.text}</p></section>)}</div>}
      {tab === 'elements' && <><p className="dropcap">{work.formalist}</p><div className="analysis-grid elements-grid">{work.elements.map(item => <section key={item.name}><h3>{item.name}</h3><p>{item.text}</p></section>)}</div><figure className="analysis-art"><img src={import.meta.env.BASE_URL + work.image} alt={`Featured artwork for ${work.title}`} /><figcaption><small>Visual study</small><h3>{work.title}</h3><p>The exhibit artwork extends the text’s central imagery and gives its conflict a visual form.</p></figcaption></figure></>}
      {tab === 'context' && <p className="dropcap">{work.context}</p>}
      <div className="analysis-closing"><blockquote><p>{work.quote}</p><cite>{work.citation}</cite></blockquote><aside><h3>My Insight</h3><p>{work.insight}</p></aside></div>
    </div>
  </>
}

export default function Analyses() {
  const nav = useNavigate()
  const [active, setActive] = useState(0)
  const small = typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches
  const touch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
  const [open, setOpen] = useState(!small)
  const [wide, setWide] = useState(false)
  const [help, setHelp] = useState(true)
  const [query, setQuery] = useState('')
  const [ci, setCi] = useState(0)
  const [pop, setPop] = useState(null)
  const [marks, setMarks] = useState([])
  const [speaking, setSpeaking] = useState(false)
  const [rotate, setRotate] = useState(true)
  const [narrate, setNarrate] = useState(false)
  const [fontTick, setFontTick] = useState(0)
  const [analysisTab, setAnalysisTab] = useState('summary')
  const input = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setHelp(false), 9000)
    document.fonts?.load('italic 28px "Bodoni Moda"').then(() => setFontTick(n => n + 1)).catch(() => {})
    const off = onCoverImageLoad(() => setFontTick(n => n + 1))
    return () => { document.body.style.overflow = ''; clearTimeout(t); window.speechSynthesis?.cancel(); off() }
  }, [])

  useEffect(() => {
    if (!wide) return
    const onKey = e => e.key === 'Escape' && setWide(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [wide])

  const covers = useMemo(() => works.map((w, i) => drawCover(w, i, 300, 400).toDataURL()), [fontTick])
  const w = works[active]

  const related = useMemo(() => {
    const others = works.map((x, i) => ({ ...x, i })).filter(x => x.i !== active)
    return others.sort((a, b) => (b.author === w.author) - (a.author === w.author))
  }, [active, w.author])
  const maxCi = Math.max(0, related.length - 1)

  const results = query.trim()
    ? works.map((x, i) => ({ ...x, i })).filter(x => `${x.title} ${x.author} ${x.lens}`.toLowerCase().includes(query.toLowerCase()))
    : []

  const stopSpeech = () => { window.speechSynthesis?.cancel(); setSpeaking(false) }
  const select = i => {
    stopSpeech()
    setActive(i); setOpen(true); setWide(false); setCi(0); setQuery(''); setPop(null); setAnalysisTab('summary')
    if (narrate) setTimeout(() => speak(i), 100)
  }
  const speak = (i = active) => {
    const s = window.speechSynthesis
    if (!s) return
    if (speaking) return stopSpeech()
    const x = works[i]
    const u = new SpeechSynthesisUtterance(`${x.title}, by ${x.author}. Summary. ${x.summary}. Formalist lens. ${x.formalist}. Context. ${x.context}`)
    u.onend = () => setSpeaking(false)
    s.cancel(); s.speak(u); setSpeaking(true)
  }
  const toggleMark = () => setMarks(m => (m.includes(active) ? m.filter(x => x !== active) : [...m, active]))

  return (
    <div className="museum" role="application" aria-label="Interactive VR literary museum">
      <Museum works={works} active={active} onSelect={select} onHotspot={() => setOpen(o => !o)} autoRotate={rotate} />

      <button className="round mnav mnav-l" aria-label="Previous exhibit" onClick={() => select((active - 1 + works.length) % works.length)}><Icon n="left" size={16} /></button>
      <button className="round mnav mnav-r" aria-label="Next exhibit" onClick={() => select((active + 1) % works.length)}><Icon n="right" size={16} /></button>

      <div className="spatial search-wrap">
        <label className="glass search-pill">
          <Icon n="search" />
          <input ref={input} id="museum-search" value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && results[0] && select(results[0].i)}
            placeholder={`Search for "${w.title}"`} autoComplete="off" />
        </label>
        {results.length > 0 && (
          <ul className="glass results">
            {results.map(r => <li key={r.i}><button onClick={() => select(r.i)}><b>{r.title}</b><span>{r.author}</span></button></li>)}
          </ul>
        )}
      </div>

      <aside className="spatial glass carousel" aria-label="Related works">
        <h2>MORE BY THIS AUTHOR / RELATED WORKS</h2>
        <div className="c-row">
          <button className="round" aria-label="Previous" onClick={() => setCi(c => Math.max(0, c - 1))}><Icon n="left" size={14} /></button>
          <div className="c-window">
            <div className="c-track" style={{ transform: `translateX(-${ci * 100}%)` }}>
              {related.map(r => (
                <button key={r.i} className="c-card" onClick={() => select(r.i)} title={r.title}>
                  <img src={covers[r.i]} alt={r.title} />
                  <b>{r.title}</b>
                  <span>{r.author}</span>
                </button>
              ))}
            </div>
          </div>
          <button className="round" aria-label="Next" onClick={() => setCi(c => Math.min(maxCi, c + 1))}><Icon n="right" size={14} /></button>
        </div>
        <div className="dots">{Array.from({ length: maxCi + 1 }, (_, k) => <i key={k} className={k === ci ? 'on' : ''} onClick={() => setCi(k)} style={{ cursor: 'pointer' }} />)}</div>
      </aside>

      {open && (
        <aside className="spatial panel exhibit-card" aria-label="Exhibit details">
          <div className="panel-actions">
            <div>
              <button className={`round ${speaking ? 'on' : ''}`} aria-label="Read aloud" onClick={() => speak()}><Icon n="sound" /></button>
              <button className={`round ${marks.includes(active) ? 'on' : ''}`} aria-label="Bookmark" onClick={toggleMark}><Icon n="bookmark" /></button>
            </div>
            <div>
              <button className="round" aria-label="Close" onClick={() => { setOpen(false); setWide(false) }}><Icon n="close" /></button>
              <button className="round" aria-label="Help" onClick={() => setHelp(h => !h)}><Icon n="help" /></button>
            </div>
          </div>
          <div className="glass panel-card">
            <img className="panel-img" src={covers[active]} alt={`Cover of ${w.title}`} />
            <div className="panel-body" key={active}>
              <h1>{w.title}</h1>
              <p className="by"><Icon n="person" size={15} /> {w.author}</p>
              <button type="button" className="read-analysis-btn" onClick={() => setWide(true)}>Read Full Analysis <span aria-hidden="true">↗</span></button>
              <div className="analysis-tabs" role="tablist" aria-label={`${w.title} analysis sections`}>
                {analysisTabs.map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={analysisTab === id} className={analysisTab === id ? 'active' : ''} onClick={() => setAnalysisTab(id)}>{label}</button>)}
              </div>
              <div className="analysis-content" role="tabpanel">
                {analysisTab === 'summary' && <p className="dropcap">{w.summary}</p>}
                {analysisTab === 'formalist' && <p className="dropcap">{w.formalist}</p>}
                {analysisTab === 'characters' && <div className="analysis-grid">{w.characters.map(item => <section key={item.name}><h3>{item.name}</h3><p>{item.text}</p></section>)}</div>}
                {analysisTab === 'themes' && <div className="analysis-grid">{w.themes.map(item => <section key={item.name}><h3>{item.name}</h3><p>{item.text}</p></section>)}</div>}
                {analysisTab === 'elements' && <>
                  <p className="dropcap">{w.formalist}</p>
                  <div className="analysis-grid elements-grid">{w.elements.map(item => <section key={item.name}><h3>{item.name}</h3><p>{item.text}</p></section>)}</div>
                  <figure className="analysis-art">
                    <img src={import.meta.env.BASE_URL + w.image} alt={`Featured artwork for ${w.title}`} />
                    <figcaption><small>Visual study</small><h3>{w.title}</h3><p>The exhibit artwork extends the text’s central imagery and gives its conflict a visual form.</p></figcaption>
                  </figure>
                </>}
                {analysisTab === 'context' && <p className="dropcap">{w.context}</p>}
                <div className="analysis-closing">
                  <blockquote><p>{w.quote}</p><cite>{w.citation}</cite></blockquote>
                  <aside><h3>My Insight</h3><p>{w.insight}</p></aside>
                </div>
              </div>
            </div>
          </div>
        </aside>
      )}

      {wide && (
        <div className="analysis-modal" role="presentation" onMouseDown={e => e.target === e.currentTarget && setWide(false)}>
          <section className="analysis-dialog glass" role="dialog" aria-modal="true" aria-labelledby="analysis-title">
            <header><div><small>Complete literary analysis</small><h1 id="analysis-title">{w.title}</h1><p className="by"><Icon n="person" size={15} /> {w.author}</p></div><button className="round" aria-label="Close full analysis" onClick={() => setWide(false)}><Icon n="close" /></button></header>
            <AnalysisDetails work={w} tab={analysisTab} setTab={setAnalysisTab} />
          </section>
        </div>
      )}

      {help && (
        <div className="glass hint">{touch ? 'Drag to look around · Pinch to zoom · Tap an exhibit or the white dot · Use ‹ › to switch' : 'Drag to look around · W A S D to walk · Click an exhibit or the white dot · Use the headset button (bottom right) for VR'}</div>
      )}

      <nav className="spatial glass dock" aria-label="Museum navigation">
        <div className="logo"><span className="museum-mark">VII</span><span>Seven Chronicles</span></div>
        <span className="sep" />
        <button className="dock-btn chapter-btn" aria-label="The Threshold" title="The Threshold" onClick={() => nav('/')}><i aria-hidden="true">⌂</i><span>The Threshold</span></button>
        <button className="dock-btn chapter-btn" aria-label="The Reader" title="The Reader" onClick={() => nav('/profile')}><i aria-hidden="true">◈</i><span>The Reader</span></button>
        <button className="dock-btn chapter-btn on" aria-current="page" aria-label="Seven Works" title="Seven Works"><i aria-hidden="true">✦</i><span>Seven Works</span></button>
        <button className="dock-btn chapter-btn" aria-label="The Odyssey" title="The Odyssey" onClick={() => nav('/favorite')}><i aria-hidden="true">≈</i><span>The Odyssey</span></button>
        <button className="dock-btn chapter-btn" aria-label="The Learning" title="The Learning" onClick={() => nav('/summary')}><i aria-hidden="true">⌘</i><span>The Learning</span></button>
        <button className="dock-btn chapter-btn" aria-label="The Reflection" title="The Reflection" onClick={() => nav('/reflection')}><i aria-hidden="true">☼</i><span>The Reflection</span></button>
        <span className="sep" />
        <div className="bookmark-wrap">
          <button className={`dock-btn bookmark-btn${pop === 'bookmarks' ? ' on' : ''}`} aria-label="Bookmarks" title="Bookmarks" aria-expanded={pop === 'bookmarks'} onClick={() => setPop(p => (p === 'bookmarks' ? null : 'bookmarks'))}><Icon n="bookmark" /><span>Bookmarks{marks.length ? ` (${marks.length})` : ''}</span></button>
          {pop === 'bookmarks' && <div className="glass popover bookmark-popover">{marks.length ? marks.map(i => <button key={i} onClick={() => select(i)}>{works[i].title}</button>) : <p>No bookmarks yet. Use the bookmark button on an exhibit card.</p>}</div>}
        </div>
      </nav>
    </div>
  )
}
