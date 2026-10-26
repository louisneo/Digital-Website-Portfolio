import { useState } from 'react'
import Carousel from '../components/Carousel.jsx'
import HeroStage, { Float } from '../components/HeroStage.jsx'
import RoadChart from '../components/RoadChart.jsx'
import { BED_QUOTE, BUTLER_URL, OPENING_QUOTE, ideas, paintings, people } from '../data/odyssey.js'

function IdeaCard({ it, active }) {
  const [open, setOpen] = useState(false)
  return (
    <article className="glass g-card-in g-idea">
      <span className="g-greek" lang="grc">{it.greek}</span>
      <span className="g-translit">{it.translit}</span>
      <span className="g-chip">{it.meaning}</span>
      <p className="g-line">{it.line}</p>
      <div className={`g-more${open ? ' open' : ''}`}>
        <p>{it.text}</p>
      </div>
      <button
        type="button"
        className={`g-plus${open ? ' on' : ''}`}
        aria-expanded={open}
        aria-label={`${open ? 'Hide' : 'Show'} more about ${it.translit}`}
        tabIndex={active ? 0 : -1}
        onClick={() => setOpen(o => !o)}
      >
        +
      </button>
    </article>
  )
}

export default function Favorite() {
  const [sirens] = paintings
  return (
    <>
      <HeroStage className="g-hero">
        <Float depth={1} className="p-title">
          <p className="g-eyebrow">Great Books</p>
          <h1>My Favorite Masterpiece</h1>
          <h2 className="g-work">The Odyssey</h2>
          <p className="g-meta">Author: <span>Homer</span></p>
        </Float>
        <Float depth={2.2} delay={1.4} className="p-quote">
          <blockquote className="g-quote">{OPENING_QUOTE}</blockquote>
          <p className="g-cite">The Odyssey, Book I, translated by Samuel Butler. <a href={BUTLER_URL} target="_blank" rel="noreferrer">Source</a></p>
        </Float>
        <Float depth={3} delay={2.6} className="p-art">
          <img src={sirens.src} alt={sirens.desc} loading="eager" />
          <small>{sirens.title}, {sirens.year}</small>
        </Float>
      </HeroStage>

      <section className="g-section reveal">
        <h3 className="g-h">Overview</h3>
        <div className="glass g-box">
          <p>
            The Odyssey follows Odysseus on his ten-year journey home after the Trojan War. On the surface, it is an
            adventure about sea monsters, angry gods, and a clever hero. Underneath, it is a story about homesickness,
            patience, and the people who wait for us. Odysseus is trying to get home, and his family is trying to keep
            a home for him.
          </p>
        </div>
      </section>

      <section className="g-section reveal">
        <h3 className="g-h">Why I Chose It</h3>
        <p className="g-lead">Four Greek ideas explain why this story stays with me. Pick one, then press + to read more.</p>
        <Carousel
          label="Why I chose it"
          items={ideas}
          renderCard={(it, k, active) => <IdeaCard it={it} active={active} />}
        />
      </section>

      <section className="g-section">
        <h3 className="g-h reveal">Themes, Characters &amp; Lessons</h3>
        <RoadChart />

        <div className="g-people">
          {people.map((p, k) => (
            <article key={p.name} className="glass-lite g-person reveal" style={{ '--i': k }}>
              <h4>{p.name}</h4>
              <p>{p.text}</p>
            </article>
          ))}
        </div>

        <div className="glass g-box reveal">
          <h4>One lesson</h4>
          <p>
            Patience and clear thinking can carry us through hard roads. Coming home is not only about the trip. It is
            also about the people who keep the light on for us.
          </p>
        </div>

        <h3 className="g-h reveal">Two faces of Odysseus</h3>
        <p className="g-lead reveal">
          Odysseus has two faces in this story. At sea, he is the hero who faces danger. At home, he is the husband
          and father that others wait for.
        </p>
        <div className="g-frames">
          {paintings.map((p, k) => (
            <figure key={p.id} className="g-frame glass reveal" style={{ '--i': k }}>
              <div className="g-frame-img">
                <img src={p.src} alt={p.desc} loading="lazy" />
              </div>
              <figcaption>
                <span className="g-chip">{p.face}</span>
                <strong>{p.title}</strong>
                <span className="g-credit">
                  {p.artist}, {p.year}. {p.museum}. <a href={p.link} target="_blank" rel="noreferrer">Wikimedia Commons (public domain)</a>
                </span>
                <span className="g-desc">{p.desc}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="g-section reveal">
        <h3 className="g-h">My Favorite Scene</h3>
        <div className="glass g-box">
          <p>
            My favorite scene is in Book 23. Odysseus has come home and cleared his house of the suitors. But Penelope
            does not run to him, because she has waited twenty years and she will not be fooled.
          </p>
          <p>
            She tells the nurse to move the bed out of their room. Odysseus is angry, because that bed cannot be moved.
            He built it himself around the trunk of an olive tree that was growing in the house.
          </p>
          <p>
            Only the two of them knew this secret, so Penelope knows he is her husband. She cries and holds him. I love
            this scene because it shows that love is built on trust and small things only two people share.
          </p>
          <blockquote className="g-quote">{BED_QUOTE}</blockquote>
          <p className="g-cite">The Odyssey, Book XXIII, translated by Samuel Butler.</p>
          <div className="g-placeholder" role="note">
            <strong>Image placeholder</strong>
            <span>Add a public domain image of the bed scene (Book 23) from Wikimedia Commons here, with its source link.</span>
          </div>
        </div>
      </section>

      <section className="g-section reveal">
        <h3 className="g-h">Personal Connections &amp; Realizations</h3>
        <div className="glass g-box">
          <p>
            Reading the Odyssey made me think of the many Filipino families who wait for someone to come home. Many of
            us know an OFW, a parent or relative who works far away so the family can have a better life. Like
            Penelope and Telemachus, the family keeps the house going and keeps hope alive. In many homes, a place at
            the table is kept for the one who is away.
          </p>
          <p className="g-fill">[add my own experience here]</p>
          <p>
            The story also made me think about xenia. In our culture, we welcome guests with food, even when we do not
            have much. I realize this is the same kind of hospitality Homer wrote about.
          </p>
          <p>
            One realization is that waiting is also a kind of strength. Penelope does not fight with a sword, but she
            holds her home together until Odysseus returns.
          </p>
          <p className="g-fill">[add my own realization here]</p>
        </div>
      </section>
    </>
  )
}
