import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../Auth/hooks/useAuth'

const Header = () => {
  const { user, handleLogout, loading } = useAuth()
  const [showDetails, setShowDetails] = useState(false)
  const displayName = user?.name || user?.email || 'Developer'
  const avatarLabel = displayName
    .split(' ')
    .map((part) => part[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('')
  const email = user?.email || 'No email provided'
  const name = user?.name || 'No name provided'

  return (
    <header
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 18,
        marginBottom: 32,
        padding: '18px 22px',
        background: 'rgba(15, 23, 42, 0.9)',
        borderRadius: 24,
        border: '1px solid rgba(148, 163, 184, 0.18)',
        boxShadow: '0 24px 40px rgba(15, 23, 42, 0.35)',
      }}
    >
      <div style={{ flex: 1, minWidth: 260, color: '#f8fafc' }}>
        <p
          style={{
            margin: 0,
            color: '#38bdf8',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            fontSize: '0.85rem',
          }}
        >
          AI Debugger
        </p>
        <h1
          style={{
            margin: '12px 0 0',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            lineHeight: 1.05,
          }}
        >
          Find bugs faster with one click.
        </h1>
        <p
          style={{
            margin: '14px 0 0',
            maxWidth: 620,
            color: '#cbd5e1',
            lineHeight: 1.8,
            fontSize: '1rem',
          }}
        >
          Paste your incorrect code, tap Debug, and view the corrected version with issues,
          fixes, and explanation.
        </p>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-end' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link
            to="/history"
            style={{
              borderRadius: 16,
              padding: '10px 16px',
              background: '#2563eb',
              color: '#f8fafc',
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '0.95rem',
            }}
          >
            History
          </Link>
          <button
            type="button"
            onClick={() => setShowDetails((value) => !value)}
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: '2px solid rgba(56, 189, 248, 0.35)',
              background: '#111827',
              color: '#38bdf8',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {avatarLabel || 'UD'}
          </button>
        </div>

        {showDetails && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              marginTop: 16,
              width: 300,
              background: '#0f172a',
              border: '1px solid rgba(148, 163, 184, 0.18)',
              borderRadius: 24,
              padding: 20,
              boxShadow: '0 20px 40px rgba(15, 23, 42, 0.35)',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: '50%',
                    background: '#1e293b',
                    color: '#38bdf8',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700,
                    fontSize: '1rem',
                  }}
                >
                  {avatarLabel || 'UD'}
                </div>
                <div>
                  <p style={{ margin: 0, color: '#cbd5e1', fontWeight: 700 }}>{displayName}</p>
                  <p style={{ margin: '6px 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>Account info</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#94a3b8',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  padding: 8,
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
              <div>
                <p style={{ margin: '0 0 6px', color: '#94a3b8', fontSize: '0.85rem' }}>Name</p>
                <p style={{ margin: 0, color: '#f8fafc' }}>{name}</p>
              </div>
              <div>
                <p style={{ margin: '0 0 6px', color: '#94a3b8', fontSize: '0.85rem' }}>Email</p>
                <p style={{ margin: 0, color: '#f8fafc' }}>{email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleLogout()
                setShowDetails(false)
              }}
              disabled={loading}
              style={{
                width: '100%',
                border: 'none',
                borderRadius: 16,
                padding: '12px 18px',
                background: '#8b5cf6',
                color: '#f8fafc',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Logging out…' : 'Logout'}
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
