import { useState } from 'react'
import GlobalFreq from './components/GlobalFreq'
import EpisodeFreq from './components/EpisodeFreq'
import WordTracker from './components/WordTracker'
import './App.css'

const TABS = [
  { id: 'global', label: 'Global Frequency' },
  { id: 'episode', label: 'Per Episode' },
  { id: 'tracker', label: 'Word Tracker' },
]

export default function App() {
  const [tab, setTab] = useState('global')

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-title">
            <span className="header-eyebrow">NLP ANALYSIS</span>
            <h1 className="header-h1">Tucker Carlson<br/>Word Intelligence</h1>
          </div>
          <div className="header-meta">
            <span className="meta-pill">361 Episodes</span>
            <span className="meta-pill">Whisper AI</span>
            <span className="meta-pill accent">Live</span>
          </div>
        </div>
        <nav className="tabs">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="main">
        {tab === 'global'  && <GlobalFreq />}
        {tab === 'episode' && <EpisodeFreq />}
        {tab === 'tracker' && <WordTracker />}
      </main>

      <footer className="footer">
        <span>Built with FastAPI · Groq Whisper · Supabase · React</span>
      </footer>
    </div>
  )
}
