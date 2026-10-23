export default function Profile() {
  return (
    <>
      <h1>Student Profile</h1><br />
      <div className="profile">
        <img className="photo" src="photo.jpg" alt="Photo of the student" onError={e => (e.currentTarget.style.visibility = 'hidden')} />
        <div>
          <h2 className="todo">[Your Full Name]</h2>
          <ul className="facts">
            <li><b>Course</b> <span className="todo">[Your Course]</span></li>
            <li><b>Year</b> <span className="todo">[Year]</span></li>
            <li><b>Section</b> <span className="todo">[Section]</span></li>
          </ul>
          <h3>About Me</h3>
          <p className="todo">[Write a brief personal introduction here.]</p>
          <h3>Reading &amp; Literature Interests</h3>
          <p className="todo">[Describe your interests and experiences with reading and literature.]</p>
          <h3>My Expectations in Great Books</h3>
          <p className="todo">[Describe what you expected and hoped to learn in Great Books.]</p>
        </div>
      </div>
    </>
  )
}
