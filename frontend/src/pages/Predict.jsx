import { useState, useMemo } from 'react'
import { Sparkles, ArrowRight, ArrowLeft, ChevronDown, Activity, Heart, Info, Loader2 } from 'lucide-react'
import { smartPredict } from '../api'
import ResultsPanel from '../components/assessment/ResultsPanel'

const initialForm = {
  age: '',
  gender: '',
  pregnancies: '',
  height_cm: '',
  weight_kg: '',
  bp_category: 'dont_know',
  family_history: 'none',
  activity_level: 'moderate',
  symptoms: [],
  // Advanced fields
  glucose: '',
  insulin: '',
  blood_pressure_exact: '',
  skin_thickness: '',
  diabetes_pedigree: ''
}

const symptomsList = [
  { id: 'frequent_thirst', label: 'Frequent Thirst', icon: '💧' },
  { id: 'frequent_urination', label: 'Frequent Urination', icon: '🚽' },
  { id: 'fatigue', label: 'Fatigue', icon: '🥱' },
  { id: 'blurred_vision', label: 'Blurred Vision', icon: '👓' },
  { id: 'slow_healing', label: 'Slow Healing', icon: '🩹' },
  { id: 'numbness', label: 'Numbness/Tingling', icon: '⚡' },
]

export default function Predict() {
  const [form, setForm] = useState(initialForm)
  const [mode, setMode] = useState('quick') // 'quick' or 'advanced'
  const [step, setStep] = useState(1)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const totalSteps = 4

  // BMI Calculation preview
  const bmi = useMemo(() => {
    if (form.height_cm && form.weight_kg) {
      const h = parseFloat(form.height_cm) / 100
      const w = parseFloat(form.weight_kg)
      if (h > 0) return (w / (h * h)).toFixed(1)
    }
    return null
  }, [form.height_cm, form.weight_kg])

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (error) setError('')
  }

  const toggleSymptom = (id) => {
    setForm(prev => {
      const isSelected = prev.symptoms.includes(id)
      let newSymptoms = []
      if (id === 'none') {
        newSymptoms = isSelected ? [] : ['none']
      } else {
        newSymptoms = isSelected
          ? prev.symptoms.filter(s => s !== id)
          : [...prev.symptoms.filter(s => s !== 'none'), id]
      }
      return { ...prev, symptoms: newSymptoms }
    })
    if (error) setError('')
  }

  const validateStep = () => {
    if (step === 1) {
      if (!form.age || form.age < 1 || form.age > 120) return "Please enter a valid age."
      if (!form.gender) return "Please select a gender."
      if (form.gender === 'female' && form.pregnancies === '') return "Please specify number of pregnancies (enter 0 if none)."
    }
    if (step === 2) {
      if (!form.height_cm || form.height_cm < 50 || form.height_cm > 250) return "Please enter a valid height in cm."
      if (!form.weight_kg || form.weight_kg < 20 || form.weight_kg > 300) return "Please enter a valid weight in kg."
    }
    if (step === 3) {
      if (!form.bp_category) return "Please select a blood pressure category."
      if (!form.family_history) return "Please select your family history."
    }
    if (step === 4) {
      if (!form.activity_level) return "Please select your activity level."
      // symptoms are optional, 'none' is acceptable
    }
    return null
  }

  const nextStep = () => {
    const err = validateStep()
    if (err) {
      setError(err)
      return
    }
    setError('')
    if (step < totalSteps) {
      setStep(step + 1)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
      setError('')
    }
  }

  const handleSubmit = async () => {
    const err = validateStep()
    if (err) {
      setError(err)
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const payload = {
        age: parseInt(form.age),
        gender: form.gender,
        height_cm: parseFloat(form.height_cm),
        weight_kg: parseFloat(form.weight_kg),
        bp_category: form.bp_category,
        family_history: form.family_history,
        activity_level: form.activity_level,
        pregnancies: form.gender === 'female' ? parseInt(form.pregnancies) : undefined,
        symptoms: form.symptoms.length > 0 ? form.symptoms : ['none']
      }

      if (mode === 'advanced') {
        if (form.glucose) payload.glucose = parseFloat(form.glucose)
        if (form.insulin) payload.insulin = parseFloat(form.insulin)
        if (form.blood_pressure_exact) payload.blood_pressure_exact = parseFloat(form.blood_pressure_exact)
        if (form.skin_thickness) payload.skin_thickness = parseFloat(form.skin_thickness)
        if (form.diabetes_pedigree) payload.diabetes_pedigree = parseFloat(form.diabetes_pedigree)
      }

      const { data } = await smartPredict(payload)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Server error. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setForm(initialForm)
    setStep(1)
    setResult(null)
    setError('')
    setAdvancedOpen(false)
  }

  // Option Card Helper
  const OptionCard = ({ field, value, icon, label, desc }) => {
    const isSelected = form[field] === value
    return (
      <div 
        className={`option-card ${isSelected ? 'selected' : ''}`}
        onClick={() => handleChange(field, value)}
      >
        <div className="option-card-icon">{icon}</div>
        <div className="option-card-label">{label}</div>
        {desc && <div className="option-card-desc">{desc}</div>}
      </div>
    )
  }

  return (
    <div className="page-section" style={{ paddingTop: 48, paddingBottom: 64 }}>
      <div className="section-inner">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span className="badge animate-fade-in-up" style={{
            background: 'var(--primary-50)', color: 'var(--primary-700)',
            border: '1px solid var(--primary-200)', marginBottom: 16,
          }}>
            <Sparkles style={{ width: 16, height: 16 }} />
            AI Health Companion
          </span>
          <h1 className="font-display" style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700,
            marginBottom: 16, marginTop: 16,
          }}>
            <span className="gradient-text">Health Assessment</span>
          </h1>
          <p style={{ fontSize: '1rem', maxWidth: 600, margin: '0 auto', color: 'var(--text-secondary)' }}>
            Discover your personalized diabetes risk profile through our intelligent guided screening.
          </p>
        </div>

        {/* Mode Selector */}
        {!result && (
          <div className="mode-selector animate-fade-in-up stagger-1">
            <button 
              type="button" 
              className={`mode-btn ${mode === 'quick' ? 'active' : ''}`}
              onClick={() => { setMode('quick'); setAdvancedOpen(false) }}
            >
              ⚡ Quick Screening
            </button>
            <button 
              type="button" 
              className={`mode-btn ${mode === 'advanced' ? 'active' : ''}`}
              onClick={() => setMode('advanced')}
            >
              🔬 Advanced Analysis
            </button>
          </div>
        )}

        <div className="assessment-container mt-8">
          {result ? (
            <ResultsPanel result={result} onReset={handleReset} />
          ) : (
            <>
              {/* Wizard Progress */}
              <div className="step-progress animate-fade-in-up stagger-2">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="step-indicator">
                      <div className={`step-dot ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                        {step > s ? '✓' : s}
                      </div>
                      <div className={`step-label ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>
                        {s === 1 ? 'Basics' : s === 2 ? 'Body' : s === 3 ? 'Profile' : 'Lifestyle'}
                      </div>
                    </div>
                    {s < 4 && (
                      <div className={`step-connector ${step > s ? 'completed' : ''}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Wizard Form */}
              <div className="assessment-card animate-fade-in-up stagger-3">
                
                {/* Step 1: Basics */}
                {step === 1 && (
                  <div className="step-content-enter">
                    <h2 className="step-title">Let's start with the basics</h2>
                    <p className="step-subtitle">This helps our AI calibrate its baseline predictions.</p>
                    
                    <div className="step-field-group">
                      <div>
                        <label className="field-label">Age</label>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="Years"
                          value={form.age}
                          onChange={(e) => handleChange('age', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="field-label">Biological Sex</label>
                        <div className="option-grid cols-2">
                          <OptionCard field="gender" value="male" icon="👨" label="Male" />
                          <OptionCard field="gender" value="female" icon="👩" label="Female" />
                        </div>
                      </div>

                      {form.gender === 'female' && (
                        <div className="animate-slide-down">
                          <label className="field-label">Pregnancies</label>
                          <input
                            type="number"
                            className="form-input"
                            placeholder="Number of times pregnant (0 if none)"
                            value={form.pregnancies}
                            onChange={(e) => handleChange('pregnancies', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Body Metrics */}
                {step === 2 && (
                  <div className="step-content-enter">
                    <h2 className="step-title">Body Metrics</h2>
                    <p className="step-subtitle">We'll automatically calculate your Body Mass Index (BMI).</p>
                    
                    <div className="step-field-group">
                      <div>
                        <label className="field-label">Height (cm)</label>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="e.g. 175"
                          value={form.height_cm}
                          onChange={(e) => handleChange('height_cm', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label className="field-label">Weight (kg)</label>
                        <input
                          type="number"
                          className="form-input"
                          placeholder="e.g. 70"
                          value={form.weight_kg}
                          onChange={(e) => handleChange('weight_kg', e.target.value)}
                        />
                      </div>

                      {bmi && (
                        <div className="bmi-display animate-slide-down">
                          <Activity style={{ width: 24, height: 24, color: 'var(--primary-500)' }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Calculated BMI</div>
                            <div className="bmi-value">{bmi}</div>
                          </div>
                          <div className="bmi-category" style={{
                            background: bmi < 18.5 ? '#fef3c7' : bmi < 25 ? '#d1fae5' : bmi < 30 ? '#fef3c7' : '#fee2e2',
                            color: bmi < 18.5 ? '#d97706' : bmi < 25 ? '#059669' : bmi < 30 ? '#d97706' : '#dc2626',
                          }}>
                            {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Health Profile */}
                {step === 3 && (
                  <div className="step-content-enter">
                    <h2 className="step-title">Health Profile</h2>
                    <p className="step-subtitle">Tell us about your family history and blood pressure.</p>
                    
                    <div className="step-field-group">
                      <div>
                        <label className="field-label">Blood Pressure</label>
                        <div className="option-grid cols-2">
                          <OptionCard field="bp_category" value="normal" icon="✅" label="Normal" desc="Usually around 120/80" />
                          <OptionCard field="bp_category" value="sometimes_high" icon="⚠️" label="Sometimes High" desc="Occasionally elevated" />
                          <OptionCard field="bp_category" value="diagnosed_high" icon="🔴" label="High BP" desc="Diagnosed hypertension" />
                          <OptionCard field="bp_category" value="dont_know" icon="🤷" label="I don't know" desc="Not sure" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="field-label">Family History of Diabetes</label>
                        <div className="option-grid cols-2">
                          <OptionCard field="family_history" value="none" icon="❌" label="None" desc="No known family history" />
                          <OptionCard field="family_history" value="grandparent" icon="👴" label="Grandparents" desc="Extended family" />
                          <OptionCard field="family_history" value="parent_or_sibling" icon="👨‍👩‍👧" label="Parent or Sibling" desc="Immediate family" />
                          <OptionCard field="family_history" value="multiple_close" icon="👨‍👩‍👧‍👦" label="Multiple" desc="Multiple close relatives" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Lifestyle */}
                {step === 4 && (
                  <div className="step-content-enter">
                    <h2 className="step-title">Lifestyle & Symptoms</h2>
                    <p className="step-subtitle">Your daily habits and recent health observations.</p>
                    
                    <div className="step-field-group">
                      <div>
                        <label className="field-label">Activity Level</label>
                        <div className="option-grid cols-3">
                          <OptionCard field="activity_level" value="sedentary" icon="🛋️" label="Sedentary" desc="Little to no exercise" />
                          <OptionCard field="activity_level" value="light" icon="🚶" label="Light" desc="Occasional activity" />
                          <OptionCard field="activity_level" value="moderate" icon="🏃" label="Moderate" desc="Regular exercise" />
                          <OptionCard field="activity_level" value="active" icon="🚴" label="Active" desc="Frequent workouts" />
                          <OptionCard field="activity_level" value="very_active" icon="🔥" label="Very Active" desc="Intense training" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="field-label">Recent Symptoms (Select all that apply)</label>
                        <div className="symptom-grid">
                          <div 
                            className={`symptom-chip ${form.symptoms.includes('none') ? 'active' : ''}`}
                            onClick={() => toggleSymptom('none')}
                          >
                            <span className="chip-icon">✨</span> None
                          </div>
                          {symptomsList.map(sym => (
                            <div 
                              key={sym.id}
                              className={`symptom-chip ${form.symptoms.includes(sym.id) ? 'active' : ''} ${form.symptoms.includes('none') ? 'opacity-50 pointer-events-none' : ''}`}
                              onClick={() => toggleSymptom(sym.id)}
                            >
                              <span className="chip-icon">{sym.icon}</span> {sym.label}
                            </div>
                          ))}
                        </div>
                      </div>

                      {mode === 'advanced' && (
                        <div className="advanced-accordion mt-4">
                          <button 
                            type="button" 
                            className="advanced-accordion-header"
                            onClick={() => setAdvancedOpen(!advancedOpen)}
                          >
                            <Heart style={{ width: 16, height: 16 }} />
                            Add Lab Results (Optional)
                            <ChevronDown className={`advanced-accordion-chevron ${advancedOpen ? 'open' : ''}`} style={{ width: 16, height: 16 }} />
                          </button>
                          
                          {advancedOpen && (
                            <div className="advanced-accordion-body">
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                                Entering specific lab values will override the estimations and increase prediction accuracy.
                              </p>
                              <div className="grid-2">
                                <div>
                                  <label className="field-label">Glucose (mg/dL)</label>
                                  <input type="number" className="form-input" placeholder="e.g. 110" value={form.glucose} onChange={(e) => handleChange('glucose', e.target.value)} />
                                </div>
                                <div>
                                  <label className="field-label">Insulin (mu U/ml)</label>
                                  <input type="number" className="form-input" placeholder="e.g. 125" value={form.insulin} onChange={(e) => handleChange('insulin', e.target.value)} />
                                </div>
                                <div>
                                  <label className="field-label">Diastolic BP (mm Hg)</label>
                                  <input type="number" className="form-input" placeholder="e.g. 72" value={form.blood_pressure_exact} onChange={(e) => handleChange('blood_pressure_exact', e.target.value)} />
                                </div>
                                <div>
                                  <label className="field-label">Skin Thickness (mm)</label>
                                  <input type="number" className="form-input" placeholder="e.g. 29" value={form.skin_thickness} onChange={(e) => handleChange('skin_thickness', e.target.value)} />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <div className="animate-slide-down" style={{
                    marginTop: 20, display: 'flex', alignItems: 'center', gap: 8,
                    padding: '12px 16px', borderRadius: 12, fontSize: '0.875rem',
                    background: 'var(--accent-red-light)', color: 'var(--accent-red-dark)',
                  }}>
                    <Info style={{ width: 16, height: 16, flexShrink: 0 }} />
                    {error}
                  </div>
                )}

                {/* Navigation */}
                <div className="step-nav">
                  {step > 1 ? (
                    <button type="button" className="step-nav-btn back" onClick={prevStep} disabled={loading}>
                      <ArrowLeft style={{ width: 16, height: 16 }} /> Back
                    </button>
                  ) : (
                    <div /> // Placeholder for flex-between
                  )}
                  
                  {step < totalSteps ? (
                    <button type="button" className="step-nav-btn next" onClick={nextStep} disabled={loading}>
                      Continue <ArrowRight style={{ width: 16, height: 16 }} />
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      className={`step-nav-btn submit ${loading ? '' : 'pulse-glow'}`} 
                      onClick={handleSubmit} 
                      disabled={loading}
                    >
                      {loading ? (
                        <><Loader2 style={{ width: 18, height: 18, animation: 'spin-slow 1s linear infinite' }} /> Analyzing...</>
                      ) : (
                        <><Sparkles style={{ width: 18, height: 18 }} /> Show My Results</>
                      )}
                    </button>
                  )}
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
