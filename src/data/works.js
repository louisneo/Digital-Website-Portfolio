const ph = {
  description: t => `[Write your description / overview of ${t} here. Paste your complete literary analysis.]`,
  themes: () => '[List the themes you identified in your analysis.]',
  imagery: () => '[Describe the imagery and symbols you analyzed.]',
}

// Edit author, lens, description, themes and imagery with your own analysis.
export const works = [
  ['Voice out of the Whirlwind', 'Book of Job (Anonymous)', '[Your Lens]', ['#1d2b4a', '#0b1224'], 'voice.png'],
  ['The Panchatantra', 'Vishnu Sharma', '[Your Lens]', ['#1f5a4a', '#0c2a22'], 'panchatantra.png'],
  ['The Ramayana', 'Valmiki', '[Your Lens]', ['#8a3b12', '#3d1505'], 'ramayana-ravi-varma-jatayu.webp'],
  ['The Mahabharata', 'Vyasa', '[Your Lens]', ['#6a1b2a', '#2a0a12'], 'mahabharata-razmnama.webp'],
  ['The Iliad', 'Homer', '[Your Lens]', ['#7a2a1f', '#2b0f0b'], 'iliad-ivanov-priam.webp'],
  ['The Odyssey', 'Homer', '[Your Lens]', ['#1f4f7a', '#0b2238'], 'odyssey-waterhouse-sirens.webp'],
  ['The Song of Roland', 'Anonymous (attributed to Turold)', '[Your Lens]', ['#4a3a6a', '#1c1530'], 'roland-fouquet.webp'],
].map(([title, author, lens, colors, image]) => ({
  title, author, lens, colors, image,
  description: ph.description(title),
  themes: ph.themes(),
  imagery: ph.imagery(),
}))
