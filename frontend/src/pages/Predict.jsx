import { useState } from 'react'
import { predictDiabetes } from '../api'
import {
  Sparkles, AlertTriangle, ShieldCheck, Info, Loader2,
  Heart, Activity, Droplets, Ruler, Syringe, Scale, Dna, Calendar
} from 'lucide-react'

const fields = [
  {
    key: 'pregnancies', label: 'Pregnancies', icon: Heart, placeholder: 'e.g. 2',
    tip: 'Number of times pregnant. Enter 0 if never pregnant or not applicable.',
    min: 0, max: 20, step: 1,
  },
  {
    key: 'glucose', label: 'Glucose (mg/dL)', icon: Droplets, placeholder: 'e.g. 120',
    tip: 'Plasma glucose concentration after 2 hours in an oral glucose tolerance test. Normal fasting: 70–100 mg/dL.',
    min: 0, max: 300, step: 1,
  },
  {
    key: 'blood_pressure', label: 'Blood Pressure (mm Hg)', icon: Activity, placeholder: 'e.g. 72',
    tip: 'Diastolic blood pressure (the bottom number). Normal is below 80 mm Hg.',
    min: 0, max: 200, step: 1,
  },
  {
    key: 'skin_thickness', label: 'Skin Thickness (mm)', icon: Ruler, placeholder: 'e.g. 29',
    tip: 'Triceps skinfold thickness in mm. Indicates subcutaneous fat. Average is about 20–30 mm.',
    min: 0, max: 100, step: 1,
  },
  {
    key: 'insulin', label: 'Insulin (mu U/ml)', icon: Syringe, placeholder: 'e.g. 125',
    tip: '2-Hour serum insulin level. Normal fasting insulin: 2–25 mu U/ml.',
    min: 0, max: 900, step: 1,
  },
  {
    key: 'bmi', label: 'BMI (kg/m²)', icon: Scale, placeholder: 'e.g. 32.0',
    tip: 'Body Mass Index = weight(kg) / height(m)². Normal: 18.5–24.9, Overweight: 25–29.9.',
    min: 0, max: 80, step: 0.1,
  },
  {
    key: 'diabetes_pedigree', label: 'Diabetes Pedigree Function', icon: Dna, placeholder: 'e.g. 0.627',
    tip: 'A function scoring the likelihood of diabetes based on family history. Higher values indicate stronger genetic influence. Typical range: 0.08–2.42.',
    min: 0, max: 3, step: 0.001,
  },
  {
    key: 'age', label: 'Age (years)', icon: Calendar, placeholder: 'e.g. 35',
    tip: 'Your current age in years.',
    min: 1, max: 120, step: 1,
  },
]

const initialForm = Object.fromEntries(fields.map(f => [f.key, '']))

export default function Predict() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [openTip, setOpenTip] = useState(null)

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    for (const f of fields) {
      if (form[f.key] === '' || form[f.key] === undefined) {
        setError(`Please fill in "${f.label}"`)
        return
      }
    }

    setLoading(true)
    try {
      const payload = {}
      for (const f of fields) {
        payload[f.key] = parseFloat(form[f.key])
      }
      const { data } = await predictDiabetes(payload)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Server error. Is the backend running on port 8000?')
    } finally {
      setLoading(false)
    }
  }

  const isHighRisk = result?.prediction === 1

  return (
    <div className="page-section" style={{ paddingTop: 48, paddingBottom: 48 }}>
      <div className="section-inner" style={{ maxWidth: 960 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="badge animate-fade-in-up" style={{
            background: 'var(--primary-50)', color: 'var(--primary-700)',
            border: '1px solid var(--primary-200)', marginBottom: 16,
          }}>
            <Sparkles style={{ width: 16, height: 16 }} />
            The Health Crystal Ball
          </span>
          <h1 className="font-display" style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700,
            marginBottom: 16, marginTop: 16,
          }}>
            <span className="gradient-text">Risk Prediction</span>
          </h1>
          <p style={{ fontSize: '1rem', maxWidth: 560, margin: '0 auto', color: 'var(--text-secondary)' }}>
            Enter your 8 health parameters below and our AI model will assess your diabetes risk instantly.
          </p>
        </div>

        <div className="predict-layout">
          {/* Form */}
          <form onSubmit={handleSubmit} id="prediction-form">
            <div style={{
              background: 'white', border: '1px solid var(--border-light)',
              borderRadius: 16, padding: 32, boxShadow: 'var(--shadow-md)',
            }}>
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16,
              }}>
                {fields.map(({ key, label, icon: Icon, placeholder, tip, min, max, step }) => (
                  <div key={key} style={{ position: 'relative' }}>
                    <label style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      fontSize: '0.875rem', fontWeight: 500, marginBottom: 6,
                      color: 'var(--text-primary)',
                    }}>
                      <Icon style={{ width: 16, height: 16, color: 'var(--primary-500)' }} />
                      {label}
                      <button
                        type="button"
                        onClick={() => setOpenTip(openTip === key ? null : key)}
                        aria-label={`Info about ${label}`}
                        style={{
                          marginLeft: 'auto', padding: 2, borderRadius: 20,
                          border: 'none', cursor: 'pointer', background: 'transparent',
                          display: 'flex', alignItems: 'center',
                        }}
                      >
                        <Info style={{ width: 14, height: 14, color: 'var(--text-muted)' }} />
                      </button>
                    </label>

                    {openTip === key && (
                      <div className="animate-slide-down" style={{
                        position: 'absolute', zIndex: 20, left: 0, right: 0, top: '100%',
                        marginTop: 4, padding: 12, borderRadius: 12,
                        fontSize: '0.75rem', lineHeight: 1.6,
                        background: 'var(--primary-50)', color: 'var(--primary-800)',
                        border: '1px solid var(--primary-200)', boxShadow: 'var(--shadow-md)',
                      }}>
                        {tip}
                      </div>
                    )}

                    <input
                      id={`input-${key}`}
                      type="number"
                      min={min} max={max} step={step}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="form-input"
                    />
                  </div>
                ))}
              </div>

              {error && (
                <div className="animate-slide-down" style={{
                  marginTop: 16, display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 16px', borderRadius: 12, fontSize: '0.875rem',
                  background: 'var(--accent-red-light)', color: 'var(--accent-red-dark)',
                  border: '1px solid var(--accent-red)',
                }}>
                  <AlertTriangle style={{ width: 16, height: 16, flexShrink: 0 }} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                id="submit-prediction"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%', marginTop: 24, justifyContent: 'center',
                  padding: '14px 24px', fontSize: '1rem',
                  opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <>
                    <Loader2 style={{ width: 20, height: 20, animation: 'spin-slow 1s linear infinite' }} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles style={{ width: 20, height: 20 }} />
                    Predict My Risk
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results Panel */}
          <div>
            {result ? (
              <div id="result-card" style={{
                borderRadius: 16, padding: 32, textAlign: 'center',
                background: isHighRisk
                  ? 'linear-gradient(135deg, #fef2f2, #fee2e2)'
                  : 'linear-gradient(135deg, #f0fdf4, #d1fae5)',
                border: `2px solid ${isHighRisk ? 'var(--accent-red)' : 'var(--accent-green)'}`,
                boxShadow: isHighRisk ? 'var(--shadow-glow-red)' : 'var(--shadow-glow-green)',
              }}>
                {/* Icon */}
                <div className="animate-pulse-soft" style={{
                  width: 80, height: 80, borderRadius: '50%',
                  margin: '0 auto 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isHighRisk ? 'var(--accent-red)' : 'var(--accent-green)',
                }}>
                  {isHighRisk
                    ? <AlertTriangle style={{ width: 40, height: 40, color: 'white' }} />
                    : <ShieldCheck style={{ width: 40, height: 40, color: 'white' }} />
                  }
                </div>

                <h2 className="font-display" style={{
                  fontSize: '1.875rem', fontWeight: 700, marginBottom: 8,
                  color: isHighRisk ? 'var(--accent-red-dark)' : 'var(--accent-green-dark)',
                }}>
                  {result.risk_label}
                </h2>

                {/* Probability */}
                <div style={{ marginBottom: 24 }}>
                  <p style={{ fontSize: '0.875rem', marginBottom: 8, color: isHighRisk ? '#b91c1c' : '#047857' }}>
                    Diabetes Risk Probability
                  </p>
                  <div style={{
                    width: '100%', height: 16, borderRadius: 9999,
                    overflow: 'hidden', background: isHighRisk ? '#fecaca' : '#a7f3d0',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 9999,
                      width: `${result.probability}%`,
                      transition: 'width 1s ease-out',
                      background: isHighRisk
                        ? 'linear-gradient(90deg, #f87171, #ef4444)'
                        : 'linear-gradient(90deg, #34d399, #10b981)',
                    }} />
                  </div>
                  <p className="font-display" style={{
                    fontSize: '2.5rem', fontWeight: 700, marginTop: 12,
                    color: isHighRisk ? 'var(--accent-red)' : 'var(--accent-green)',
                  }}>
                    {result.probability}%
                  </p>
                </div>

                {/* Confidence */}
                <div style={{
                  borderRadius: 12, padding: 16,
                  background: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(0,0,0,0.05)',
                }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 500, marginBottom: 4, color: 'var(--text-muted)' }}>Model Confidence</p>
                  <p className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>{result.confidence}%</p>
                </div>

                <p style={{ fontSize: '0.75rem', marginTop: 24, lineHeight: 1.6, color: 'var(--text-muted)' }}>
                  ⚕️ This is a screening tool, not a medical diagnosis.
                  Please consult a healthcare professional for clinical advice.
                </p>
              </div>
            ) : (
              <div style={{
                borderRadius: 16, padding: 32, textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'white', border: '1px dashed var(--border)', minHeight: 400,
              }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--surface-secondary)', marginBottom: 16,
                }}>
                  <Sparkles style={{ width: 32, height: 32, color: 'var(--primary-300)' }} />
                </div>
                <h3 className="font-display" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
                  Your Results Will Appear Here
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Fill in the form and click "Predict My Risk" to see your assessment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .predict-layout {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .predict-layout { grid-template-columns: 1fr !important; }
          .predict-layout form div[style*="grid-template-columns: repeat(2"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
