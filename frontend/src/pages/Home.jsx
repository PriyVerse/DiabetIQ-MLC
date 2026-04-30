import { Link } from 'react-router-dom'
import {
  Sparkles, Shield, BarChart3, Database, ArrowRight, Brain,
  HeartPulse, Users, Zap, TrendingUp, Award, ChevronRight
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Predictions',
    desc: 'Our Gradient Boosting model analyzes 8 key health parameters to assess your diabetes risk with clinical-grade accuracy.',
    gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    desc: 'Your health data never leaves your browser session. No accounts, no tracking — just instant, anonymous predictions.',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
  },
  {
    icon: BarChart3,
    title: 'Visual Insights',
    desc: 'Interactive charts reveal which health factors matter most, and how your metrics compare to population averages.',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
  },
  {
    icon: Database,
    title: 'Trusted Dataset',
    desc: 'Built on the PIMA Indians Diabetes Dataset — a gold-standard benchmark from the National Institute of Diabetes.',
    gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  },
]

const team = [
  { name: 'Dr. Ananya Sharma', role: 'Lead Data Scientist', emoji: '👩‍🔬' },
  { name: 'Raj Patel', role: 'ML Engineer', emoji: '🧑‍💻' },
  { name: 'Dr. Meera Joshi', role: 'Medical Advisor', emoji: '👩‍⚕️' },
  { name: 'Vikram Singh', role: 'Full-Stack Developer', emoji: '🛠️' },
]

const stats = [
  { value: '768', label: 'Patient Records', icon: Users },
  { value: '75%+', label: 'Model Accuracy', icon: TrendingUp },
  { value: '8', label: 'Health Parameters', icon: HeartPulse },
  { value: '<1s', label: 'Prediction Time', icon: Zap },
]

export default function Home() {
  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section id="hero" className="page-section" style={{ position: 'relative', paddingTop: 80, paddingBottom: 80 }}>
        {/* Background decorations */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div className="animate-float" style={{
            position: 'absolute', top: -50, right: -50, width: 400, height: 400,
            borderRadius: '50%', opacity: 0.15,
            background: 'radial-gradient(circle, var(--primary-300), transparent 70%)',
          }} />
          <div style={{
            position: 'absolute', bottom: -50, left: -50, width: 350, height: 350,
            borderRadius: '50%', opacity: 0.1,
            background: 'radial-gradient(circle, var(--accent-green), transparent 70%)',
            animation: 'float 8s ease-in-out infinite 3s',
          }} />
        </div>

        <div className="section-inner" style={{ position: 'relative', textAlign: 'center' }}>
          {/* Badge */}
          <div className="animate-fade-in-up">
            <span className="badge" style={{
              background: 'var(--primary-50)', color: 'var(--primary-700)',
              border: '1px solid var(--primary-200)',
              marginBottom: 32, display: 'inline-flex',
            }}>
              <Sparkles style={{ width: 16, height: 16 }} />
              Powered by Machine Learning
            </span>
          </div>

          <h1 className="font-display animate-fade-in-up stagger-1" style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800, letterSpacing: '-0.02em',
            marginBottom: 24, lineHeight: 1.1,
          }}>
            <span className="gradient-text-hero">Predict Your</span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>Diabetes Risk</span>
          </h1>

          <p className="animate-fade-in-up stagger-2" style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            maxWidth: 640, margin: '0 auto 40px',
            color: 'var(--text-secondary)', lineHeight: 1.7,
          }}>
            Democratizing predictive health analytics. Our AI analyzes 8 key health
            indicators to give you a proactive wellness assessment — in under a second.
          </p>

          <div className="animate-fade-in-up stagger-3" style={{
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'center', gap: 16,
          }}>
            <Link to="/predict" id="hero-cta" className="btn-primary">
              Start Prediction
              <ArrowRight style={{ width: 20, height: 20 }} />
            </Link>
            <Link to="/data" id="hero-secondary" className="btn-secondary">
              Explore Dataset
              <ChevronRight style={{ width: 20, height: 20 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────── */}
      <section id="stats-bar" className="page-section" style={{ paddingTop: 16, paddingBottom: 32 }}>
        <div className="section-inner-sm">
          <div className="glass" style={{
            borderRadius: 24, padding: 32,
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24,
            boxShadow: 'var(--shadow-lg)',
          }}>
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 40, height: 40, borderRadius: 12, marginBottom: 8,
                  background: 'var(--primary-50)', color: 'var(--primary-600)',
                }}>
                  <Icon style={{ width: 20, height: 20 }} />
                </div>
                <p className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700, color: 'var(--primary-700)' }}>{value}</p>
                <p style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            #stats-bar .glass { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      <section id="features" className="page-section" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="section-inner">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
              Why <span className="gradient-text">DiabetIQ</span>?
            </h2>
            <p style={{ fontSize: '1rem', maxWidth: 560, margin: '0 auto', color: 'var(--text-secondary)' }}>
              A suite of intelligent tools designed to give you clarity about your metabolic health.
            </p>
          </div>

          <div className="grid-2">
            {features.map(({ icon: Icon, title, desc, gradient }) => (
              <div key={title} className="card" style={{ padding: 32 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20, background: gradient,
                }}>
                  <Icon style={{ width: 24, height: 24, color: 'white' }} />
                </div>
                <h3 className="font-display" style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="page-section" style={{
        paddingTop: 80, paddingBottom: 80,
        background: 'linear-gradient(180deg, var(--surface-secondary) 0%, transparent 100%)',
      }}>
        <div className="section-inner-sm">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
              How It Works
            </h2>
            <p style={{ fontSize: '1rem', maxWidth: 560, margin: '0 auto', color: 'var(--text-secondary)' }}>
              Three simple steps to your personalized risk assessment.
            </p>
          </div>

          <div className="grid-3">
            {[
              { step: '01', title: 'Enter Your Data', desc: 'Provide 8 simple health metrics like glucose level, BMI, and age.', color: 'var(--primary-600)' },
              { step: '02', title: 'AI Analysis', desc: 'Our Gradient Boosting model processes your data through a trained pipeline.', color: 'var(--accent-green)' },
              { step: '03', title: 'Get Results', desc: 'Receive an instant risk assessment with probability score and visual insights.', color: 'var(--primary-400)' },
            ].map(({ step, title, desc, color }) => (
              <div key={step} style={{ textAlign: 'center' }}>
                <div className="font-display" style={{
                  width: 64, height: 64, borderRadius: 16, margin: '0 auto 24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', fontWeight: 700, color: 'white',
                  background: color, boxShadow: `0 8px 20px ${color}40`,
                }}>
                  {step}
                </div>
                <h3 className="font-display" style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────── */}
      <section id="team" className="page-section" style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div className="section-inner-sm">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, marginBottom: 16, color: 'var(--text-primary)' }}>
              Meet the <span className="gradient-text">Team</span>
            </h2>
            <p style={{ fontSize: '1rem', maxWidth: 560, margin: '0 auto', color: 'var(--text-secondary)' }}>
              The passionate minds behind DiabetIQ.
            </p>
          </div>

          <div className="grid-4">
            {team.map(({ name, role, emoji }) => (
              <div key={name} className="card" style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>{emoji}</div>
                <h4 className="font-display" style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{name}</h4>
                <p style={{ fontSize: '0.75rem', marginTop: 4, color: 'var(--text-muted)' }}>{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <section id="cta" className="page-section" style={{ paddingTop: 40, paddingBottom: 80 }}>
        <div className="section-inner-sm">
          <div style={{
            borderRadius: 24, padding: 'clamp(48px, 6vw, 64px)',
            position: 'relative', overflow: 'hidden', textAlign: 'center',
            background: 'linear-gradient(135deg, var(--primary-700), var(--primary-500))',
            boxShadow: 'var(--shadow-glow-blue)',
          }}>
            {/* Decorative circles */}
            <div style={{
              position: 'absolute', top: 0, right: 0, width: 160, height: 160,
              borderRadius: '50%', background: 'white', opacity: 0.1,
              transform: 'translate(30%, -30%)',
            }} />
            <div style={{
              position: 'absolute', bottom: 0, left: 0, width: 128, height: 128,
              borderRadius: '50%', background: 'white', opacity: 0.1,
              transform: 'translate(-30%, 30%)',
            }} />

            <Award style={{ width: 48, height: 48, color: 'rgba(255,255,255,0.8)', margin: '0 auto 24px' }} />
            <h2 className="font-display" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 700, color: 'white', marginBottom: 16 }}>
              Ready to Take Control?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.125rem', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
              Knowledge is the first step to prevention. Get your personalized diabetes risk assessment now.
            </p>
            <Link to="/predict" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 32px', borderRadius: 16,
              fontWeight: 600, fontSize: '1.125rem',
              background: 'white', color: 'var(--primary-700)',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Get Your Assessment
              <ArrowRight style={{ width: 20, height: 20 }} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
