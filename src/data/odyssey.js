// Content for "My Favorite Masterpiece": The Odyssey.
// Quotes are copied exactly from Samuel Butler's translation (Project Gutenberg #1727).
const base = import.meta.env.BASE_URL

export const BUTLER_URL = 'https://www.gutenberg.org/ebooks/1727'

export const OPENING_QUOTE =
  'Tell me, O Muse, of that ingenious hero who travelled far and wide after he had sacked the famous town of Troy.'

export const BED_QUOTE = 'There was a young olive growing within the precincts of the house'

export const SIRENS_DESC =
  'Odysseus stands tied to the mast of his ship. Winged Sirens with the faces of women fly all around him. His crew pull hard on the oars. Tall rocky cliffs and dark water surround the boat. The painting shows how dangerous the journey home can be.'

export const PENELOPE_DESC =
  'Penelope sits in the middle of the room in a red dress. She holds a thread close to her mouth. Her maids sit near her on the left. Young men lean in through the window on the right, and one holds out a bunch of flowers. The painting shows the long wait at home.'

export const CHART_DESC =
  "This line chart shows seven stages of Odysseus's long road home. The line starts low at Calypso's island, where he is stuck far from Ithaca. It rises slowly as he faces the Cyclops, the Underworld, and the Sirens and Scylla. It jumps up when he returns to Ithaca and defeats the suitors. It reaches the top when he is back with Penelope."

export const paintings = [
  {
    id: 'sirens',
    src: base + 'waterhouse-ulysses-sirens-1891.jpg',
    title: 'Ulysses and the Sirens',
    artist: 'John William Waterhouse',
    year: '1891',
    museum: 'National Gallery of Victoria, Melbourne',
    link: 'https://commons.wikimedia.org/wiki/File:John_William_Waterhouse_-_Ulysses_and_the_Sirens_(1891).jpg',
    face: 'The danger of the journey',
    desc: SIRENS_DESC,
  },
  {
    id: 'penelope',
    src: base + 'waterhouse-penelope-suitors-1912.jpg',
    title: 'Penelope and the Suitors',
    artist: 'John William Waterhouse',
    year: '1912',
    museum: 'Aberdeen Art Gallery & Museums',
    link: 'https://commons.wikimedia.org/wiki/File:JohnWilliamWaterhouse-PenelopeandtheSuitors(1912).jpg',
    face: 'The waiting at home',
    desc: PENELOPE_DESC,
  },
]

export const ideas = [
  {
    tab: 'Nostos',
    greek: 'νόστος',
    translit: 'nostos',
    meaning: 'homecoming',
    line: 'It is about wanting to go home.',
    text:
      'Nostos means homecoming, and the whole story is built on it. Odysseus has many chances to stay away, but he keeps choosing to go home. I understand this because wanting to go home is something almost everyone feels. For me, this is the heart of the story.',
  },
  {
    tab: 'Xenia',
    greek: 'ξενία',
    translit: 'xenia',
    meaning: 'hospitality',
    line: 'It shows how guests and strangers should be treated.',
    text:
      'Xenia means hospitality, or how we treat guests and strangers. In the story, a good host offers food, a bed, and a safe place before asking any questions. The kind hosts are thanked, and the rude ones pay a heavy price. I like this because it teaches that kindness to a stranger matters.',
  },
  {
    tab: 'Metis',
    greek: 'μήτις',
    translit: 'metis',
    meaning: 'cunning',
    line: 'It values cleverness over strength.',
    text:
      'Metis means cunning, or clever thinking. Odysseus is not always the strongest man in the room, but he wins by using his mind. He tricks the Cyclops and finds a way out of danger again and again. I like that the story respects cleverness more than strength.',
  },
  {
    tab: 'Oikos',
    greek: 'οίκος',
    translit: 'oikos',
    meaning: 'home and family',
    line: 'It shows the people waiting at home, like Penelope and Telemachus.',
    text:
      'Oikos means home and family. The story also shows Penelope and Telemachus, who keep the house going while Odysseus is away. They wait, they hope, and they protect what is left. To me, they are as brave as the hero at sea.',
  },
]

// Stage names, book numbers, and how close Odysseus is to home (0 to 100).
export const road = [
  ["Calypso's island", 'Book 5', 10],
  ['Cyclops', 'Book 9', 25],
  ['Underworld', 'Book 11', 35],
  ['Sirens and Scylla', 'Book 12', 45],
  ['Return to Ithaca', 'Book 13', 75],
  ['Suitors defeated', 'Book 22', 90],
  ['Reunion with Penelope', 'Book 23', 100],
]

export const people = [
  {
    name: 'Odysseus',
    text: 'He is clever, brave, and patient. He also makes mistakes, like when he tells the Cyclops his real name.',
  },
  {
    name: 'Penelope',
    text: 'She is loyal and smart. She does not believe the stranger is her husband until she tests him.',
  },
  {
    name: 'Telemachus',
    text: 'He is young and unsure at the start. He goes looking for news of his father and grows into a man who stands beside him.',
  },
]
