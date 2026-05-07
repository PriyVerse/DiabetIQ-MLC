/**
 * ResultsPanel — Rich AI insight experience with risk meter,
 * contributing factors, health insights, and recommendations.
 */
import { ShieldCheck, AlertTriangle, TrendingUp, Lightbulb, RotateCcw } from 'lucide-react'
import RiskMeter from './RiskMeter'

const riskStyles = {
  low: { bg: 'linear-gradient(135deg, #f0fdf4, #d1fae5)', border: '#86efac', color: '#065f46', icon: ShieldCheck },
  moderate: { bg: 'linear-gradient(135deg, #fffbeb, #fef3c7)', border: '#fde68a', color: '#92400e', icon: AlertTriangle },
  high: { bg: 'linear-gradient(135deg, #fef2f2, #fee2e2)', border: '#fca5a5', color: '#991b1b', icon: AlertTriangle },
  very_high: { bg: 'linear-gradient(135deg, #fef2f2, #fecaca)', border: '#f87171', color: '#7f1d1d', icon: AlertTriangle },
}

export default function ResultsPanel({ result, onReset }) {
  if (!result) return null
  const style = riskStyles[result.risk_level] || riskStyles.moderate
  const Icon = style.icon

  return (
    <div className="result-panel animate-fade-in-up">
      {/* Header with risk meter */}
      <div className="result-header" style={{ background: style.bg }}>
        <div style={{ marginBottom: 8 }}>
          <div className="completeness-badge" style={{ marginBottom: 16 }}>
            <span>{result.mode === 'advanced' ? '🔬 Advanced' : '⚡ Quick'} Screening</span>
            <div className="completeness-bar">
              <div className="completeness-fill" style={{ width: `${result.data_completeness}%` }} />
            </div>
            <span>{result.data_completeness}% data</span>
          </div>
        </div>

        <RiskMeter probability={result.probability} riskLevel={result.risk_level} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
          <Icon style={{ width: 24, height: 24, color: style.color }} />
          <h2 className="font-display" style={{ fontSize: '1.5rem', fontWeight: 700, color: style.color, margin: 0 }}>
            {result.risk_label}
          </h2>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 24 }}>
          Model Confidence: <strong>{result.confidence}%</strong> &nbsp;·&nbsp; BMI: <strong>{result.bmi_calculated}</strong>
        </p>
      </div>

      <div className="result-body">
        {/* Contributing Factors */}
        <div className="result-section-title">
          <TrendingUp style={{ width: 18, height: 18, color: 'var(--primary-500)' }} />
          Contributing Factors
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {result.contributing_factors.slice(0, 5).map((f, i) => (
            <div className="factor-row" key={i}>
              <div className={`factor-impact ${f.impact}`} />
              <div className="factor-info">
                <div className="factor-name">{f.label}</div>
                <div className="factor-desc">{f.description}</div>
              </div>
              <div className="factor-value">{f.value}</div>
            </div>
          ))}
        </div>

        <div className="result-divider" />

        {/* Health Insights */}
        {result.health_insights.length > 0 && (
          <>
            <div className="result-section-title">
              <Lightbulb style={{ width: 18, height: 18, color: 'var(--accent-amber)' }} />
              Health Insights
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.health_insights.map((insight, i) => (
                <div className={`insight-card ${insight.type}`} key={i}>
                  <span className="insight-icon">{insight.icon}</span>
                  <div className="insight-content">
                    <div className="insight-title">{insight.title}</div>
                    <div className="insight-desc">{insight.description}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="result-divider" />
          </>
        )}

        {/* Recommendations */}
        <div className="result-section-title">📋 Recommendations</div>
        <div>
          {result.recommendations.map((rec, i) => (
            <div className="rec-item" key={i}>
              <div className="rec-bullet">{i + 1}</div>
              <div className="rec-text">{rec}</div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button className="btn-reset" onClick={onReset} id="new-assessment-btn">
            <RotateCcw style={{ width: 16, height: 16 }} />
            New Assessment
          </button>
        </div>
      </div>

      <div className="result-disclaimer">
        ⚕️ This is an AI-powered screening tool based on statistical models, not a medical diagnosis.
        Please consult a healthcare professional for clinical advice and proper testing.
      </div>
    </div>
  )
}
