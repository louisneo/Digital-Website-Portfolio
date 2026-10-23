export default function Favorite() {
  return (
    <>
      <h1>My Favorite Masterpiece</h1>
      <h2 style={{ marginTop: '1.5rem' }} className="todo">[Title]</h2>
      <p className="meta">Author: <span className="todo">[Author]</span></p>
      <blockquote className="todo">[A memorable quotation from the work]</blockquote>
      <h3>Overview</h3><p className="todo">[Brief overview of the literary work.]</p>
      <h3>Why I Chose It</h3><p className="todo">[Reasons for choosing it as your favorite.]</p>
      <h3>Themes, Characters &amp; Lessons</h3><p className="todo">[Significant themes, characters, or lessons that shaped your appreciation.]</p>
      <h3>Personal Connections &amp; Realizations</h3><p className="todo">[Personal connections or realizations gained from the work.]</p>
    </>
  )
}
