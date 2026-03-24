const BASE = import.meta.env.VITE_API_URL || 'https://tucker-backend.onrender.com'

export async function fetchGlobalFreq(limit = 40) {
  const res = await fetch(`${BASE}/words/global?limit=${limit}`)
  return res.json()
}

export async function fetchEpisodes() {
  const res = await fetch(`${BASE}/episodes`)
  return res.json()
}

export async function fetchEpisodeFreq(id, limit = 40) {
  const res = await fetch(`${BASE}/words/episode/${id}?limit=${limit}`)
  return res.json()
}

export async function trackWord(word) {
  const res = await fetch(`${BASE}/words/track?word=${encodeURIComponent(word)}`)
  return res.json()
}
