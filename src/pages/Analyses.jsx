import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { works } from '../data/works.js'
import { meta, roman } from '../data/meta.js'
import { fullSummaries } from '../data/full_summaries.js'
import BookCover from '../components/BookCover.jsx'

const tabs = ['Summary', 'Formalist Lens', 'Characters', 'Themes', 'Literary Elements', 'Context']

function Cards({ items }) {
  return (
    <div className="lib-cards">
      {items.map((x, i) => (
        <article key={x.name} className="lib-card" style={{ animationDelay: `${i * 60}ms` }}>
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

  const paragraphs = fullSummaries[w.title] || [w.summary]

  return (
    <div className="lib">
      {/* Featured Header Panel */}
      <section className="lib-panel" aria-labelledby="lib-title">
        <div className="lib-feature" key={m.id}>
          <div className="lib-copy">
            <p className="lib-kicker">WORK {roman[idx]} OF VII · {m.era.toUpperCase()}</p>
            <h1 id="lib-title" className="lib-title">{w.title}</h1>
            <p className="lib-by">
              <span>By</span> {w.author}
              <span className="lib-gap">Read through</span> <strong>{m.lens}</strong> lens
            </p>
            <p className="lib-stats">
              <span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" /></svg>{m.date}</span>
              <span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></svg>{m.length}</span>
            </p>
            <p className="lib-desc"><b>{m.hook}</b> {w.summary}</p>
            <div className="lib-actions">
              <button type="button" className="btn-gold" onClick={readMore}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4l13 8-13 8z" /></svg>READ THE ANALYSIS
              </button>
              <Link className="btn-dark" to="/museum">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7M2 10l10-6 10 6z" /></svg>VIEW IN 3D MUSEUM
              </Link>
            </div>
          </div>
          <div className="lib-cover">
            <BookCover work={w} meta={m} size="lg" />
          </div>
        </div>
        <h2 className="lib-shelf-title">MORE WORKS IN THE COLLECTION</h2>
      </section>

      {/* Book Covers Shelf */}
      <div className="lib-shelf" role="list" aria-label="Other works">
        {works.map((wk, i) => i === idx ? null : (
          <button key={meta[i].id} type="button" role="listitem" className="lib-shelf-item" onClick={() => pick(i)} aria-label={`Open ${wk.title}`}>
            <BookCover work={wk} meta={meta[i]} size="sm" />
            <span className="lib-shelf-label">{roman[i]} · {meta[i].short}</span>
          </button>
        ))}
      </div>

      {/* In-Depth Reader Section with Tabs matching Reference Image */}
      <section ref={detailRef} className="lib-detail" aria-labelledby="detail-title">
        <div className="lib-detail-main">
          <div className="lib-tabs" role="tablist" aria-label={`${w.title} analysis`}>
            {tabs.map((t, i) => (
              <button
                key={t}
                type="button"
                role="tab"
                id={`tab-${i}`}
                aria-controls={`panel-${i}`}
                aria-selected={tab === i}
                className="lib-tab"
                onClick={() => setTab(i)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="lib-panelbody" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} key={`${m.id}-${tab}`}>
            {tab === 0 && (
              <div className="summary-editorial-layout">
                <div className="editorial-prose">
                  {paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className={pIdx === 0 ? 'drop-cap-p' : ''}>
                      {pIdx === 0 ? (
                        <>
                          <span className="drop-cap">{p.charAt(0)}</span>
                          {p.slice(1)}
                        </>
                      ) : (
                        p
                      )}
                    </p>
                  ))}
                </div>

                {/* Curatorial Story Dossier & Masterpiece Artwork */}
                <aside className="summary-dossier-card" aria-label={`${w.title} curatorial dossier`}>
                  <div className="dossier-art-frame">
                    <img
                      src={import.meta.env.BASE_URL + w.image}
                      alt={m.credit || w.title}
                      className="dossier-art-img"
                      loading="lazy"
                    />
                    <div className="dossier-art-badge">
                      <span className="art-era-tag">{m.era}</span>
                      <span className="art-date-tag">{m.date}</span>
                    </div>
                  </div>
                  <p className="dossier-art-caption">
                    <strong>Artwork:</strong> {m.credit}
                  </p>

                  <div className="dossier-divider" />

                  <div className="dossier-section">
                    <h4 className="dossier-heading">Core Dramatic Tension</h4>
                    <p className="dossier-conflict">“{m.hook}”</p>
                  </div>

                  <div className="dossier-section">
                    <h4 className="dossier-heading">Pivotal Figures</h4>
                    <div className="dossier-chips-wrap">
                      {w.characters?.slice(0, 4).map(c => (
                        <span key={c.name} className="dossier-chip char-chip" title={c.text}>
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="dossier-section">
                    <h4 className="dossier-heading">Dominant Motifs</h4>
                    <div className="dossier-chips-wrap">
                      {w.themes?.slice(0, 4).map(t => (
                        <span key={t.name} className="dossier-chip theme-chip" title={t.text}>
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="dossier-footer">
                    <Link to="/museum" className="btn-dossier-museum">
                      <svg viewBox="0 0 24 24" aria-hidden="true" width="14" height="14" fill="currentColor">
                        <path d="M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7M2 10l10-6 10 6z" />
                      </svg>
                      Explore in 3D Gallery →
                    </Link>
                  </div>
                </aside>
              </div>
            )}

            {tab === 1 && (
              <div className="editorial-prose">
                <h3 className="section-subhead">Formalist &amp; Structural Architecture</h3>
                <p className="lead-text">{w.formalist}</p>
                <div className="craft-highlight-box">
                  <h4>Narrative Technique</h4>
                  <p>Through careful arrangement of framing, repetition, and verbal balance, the form itself embodies the thematic crisis of the work.</p>
                </div>
              </div>
            )}

            {tab === 2 && <Cards items={w.characters} />}
            {tab === 3 && <Cards items={w.themes} />}
            {tab === 4 && <Cards items={w.elements} />}

            {tab === 5 && (
              <div className="editorial-prose">
                <h3 className="section-subhead">Historical &amp; Cultural Milieu</h3>
                <p className="lead-text">{w.context}</p>
                <div className="facts-matrix">
                  <div>
                    <span className="matrix-label">Original Language</span>
                    <strong>{m.origLang} ({m.orig})</strong>
                  </div>
                  <div>
                    <span className="matrix-label">Historical Era</span>
                    <strong>{m.era}</strong>
                  </div>
                  <div>
                    <span className="matrix-label">Approximate Composition</span>
                    <strong>{m.date}</strong>
                  </div>
                  <div>
                    <span className="matrix-label">Preserved Length</span>
                    <strong>{m.length}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Dual Quote & Insight Grid matching user's Image 1 */}
          <div className="dual-reflection-row">
            <blockquote className="editorial-quote-box">
              <p className="quote-text">{w.quote}</p>
              <cite className="quote-cite">{w.citation}</cite>
            </blockquote>

            <div className="editorial-insight-card">
              <span className="insight-eyebrow">MY INSIGHT</span>
              <p className="insight-text">{w.insight}</p>
            </div>
          </div>

          {/* Previous / Next Nav */}
          <div className="lib-pager">
            <button type="button" className="btn-dark" onClick={() => pick((idx + 6) % 7)}>
              ← {meta[(idx + 6) % 7].short}
            </button>
            <button type="button" className="btn-dark" onClick={() => pick((idx + 1) % 7)}>
              {meta[(idx + 1) % 7].short} →
            </button>
          </div>
        </div>

        {/* Fact Card Sidebar */}
        <aside className="lib-facts" aria-label="Catalogue details">
          <h3>Catalogue Card</h3>
          <dl>
            <div><dt>Original Title</dt><dd lang="und">{m.orig} <small>({m.origLang})</small></dd></div>
            <div><dt>Author</dt><dd>{w.author}</dd></div>
            <div><dt>Date</dt><dd>{m.date}</dd></div>
            <div><dt>Tradition</dt><dd>{m.era}</dd></div>
            <div><dt>Form</dt><dd>{m.form}</dd></div>
            <div><dt>Length</dt><dd>{m.length}</dd></div>
            <div><dt>Primary Lens</dt><dd>{m.lens}</dd></div>
            <div><dt>Cover Artwork</dt><dd>{m.credit}</dd></div>
          </dl>
          <p className="lib-hook">“{m.hook}”</p>
        </aside>
      </section>
    </div>
  )
}
