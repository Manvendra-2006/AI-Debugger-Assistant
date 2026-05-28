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
  const { result } = context
  const { loading, handleDebugAI, codeReport, setcodeReport, handleZip } = useDebug()
  const [inputCode, setInputCode] = useState('')
  const [view, setView] = useState('input')
  const [error, setError] = useState(null)
  const [copySuccess, setCopySuccess] = useState('')
  const [file, setfile] = useState('')
  const [prompt, setprompt] = useState('')

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

  async function handleFile(e) {
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
      const stateToStore = { inputCode, view, codeReport }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore))
    } catch (err) {
      console.warn('Failed to persist debug state', err)
    }
  }, [inputCode, view, codeReport])

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">

      {/* Background glow blobs */}
      <div className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-80px] w-[450px] h-[450px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1100px] mx-auto px-5 py-8">
        <Header />

        {/* ── INPUT VIEW ─────────────────────────────────── */}
        {view === 'input' ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">

            {/* Left — Paste Code */}
            <section className="bg-slate-900/90 border border-slate-700/50 rounded-2xl p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <h2 className="m-0 text-xl font-bold text-white">Broken Code</h2>
                  <p className="mt-1 mb-0 text-slate-400 text-sm">Paste the snippet you want fixed.</p>
                </div>
                <span className="px-3 py-1.5 rounded-full bg-slate-800 text-sky-400 text-xs font-bold border border-slate-700/60">
                  Step 1
                </span>
              </div>

              <textarea
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Enter your incorrect code here..."
                className="w-full min-h-[320px] rounded-xl border border-slate-700/60 bg-[#020617] text-slate-200 p-4 text-sm font-mono resize-y focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-all duration-200 placeholder-slate-600"
              />

              {error && (
                <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="flex gap-3 flex-wrap mt-5">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-300 hover:to-violet-400 text-slate-900 font-bold text-sm border-none cursor-pointer active:scale-[0.98] transition-all duration-200 shadow-lg shadow-sky-500/20 disabled:opacity-60 disabled:cursor-not-allowed min-w-[140px] justify-center"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                      Debugging…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0 1 12 12.75Zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 0 1-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 0 0 2.248-2.354M12 12.75a2.25 2.25 0 0 1-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 0 0-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 0 1 .4-2.253M12 8.25a2.25 2.25 0 0 0-2.248 2.146M12 8.25a2.25 2.25 0 0 1 2.248 2.146" />
                      </svg>
                      Debug
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { setInputCode(''); setError(null) }}
                  className="rounded-xl px-6 py-3 border border-slate-700/60 bg-transparent hover:bg-slate-800/60 text-slate-300 text-sm font-semibold cursor-pointer active:scale-[0.98] transition-all duration-200 min-w-[100px]"
                >
                  Clear
                </button>
              </div>
            </section>

            {/* Right — ZIP Upload */}
            <div className="grid gap-5">

              {/* Upload card */}
              <div className="bg-slate-900/90 border border-slate-700/50 rounded-2xl p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <h3 className="m-0 text-white font-bold text-base">Upload Project ZIP</h3>
                <p className="mt-1 mb-4 text-slate-400 text-xs">Upload a ZIP and an optional prompt for AI analysis.</p>

                <form onSubmit={(e) => handleFile(e)} className="flex flex-col gap-3">

                  {/* Drop zone */}
                  <label
                    htmlFor="zip-input"
                    className="flex flex-col items-center justify-center gap-2 py-6 px-4 rounded-xl border-2 border-dashed border-violet-500/25 bg-violet-500/5 hover:border-violet-500/40 hover:bg-violet-500/10 cursor-pointer transition-all duration-200 text-center"
                  >
                    <span className="text-3xl">📦</span>
                    <span className="text-slate-300 text-sm font-medium">Drag & drop a ZIP here</span>
                    <span className="text-slate-500 text-xs">or click to choose a file</span>
                  </label>
                  <input
                    id="zip-input"
                    type="file"
                    accept=".zip"
                    onChange={() => setfile(event.target.files[0])}
                    className="hidden"
                  />

                  {/* File selected indicator */}
                  {file ? (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.75 2.25 2.25 4.5-4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <span className="truncate">{file.name}</span>
                    </div>
                  ) : (
                    <p className="m-0 text-slate-500 text-xs text-center">No file selected</p>
                  )}

                  {/* Prompt input */}
                  <input
                    type="text"
                    placeholder="Enter prompt (optional)"
                    onChange={(event) => setprompt(event.target.value)}
                    value={prompt}
                    className="w-full rounded-xl border border-slate-700/60 bg-[#020617] text-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 transition-all duration-200 placeholder-slate-600"
                  />

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-xl py-2.5 bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-300 hover:to-violet-400 text-slate-900 font-bold text-sm border-none cursor-pointer active:scale-[0.98] transition-all duration-200"
                    >
                      Upload & Analyze
                    </button>
                    <button
                      type="button"
                      onClick={() => { setfile(''); setprompt('') }}
                      className="rounded-xl px-4 py-2.5 border border-slate-700/60 bg-transparent hover:bg-slate-800/60 text-slate-300 text-sm cursor-pointer active:scale-[0.98] transition-all duration-200"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>

              {/* Analysis Result */}
              <div className="bg-slate-900/90 border border-slate-700/50 rounded-2xl p-5 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <h3 className="m-0 text-white font-bold text-base">Analysis Result</h3>
                <p className="mt-1 mb-3 text-slate-400 text-xs">AI response and messages from the server.</p>
                <div className="min-h-[80px] max-h-[280px] overflow-y-auto p-3 rounded-xl bg-[#020617] border border-slate-700/40">
                  {result?.message && (
                    <div className="mb-2 text-slate-300 text-sm">{result.message}</div>
                  )}
                  <div className="text-sky-200 text-sm leading-relaxed">
                    <ReactMarkdown>{result?.aiResponse}</ReactMarkdown>
                  </div>
                  {!result?.message && !result?.aiResponse && (
                    <p className="m-0 text-slate-600 text-sm italic">No analysis yet. Upload a ZIP to get started.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

        ) : (
          /* ── RESULT VIEW ───────────────────────────────── */
          <section className="bg-slate-900/90 border border-slate-700/50 rounded-2xl p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="m-0 text-xl font-bold text-white">Debug Result</h2>
                <p className="mt-1 mb-0 text-slate-400 text-sm">Review corrected code, issues, fixes, and explanation.</p>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold border border-slate-700/60">
                Step 2
              </span>
            </div>

            {/* Code panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div>
                <h4 className="m-0 mb-2 text-slate-400 text-xs uppercase tracking-wider font-semibold">Original Code</h4>
                <pre className="m-0 p-4 rounded-xl bg-[#020617] text-slate-200 overflow-x-auto whitespace-pre-wrap text-sm h-[300px] overflow-y-auto border border-slate-700/40 leading-relaxed font-mono">
                  {inputCode || 'No original code available.'}
                </pre>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="m-0 text-sky-400 text-xs uppercase tracking-wider font-semibold">Corrected Output</h4>
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!correctedCode}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 border border-sky-400/30 bg-[#020617] hover:bg-slate-800 text-sky-400 text-xs font-semibold cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                    </svg>
                    {correctedCode ? 'Copy' : 'No code'}
                  </button>
                </div>
                <pre className="m-0 p-4 rounded-xl bg-[#020617] text-sky-200 overflow-x-auto whitespace-pre-wrap text-sm h-[300px] overflow-y-auto border border-sky-500/20 leading-relaxed font-mono">
                  {loading ? 'Fetching corrected code...' : correctedCode || 'No corrected code returned yet.'}
                </pre>
              </div>
            </div>

            <TheoryExplanation explanation={explanationText} issues={issues} fixes={fixes} />

            <div className="flex gap-3 flex-wrap items-center mt-5">
              <button
                type="button"
                onClick={handleStartOver}
                className="flex items-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-sky-400 to-violet-500 hover:from-sky-300 hover:to-violet-400 text-slate-900 font-bold text-sm border-none cursor-pointer active:scale-[0.98] transition-all duration-200 shadow-lg shadow-sky-500/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                Debug another snippet
              </button>
              {copySuccess && (
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-sm">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  {copySuccess}
                </span>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default DebugUI