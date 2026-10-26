const questions = [
  'How has my understanding and appreciation of literature changed?',
  'What challenges did I encounter, and how did I overcome them?',
  'Which literary lens influenced me the most, and why?',
  'What realizations about life, society, culture, or human nature have I gained?',
  'How can I apply these lessons in my personal, academic, or professional life?',
]

export default function Reflection() {
  return (
    <>
      <h1>Personal Reflection</h1>
      {questions.map((q, i) => (
        <section key={q} className="glass g-box reveal" style={{ '--i': i }}>
          <h3>{i + 1}. {q}</h3>
          <p className="todo">[Your answer.]</p>
        </section>
      ))}
    </>
  )
}
