import { useState } from 'react'
import { Link } from 'react-router-dom'
import { works } from '../data/works.js'

const img = file => import.meta.env.BASE_URL + file

const context = {
  'Voice out of the Whirlwind': { short: 'Job', date: 'c. 6th–4th century BCE', era: 'Wisdom literature', summary: 'A searching dialogue about suffering, justice, human limits, and the mystery of the divine.' },
  'The Iliad': { short: 'Iliad', date: 'c. 750 BCE', era: 'Ancient Greece', summary: 'Homer’s poem of Achilles examines rage, honor, grief, and the human cost of war.' },
  'The Odyssey': { short: 'Odyssey', date: 'c. 700 BCE', era: 'Ancient Greece', summary: 'A homecoming shaped by wit, temptation, identity, endurance, and the pull of family.' },
  'The Ramayana': { short: 'Ramayana', date: 'c. 5th century BCE–3rd century CE', era: 'Ancient India', summary: 'An epic journey through duty, loyalty, exile, devotion, and the demands of righteous action.' },
  'The Mahabharata': { short: 'Mahabharata', date: 'c. 4th century BCE–4th century CE', era: 'Ancient India', summary: 'A vast family conflict that asks what duty means when every available choice carries a cost.' },
  'The Panchatantra': { short: 'Panchatantra', date: 'c. 3rd century BCE–3rd century CE', era: 'Classical India', summary: 'Interlocking animal fables turn practical wisdom, friendship, strategy, and leadership into memorable stories.' },
  'The Song of Roland': { short: 'Roland', date: 'c. 1100 CE', era: 'Medieval France', summary: 'A heroic song about courage, loyalty, pride, sacrifice, and the making of cultural memory.' },
}

const orderedTitles = ['The Iliad', 'The Odyssey', 'Voice out of the Whirlwind', 'The Ramayana', 'The Mahabharata', 'The Panchatantra', 'The Song of Roland']
const orderedWorks = orderedTitles.map(title => ({ ...works.find(item => item.title === title), ...context[title] }))
const Arrow = () => <span aria-hidden="true">↗</span>

export default function Home() {
  const [selected, setSelected] = useState(orderedWorks[0])
  const featured = works.find(work => work.title === 'The Iliad')

  return (
    <div className="editorial-home">
      <section className="eh-hero reveal" aria-labelledby="home-title">
        <div className="eh-hero-copy">
          <p className="eh-kicker"><span>Great Books portfolio</span><i />Seven works, one journey</p>
          <h1 id="home-title">Seven timeless works.<br /><em>One evolving reader.</em></h1>
          <p className="eh-intro">From ancient questions of justice and duty to medieval ideals of courage, this portfolio explores how enduring stories still speak to a modern student.</p>
          <div className="eh-actions">
            <Link className="eh-primary" to="/analyses">Read the analyses <Arrow /></Link>
            <a className="eh-text-link" href="#collection">Explore the collection ↓</a>
          </div>
        </div>
        <figure className="eh-hero-art">
          <img src={img('bg-turner-polyphemus.jpg')} alt="Ulysses Deriding Polyphemus by J. M. W. Turner" />
          <figcaption><b>Ulysses Deriding Polyphemus</b><span>J. M. W. Turner, 1829</span></figcaption>
          <div className="eh-count"><strong>07</strong><span>works across<br />two millennia</span></div>
        </figure>
      </section>

      <section className="eh-highlights reveal" aria-label="Portfolio highlights">
        <Link to="/analyses" className="eh-highlight eh-highlight-wide">
          <img src={img('ramayana-ravi-varma-jatayu.webp')} alt="A scene from the Ramayana" />
          <span className="eh-label">01 · Analyses</span><h2>Seven close readings</h2>
          <p>Explore plot, character, themes, symbols, and the literary choices that give each work its lasting force.</p><Arrow />
        </Link>
        <Link to="/favorite" className="eh-highlight">
          <img src={img(featured.image)} alt="Priam asking Achilles for Hector’s body" />
          <span className="eh-label">02 · Favorite masterpiece</span><h2>The Iliad</h2>
          <p>Why Achilles’ rage—and his final act of compassion—stays with me.</p><Arrow />
        </Link>
        <Link to="/profile" className="eh-highlight">
          <img src={img('waterhouse-penelope-suitors-1912.jpg')} alt="Penelope and the Suitors by John William Waterhouse" />
          <span className="eh-label">03 · Meet the reader</span><h2>Student profile</h2>
          <p>Meet the IT student learning to read ancient stories with new eyes.</p><Arrow />
        </Link>
      </section>

      <section id="collection" className="eh-section reveal">
        <header className="eh-section-head">
          <div><span className="eh-overline">The reading list</span><h2>The seven works</h2></div>
          <p>Stories from Greece, India, the ancient Near East, and medieval Europe—read through questions that still matter: What do we owe each other? What makes a hero? How should we live?</p>
        </header>
        <div className="eh-work-grid">
          {works.map((work, index) => (
            <Link to="/analyses" className="eh-work" key={work.title}>
              <div className="eh-work-image"><img src={img(work.image)} alt="" loading="lazy" /><span>{String(index + 1).padStart(2, '0')}</span></div>
              <div className="eh-work-copy"><small>{context[work.title].era}</small><h3>{work.title}</h3><p>{context[work.title].summary}</p><b>{work.author}</b></div><Arrow />
            </Link>
          ))}
        </div>
      </section>

      <section className="eh-timeline reveal" aria-labelledby="timeline-title">
        <header><span className="eh-overline">Literature through time</span><h2 id="timeline-title">Explore the timeline</h2><p>Choose a work to place it within the long conversation between cultures and centuries.</p></header>
        <div className="eh-time-tabs" role="tablist" aria-label="Works timeline">
          {orderedWorks.map(work => <button key={work.title} type="button" role="tab" aria-selected={selected.title === work.title} className={selected.title === work.title ? 'active' : ''} onClick={() => setSelected(work)}><span>{work.short}</span><i /></button>)}
        </div>
        <div className="eh-time-detail" role="tabpanel">
          <img src={img(selected.image)} alt="" />
          <div className="eh-time-date"><small>{selected.era}</small><h3>{selected.date}</h3><p>{selected.title}</p></div>
          <div className="eh-time-copy"><p>{selected.summary}</p><Link to="/analyses">Read the analysis <Arrow /></Link></div>
        </div>
      </section>

      <section className="eh-journey reveal">
        <span className="eh-overline">Continue the journey</span>
        <div><h2>Literature is not only about old stories.<br />It is a way of seeing the present.</h2><p>See what changed in my understanding of courage, responsibility, family, leadership, and what it means to be human.</p></div>
        <nav aria-label="Learning and reflection">
          <Link to="/summary"><small>What I learned</small><strong>Summary of Learning</strong><Arrow /></Link>
          <Link to="/reflection"><small>How I changed</small><strong>Personal Reflection</strong><Arrow /></Link>
        </nav>
      </section>
    </div>
  )
}
