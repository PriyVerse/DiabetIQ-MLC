import { useState, useEffect } from 'react'
import { getFeatureImportance, getAverages } from '../api'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'
import { BarChart3, Palette, Loader2, AlertTriangle, RefreshCw } from 'lucide-react'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899']

const featureLabels = {
  Pregnancies: 'Pregnancies',
  Glucose: 'Glucose',
  BloodPressure: 'Blood Press.',
  SkinThickness: 'Skin Thick.',
  Insulin: 'Insulin',
  BMI: 'BMI',
  DiabetesPedigreeFunction: 'Pedigree Fn',
  Age: 'Age',
}

export default function Visualize() {
  const [importance, setImportance] = useState([])
  const [averages, setAverages] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userValues, setUserValues] = useState({
    Pregnancies: '', Glucose: '', BloodPressure: '', SkinThickness: '',
    Insulin: '', BMI: '', DiabetesPedigreeFunction: '', Age: '',
  })
  const [showComparison, setShowComparison] = useState(false)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    setError('')
    try {
      const [impRes, avgRes] = await Promise.all([getFeatureImportance(), getAverages()])
      const impData = Object.entries(impRes.data)
        .map(([name, value]) => ({ name: featureLabels[name] || name, fullName: name, value: +(value * 100).toFixed(2) }))
        .sort((a, b) => b.value - a.value)
      setImportance(impData)
      setAverages(avgRes.data)
    } catch {
      setError('Could not load data. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleUserInput = (key, val) => setUserValues(prev => ({ ...prev, [key]: val }))

  const buildComparisonData = () => {
    return Object.entries(averages).map(([key, avg]) => {
      const userVal = parseFloat(userValues[key]) || 0
      const maxVal = Math.max(avg, userVal, 1)
      return {
        name: featureLabels[key] || key,
        'Dataset Avg': +avg.toFixed(1),
        'Your Value': +userVal.toFixed(1),
        normalizedAvg: +(avg / maxVal * 100).toFixed(1),
        normalizedUser: +(userVal / maxVal * 100).toFixed(1),
      }
    })
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: 'white', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', borderRadius: 12, padding: 12, fontSize: '0.75rem' }}>
        <p style={{ fontWeight: 600, marginBottom: 4, color: 'var(--text-primary)' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <strong>{p.value}</strong>{p.name === 'Importance' ? '%' : ''}
          </p>
        ))}
      </div>
    )
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

  const comparisonData = buildComparisonData()

  return (
    <div className="page-section" style={{ paddingTop: 48, paddingBottom: 48 }}>
      <div className="section-inner">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="badge" style={{
            background: 'var(--accent-amber-light)', color: '#92400e',
            border: '1px solid #fcd34d', marginBottom: 16,
          }}>
            <Palette style={{ width: 16, height: 16 }} />
            The Fun Picture Book
          </span>
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, marginBottom: 16, marginTop: 16 }}>
            <span className="gradient-text">Visual Insights</span>
          </h1>
          <p style={{ fontSize: '1rem', maxWidth: 560, margin: '0 auto', color: 'var(--text-secondary)' }}>
            Explore which health factors influence diabetes risk the most, and compare your metrics against population averages.
          </p>
        </div>

        {/* Feature Importance Charts */}
        <div className="viz-grid-2" style={{ marginBottom: 48 }}>
          {/* Bar Chart */}
          <div style={{
            background: 'white', border: '1px solid var(--border-light)',
            borderRadius: 16, padding: 32, boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <BarChart3 style={{ width: 20, height: 20, color: 'var(--primary-600)' }} />
              <h2 className="font-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Feature Importance</h2>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={importance} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} unit="%" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: '#475569' }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Importance" radius={[0, 8, 8, 0]} barSize={24}>
                  {importance.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div style={{
            background: 'white', border: '1px solid var(--border-light)',
            borderRadius: 16, padding: 32, boxShadow: 'var(--shadow-md)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <Palette style={{ width: 20, height: 20, color: 'var(--accent-amber)' }} />
              <h2 className="font-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>Importance Distribution</h2>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={importance} cx="50%" cy="50%"
                  outerRadius={120} innerRadius={60}
                  dataKey="value" nameKey="name"
                  label={({ name, value }) => `${name} (${value}%)`}
                  labelLine={{ stroke: '#94a3b8' }}
                >
                  {importance.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User vs Average Section */}
        <div style={{
          background: 'white', border: '1px solid var(--border-light)',
          borderRadius: 16, padding: 32, boxShadow: 'var(--shadow-md)',
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
            <div>
              <h2 className="font-display" style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                📊 User vs. Dataset Average
              </h2>
              <p style={{ fontSize: '0.875rem', marginTop: 4, color: 'var(--text-secondary)' }}>
                Enter your values to see how you compare to the PIMA population averages.
              </p>
            </div>
            {showComparison && (
              <button
                onClick={() => { setShowComparison(false); setUserValues(Object.fromEntries(Object.keys(userValues).map(k => [k, '']))) }}
                style={{
                  padding: '6px 12px', borderRadius: 8, fontSize: '0.75rem', fontWeight: 500,
                  background: 'var(--surface-secondary)', color: 'var(--text-secondary)',
                  border: '1px solid var(--border)', cursor: 'pointer',
                }}
              >
                Reset
              </button>
            )}
          </div>

          {/* Input Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {Object.entries(averages).map(([key]) => (
              <div key={key}>
                <label style={{ fontSize: '0.75rem', fontWeight: 500, marginBottom: 4, display: 'block', color: 'var(--text-muted)' }}>
                  {featureLabels[key] || key}
                </label>
                <input
                  type="number"
                  value={userValues[key]}
                  onChange={(e) => handleUserInput(key, e.target.value)}
                  placeholder={`Avg: ${averages[key]}`}
                  className="form-input"
                  style={{ padding: '8px 12px' }}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowComparison(true)}
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.875rem', marginBottom: 24 }}
          >
            Compare My Values
          </button>

          {showComparison && (
            <div className="viz-grid-2 animate-fade-in-up">
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>Bar Comparison</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={comparisonData} margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} angle={-30} textAnchor="end" height={60} />
                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="Dataset Avg" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="Your Value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>Radar Overview</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={comparisonData.map(d => ({ ...d, avg: d.normalizedAvg, user: d.normalizedUser }))}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#475569' }} />
                    <PolarRadiusAxis tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Radar name="Dataset Avg" dataKey="avg" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
                    <Radar name="Your Value" dataKey="user" stroke="#10b981" fill="#10b981" fillOpacity={0.15} />
                    <Legend />
                    <Tooltip content={<CustomTooltip />} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .viz-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }
        @media (max-width: 900px) {
          .viz-grid-2 { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  )
}
