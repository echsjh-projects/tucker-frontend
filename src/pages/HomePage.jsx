import { useState } from 'react'
import SearchForm from '../components/SearchForm'
import JobCard from '../components/JobCard'
import { useJobSearch } from '../hooks/useJobSearch'
import { Radar } from 'lucide-react'

export default function HomePage() {
  const { status, results, error, search } = useJobSearch()
  const userId = localStorage.getItem('scouter_user_id')
  const isLoading = status === 'searching' || status === 'polling'

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }} className="fade-up">
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'var(--c-primary)12', border: '1px solid var(--c-primary)30',
          borderRadius: '100px', padding: '5px 16px', marginBottom: '1rem',
          fontSize: '0.82rem', fontWeight: 600, color: 'var(--c-primary)',
        }}>
          <Radar size={14} /> Autonomous job scouting for new grads
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.75rem' }}>
          Find your <span style={{ color: 'var(--c-primary)' }}>first role</span><br />
          we scout, you apply.
        </h1>
        <p style={{ color: 'var(--c-ink2)', fontSize: '1.05rem', maxWidth: '500px', margin: '0 auto' }}>
          Scouter crawls 10+ job boards, filters entry-level positions, and tailors your CV per role — powered by Groq AI.
        </p>
      </div>

      {/* Search form */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }} className="fade-up-delay-1">
        <SearchForm onSearch={search} loading={isLoading} />
      </div>

      {/* Status */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--c-ink2)' }}>
          <div style={{
            width: '48px', height: '48px',
            border: '3px solid var(--c-border)', borderTopColor: 'var(--c-primary)',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
            margin: '0 auto 1rem',
          }} />
          <p style={{ fontWeight: 600 }}>Scouting across 10 job boards...</p>
          <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>This takes 30–90 seconds</p>
        </div>
      )}

      {error && (
        <div style={{
          background: '#fff1f1', border: '1.5px solid #fca5a5',
          borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem',
          color: 'var(--c-danger)', marginBottom: '1.5rem', textAlign: 'center',
        }}>
          {error}
        </div>
      )}

      {/* Results */}
      {status === 'done' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700 }}>
              {results.length} roles found
            </h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--c-ink3)' }}>
              entry-level · sorted by location match
            </span>
          </div>

          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--c-ink3)' }}>
              <p style={{ fontSize: '1.1rem' }}>No matching jobs found.</p>
              <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Try different keywords or a broader location.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem',
            }}>
              {results.map((job, i) => (
                <JobCard key={job.id} job={job} userId={userId} animDelay={i * 0.05} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
