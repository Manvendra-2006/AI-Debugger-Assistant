import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../Header/Header'
import HistorySection from './HistorySection'
import { getDebugHistory } from '../../services/ai.api'

const HistoryPage = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)
    setHistory([])

    try {
      console.log('📥 Fetching debug history from API...')
      const data = await getDebugHistory()

      const validData = Array.isArray(data) ? data : []

      console.log(` History fetched successfully. Total records: ${validData.length}`)
      console.log(' History data:', validData)

      setHistory(validData)
    } catch (err) {
      console.error('Error fetching history:', err)
      setError('Unable to load history')
      setHistory([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">

      {/* Background glow blobs */}
      <div className="absolute top-[-150px] left-[-100px] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-80px] w-[450px] h-[450px] bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1100px] mx-auto px-5 py-8">

        <Header />

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white m-0">Debug History</h2>
            <p className="text-slate-400 text-sm mt-1 m-0">All your previous debugging sessions</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white px-4 py-2.5 no-underline font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Debug
          </Link>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/60 to-transparent mb-6" />

        <HistorySection history={history} loading={loading} error={error} onRefresh={fetchHistory} />
      </div>
    </div>
  )
}

export default HistoryPage
