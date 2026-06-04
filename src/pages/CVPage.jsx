import { useState, useEffect } from 'react'
import { Plus, Trash2, Save, CheckCircle } from 'lucide-react'
import { saveCV } from '../services/api'

const USER_ID_KEY = 'scouter_user_id'
const CV_KEY = 'scouter_cv'

function genUserId() {
  return 'user_' + Math.random().toString(36).slice(2, 10)
}

const inputStyle = {
  width: '100%', padding: '10px 14px',
  background: '#fff', border: '1.5px solid var(--c-border)',
  borderRadius: 'var(--radius-md)', fontSize: '0.95rem',
  color: 'var(--c-ink)', fontFamily: 'var(--font-body)',
  transition: 'border-color 0.2s',
}

const labelStyle = {
  fontSize: '0.8rem', fontWeight: 600, color: 'var(--c-ink2)',
  marginBottom: '5px', display: 'block', letterSpacing: '0.03em',
  textTransform: 'uppercase',
}

export default function CVPage() {
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId] = useState(() => {
    const existing = localStorage.getItem(USER_ID_KEY)
    if (existing) return existing
    const newId = genUserId()
    localStorage.setItem(USER_ID_KEY, newId)
    return newId
  })

  const [cv, setCV] = useState(() => {
    const stored = localStorage.getItem(CV_KEY)
    return stored ? JSON.parse(stored) : {
      full_name: '', email: '', phone: '', linkedin: '', github: '',
      summary: '',
      education: [{ degree: '', institution: '', graduation_year: new Date().getFullYear(), gpa: '', relevant_courses: [] }],
      experience: [],
      projects: [],
      skills: [],
    }
  })

  const set = (field, value) => setCV(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    setLoading(true)
    try {
      localStorage.setItem(CV_KEY, JSON.stringify(cv))
      await saveCV({ ...cv, user_id: userId })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      alert('Save failed: ' + e.message)
    }
    setLoading(false)
  }

  // Education helpers
  const updateEdu = (i, field, val) => setCV(prev => {
    const edu = [...prev.education]
    edu[i] = { ...edu[i], [field]: val }
    return { ...prev, education: edu }
  })
  const addEdu = () => setCV(prev => ({ ...prev, education: [...prev.education, { degree: '', institution: '', graduation_year: new Date().getFullYear(), gpa: '', relevant_courses: [] }] }))
  const removeEdu = (i) => setCV(prev => ({ ...prev, education: prev.education.filter((_, idx) => idx !== i) }))

  // Experience helpers
  const updateExp = (i, field, val) => setCV(prev => {
    const exp = [...prev.experience]
    exp[i] = { ...exp[i], [field]: val }
    return { ...prev, experience: exp }
  })
  const addExp = () => setCV(prev => ({ ...prev, experience: [...prev.experience, { title: '', company: '', duration: '', description: [''] }] }))
  const removeExp = (i) => setCV(prev => ({ ...prev, experience: prev.experience.filter((_, idx) => idx !== i) }))

  // Project helpers
  const updateProj = (i, field, val) => setCV(prev => {
    const projects = [...prev.projects]
    projects[i] = { ...projects[i], [field]: val }
    return { ...prev, projects }
  })
  const addProj = () => setCV(prev => ({ ...prev, projects: [...prev.projects, { name: '', description: '', technologies: [], link: '' }] }))
  const removeProj = (i) => setCV(prev => ({ ...prev, projects: prev.projects.filter((_, idx) => idx !== i) }))

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }} className="fade-up">
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2rem' }}>My CV</h1>
        <p style={{ color: 'var(--c-ink2)', marginTop: '6px' }}>Your facts are stored securely. Only wording is changed when tailoring.</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--c-ink3)', marginTop: '4px' }}>Your ID: <code style={{ background: 'var(--c-bg2)', padding: '2px 8px', borderRadius: '4px' }}>{userId}</code></p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Personal */}
        <Card title="Personal Info" color="var(--c-primary)">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Field label="Full Name"><input style={inputStyle} value={cv.full_name} onChange={e => set('full_name', e.target.value)} placeholder="Your full name" /></Field>
            <Field label="Email"><input style={inputStyle} type="email" value={cv.email} onChange={e => set('email', e.target.value)} placeholder="you@email.com" /></Field>
            <Field label="Phone"><input style={inputStyle} value={cv.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 555 000 0000" /></Field>
            <Field label="LinkedIn"><input style={inputStyle} value={cv.linkedin} onChange={e => set('linkedin', e.target.value)} placeholder="linkedin.com/in/you" /></Field>
            <Field label="GitHub" style={{ gridColumn: 'span 2' }}><input style={inputStyle} value={cv.github} onChange={e => set('github', e.target.value)} placeholder="github.com/you" /></Field>
          </div>
          <Field label="Professional Summary" style={{ marginTop: '12px' }}>
            <textarea style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }} value={cv.summary} onChange={e => set('summary', e.target.value)} placeholder="Brief professional summary..." />
          </Field>
        </Card>

        {/* Education */}
        <Card title="Education" color="var(--c-secondary)">
          {cv.education.map((edu, i) => (
            <div key={i} style={{ background: 'var(--c-bg)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '12px', position: 'relative' }}>
              <button onClick={() => removeEdu(i)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', color: 'var(--c-danger)' }}><Trash2 size={15} /></button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Field label="Degree"><input style={inputStyle} value={edu.degree} onChange={e => updateEdu(i, 'degree', e.target.value)} placeholder="B.Sc. Computer Science" /></Field>
                <Field label="Institution"><input style={inputStyle} value={edu.institution} onChange={e => updateEdu(i, 'institution', e.target.value)} placeholder="University name" /></Field>
                <Field label="Graduation Year"><input style={inputStyle} type="number" value={edu.graduation_year} onChange={e => updateEdu(i, 'graduation_year', parseInt(e.target.value))} /></Field>
                <Field label="GPA (optional)"><input style={inputStyle} value={edu.gpa} onChange={e => updateEdu(i, 'gpa', e.target.value)} placeholder="3.8 / 4.0" /></Field>
                <Field label="Relevant Courses (comma-separated)" style={{ gridColumn: 'span 2' }}>
                  <input style={inputStyle} value={edu.relevant_courses?.join(', ')} onChange={e => updateEdu(i, 'relevant_courses', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Machine Learning, Statistics, Algorithms" />
                </Field>
              </div>
            </div>
          ))}
          <AddButton onClick={addEdu} label="Add Education" />
        </Card>

        {/* Experience */}
        <Card title="Experience" color="var(--c-accent1)">
          {cv.experience.map((exp, i) => (
            <div key={i} style={{ background: 'var(--c-bg)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '12px', position: 'relative' }}>
              <button onClick={() => removeExp(i)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', color: 'var(--c-danger)' }}><Trash2 size={15} /></button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Field label="Title"><input style={inputStyle} value={exp.title} onChange={e => updateExp(i, 'title', e.target.value)} placeholder="Data Science Intern" /></Field>
                <Field label="Company"><input style={inputStyle} value={exp.company} onChange={e => updateExp(i, 'company', e.target.value)} placeholder="Company name" /></Field>
                <Field label="Duration" style={{ gridColumn: 'span 2' }}><input style={inputStyle} value={exp.duration} onChange={e => updateExp(i, 'duration', e.target.value)} placeholder="June 2023 – Aug 2023" /></Field>
                <Field label="Bullet Points (one per line)" style={{ gridColumn: 'span 2' }}>
                  <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={exp.description?.join('\n')} onChange={e => updateExp(i, 'description', e.target.value.split('\n').filter(Boolean))} placeholder="Built a model that...&#10;Reduced latency by..." />
                </Field>
              </div>
            </div>
          ))}
          <AddButton onClick={addExp} label="Add Experience" />
        </Card>

        {/* Projects */}
        <Card title="Projects" color="var(--c-accent2)">
          {cv.projects.map((proj, i) => (
            <div key={i} style={{ background: 'var(--c-bg)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '12px', position: 'relative' }}>
              <button onClick={() => removeProj(i)} style={{ position: 'absolute', top: '8px', right: '8px', background: 'none', color: 'var(--c-danger)' }}><Trash2 size={15} /></button>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Field label="Project Name"><input style={inputStyle} value={proj.name} onChange={e => updateProj(i, 'name', e.target.value)} placeholder="Job Finder App" /></Field>
                <Field label="Link (optional)"><input style={inputStyle} value={proj.link} onChange={e => updateProj(i, 'link', e.target.value)} placeholder="github.com/you/project" /></Field>
                <Field label="Description" style={{ gridColumn: 'span 2' }}>
                  <textarea style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} value={proj.description} onChange={e => updateProj(i, 'description', e.target.value)} placeholder="What the project does and what you built..." />
                </Field>
                <Field label="Technologies (comma-separated)" style={{ gridColumn: 'span 2' }}>
                  <input style={inputStyle} value={proj.technologies?.join(', ')} onChange={e => updateProj(i, 'technologies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Python, PyTorch, FastAPI" />
                </Field>
              </div>
            </div>
          ))}
          <AddButton onClick={addProj} label="Add Project" />
        </Card>

        {/* Skills */}
        <Card title="Skills" color="var(--c-accent3)">
          <Field label="Skills (comma-separated)">
            <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} value={cv.skills?.join(', ')} onChange={e => set('skills', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Python, SQL, TensorFlow, PyTorch, Pandas, Git, Docker..." />
          </Field>
        </Card>

        {/* Save */}
        <button onClick={handleSave} disabled={loading} style={{
          padding: '14px', background: saved ? 'var(--c-accent1)' : 'var(--c-primary)',
          color: '#fff', borderRadius: 'var(--radius-md)',
          fontSize: '1rem', fontWeight: 700, fontFamily: 'var(--font-display)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          boxShadow: '0 4px 20px rgba(255,77,0,0.3)',
          transition: 'background 0.3s',
        }}>
          {saved ? <><CheckCircle size={18} /> Saved!</> : loading ? '⟳ Saving...' : <><Save size={18} /> Save CV</>}
        </button>
      </div>
    </div>
  )
}

function Card({ title, color, children }) {
  return (
    <div style={{ background: 'var(--c-card)', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--c-border)', overflow: 'hidden', boxShadow: 'var(--shadow-card)' }} className="fade-up">
      <div style={{ padding: '10px 18px', background: color + '12', borderBottom: '1px solid ' + color + '22' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color, letterSpacing: '0.02em' }}>{title}</h3>
      </div>
      <div style={{ padding: '1.25rem' }}>{children}</div>
    </div>
  )
}

function Field({ label, children, style }) {
  return (
    <div style={style}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}

function AddButton({ onClick, label }) {
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '8px 16px', background: 'none',
      border: '1.5px dashed var(--c-border)', borderRadius: 'var(--radius-md)',
      color: 'var(--c-ink2)', fontSize: '0.88rem', fontWeight: 500,
      cursor: 'pointer', transition: 'border-color 0.2s',
      fontFamily: 'var(--font-body)',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--c-primary)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--c-border)'}
    >
      <Plus size={15} /> {label}
    </button>
  )
}
