import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { fetchEpisodes, fetchEpisodeFreq } from '../api'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid #333',
      padding: '10px 14px', fontFamily: 'DM Mono, monospace', fontSize: 12
    }}>
      <div style={{ color: '#47c5b0', fontSize: 16, fontFamily: 'Bebas Neue' }}>
        {payload[0].payload.word}
      </div>
      <div style={{ color: '#888' }}>
        count: <span style={{ color: '#f0ede6' }}>{payload[0].value}</span>
      </div>
    </div>
  )
}

export default function EpisodeFreq() {
  const [episodes, setEpisodes] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [epLoading, setEpLoading] = useState(true)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    fetchEpisodes()
      .then(eps => {
        const done = eps.filter(e => e.scraped === 1)
        setEpisodes(done)
        if (done.length > 0) setSelectedId(String(done[0].id))
      })
      .finally(() => setEpLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedId) return
    setLoading(true)
    fetchEpisodeFreq(selectedId, 40)
      .then(setData)
      .finally(() => setLoading(false))
  }, [selectedId])

  const selected = episodes.find(e => String(e.id) === selectedId)
  const topWord = data[0]?.word || '—'
  const topCount = data[0]?.count || 0

  return (
    <div>
      <h2 className="panel-title">Per-Episode Frequency</h2>
      <p className="panel-sub">SELECT AN EPISODE TO EXPLORE ITS MOST FREQUENT WORDS</p>

      <div className="controls">
        <label>Episode</label>
        {epLoading ? (
          <span style={{ fontFamily: 'DM Mono', fontSize: 11, color: '#555' }}>Loading episodes...</span>
        ) : (
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            style={{ minWidth: 320, maxWidth: 560 }}
          >
            {episodes.map(ep => (
              <option key={ep.id} value={ep.id}>
                {ep.pub_date ? ep.pub_date.slice(0, 16) : '—'} · {ep.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {selected && (
        <div className="stat-row">
          <div className="stat">
            <div className="stat-val" style={{ color: '#47c5b0' }}>{topWord.toUpperCase()}</div>
            <div className="stat-label">Top word</div>
          </div>
          <div className="stat">
            <div className="stat-val" style={{ color: '#47c5b0' }}>{topCount}</div>
            <div className="stat-label">Top count</div>
          </div>
          <div className="stat" style={{ flex: 1 }}>
            <div className="stat-val" style={{ fontSize: 14, color: '#f0ede6', fontFamily: 'DM Sans' }}>
              {selected.title}
            </div>
            <div className="stat-label">Selected episode</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">LOADING EPISODE DATA...</div>
      ) : data.length === 0 ? (
        <div className="empty">No data for this episode</div>
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 80 }}>
              <XAxis
                dataKey="word"
                tick={{ fill: '#555550', fontSize: 11, fontFamily: 'DM Mono' }}
                angle={-45}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                tick={{ fill: '#555550', fontSize: 11, fontFamily: 'DM Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(71,197,176,0.05)' }} />
              <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={hovered === i ? '#47c5b0' : i < 3 ? '#2a7a6e' : '#2a2a2a'}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
