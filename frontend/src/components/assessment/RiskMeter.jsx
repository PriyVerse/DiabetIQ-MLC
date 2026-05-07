/**
 * RiskMeter — Animated SVG semi-circle gauge for displaying risk probability.
 */
export default function RiskMeter({ probability, riskLevel }) {
  const arcLength = 251 // length of the visible arc (half-circle, r=80)
  const offset = arcLength - (probability / 100) * arcLength
  const needleAngle = -90 + (probability / 100) * 180

  const colorMap = {
    low: '#10b981',
    moderate: '#f59e0b',
    high: '#ef4444',
    very_high: '#dc2626',
  }
  const strokeColor = colorMap[riskLevel] || '#3b82f6'

  return (
    <div className="risk-meter-container">
      <svg className="risk-meter-svg" viewBox="0 0 220 130">
        {/* Background arc */}
        <path
          d="M 20 110 A 80 80 0 0 1 200 110"
          className="risk-meter-bg"
        />
        {/* Filled arc */}
        <path
          d="M 20 110 A 80 80 0 0 1 200 110"
          className="risk-meter-fill"
          stroke={strokeColor}
          strokeDasharray={arcLength}
          strokeDashoffset={offset}
        />
        {/* Needle */}
        <g
          className="risk-meter-needle"
          style={{ transform: `rotate(${needleAngle}deg)` }}
        >
          <line x1="110" y1="110" x2="110" y2="42" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="110" cy="110" r="6" fill={strokeColor} />
          <circle cx="110" cy="110" r="3" fill="white" />
        </g>
      </svg>
      <div className="risk-meter-value">
        <div className="risk-meter-percentage" style={{ color: strokeColor }}>
          {probability}%
        </div>
        <div className="risk-meter-label">Risk Probability</div>
      </div>
    </div>
  )
}
