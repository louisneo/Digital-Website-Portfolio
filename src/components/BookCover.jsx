const img = file => import.meta.env.BASE_URL + file

// A painted book cover: the work's artwork with the title set on top.
export default function BookCover({ work, meta, size = 'md' }) {
  return (
    <div className={`book book-${size}`}>
      <img src={img(work.image)} alt="" loading={size === 'lg' ? 'eager' : 'lazy'} />
      <div className="book-shade" aria-hidden="true" />
      <div className="book-text">
        <span className="book-author">{work.author.replace(/\s*\(.*\)/, '')}</span>
        <span className="book-title">{meta.short}</span>
        <span className="book-orig" lang="und">{meta.orig}</span>
      </div>
    </div>
  )
}

