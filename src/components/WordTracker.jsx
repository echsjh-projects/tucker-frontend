import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, ReferenceLine
} from 'recharts'
import { trackWord } from '../api'

const PRESETS = ['war', 'israel', 'iran', 'china', 'trump', 'media', 'government', 'ukraine']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: '#1a1a1a', border: '1px solid #333',
      padding: '10px 14px', fontFamily: 'DM Mono, monospace', fontSize: 12,
      maxWidth: 280
    }}>
      <div style={{ color: '#e85432', fontSize: 14, fontFamily: 'Bebas Neue', marginBottom: 4 }}>
        {d.pub_date ? d.pub_date.slice(0, 10) : ''}
      </div>
      <div style={{ color: '#888', marginBottom: 4, fontSize: 11, lineHeight: 1.4 }}>
        {d.title?.slice(0, 60)}{d.title?.length > 60 ? '…' : ''}
      </div>
      <div style={{ color: '#888' }}>
        mentions: <span style={{ color: '#f0ede6', fontSize: 14 }}>{d.count}</span>
      </div>
    </div>
  )
}

export default function WordTracker() {
  const [word, setWord] = useState('')
  const [input, setInput] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const search = async (w) => {
    const term = (w || input).trim().toLowerCase()
    if (!term) return
    setWord(term)
    setInput(term)
    setLoading(true)
    setSearched(true)
    const result = await trackWord(term)
    setData(result)
    setLoading(false)
  }

  const maxCount = Math.max(...data.map(d => d.count), 1)
  const totalMentions = data.reduce((s, d) => s + d.count, 0)
  const episodesWithWord = data.filter(d => d.count > 0).length
  const peakEp = data.reduce((best, d) => d.count > (best?.count || 0) ? d : best, null)

  return (
    <div>
      <h2 className="panel-title">Word Tracker</h2>
      <p className="panel-sub">TRACK HOW OFTEN A WORD APPEARS ACROSS EPISODES OVER TIME</p>

      <div className="controls">
        <input
          type="text"
          placeholder="Enter a word..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          style={{ width: 200 }}
        />
        <button className="btn" onClick={() => search()}>Track</button>
      </div>

      <div className="controls" style={{ marginTop: -16, marginBottom: 28 }}>
        <label>Quick picks:</label>
        {PRESETS.map(p => (
          <button
            key={p}
            className={`btn secondary ${word === p ? 'active-preset' : ''}`}
            style={word === p ? { borderColor: '#e85432', color: '#e85432' } : {}}
            onClick={() => search(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {searched && !loading && data.length > 0 && (
        <div className="stat-row">
          <div className="stat">
            <div className="stat-val" style={{ color: '#e85432' }}>
              {word.toUpperCase()}
            </div>
            <div className="stat-label">Tracked word</div>
          </div>
          <div className="stat">
            <div className="stat-val" style={{ color: '#e85432' }}>{totalMentions}</div>
            <div className="stat-label">Total mentions</div>
          </div>
          <div className="stat">
            <div className="stat-val" style={{ color: '#e85432' }}>{episodesWithWord}</div>
            <div className="stat-label">Episodes with word</div>
          </div>
          {peakEp && (
            <div className="stat" style={{ flex: 1 }}>
              <div className="stat-val" style={{ fontSize: 14, color: '#f0ede6', fontFamily: 'DM Sans' }}>
                {peakEp.title?.slice(0, 50)}…
              </div>
              <div className="stat-label">Peak episode ({peakEp.count} mentions)</div>
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="loading">TRACKING "{word.toUpperCase()}"...</div>
      ) : !searched ? (
        <div className="empty">Enter a word above to track its frequency across episodes</div>
      ) : data.length === 0 ? (
        <div className="empty">No data found for "{word}"</div>
      ) : (
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={420}>
            <LineChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 8 }}>
              <CartesianGrid stroke="#1f1f1f" strokeDasharray="4 4" vertical={false} />
              <XAxis
                dataKey="pub_date"
                tick={{ fill: '#555550', fontSize: 10, fontFamily: 'DM Mono' }}
                #tickFormatter={v => v ? v.slice(0, 7) : ''}
                #tickFormatter={v => v ? new Date(v).toLocaleDateString('en-US', {month:'short', year:'2-digit'}) : ''}
                tickFormatter={v => {
                  if (!v) return ''
                  const m = v.match(/(\d+)\s+(\w+)\s+(\d{4})/)
                  if (!m) return v.slice(0, 7)
                  return `${m[2].slice(0,3)} '${m[3].slice(2)}`
                }}
                interval={Math.floor(data.length / 8)}
              />
              <YAxis
                tick={{ fill: '#555550', fontSize: 11, fontFamily: 'DM Mono' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine
                y={maxCount}
                stroke="#e85432"
                strokeDasharray="3 3"
                strokeOpacity={0.3}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#e85432"
                strokeWidth={2}
                dot={(props) => {
                  const { cx, cy, payload } = props
                  if (payload.count === 0) return null
                  return (
                    <circle
                      key={`dot-${cx}-${cy}`}
                      cx={cx} cy={cy} r={payload.count === maxCount ? 5 : 3}
                      fill={payload.count === maxCount ? '#e85432' : '#1a1a1a'}
                      stroke="#e85432"
                      strokeWidth={payload.count === maxCount ? 2 : 1}
                    />
                  )
                }}
                activeDot={{ r: 6, fill: '#e85432', stroke: '#fff', strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
