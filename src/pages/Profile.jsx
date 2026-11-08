import { useState } from 'react'

export default function Profile() {
  const [photoError, setPhotoError] = useState(false)

  return (
    <section className="profile-page">
      <h1>Student Profile</h1><br />
      <div className="profile glass reveal">
        <div className="profile-photo-wrap">
          {!photoError ? (
            <img
              className="photo"
              src={import.meta.env.BASE_URL + 'photo.jpg'}
              alt="Portrait of Louis Neo M. Lok"
              onError={() => setPhotoError(true)}
            />
          ) : (
            <div className="profile-avatar-placeholder">
              <div className="avatar-monogram">NL</div>
              <span className="avatar-name">Louis Neo M. Lok</span>
              <span className="avatar-caption">4th Year BS IT · UNC</span>
            </div>
          )}
        </div>
        <div className="profile-content">
          <h2>Louis Neo M. Lok</h2>
          <ul className="facts">
            <li><b>Course</b> BS Information Technology</li>
            <li><b>Year</b> 4th Year</li>
            <li><b>Section</b> GEC-GB-NRn 1454</li>
            <li><b>Subject</b> Great Books (World Literature)</li>
            <li><b>School</b> University of Nueva Caceres</li>
            <li><b>Portfolio</b> Myth &amp; Mind</li>
          </ul>
          <h3>About Me</h3>
          <p>Hello! My name is Louis Neo M. Lok, a 4th-year BS Information Technology student at the University of Nueva Caceres. I’m not a literature major, but I have always gravitated toward stories that examine what drives people under extreme pressure, whether in tactical online games like Wild Rift, serialized long-form fiction, or the Marvel Cinematic Universe.</p>
          <h3>Reading &amp; Narrative Interests</h3>
          <p>Before Great Books, most of what I read was online fiction like the university series by 4reuminct (Gwy Saludes) on Wattpad, alongside epic movie franchises. I loved stories that span multiple arcs because you get to see characters fail, battle internal doubts, and change over time. In Great Books, I was surprised to find that ancient epics were the original masters of this: Achilles wrestling with unmanageable rage and grief in The Iliad, Rama’s moral struggle between private affection and public duty in The Ramayana, and the tragedy of impulsive assumption in The Panchatantra.</p>
          <h3>My Expectations vs. Reality</h3>
          <p>Going into Great Books, I honestly expected rote memorization: endless family trees, strange ancient gods, and archaic verses meant only for exams. What I actually found was a psychological mirror. These stories dissect fear, loyalty, pride, and homecoming with surgical precision. Rather than memorizing plots, learning to look through critical lenses (especially psychological and moral-philosophical) turned world classics into practical lessons in human nature, leadership, and emotional resilience.</p>
        </div>
      </div>
    </section>
  )
}
