import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { works } from '../data/works.js'
import { meta, roman } from '../data/meta.js'
import BookCover from '../components/BookCover.jsx'

const tabs = ['Overview', 'Characters', 'Themes', 'Literary Elements', 'My Reading']

function Cards({ items }) {
  return (
    <div className="lib-cards">
      {items.map(x => (
        <article key={x.name} className="lib-card">
          <h4>{x.name}</h4>
          <p>{x.text}</p>
        </article>
      ))}
    </div>
  )
}

export default function Analyses() {
  const [params, setParams] = useSearchParams()
  const found = meta.findIndex(m => m.id === params.get('work'))
  const idx = found < 0 ? 0 : found
  const w = works[idx]
  const m = meta[idx]
  const [tab, setTab] = useState(0)
  const detailRef = useRef(null)

  useEffect(() => { setTab(0) }, [idx])

  const pick = i => {
    setParams({ work: meta[i].id })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const readMore = () => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="lib">
      <section className="lib-panel" aria-labelledby="lib-title">
        <div className="lib-feature" key={m.id}>
          <div className="lib-copy">
            <p className="lib-kicker">Work {roman[idx]} of VII · {m.era}</p>
            <h1 id="lib-title" className="lib-title">{w.title}</h1>
            <p className="lib-by">
              <span>By</span> {w.author}
              <span className="lib-gap">Read through</span> {m.lens} lens
            </p>
            <p className="lib-stats">
              <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" /></svg>{m.date}</span>
              <span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></svg>{m.length}</span>
            </p>
            <p className="lib-desc"><b>{m.hook}</b> {w.summary}</p>
            <div className="lib-actions">
              <button type="button" className="btn-gold" onClick={readMore}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" /></svg>Read the analysis
              </button>
              <Link className="btn-dark" to="/museum">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7M2 10l10-6 10 6z" /></svg>View in 3D museum
              </Link>
            </div>
          </div>
          <div className="lib-cover">
            <BookCover work={w} meta={m} size="lg" />
          </div>
        </div>
        <h2 className="lib-shelf-title">More works in the collection</h2>
      </section>

      <div className="lib-shelf" role="list" aria-label="Other works">
        {works.map((wk, i) => i === idx ? null : (
          <button key={meta[i].id} type="button" role="listitem" className="lib-shelf-item" onClick={() => pick(i)} aria-label={`Open ${wk.title}`}>
            <BookCover work={wk} meta={meta[i]} size="sm" />
            <span className="lib-shelf-label">{roman[i]} · {meta[i].short}</span>
          </button>
        ))}
      </div>

      <section ref={detailRef} className="lib-detail" aria-labelledby="detail-title">
        <div className="lib-detail-main">
          <p className="lib-kicker">Close reading</p>
          <h2 id="detail-title" className="lib-detail-title">{w.title}</h2>
          <div className="lib-tabs" role="tablist" aria-label={`${w.title} analysis`}>
            {tabs.map((t, i) => (
              <button key={t} type="button" role="tab" id={`tab-${i}`} aria-controls={`panel-${i}`} aria-selected={tab === i} className="lib-tab" onClick={() => setTab(i)}>
                {t}
              </button>
            ))}
          </div>

          <div className="lib-panelbody" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} key={`${m.id}-${tab}`}>
            {tab === 0 && (
              <>
                <h3>The story</h3>
                <p>{w.summary}</p>
                <h3>Through the {m.lens} lens</h3>
                <p>{w.formalist}</p>
                <h3>Historical and cultural context</h3>
                <p>{w.context}</p>
              </>
            )}
            {tab === 1 && <Cards items={w.characters} />}
            {tab === 2 && <Cards items={w.themes} />}
            {tab === 3 && <Cards items={w.elements} />}
            {tab === 4 && (
              <>
                <blockquote className="lib-quote">
                  <p>{w.quote}</p>
                  <cite>{w.citation}</cite>
                </blockquote>
                <h3>What I took from it</h3>
                <p>{w.insight}</p>
              </>
            )}
          </div>

          <div className="lib-pager">
            <button type="button" className="btn-dark" onClick={() => pick((idx + 6) % 7)}>← {meta[(idx + 6) % 7].short}</button>
            <button type="button" className="btn-dark" onClick={() => pick((idx + 1) % 7)}>{meta[(idx + 1) % 7].short} →</button>
          </div>
        </div>

        <aside className="lib-facts" aria-label="Catalogue details">
          <h3>Catalogue card</h3>
          <dl>
            <div><dt>Original title</dt><dd lang="und">{m.orig} <small>({m.origLang})</small></dd></div>
            <div><dt>Author</dt><dd>{w.author}</dd></div>
            <div><dt>Date</dt><dd>{m.date}</dd></div>
            <div><dt>Tradition</dt><dd>{m.era}</dd></div>
            <div><dt>Form</dt><dd>{m.form}</dd></div>
            <div><dt>Length</dt><dd>{m.length}</dd></div>
            <div><dt>Lens</dt><dd>{m.lens}</dd></div>
            <div><dt>Cover art</dt><dd>{m.credit}</dd></div>
          </dl>
          <p className="lib-hook">“{m.hook}”</p>
        </aside>
      </section>
    </div>
  )
}
