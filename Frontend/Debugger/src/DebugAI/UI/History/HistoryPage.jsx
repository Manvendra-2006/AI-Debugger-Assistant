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
      setHistory([]) // Clear history on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  return (
    <div
      className="history-page"
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              borderRadius: 16,
              background: '#2563eb',
              color: '#f8fafc',
              padding: '12px 18px',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Back to Debug
          </Link>
        </div>

        <HistorySection history={history} loading={loading} error={error} onRefresh={fetchHistory} />
      </div>
    </div>
  )
}

export default HistoryPage
