const BASE_URL = import.meta.env.VITE_API_URL || 'https://scouter-api-jtvo.onrender.com'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export const searchJobs = (payload) =>
  request('/api/v1/jobs/search', { method: 'POST', body: JSON.stringify(payload) })

export const getSearchResults = (searchId) =>
  request(`/api/v1/jobs/results/${searchId}`)

export const saveCV = (cvData) =>
  request('/api/v1/cv/save', { method: 'POST', body: JSON.stringify(cvData) })

export const getCV = (userId) =>
  request(`/api/v1/cv/${userId}`)

export const tailorCV = (payload) =>
  request('/api/v1/cv/tailor', { method: 'POST', body: JSON.stringify(payload) })

export const healthCheck = () => request('/api/v1/health')
