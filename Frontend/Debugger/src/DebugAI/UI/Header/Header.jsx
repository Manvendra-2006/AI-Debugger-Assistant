import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../Auth/hooks/useAuth'
import { toast } from 'react-toastify'

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
    <header className="flex flex-wrap justify-between items-center gap-4 mb-8 px-6 py-5 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40">

      {/* Left — branding & tagline */}
      <div className="flex-1 min-w-[260px] text-white">
        <p className="text-sky-400 font-bold uppercase tracking-[0.18em] text-sm m-0">
          AI Debugger
        </p>
        <h1 className="mt-3 mb-0 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
          Find bugs faster with one click.
        </h1>
        <p className="mt-3 mb-0 max-w-xl text-slate-300 leading-relaxed text-base">
          Paste your incorrect code, tap Debug, and view the corrected version with issues,
          fixes, and explanation.
        </p>
      </div>

      {/* Right — actions & avatar */}
      <div className="relative flex flex-col gap-3 items-end">
        <div className="flex gap-2.5 items-center">
          <Link
            to="/history"
            className="rounded-2xl px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors duration-200 no-underline"
          >
            History
          </Link>
          <button
            type="button"
            onClick={() => setShowDetails((value) => !value)}
            className="w-14 h-14 rounded-full border-2 border-sky-400/35 bg-slate-800 text-sky-400 font-bold text-base cursor-pointer grid place-items-center hover:border-sky-400/60 hover:bg-slate-700 transition-all duration-200"
          >
            {avatarLabel || 'UD'}
          </button>
        </div>

        {/* Dropdown */}
        {showDetails && (
          <div className="absolute right-0 top-full mt-4 w-[300px] bg-slate-950 border border-slate-700/50 rounded-2xl p-5 shadow-2xl shadow-black/50 z-10">

            {/* Dropdown header */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-slate-800 text-sky-400 grid place-items-center font-bold text-base border border-slate-700/60">
                  {avatarLabel || 'UD'}
                </div>
                <div>
                  <p className="m-0 text-slate-200 font-bold text-sm">{displayName}</p>
                  <p className="m-0 mt-1 text-slate-500 text-xs">Account info</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="text-slate-500 hover:text-slate-300 bg-transparent border-none cursor-pointer p-2 text-base transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-800 mb-4" />

            {/* User info */}
            <div className="grid gap-3 mb-5">
              <div>
                <p className="m-0 mb-1 text-slate-500 text-xs uppercase tracking-wider">Name</p>
                <p className="m-0 text-white text-sm">{name}</p>
              </div>
              <div>
                <p className="m-0 mb-1 text-slate-500 text-xs uppercase tracking-wider">Email</p>
                <p className="m-0 text-white text-sm">{email}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={() => {
                handleLogout()
                toast.success('You have been logged out successfully.')
                setShowDetails(false)
              }}
              disabled={loading}
              className="w-full rounded-xl py-3 px-4 bg-violet-600 hover:bg-violet-500 active:scale-[0.98] text-white font-bold text-sm cursor-pointer border-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
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
