export const questions = [
  'How has my understanding and appreciation of literature changed?',
  'What challenges did I encounter, and how did I overcome them?',
  'Which literary lens influenced me the most, and why?',
  'What realizations about life, society, culture, or human nature have I gained?',
  'How can I apply these lessons in my personal, academic, or professional life?',
]

export const answers = [
  {
    theme: 'From Passive Memorization to Narrative Systems Thinking',
    content:
      'Entering Great Books as a 4th-year BS Information Technology student, I initially expected an archive of ancient texts to memorize for exams. Studying these seven masterpieces changed my perspective entirely: I realized that classic epics engineered the very narrative devices—concentric character arcs, frame structures, and moral dilemmas—that modern serialized media relies on. I now look past surface plots to analyze how form and structure generate meaning.',
  },
  {
    theme: 'Navigating Epic Scale, Unfamiliar Civilizations & Moral Ambiguity',
    content:
      'Navigating four distinct literary traditions (Ancient Near Eastern wisdom literature, classical Sanskrit fables and epics, Homeric dactylic hexameter, and Old French chansons de geste) was initially daunting. I overcame this by applying systems-thinking habits from IT: deconstructing works into narrative frames, character foils (Achilles vs. Hector, Rama vs. Ravana, Roland vs. Oliver), and recurring symbolic relics, which clarified the central ethical conflict of each text.',
  },
  {
    theme: 'The Formalist Lens: How Architecture Drives Meaning',
    content:
      'The Formalist Lens resonated with me most because it directly parallels software architecture: just as system design dictates stability and performance, literary form determines emotional and philosophical impact. Examining ring composition in The Iliad, nested fables in The Panchatantra, and the climactic olive-tree bed token in The Odyssey proved that every technique is deliberately engineered to shape human insight.',
  },
  {
    theme: 'Endurance, Shared Vulnerability & the Cost of Pride',
    content:
      'Across all seven works, human nature remains remarkably consistent across millennia. Penelope’s twenty-year vigilance in Ithaca mirrored the quiet strength of Filipino OFW families holding households together across oceans. Meanwhile, The Iliad and The Book of Job demonstrated that recognizing our shared mortality and suffering fosters genuine empathy where brute force and rigid orthodoxy fail.',
  },
  {
    theme: 'Humility in Leadership, Discernment & Team Accountability',
    content:
      'In professional software engineering, The Song of Roland delivers a vital maxim: "Roland is brave and Oliver is wise." Refusing to ask for assistance or communicate risks early out of personal pride puts the entire team in jeopardy. Combining technical precision with the ethical discernment of The Panchatantra and the steadfast duty of The Ramayana provides a practical compass for my future career.',
  },
]

export default function Reflection() {
  return (
    <>
      <h1>Personal Reflection</h1>
      {questions.map((q, i) => (
        <section key={q} className="glass g-box reveal" style={{ '--i': i }}>
          <span className="g-chip" style={{ marginBottom: '0.6rem' }}>
            {answers[i].theme}
          </span>
          <h3>
            {i + 1}. {q}
          </h3>
          <p style={{ lineHeight: '1.75', color: '#e8e2d4' }}>{answers[i].content}</p>
        </section>
      ))}
    </>
  )
}
