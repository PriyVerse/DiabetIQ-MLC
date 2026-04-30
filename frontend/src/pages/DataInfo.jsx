import { useState, useEffect, useMemo } from 'react'
import { getStats } from '../api'
import {
  Database, ChevronLeft, ChevronRight, Loader2, AlertTriangle,
  RefreshCw, Table2, TrendingUp, ArrowUpDown
} from 'lucide-react'

const columnLabels = {
  Pregnancies: 'Pregnancies',
  Glucose: 'Glucose',
  BloodPressure: 'Blood Press.',
  SkinThickness: 'Skin Thick.',
  Insulin: 'Insulin',
  BMI: 'BMI',
  DiabetesPedigreeFunction: 'Pedigree Fn',
  Age: 'Age',
  Outcome: 'Outcome',
}

const PAGE_SIZE = 15

export default function DataInfo() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(0)
  const [sortCol, setSortCol] = useState(null)
  const [sortDir, setSortDir] = useState('asc')

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const { data: res } = await getStats()
      setData(res)
    } catch {
      setError('Could not load data. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const columns = data?.sample?.[0] ? Object.keys(data.sample[0]) : []

  const sortedSample = useMemo(() => {
    if (!data?.sample) return []
    let arr = [...data.sample]
    if (sortCol) {
      arr.sort((a, b) => {
        const va = a[sortCol] ?? 0, vb = b[sortCol] ?? 0
        return sortDir === 'asc' ? va - vb : vb - va
      })
    }
    return arr
  }, [data, sortCol, sortDir])

  const totalPages = Math.ceil(sortedSample.length / PAGE_SIZE)
  const pageData = sortedSample.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
    setPage(0)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '128px 0' }}>
        <Loader2 style={{ width: 32, height: 32, color: 'var(--primary-500)', animation: 'spin-slow 1s linear infinite' }} />
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '128px 0', gap: 16 }}>
        <AlertTriangle style={{ width: 40, height: 40, color: 'var(--accent-red)' }} />
        <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
        <button onClick={fetchData} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>
          <RefreshCw style={{ width: 16, height: 16 }} /> Retry
        </button>
      </div>
    )
  }

  return (
    <div className="page-section" style={{ paddingTop: 48, paddingBottom: 48 }}>
      <div className="section-inner-lg">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="badge" style={{
            background: 'var(--primary-50)', color: 'var(--primary-700)',
            border: '1px solid var(--primary-200)', marginBottom: 16,
          }}>
            <Database style={{ width: 16, height: 16 }} />
            PIMA Indians Diabetes Dataset
          </span>
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: 16, marginTop: 16 }}>
            <span className="gradient-text">Data Explorer</span>
          </h1>
          <p style={{ fontSize: '1rem', maxWidth: 560, margin: '0 auto', color: 'var(--text-secondary)' }}>
            Browse the dataset and explore summary statistics for each health parameter.
          </p>
        </div>

        {/* Statistics Summary */}
        {data?.stats && (
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <TrendingUp style={{ width: 20, height: 20, color: 'var(--primary-600)' }} />
              <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>Summary Statistics</h2>
            </div>
            <div className="stats-grid">
              {Object.entries(data.stats).map(([col, s]) => (
                <div key={col} className="card" style={{ padding: 20 }}>
                  <h3 className="font-display" style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: 12, color: 'var(--primary-700)' }}>
                    {columnLabels[col] || col}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { label: 'Mean', value: s.mean, color: 'var(--primary-600)' },
                      { label: 'Median', value: s.median, color: 'var(--accent-green)' },
                      { label: 'Std Dev', value: s.std, color: 'var(--accent-amber)' },
                      { label: 'Min', value: s.min, color: 'var(--text-muted)' },
                      { label: 'Max', value: s.max, color: 'var(--text-muted)' },
                    ].map(({ label, value, color }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{label}</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Table */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <Table2 style={{ width: 20, height: 20, color: 'var(--primary-600)' }} />
            <h2 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Dataset Sample <span style={{ fontSize: '0.875rem', fontWeight: 400, color: 'var(--text-muted)' }}>({sortedSample.length} rows)</span>
            </h2>
          </div>

          <div style={{ background: 'white', border: '1px solid var(--border-light)', borderRadius: 16, overflow: 'hidden', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.875rem', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-secondary)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>#</th>
                    {columns.map(col => (
                      <th key={col}
                        onClick={() => handleSort(col)}
                        style={{
                          padding: '12px 16px', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600,
                          cursor: 'pointer', color: sortCol === col ? 'var(--primary-600)' : 'var(--text-muted)',
                          transition: 'color 0.2s',
                        }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          {columnLabels[col] || col}
                          <ArrowUpDown style={{ width: 12, height: 12 }} />
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageData.map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: '1px solid var(--border-light)', transition: 'background 0.15s' }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59,130,246,0.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '10px 16px', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                        {page * PAGE_SIZE + ri + 1}
                      </td>
                      {columns.map(col => (
                        <td key={col} style={{ padding: '10px 16px', color: 'var(--text-primary)' }}>
                          {col === 'Outcome' ? (
                            <span style={{
                              display: 'inline-flex', alignItems: 'center',
                              padding: '2px 10px', borderRadius: 9999,
                              fontSize: '0.75rem', fontWeight: 500,
                              background: row[col] === 1 ? 'var(--accent-red-light)' : 'var(--accent-green-light)',
                              color: row[col] === 1 ? 'var(--accent-red-dark)' : 'var(--accent-green-dark)',
                            }}>
                              {row[col] === 1 ? 'Diabetic' : 'Healthy'}
                            </span>
                          ) : (
                            <span style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>{row[col]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '16px 24px', borderTop: '1px solid var(--border-light)',
              background: 'var(--surface-secondary)',
            }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Page {page + 1} of {totalPages}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  id="page-prev"
                  style={{
                    padding: 8, borderRadius: 8, cursor: page === 0 ? 'default' : 'pointer',
                    background: 'white', border: '1px solid var(--border)',
                    opacity: page === 0 ? 0.3 : 1, display: 'flex',
                  }}
                >
                  <ChevronLeft style={{ width: 16, height: 16, color: 'var(--text-secondary)' }} />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) pageNum = i
                  else if (page < 3) pageNum = i
                  else if (page > totalPages - 4) pageNum = totalPages - 5 + i
                  else pageNum = page - 2 + i
                  return (
                    <button key={pageNum} onClick={() => setPage(pageNum)}
                      style={{
                        width: 32, height: 32, borderRadius: 8, fontSize: '0.75rem', fontWeight: 500,
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: page === pageNum ? 'var(--primary-600)' : 'white',
                        color: page === pageNum ? 'white' : 'var(--text-secondary)',
                        border: page === pageNum ? 'none' : '1px solid var(--border)',
                      }}>
                      {pageNum + 1}
                    </button>
                  )
                })}
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  id="page-next"
                  style={{
                    padding: 8, borderRadius: 8, cursor: page >= totalPages - 1 ? 'default' : 'pointer',
                    background: 'white', border: '1px solid var(--border)',
                    opacity: page >= totalPages - 1 ? 0.3 : 1, display: 'flex',
                  }}
                >
                  <ChevronRight style={{ width: 16, height: 16, color: 'var(--text-secondary)' }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 500px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
