const relics = [
  { name: 'The Whirlwind', work: 'The Book of Job', image: 'relics/job-whirlwind.png' },
  { name: 'Achilles’ Shield', work: 'The Iliad', image: 'relics/achilles-shield.png' },
  { name: 'The Great Bow', work: 'The Ramayana', image: 'relics/rama-bow.png' },
  { name: 'Sudarshana Chakra', work: 'The Mahabharata', image: 'relics/sudarshana-chakra.png' },
  { name: 'The Speaking Animals', work: 'The Panchatantra', image: 'relics/panchatantra-manuscript.png' },
  { name: 'Odysseus’ Bow', work: 'The Odyssey', image: 'relics/odysseus-bow.png' },
  { name: 'Roland’s Oliphant', work: 'The Song of Roland', image: 'relics/roland-oliphant.png' },
]

const variants = { '/': 0, '/profile': 1, '/favorite': 2, '/summary': 3, '/reflection': 4 }

export default function SymbolicRelics({ pathname }) {
  const variant = variants[pathname] ?? 0
  return (
    <div className={`symbolic-relics relic-layout-${variant}`} aria-hidden="true">
      {relics.map((relic, index) => (
        <figure className={`symbolic-relic relic-${index + 1}`} key={relic.name}>
          <img src={import.meta.env.BASE_URL + relic.image} alt="" loading={index > 1 ? 'lazy' : 'eager'} decoding="async" />
        </figure>
      ))}
    </div>
  )
}
