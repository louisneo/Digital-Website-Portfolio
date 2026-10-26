export default function Profile() {
  return (
    <section className="profile-page">
      <h1>Student Profile</h1><br />
      <div className="profile glass reveal">
        <div className="profile-photo-wrap">
          <img className="photo" src="photo.jpg" alt="Photo of the student" onError={e => (e.currentTarget.style.visibility = 'hidden')} />
        </div>
        <div className="profile-content">
          <h2>Louis Neo M. Lok</h2>
          <ul className="facts">
            <li><b>Course</b> BS Information Technology</li>
            <li><b>Year</b> 4th Year</li>
            <li><b>Section</b> GEC-GB-NRn 1454</li>
            <li><b>Subject</b> Great Books</li>
            <li><b>School</b> University of Nueva Caceres</li>
          </ul>
          <h3>About Me</h3>
          <p>Hello! My name is Louis Neo M. Lok, and I am a 4th year BS Information Technology student at the University of Nueva Caceres. In my free time, I play online games like Wild Rift or scroll through social media. I did not expect to enjoy a literature course, but Great Books proved me wrong.</p>
          <h3>Reading &amp; Literature Interests</h3>
          <p>I do not read classic literature often. Most of what I read are Wattpad stories, like the university series by 4reuminct (Gwy Saludes). I prefer long stories because I like getting to know the characters over time and seeing how they change. I also enjoy watching the MCU for the same reason. Its story runs across many films, with heroes who make mistakes, friends who lose each other, and sacrifices that cost something. After Great Books, I noticed that these are the same things ancient epics are built on. Thor’s story even borrows from old myths, and the idea of a hero facing a hard choice is as old as the epics we read in class.</p>
          <h3>My Expectations in Great Books</h3>
          <p>I used to think epics were long, difficult poems that only scholars could read. I expected to memorize plots and characters for exams and then move on. Instead, I found families, friends, and leaders dealing with problems I could understand. The course taught me to read one story in different ways and to connect old epics to my own family and community. Now I read more slowly and ask better questions, about books and about the people around me.</p>
        </div>
      </div>
    </section>
  )
}
