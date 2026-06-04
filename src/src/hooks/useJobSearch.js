import { useState, useRef } from 'react'
import { searchJobs, getSearchResults } from '../services/api'

export function useJobSearch() {
  const [status, setStatus] = useState('idle')
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)
  const pollRef = useRef(null)

  const search = async (payload) => {
    setStatus('searching')
    setResults([])
    setError(null)

    try {
      const { search_id } = await searchJobs(payload)
      setStatus('polling')
      _poll(search_id)
    } catch (e) {
      setError(e.message)
      setStatus('error')
    }
  }

  const _poll = (searchId) => {
    let attempts = 0
    const MAX = 24

    // Wait 8 seconds before first poll to let background task complete
    setTimeout(() => {
      pollRef.current = setInterval(async () => {
        attempts++
        try {
          const data = await getSearchResults(searchId)
          if (data.status === 'done') {
            clearInterval(pollRef.current)
            setResults(data.results || [])
            setStatus('done')
          } else if (data.status === 'error' || attempts >= MAX) {
            clearInterval(pollRef.current)
            setError('Search timed out or failed. Please try again.')
            setStatus('error')
          }
        } catch (e) {
          clearInterval(pollRef.current)
          setError(e.message)
          setStatus('error')
        }
      }, 5000)
    }, 8000)
  }

  const reset = () => {
    clearInterval(pollRef.current)
    setStatus('idle')
    setResults([])
    setError(null)
  }

  return { status, results, error, search, reset }
}
