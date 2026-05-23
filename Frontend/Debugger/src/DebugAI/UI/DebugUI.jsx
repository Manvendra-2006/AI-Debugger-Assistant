﻿import { useEffect, useState } from 'react'
import { useDebug } from '../hooks/useDebug'
import Header from './Header/Header'
import TheoryExplanation from './TheoryExplanation'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import { DebugContext } from '../state/debug.context'
const STORAGE_KEY = 'ai-debugger-state'

const DebugUI = () => {
  const context = useContext(DebugContext)
  const {result} = context
  const { loading, handleDebugAI, codeReport, setcodeReport,handleZip } = useDebug()
  const [inputCode, setInputCode] = useState('')
  const [view, setView] = useState('input')
  const [error, setError] = useState(null)
  const [copySuccess, setCopySuccess] = useState('')
  const [file,setfile] = useState('')
  const [prompt,setprompt] = useState('')
  
  const correctedCode =
    typeof codeReport === 'string'
      ? codeReport
      : codeReport?.correctedCode ||
        codeReport?.corrected ||
        (codeReport ? JSON.stringify(codeReport, null, 2) : '')

  const explanationText =
    typeof codeReport === 'string'
      ? ''
      : codeReport?.explanation || codeReport?.theory || codeReport?.details || ''

  const issues = Array.isArray(codeReport?.issues) ? codeReport.issues : []
  const fixes = Array.isArray(codeReport?.fixes) ? codeReport.fixes : []

  const handleSubmit = async () => {
    setError(null)

    if (!inputCode.trim()) {
      setError('Please paste your broken code before debugging.')
      return
    }

    const data = await handleDebugAI({ code: inputCode })
    if (data) {
      setView('result')
      toast.success('Code debugged successfully! Check your corrected output.')
    }
  }

  const handleCopy = async () => {
    if (!correctedCode) return

    try {
      await navigator.clipboard.writeText(correctedCode)
      setCopySuccess('Code is copied!')
      window.setTimeout(() => setCopySuccess(''), 3000)
    } catch (err) {
      setCopySuccess('Copy failed. Use Ctrl+C to copy.')
    }
  }

  const handleStartOver = () => {
    try {
      setView('input')
      setcodeReport(null)
      setInputCode('')
      setError(null)
      setCopySuccess('')
      window.localStorage.removeItem(STORAGE_KEY)
    } catch (err) {
      console.error('Error resetting debug state:', err)
    }
  }
async function handleFile(e){
  e.preventDefault()
    const formData = new FormData()
    formData.append("projectZip", file)
    formData.append("prompt", prompt)
    handleZip(formData)
}
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (!stored) return

      const parsed = JSON.parse(stored)
      if (parsed?.inputCode !== undefined) setInputCode(parsed.inputCode)
      if (parsed?.codeReport !== undefined) setcodeReport(parsed.codeReport)
      if (parsed?.view !== undefined) {
        setView(parsed.view)
      } else if (parsed?.codeReport) {
        setView('result')
      }
    } catch (err) {
      console.warn('Failed to restore saved debug state', err)
    }
  }, [setcodeReport])

  useEffect(() => {
    try {
      const stateToStore = {
        inputCode,
        view,
        codeReport,
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore))
    } catch (err) {
      console.warn('Failed to persist debug state', err)
    }
  }, [inputCode, view, codeReport])

  return (
    <div
      className="debug-page"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0f172a 0%, #111827 55%, #15223c 100%)',
        color: '#f8fafc',
        padding: '32px 20px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <Header />

        {view === 'input' ? (
          <section style={{ display: 'grid', gap: 24 }}>
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(148, 163, 184, 0.18)',
                borderRadius: 24,
                padding: 28,
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Broken code</h2>
                  <p style={{ margin: '8px 0 0', color: '#94a3b8' }}>Paste the snippet you want fixed.</p>
                </div>
                <span
                  style={{
                    background: '#1e293b',
                    color: '#38bdf8',
                    borderRadius: 9999,
                    padding: '8px 14px',
                    fontSize: '0.85rem',
                  }}
                >
                  Step 1
                </span>
              </div>
              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter your incorrect code here..."
                style={{
                  width: '100%',
                  minHeight: 320,
                  borderRadius: 20,
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  background: '#020617',
                  color: '#e2e8f0',
                  padding: 20,
                  fontSize: '0.95rem',
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace',
                  resize: 'vertical',
                }}
              />
              {error && <p style={{ margin: '14px 0 0', color: '#f87171' }}>{error}</p>}
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 20 }}>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    border: 'none',
                    borderRadius: 16,
                    padding: '14px 24px',
                    background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
                    color: '#0f172a',
                    fontWeight: 700,
                    cursor: 'pointer',
                    minWidth: 140,
                    boxShadow: '0 18px 30px rgba(56, 189, 248, 0.25)',
                  }}
                >
                  {loading ? 'Debugging…' : 'Debug'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputCode('')
                    setError(null)
                  }}
                  style={{
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    borderRadius: 16,
                    padding: '14px 24px',
                    background: 'transparent',
                    color: '#cbd5e1',
                    cursor: 'pointer',
                    minWidth: 140,
                  }}
                >
                  Clear
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section style={{ display: 'grid', gap: 24 }}>
            <div
              style={{
                background: 'rgba(30, 41, 59, 0.9)',
                border: '1px solid rgba(148, 163, 184, 0.18)',
                borderRadius: 24,
                padding: 28,
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.4rem' }}>Debug result</h2>
                  <p style={{ margin: '8px 0 0', color: '#94a3b8' }}>
                    Review the corrected code, issues, fixes, and explanation.
                  </p>
                </div>
                <span
                  style={{
                    background: '#1e293b',
                    color: '#34d399',
                    borderRadius: 9999,
                    padding: '8px 14px',
                    fontSize: '0.85rem',
                  }}
                >
                  Step 2
                </span>
              </div>
              <div style={{ display: 'grid', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <h4 style={{ margin: '0 0 10px', color: '#cbd5e1' }}>Original code</h4>
                    <pre
                      style={{
                        margin: 0,
                        borderRadius: 18,
                        padding: 20,
                        background: '#020617',
                        color: '#f8fafc',
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap',
                        fontSize: '0.94rem',
                        height: 300,
                        overflowY: 'auto',
                      }}
                    >
                      {inputCode || 'No original code available.'}
                    </pre>
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <h4 style={{ margin: 0, color: '#cbd5e1' }}>Corrected output</h4>
                      <button
                        type="button"
                        onClick={handleCopy}
                        disabled={!correctedCode}
                        style={{
                          border: '1px solid rgba(56, 189, 248, 0.35)',
                          borderRadius: 12,
                          padding: '8px 16px',
                          background: correctedCode ? '#0f172a' : '#1f2937',
                          color: '#38bdf8',
                          fontWeight: 600,
                          cursor: correctedCode ? 'pointer' : 'not-allowed',
                          fontSize: '0.85rem',
                        }}
                      >
                        {correctedCode ? 'Copy' : 'No code'}
                      </button>
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        borderRadius: 18,
                        padding: 20,
                        background: '#020617',
                        color: '#a5f3fc',
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap',
                        fontSize: '0.94rem',
                        height: 300,
                        overflowY: 'auto',
                      }}
                    >
                      {loading ? 'Fetching corrected code...' : correctedCode || 'No corrected code returned yet.'}
                    </pre>
                  </div>
                </div>
                <TheoryExplanation explanation={explanationText} issues={issues} fixes={fixes} />
              </div>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginTop: 22 }}>
                <button
                  type="button"
                  onClick={handleStartOver}
                  style={{
                    border: 'none',
                    borderRadius: 16,
                    padding: '14px 24px',
                    background: 'linear-gradient(135deg, #38bdf8, #8b5cf6)',
                    color: '#0f172a',
                    fontWeight: 700,
                    cursor: 'pointer',
                    minWidth: 140,
                  }}
                >
                  Debug another snippet
                </button>
                {copySuccess && (
                  <span style={{ color: '#34d399', fontWeight: 600, fontSize: '0.95rem' }}>
                    {copySuccess}
                  </span>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
      <div style={{ marginTop: 28 }}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div
            style={{
              flex: '1 1 360px',
              background: 'linear-gradient(180deg, rgba(15,23,42,0.9), rgba(2,6,23,0.9))',
              border: '1px solid rgba(148,163,184,0.08)',
              borderRadius: 16,
              padding: 18,
              boxShadow: '0 12px 30px rgba(2,6,23,0.35)',
            }}
          >
            <h3 style={{ margin: 0, color: '#e6eef8' }}>Upload Project ZIP</h3>
            <p style={{ margin: '6px 0 12px', color: '#9fb0c8', fontSize: 13 }}>Upload a ZIP of your project and an optional prompt.</p>

            <form onSubmit={(e) => handleFile(e)} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <label
                htmlFor="zip-input"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 12,
                  padding: '18px 12px',
                  borderRadius: 12,
                  border: '2px dashed rgba(99,102,241,0.18)',
                  background: 'linear-gradient(180deg, rgba(99,102,241,0.03), transparent)',
                  color: '#cfe8ff',
                  cursor: 'pointer',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, color: '#8b5cf6', marginBottom: 6 }}>📦</div>
                  <div style={{ fontSize: 14 }}>Drag & drop a ZIP here, or</div>
                  <div style={{ fontSize: 13, color: '#94a3b8' }}>click to choose a file</div>
                </div>
              </label>

              <input id="zip-input" type="file" accept='.zip' onChange={() => setfile(event.target.files[0])} style={{ display: 'none' }} />

              <input
                type="text"
                placeholder='Enter prompt (optional)'
                onChange={(event) => setprompt(event.target.value)}
                value={prompt}
                style={{
                  borderRadius: 10,
                  border: '1px solid rgba(148,163,184,0.08)',
                  padding: '10px 12px',
                  background: '#071126',
                  color: '#e6eef8',
                }}
              />

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    border: 'none',
                    borderRadius: 10,
                    padding: '10px 14px',
                    background: 'linear-gradient(90deg, #38bdf8, #8b5cf6)',
                    color: '#041226',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Upload & Analyze
                </button>
                <button
                  type="button"
                  onClick={() => { setfile(''); setprompt('') }}
                  style={{
                    border: '1px solid rgba(148,163,184,0.08)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    background: 'transparent',
                    color: '#cbd5e1',
                    cursor: 'pointer',
                  }}
                >
                  Reset
                </button>
              </div>

              {file ? (
                <div style={{ marginTop: 8, color: '#cbd5e1', fontSize: 13 }}>
                  Selected: <strong style={{ color: '#e6eef8' }}>{file.name}</strong>
                </div>
              ) : (
                <div style={{ marginTop: 8, color: '#94a3b8', fontSize: 13 }}>No file selected</div>
              )}
            </form>
          </div>

          <div
            style={{
              flex: '1 1 420px',
              background: 'linear-gradient(180deg, rgba(2,6,23,0.9), rgba(8,12,24,0.9))',
              border: '1px solid rgba(148,163,184,0.06)',
              borderRadius: 16,
              padding: 18,
              boxShadow: '0 12px 28px rgba(2,6,23,0.28)',
            }}
          >
            <h3 style={{ margin: 0, color: '#e6eef8' }}>Analysis Result</h3>
            <p style={{ margin: '6px 0 12px', color: '#9fb0c8', fontSize: 13 }}>AI response and messages from the server.</p>

            <div style={{ minHeight: 80, maxHeight: 360, overflowY: 'auto', padding: 12, borderRadius: 10, background: '#020617' }}>
              {result?.message && (
                <div style={{ marginBottom: 10, color: '#cbd5e1', fontSize: 14 }}>{result.message}</div>
              )}

              <div style={{ color: '#d1f2ff', lineHeight: 1.5, fontSize: 14 }}>
                <ReactMarkdown>{result?.aiResponse}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DebugUI