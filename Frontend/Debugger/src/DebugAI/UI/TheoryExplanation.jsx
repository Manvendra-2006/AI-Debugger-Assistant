import { useState } from 'react'

const TheoryExplanation = ({ explanation, issues = [], fixes = [] }) => {
  const [expanded, setExpanded] = useState(true)

  if (!explanation && issues.length === 0 && fixes.length === 0) {
    return null
  }

  return (
    <div className="bg-slate-900 border border-slate-700/50 rounded-2xl p-5 shadow-xl shadow-black/30">

      {/* Header */}
      <div className="flex justify-between items-center gap-4 mb-5">
        <div>
          <p className="m-0 text-sky-400 font-bold uppercase tracking-[0.15em] text-xs">
            Theory Explanation
          </p>
          <h4 className="mt-2 mb-0 text-slate-200 text-lg font-bold">
            Why this fix works
          </h4>
        </div>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 border text-sm font-bold cursor-pointer transition-all duration-200 active:scale-[0.97]
            ${expanded
              ? 'border-sky-400/40 bg-slate-800 text-sky-400 hover:bg-slate-700'
              : 'border-slate-700/60 bg-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
        >
          {expanded ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
              Hide details
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
              Show details
            </>
          )}
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent mb-5" />

      {/* Content */}
      {expanded && (
        <div className="grid gap-4">

          {/* Explanation */}
          {explanation && (
            <div className="p-4 rounded-xl bg-[#020617] border border-slate-700/40">
              <p className="m-0 text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
                {explanation}
              </p>
            </div>
          )}

          {/* Issues */}
          {issues.length > 0 && (
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <p className="m-0 text-red-400 font-bold text-sm">Issues Identified</p>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
                  {issues.length}
                </span>
              </div>
              <ul className="m-0 pl-5 text-slate-300 text-sm leading-relaxed space-y-1.5">
                {issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Fixes */}
          {fixes.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <p className="m-0 text-emerald-400 font-bold text-sm">Fixes Applied</p>
                <span className="ml-auto px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                  {fixes.length}
                </span>
              </div>
              <ul className="m-0 pl-5 text-slate-300 text-sm leading-relaxed space-y-1.5">
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