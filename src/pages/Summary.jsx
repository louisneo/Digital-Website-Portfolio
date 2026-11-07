const matrix = [
  {
    title: 'Voice out of the Whirlwind',
    author: 'Book of Job',
    era: 'Ancient Near East',
    date: 'c. 6th–4th cent. BCE',
    lens: 'Formalist & Philosophical',
    symbol: 'The Whirlwind (Se‘arah)',
    question: 'Why do the innocent suffer, and how can human reason confront cosmic mystery?',
  },
  {
    title: 'The Panchatantra',
    author: 'Vishnu Sharma',
    era: 'Classical India',
    date: 'c. 3rd cent. BCE–3rd cent. CE',
    lens: 'Formalist & Didactic',
    symbol: 'Palm-Leaf Manuscript & Animals',
    question: 'How do discernment, strategic alliances, and prudence preserve communities?',
  },
  {
    title: 'The Ramayana',
    author: 'Valmiki',
    era: 'Ancient India',
    date: 'c. 5th cent. BCE–3rd cent. CE',
    lens: 'Formalist & Moral-Archetypal',
    symbol: 'Kodanda (The Bow of Rama)',
    question: 'What does righteous duty (dharma) demand when personal love and public rule collide?',
  },
  {
    title: 'The Mahabharata',
    author: 'Vyasa',
    era: 'Ancient India',
    date: 'c. 4th cent. BCE–4th cent. CE',
    lens: 'Formalist & Ethical-Tragic',
    symbol: 'Sudarshana Chakra',
    question: 'How should one act when sacred duties conflict and every choice carries a cost?',
  },
  {
    title: 'The Iliad',
    author: 'Homer',
    era: 'Archaic Greece',
    date: 'c. 750 BCE',
    lens: 'Formalist Lens',
    symbol: 'The Shield of Achilles',
    question: 'What is the cost of heroic rage when measured against mortality, grief, and empathy?',
  },
  {
    title: 'The Odyssey',
    author: 'Homer',
    era: 'Archaic Greece',
    date: 'c. 700 BCE',
    lens: 'Formalist & Cultural',
    symbol: 'The Palintonos Bow & Olive Bed',
    question: 'What does it mean to reclaim home and identity after displacement and trial?',
  },
  {
    title: 'The Song of Roland',
    author: 'Anonymous (Turold)',
    era: 'Medieval France',
    date: 'c. 1100 CE',
    lens: 'Formalist & Historical',
    symbol: 'The Oliphant (Ivory Horn)',
    question: 'When does martial valor cross into fatal pride, and what does a leader owe companions?',
  },
]

const lenses = [
  {
    name: 'Formalist Lens',
    focus: 'Narrative Architecture & Poetic Devices',
    desc: 'Analyzed how structure produces meaning: the prose-poetry frame of Job, nested fables in the Panchatantra, ring composition in the Iliad, and the olive-tree recognition token in the Odyssey.',
  },
  {
    name: 'Moral & Philosophical Lens',
    focus: 'Ethical Dilemmas & Dharma',
    desc: 'Examined how characters navigate competing duties—Job rejecting retributive platitudes, Rama and Arjuna confronting moral conflict, and Roland balancing valor (prouesse) with wisdom (sagesse).',
  },
  {
    name: 'Historical & Cultural Lens',
    focus: 'Civilizational Codes & Memory',
    desc: 'Contextualized works within Ancient Near Eastern wisdom debates, Sanskrit nītiśāstra statecraft, Greek xenia (hospitality) and kleos (glory), and feudal chivalric codes of medieval Europe.',
  },
  {
    name: 'Reader-Response & Systems Lens',
    focus: 'Filipino Context & Technology Practice',
    desc: 'Connected ancient insights to modern life: Penelope’s household vigilance reflecting Filipino OFW families, and Roland’s pride warning against communication failure in engineering teams.',
  },
]

export default function Summary() {
  return (
    <>
      <h1>Summary of Learning</h1>
      <section className="glass g-box reveal">
        <h3>Masterpieces Across Periods and Cultures</h3>
        <p style={{ lineHeight: '1.75', color: '#e8e2d4', marginBottom: '1.4rem' }}>
          Across two millennia, four distinct civilizations (the Ancient Near East, classical India, archaic Greece,
          and medieval Europe) confronted the perennial dilemmas of human existence. The matrix below synthesizes
          their central inquiries, historical eras, and primary symbolic artifacts:
        </p>
        <div style={{ overflowX: 'auto', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '12px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--gold2)' }}>Work &amp; Author</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--gold2)' }}>Era &amp; Date</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--gold2)' }}>Critical Lens</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--gold2)' }}>Symbolic Artifact</th>
                <th style={{ padding: '0.75rem 1rem', color: 'var(--gold2)' }}>Core Inquiry</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={row.title} style={{ borderBottom: i < matrix.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <strong style={{ color: '#fff' }}>{row.title}</strong>
                    <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{row.author}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', whiteSpace: 'nowrap' }}>
                    <div>{row.era}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--muted)' }}>{row.date}</div>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--gold2)' }}>{row.lens}</td>
                  <td style={{ padding: '0.75rem 1rem' }}>{row.symbol}</td>
                  <td style={{ padding: '0.75rem 1rem', color: '#d8d2c4', maxWidth: '300px' }}>{row.question}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="glass g-box reveal" style={{ '--i': 1 }}>
        <h3>Literary Lenses Applied</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          {lenses.map(l => (
            <div key={l.name} className="glass-lite" style={{ padding: '1.2rem', borderRadius: '12px' }}>
              <span className="g-chip" style={{ marginBottom: '0.5rem' }}>{l.focus}</span>
              <h4 style={{ margin: '0.3rem 0', color: 'var(--gold2)' }}>{l.name}</h4>
              <p style={{ fontSize: '0.84rem', lineHeight: '1.6', margin: 0, color: '#ded8cc' }}>{l.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="glass g-box reveal" style={{ '--i': 2 }}>
        <h3>Literature as a Reflection of Human Experience</h3>
        <p style={{ lineHeight: '1.75', color: '#e8e2d4' }}>
          Despite vast historical and linguistic distances, these masterpieces converge on universal truths: human
          power is fragile (Job, Achilles), ethical duty is complex and rarely unblemished (Rama, Arjuna), community
          requires trust and hospitality (The Panchatantra, The Odyssey), and true leadership demands humility and
          accountability to those we lead (The Song of Roland).
        </p>
      </section>

      <section className="glass g-box reveal" style={{ '--i': 3 }}>
        <h3>Critical Thinking &amp; Analytical Skills Development</h3>
        <p style={{ lineHeight: '1.75', color: '#e8e2d4' }}>
          Throughout Great Books, my analytical approach evolved from passive plot consumption to structural and ethical
          critique. Treating literature as narrative architecture strengthened my capacity to recognize patterns,
          evaluate ambiguous arguments without hasty moralizing, and translate ancient wisdom into ethical judgment
          for modern technology and team collaboration.
        </p>
      </section>
    </>
  )
}

