import React, { useState } from 'react'

const HistorySection = ({ history = [], loading, error, onRefresh }) => {
  const [expandedId, setExpandedId] = useState(null)

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <section className="grid gap-5 mb-6 p-6 bg-slate-900/90 border border-slate-700/50 rounded-2xl backdrop-blur-xl shadow-2xl shadow-black/40">

      {/* Section Header */}
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <p className="m-0 text-sky-400 font-bold uppercase tracking-[0.15em] text-xs">
            Debug History
          </p>
          <h2 className="mt-2 mb-0 text-white text-xl font-bold">
            Your recent debug reports
          </h2>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white font-bold text-sm border-none cursor-pointer transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />

      {/* Error State */}
      {error ? (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <span className="text-red-400 text-sm">{error}</span>
        </div>

      ) : loading ? (
        /* Loading State */
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-10 h-10 border-4 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
          <p className="m-0 text-slate-400 text-sm">Loading your debug history...</p>
        </div>

      ) : history.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-14 px-6 text-center bg-slate-800/40 rounded-xl border border-slate-700/30">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center mb-4 text-2xl">
            📭
          </div>
          <p className="m-0 mb-2 text-slate-300 font-semibold text-base">No debug history found</p>
          <p className="m-0 text-slate-500 text-sm max-w-sm">
            Debug your first code snippet to start saving reports to your history
          </p>
        </div>

      ) : (
        /* History List */
        <div className="grid gap-3">
          {history.map((entry) => {
            const isExpanded = expandedId === entry._id
            const previewCode = entry.IncorrectCode?.slice(0, 100) + (entry.IncorrectCode?.length > 100 ? '...' : '')

            return (
              <div
                key={entry._id}
                onClick={() => toggleExpanded(entry._id)}
                className={`rounded-2xl border cursor-pointer transition-all duration-200 overflow-hidden
                  ${isExpanded
                    ? 'bg-slate-800/80 border-sky-500/30 shadow-lg shadow-sky-500/5'
                    : 'bg-slate-800/40 border-slate-700/40 hover:border-slate-600/60 hover:bg-slate-800/60'
                  }`}
              >
                {/* Card Header */}
                <div className={`flex justify-between gap-3 flex-wrap items-center px-5 py-4 ${isExpanded ? 'border-b border-slate-700/50' : ''}`}>
                  <div className="flex gap-3 items-center flex-wrap">
                    {/* Date */}
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                    {/* Report ID badge */}
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs">
                      #{entry._id?.slice(-6)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {!isExpanded && (
                      <span className="text-slate-500 text-xs italic hidden sm:block max-w-[280px] truncate">
                        {previewCode}
                      </span>
                    )}
                    <span className={`text-sky-400 text-xs transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`}>
                      ▼
                    </span>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-5 grid gap-4">

                    {/* Code Panels */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="m-0 mb-2 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                          Original Code
                        </p>
                        <pre className="m-0 p-4 rounded-xl bg-[#020617] text-slate-200 overflow-x-auto whitespace-pre-wrap text-xs h-[250px] overflow-y-auto border border-slate-700/40 leading-relaxed">
                          {entry.IncorrectCode}
                        </pre>
                      </div>
                      <div>
                        <p className="m-0 mb-2 text-sky-400 text-xs uppercase tracking-wider font-semibold">
                          Corrected Code
                        </p>
                        <pre className="m-0 p-4 rounded-xl bg-[#020617] text-sky-200 overflow-x-auto whitespace-pre-wrap text-xs h-[250px] overflow-y-auto border border-sky-500/20 leading-relaxed">
                          {entry.code}
                        </pre>
                      </div>
                    </div>

                    {/* Issues & Fixes */}
                    {(entry.issues?.length > 0 || entry.fixes?.length > 0) && (
                      <div className="grid gap-3">
                        {entry.issues?.length > 0 && (
                          <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                            <p className="m-0 mb-2 text-red-400 font-bold text-sm flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                              </svg>
                              Issues Found
                            </p>
                            <ul className="m-0 pl-5 text-slate-300 text-sm leading-relaxed space-y-1">
                              {entry.issues.map((issue, index) => (
                                <li key={index}>{issue}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {entry.fixes?.length > 0 && (
                          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                            <p className="m-0 mb-2 text-emerald-400 font-bold text-sm flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                              </svg>
                              Fixes Applied
                            </p>
                            <ul className="m-0 pl-5 text-slate-300 text-sm leading-relaxed space-y-1">
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
