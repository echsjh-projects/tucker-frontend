import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { fetchGlobalFreq } from '../api'

const LIMITS = [20, 40, 60]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid #333',
      padding: '10px 14px', fontFamily: 'DM Mono, monospace', fontSize: 12
    }}>
      <div style={{ color: '#e8c547', fontSize: 16, fontFamily: 'Bebas Neue' }}>
        {payload[0].payload.word}
      </div>
      <div style={{ color: '#888' }}>
        count: <span style={{ color: '#f0ede6' }}>{payload[0].value}</span>
      </div>
    </div>
  )
}

export default function GlobalFreq() {
  const [data, setData] = useState([])
  const [limit, setLimit] = useState(40)
  const [loading, setLoading] = useState(true)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    setLoading(true)
    fetchGlobalFreq(limit)
      .then(setData)
      .finally(() => setLoading(false))
  }, [limit])

  const total = data.reduce((s, d) => s + d.count, 0)
  const topWord = data[0]?.word || '—'
  const topCount = data[0]?.count || 0

  return (
    <div>
      <h2 className="panel-title">Global Word Frequency</h2>
      <p className="panel-sub">TOP WORDS ACROSS ALL TRANSCRIBED EPISODES · STOPWORDS REMOVED</p>

      <div className="stat-row">
        <div className="stat">
          <div className="stat-val">{topWord.toUpperCase()}</div>
          <div className="stat-label">Top word</div>
        </div>
        <div className="stat">
          <div className="stat-val">{topCount.toLocaleString()}</div>
          <div className="stat-label">Top count</div>
        </div>
        <div className="stat">
          <div className="stat-val">{total.toLocaleString()}</div>
          <div className="stat-label">Total occurrences</div>
        </div>
        <div className="stat">
          <div className="stat-val">{data.length}</div>
          <div className="stat-label">Words shown</div>
        </div>
      </div>

      <div className="controls">
        <label>Show top</label>
        {LIMITS.map(l => (
          <button
            key={l}
            className={`btn ${limit === l ? '' : 'secondary'}`}
            onClick={() => setLimit(l)}
          >
            {l}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading">LOADING DATA...</div>
      ) : data.length === 0 ? (
        <div className="empty">No data yet — transcription in progress</div>
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
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(232,197,71,0.05)' }} />
              <Bar dataKey="count" radius={[2, 2, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={hovered === i ? '#e8c547' : i < 3 ? '#c4a832' : '#2a2a2a'}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    stroke={hovered === i ? '#e8c547' : 'none'}
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
