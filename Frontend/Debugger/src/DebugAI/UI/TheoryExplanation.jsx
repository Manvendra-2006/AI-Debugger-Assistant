import { useState } from 'react'

const TheoryExplanation = ({ explanation, issues = [], fixes = [] }) => {
  const [expanded, setExpanded] = useState(true)

  if (!explanation && issues.length === 0 && fixes.length === 0) {
    return null
  }

  return (
    <div
      style={{
        background: '#111827',
        border: '1px solid rgba(148, 163, 184, 0.18)',
        borderRadius: 24,
        padding: 24,
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.18)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 18 }}>
        <div>
          <p style={{ margin: 0, color: '#38bdf8', fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Theory explanation
          </p>
          <h4 style={{ margin: '10px 0 0', color: '#e2e8f0', fontSize: '1.15rem' }}>
            Why this fix works
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          style={{
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: 16,
            background: expanded ? '#0f172a' : 'transparent',
            color: expanded ? '#38bdf8' : '#cbd5e1',
            padding: '12px 18px',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          {expanded ? 'Hide details' : 'Show details'}
        </button>
      </div>

      {expanded && (
        <div style={{ display: 'grid', gap: 18 }}>
          {explanation && (
            <div style={{ background: '#0f172a', borderRadius: 20, padding: 18 }}>
              <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>{explanation}</p>
            </div>
          )}

          {issues.length > 0 && (
            <div style={{ display: 'grid', gap: 10, background: '#111827', borderRadius: 20, padding: 18, border: '1px solid rgba(248, 113, 113, 0.18)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f87171' }} />
                <p style={{ margin: 0, color: '#f87171', fontWeight: 700 }}>Issues identified</p>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', lineHeight: 1.8 }}>
                {issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {fixes.length > 0 && (
            <div style={{ display: 'grid', gap: 10, background: '#111827', borderRadius: 20, padding: 18, border: '1px solid rgba(52, 211, 153, 0.18)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#34d399' }} />
                <p style={{ margin: 0, color: '#34d399', fontWeight: 700 }}>Fixes applied</p>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', lineHeight: 1.8 }}>
                {fixes.map((fix, index) => (
                  <li key={index}>{fix}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TheoryExplanation
