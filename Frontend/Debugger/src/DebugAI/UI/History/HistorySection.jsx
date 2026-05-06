import React, { useState } from 'react'

const HistorySection = ({ history = [], loading, error, onRefresh }) => {
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }
  return (
    <section
      style={{
        display: 'grid',
        gap: 20,
        marginBottom: 24,
        padding: 24,
        background: 'rgba(15, 23, 42, 0.88)',
        border: '1px solid rgba(148, 163, 184, 0.18)',
        borderRadius: 24,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div>
          <p style={{ margin: 0, color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.85rem' }}>
            Debug history
          </p>
          <h2 style={{ margin: '10px 0 0', color: '#f8fafc', fontSize: '1.4rem' }}>
            Your recent debug reports
          </h2>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          style={{
            border: 'none',
            borderRadius: 16,
            padding: '12px 18px',
            background: '#2563eb',
            color: '#f8fafc',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {error ? (
        <div style={{
          padding: 16,
          background: 'rgba(248, 113, 113, 0.1)',
          border: '1px solid rgba(248, 113, 113, 0.2)',
          borderRadius: 8,
          color: '#f87171'
        }}>
          ❌ {error}
        </div>
      ) : loading ? (
        <div style={{
          padding: 32,
          textAlign: 'center',
          color: '#94a3b8'
        }}>
          <div style={{
            width: 40,
            height: 40,
            border: '4px solid rgba(56, 189, 248, 0.3)',
            borderTop: '4px solid #38bdf8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ margin: 0, fontSize: '1rem' }}>Loading your debug history...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : history.length === 0 ? (
        <div style={{
          padding: 32,
          textAlign: 'center',
          background: 'rgba(30, 41, 59, 0.5)',
          borderRadius: 12,
          border: '1px solid rgba(148, 163, 184, 0.1)'
        }}>
          <p style={{ margin: '0 0 8px', color: '#cbd5e1', fontSize: '1rem' }}>
            📭 No debug history found
          </p>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
            Debug your first code snippet to start saving reports to your history
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {history.map((entry) => {
            const isExpanded = expandedId === entry._id
            const previewCode = entry.IncorrectCode?.slice(0, 100) + (entry.IncorrectCode?.length > 100 ? '...' : '')

            return (
              <div
                key={entry._id}
                style={{
                  borderRadius: 20,
                  background: '#111827',
                  border: '1px solid rgba(148, 163, 184, 0.12)',
                  padding: 18,
                  cursor: 'pointer',
                }}
                onClick={() => toggleExpanded(entry._id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: isExpanded ? 14 : 0 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                    <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>
                      Report ID: {entry._id?.slice(-6)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {!isExpanded && (
                      <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontStyle: 'italic' }}>
                        {previewCode}
                      </span>
                    )}
                    <span style={{ color: '#38bdf8', fontSize: '0.8rem', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      ▼
                    </span>
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ display: 'grid', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <p style={{ margin: '0 0 6px', color: '#94a3b8', fontSize: '0.85rem' }}>Original code</p>
                        <pre style={{ margin: 0, padding: 14, borderRadius: 16, background: '#0f172a', color: '#f8fafc', overflowX: 'auto', whiteSpace: 'pre-wrap', fontSize: '0.9rem', height: 250, overflowY: 'auto' }}>
                          {entry.IncorrectCode}
                        </pre>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 6px', color: '#94a3b8', fontSize: '0.85rem' }}>Corrected code</p>
                        <pre style={{ margin: 0, padding: 14, borderRadius: 16, background: '#0f172a', color: '#a5f3fc', overflowX: 'auto', whiteSpace: 'pre-wrap', fontSize: '0.9rem', height: 250, overflowY: 'auto' }}>
                          {entry.code}
                        </pre>
                      </div>
                    </div>
                    {(entry.issues?.length > 0 || entry.fixes?.length > 0) && (
                      <div style={{ display: 'grid', gap: 10 }}>
                        {entry.issues?.length > 0 && (
                          <div style={{ padding: 14, borderRadius: 16, background: '#1f2937' }}>
                            <p style={{ margin: '0 0 6px', color: '#f87171', fontWeight: 700 }}>Issues</p>
                            <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', lineHeight: 1.8 }}>
                              {entry.issues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {entry.fixes?.length > 0 && (
                          <div style={{ padding: 14, borderRadius: 16, background: '#111827' }}>
                            <p style={{ margin: '0 0 6px', color: '#34d399', fontWeight: 700 }}>Fixes</p>
                            <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', lineHeight: 1.8 }}>
                              {entry.fixes.map((fix, index) => (
                                <li key={index}>{fix}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default HistorySection
